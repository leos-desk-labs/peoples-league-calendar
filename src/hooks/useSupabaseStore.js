import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { getFirstStageForType } from '../data/initialData'

// Map DB row (snake_case) to app item (camelCase)
function rowToItem(row) {
  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    type: row.type || 'short-form',
    stage: row.stage || 'idea',
    shootDate: row.shoot_date || '',
    releaseDate: row.release_date || '',
    assignee: row.assignee || '',
    tags: row.tags || [],
    notes: row.notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by || '',
    updatedBy: row.updated_by || '',
    position: row.position || 0,
  }
}

// Map app item (camelCase) to DB row (snake_case)
function itemToRow(item) {
  const row = {
    title: item.title,
    description: item.description || '',
    type: item.type,
    stage: item.stage,
    shoot_date: item.shootDate || null,
    release_date: item.releaseDate || null,
    assignee: item.assignee || '',
    tags: item.tags || [],
    notes: item.notes || '',
  }
  if (item.createdBy !== undefined) row.created_by = item.createdBy
  if (item.updatedBy !== undefined) row.updated_by = item.updatedBy
  return row
}

function rowToIdea(row) {
  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    type: row.type || 'short-form',
    tags: row.tags || [],
    createdAt: row.created_at,
    createdBy: row.created_by || '',
  }
}

export function useSupabaseStore(user, displayName) {
  const [content, setContent] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const realtimeRef = useRef(null)

  // Load initial data
  const loadData = useCallback(async () => {
    const [{ data: contentData }, { data: ideasData }] = await Promise.all([
      supabase.from('content_items').select('*').order('created_at', { ascending: false }),
      supabase.from('ideas').select('*').order('created_at', { ascending: false }).catch(() => ({ data: [] })),
    ])
    if (contentData) setContent(contentData.map(rowToItem))
    if (ideasData) setIdeas(ideasData.map(rowToIdea))
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return
    loadData()

    // Realtime subscriptions
    const channel = supabase.channel('content-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContent((prev) => {
            if (prev.some((item) => item.id === payload.new.id)) return prev
            return [rowToItem(payload.new), ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setContent((prev) =>
            prev.map((item) => item.id === payload.new.id ? rowToItem(payload.new) : item)
          )
        } else if (payload.eventType === 'DELETE') {
          setContent((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ideas' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setIdeas((prev) => {
            if (prev.some((item) => item.id === payload.new.id)) return prev
            return [rowToIdea(payload.new), ...prev]
          })
        } else if (payload.eventType === 'UPDATE') {
          setIdeas((prev) =>
            prev.map((item) => item.id === payload.new.id ? rowToIdea(payload.new) : item)
          )
        } else if (payload.eventType === 'DELETE') {
          setIdeas((prev) => prev.filter((item) => item.id !== payload.old.id))
        }
      })
      .subscribe()

    realtimeRef.current = channel
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loadData])

  const logHistory = async (contentId, action, changedFields) => {
    try {
      await supabase.from('content_history').insert({
        content_id: contentId,
        user_name: displayName || user?.email || 'Unknown',
        action,
        changed_fields: changedFields,
        timestamp: new Date().toISOString(),
      })
    } catch {
      // History logging is best-effort, don't block on errors
    }
  }

  const addContent = useCallback(async (itemData) => {
    const newItem = {
      ...itemToRow(itemData),
      created_by: displayName || user?.email || '',
      updated_by: displayName || user?.email || '',
    }
    const { data, error } = await supabase.from('content_items').insert(newItem).select().single()
    if (error) {
      console.error('addContent error:', error)
      return null
    }
    const item = rowToItem(data)
    setContent((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev
      return [item, ...prev]
    })
    logHistory(data.id, 'created', newItem)
    return item
  }, [user, displayName])

  const updateContent = useCallback(async (id, updates) => {
    const row = {
      ...itemToRow(updates),
      updated_by: displayName || user?.email || '',
      updated_at: new Date().toISOString(),
    }
    // Optimistic update
    setContent((prev) =>
      prev.map((item) => item.id === id ? { ...item, ...updates, updatedBy: row.updated_by } : item)
    )
    const { data, error } = await supabase
      .from('content_items')
      .update(row)
      .eq('id', id)
      .select()
      .single()
    if (error) {
      console.error('updateContent error:', error)
      loadData() // Revert
      return
    }
    setContent((prev) => prev.map((item) => item.id === id ? rowToItem(data) : item))
    logHistory(id, 'updated', row)
  }, [user, displayName, loadData])

  const deleteContent = useCallback(async (id) => {
    setContent((prev) => prev.filter((item) => item.id !== id))
    const { error } = await supabase.from('content_items').delete().eq('id', id)
    if (error) {
      console.error('deleteContent error:', error)
      loadData()
      return
    }
    logHistory(id, 'deleted', {})
  }, [loadData])

  const moveContent = useCallback(async (id, newStage) => {
    await updateContent(id, { ...content.find((i) => i.id === id), stage: newStage })
  }, [content, updateContent])

  const addIdea = useCallback(async (ideaData) => {
    const newIdea = {
      title: ideaData.title,
      description: ideaData.description || '',
      type: ideaData.type || 'short-form',
      tags: ideaData.tags || [],
      created_by: displayName || user?.email || '',
    }
    const { data, error } = await supabase.from('ideas').insert(newIdea).select().single()
    if (error) {
      console.error('addIdea error:', error)
      return null
    }
    const idea = rowToIdea(data)
    setIdeas((prev) => {
      if (prev.some((i) => i.id === idea.id)) return prev
      return [idea, ...prev]
    })
    return idea
  }, [user, displayName])

  const deleteIdea = useCallback(async (id) => {
    setIdeas((prev) => prev.filter((item) => item.id !== id))
    await supabase.from('ideas').delete().eq('id', id)
  }, [])

  const promoteIdea = useCallback(async (ideaId) => {
    const idea = ideas.find((i) => i.id === ideaId)
    if (!idea) return null
    const newContent = await addContent({
      title: idea.title,
      description: idea.description || '',
      type: idea.type,
      stage: getFirstStageForType(idea.type),
      shootDate: '',
      releaseDate: '',
      assignee: '',
      tags: idea.tags || [],
      notes: '',
    })
    await deleteIdea(ideaId)
    return newContent
  }, [ideas, addContent, deleteIdea])

  const exportData = () => {
    const data = { content, ideas, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pl-calendar-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    content,
    ideas,
    team: [],
    loading,
    addContent,
    updateContent,
    deleteContent,
    moveContent,
    addIdea,
    deleteIdea,
    promoteIdea,
    exportData,
  }
}
