import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Ideas are stored in content_items with stage = 'ideas-bank'
const IDEAS_BANK_STAGE = 'ideas-bank'

function toAppItem(row) {
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
    createdBy: row.created_by || '',
    updatedBy: row.updated_by || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toDbRow(item) {
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
  if (item.createdBy) row.created_by = item.createdBy
  if (item.updatedBy) row.updated_by = item.updatedBy
  return row
}

export function useSupabaseStore(currentUser) {
  const [content, setContent] = useState([])
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recentActivity, setRecentActivity] = useState(null)

  // Check if updated_by column exists (graceful degradation)
  const [hasUpdatedBy, setHasUpdatedBy] = useState(false)

  const fetchAll = useCallback(async () => {
    try {
      const { data, error: err } = await supabase
        .from('content_items')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err

      const allItems = (data || []).map(toAppItem)
      setContent(allItems.filter((i) => i.stage !== IDEAS_BANK_STAGE))
      setIdeas(allItems.filter((i) => i.stage === IDEAS_BANK_STAGE))
      
      // Check if updated_by column exists
      if (data && data.length > 0 && 'updated_by' in data[0]) {
        setHasUpdatedBy(true)
      }
    } catch (e) {
      console.error('Error fetching content:', e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('content_items_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_items' },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload

          setRecentActivity({
            type: eventType,
            item: newRow?.title || oldRow?.title,
            timestamp: Date.now(),
          })

          if (eventType === 'INSERT') {
            const item = toAppItem(newRow)
            if (item.stage === IDEAS_BANK_STAGE) {
              setIdeas((prev) => {
                if (prev.find((i) => i.id === item.id)) return prev
                return [item, ...prev]
              })
            } else {
              setContent((prev) => {
                if (prev.find((i) => i.id === item.id)) return prev
                return [item, ...prev]
              })
            }
          } else if (eventType === 'UPDATE') {
            const item = toAppItem(newRow)
            if (item.stage === IDEAS_BANK_STAGE) {
              setContent((prev) => prev.filter((i) => i.id !== item.id))
              setIdeas((prev) =>
                prev.map((i) => (i.id === item.id ? item : i))
              )
            } else {
              setIdeas((prev) => prev.filter((i) => i.id !== item.id))
              setContent((prev) =>
                prev.map((i) => (i.id === item.id ? item : i))
              )
            }
          } else if (eventType === 'DELETE') {
            const id = oldRow?.id
            setContent((prev) => prev.filter((i) => i.id !== id))
            setIdeas((prev) => prev.filter((i) => i.id !== id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const addContent = async (item) => {
    const row = toDbRow({
      ...item,
      createdBy: currentUser,
      updatedBy: currentUser,
    })
    const { data, error: err } = await supabase
      .from('content_items')
      .insert(row)
      .select()
      .single()

    if (err) {
      // Retry without created_by/updated_by if column doesn't exist
      const { created_by, updated_by, ...rowWithout } = row
      const { data: d2, error: e2 } = await supabase
        .from('content_items')
        .insert(rowWithout)
        .select()
        .single()
      if (e2) throw e2
      return toAppItem(d2)
    }
    return toAppItem(data)
  }

  const updateContent = async (id, updates) => {
    const row = toDbRow({ ...updates, updatedBy: currentUser })
    row.updated_at = new Date().toISOString()
    const { error: err } = await supabase
      .from('content_items')
      .update(row)
      .eq('id', id)

    if (err) {
      const { updated_by, ...rowWithout } = row
      const { error: e2 } = await supabase
        .from('content_items')
        .update(rowWithout)
        .eq('id', id)
      if (e2) throw e2
    }
  }

  const deleteContent = async (id) => {
    const { error: err } = await supabase
      .from('content_items')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  const moveContent = (id, newStage) => updateContent(id, { stage: newStage })

  const addIdea = async (idea) => {
    return addContent({ ...idea, stage: IDEAS_BANK_STAGE })
  }

  const deleteIdea = async (id) => {
    return deleteContent(id)
  }

  const promoteIdea = async (ideaId) => {
    const idea = ideas.find((i) => i.id === ideaId)
    if (!idea) return null
    await updateContent(ideaId, {
      ...idea,
      stage: 'idea',
    })
  }

  const exportData = () => {
    const data = { content, ideas }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pl-calendar-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData)
      if (!parsed.content && !parsed.ideas) return false

      if (parsed.content?.length) {
        const rows = parsed.content.map((item) => ({
          ...toDbRow(item),
          id: item.id,
          created_at: item.createdAt || new Date().toISOString(),
        }))
        await supabase.from('content_items').upsert(rows)
      }

      if (parsed.ideas?.length) {
        const rows = parsed.ideas.map((idea) => ({
          ...toDbRow({ ...idea, stage: IDEAS_BANK_STAGE }),
          id: idea.id,
          created_at: idea.createdAt || new Date().toISOString(),
        }))
        await supabase.from('content_items').upsert(rows)
      }

      await fetchAll()
      return true
    } catch (e) {
      console.error('Import error:', e)
      return false
    }
  }

  return {
    content,
    ideas,
    team: [
      'Clay', 'Anthony', 'Cole', 'Reagan', 'Shane',
      'Liam', 'Franco', 'Felipe', 'Zach', 'Liane', 'Serge',
    ],
    loading,
    error,
    recentActivity,
    addContent,
    updateContent,
    deleteContent,
    moveContent,
    addIdea,
    deleteIdea,
    promoteIdea,
    exportData,
    importData,
  }
}
