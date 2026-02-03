import { useLocalStorage } from './useLocalStorage'
import { initialData } from '../data/initialData'

export function useContentStore() {
  const [data, setData] = useLocalStorage('pl-content-calendar', initialData)

  const addContent = (content) => {
    const newContent = {
      ...content,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      content: [...prev.content, newContent],
    }))
    return newContent
  }

  const updateContent = (id, updates) => {
    setData((prev) => ({
      ...prev,
      content: prev.content.map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      ),
    }))
  }

  const deleteContent = (id) => {
    setData((prev) => ({
      ...prev,
      content: prev.content.filter((item) => item.id !== id),
    }))
  }

  const moveContent = (id, newStage) => {
    updateContent(id, { stage: newStage })
  }

  const addIdea = (idea) => {
    const newIdea = {
      ...idea,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setData((prev) => ({
      ...prev,
      ideas: [...prev.ideas, newIdea],
    }))
    return newIdea
  }

  const updateIdea = (id, updates) => {
    setData((prev) => ({
      ...prev,
      ideas: prev.ideas.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }))
  }

  const deleteIdea = (id) => {
    setData((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((item) => item.id !== id),
    }))
  }

  const promoteIdea = (ideaId) => {
    const idea = data.ideas.find((i) => i.id === ideaId)
    if (!idea) return null

    const newContent = addContent({
      title: idea.title,
      description: idea.description || '',
      type: idea.type,
      stage: 'idea',
      shootDate: '',
      releaseDate: '',
      assignee: '',
      tags: idea.tags || [],
      notes: '',
    })

    deleteIdea(ideaId)
    return newContent
  }

  const addTeamMember = (name) => {
    if (!name.trim() || data.team.includes(name.trim())) return
    setData((prev) => ({
      ...prev,
      team: [...prev.team, name.trim()],
    }))
  }

  const removeTeamMember = (name) => {
    setData((prev) => ({
      ...prev,
      team: prev.team.filter((member) => member !== name),
    }))
  }

  const exportData = () => {
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

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData)
      if (parsed.content && parsed.ideas) {
        setData(parsed)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  const getContentByDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return data.content.filter(
      (item) => item.shootDate === dateStr || item.releaseDate === dateStr
    )
  }

  const getContentByStage = (stage, type = null) => {
    return data.content.filter(
      (item) =>
        item.stage === stage && (type === null || item.type === type)
    )
  }

  return {
    content: data.content,
    ideas: data.ideas,
    team: data.team,
    settings: data.settings,
    addContent,
    updateContent,
    deleteContent,
    moveContent,
    addIdea,
    updateIdea,
    deleteIdea,
    promoteIdea,
    addTeamMember,
    removeTeamMember,
    exportData,
    importData,
    getContentByDate,
    getContentByStage,
  }
}
