import { useState, useEffect } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { PipelineBoard } from './components/Pipeline/PipelineBoard'
import { MonthView } from './components/Calendar/MonthView'
import { WeekView } from './components/Calendar/WeekView'
import { IdeasBank } from './components/Ideas/IdeasBank'
import { ContentModal } from './components/Content/ContentModal'
import { AccessGate } from './components/Auth/AccessGate'
import { TeamPicker } from './components/Auth/TeamPicker'
import { PresenceIndicator } from './components/Presence/PresenceIndicator'
import { useSupabaseStore } from './hooks/useSupabaseStore'
import { usePresence } from './hooks/usePresence'

const ACCESS_GRANTED_KEY = 'pl-cal-access'
const CURRENT_USER_KEY = 'pl-cal-user'

function App() {
  const [activeView, setActiveView] = useState('pipeline')
  const [calendarView, setCalendarView] = useState('month')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)

  // Auth state
  const [hasAccess, setHasAccess] = useState(
    () => localStorage.getItem(ACCESS_GRANTED_KEY) === 'true'
  )
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem(CURRENT_USER_KEY) || null
  )
  const [showTeamPicker, setShowTeamPicker] = useState(false)

  // Show team picker after access granted if no user set
  useEffect(() => {
    if (hasAccess && !currentUser) {
      setShowTeamPicker(true)
    }
  }, [hasAccess, currentUser])

  const handleAccess = () => {
    localStorage.setItem(ACCESS_GRANTED_KEY, 'true')
    setHasAccess(true)
    if (!currentUser) {
      setShowTeamPicker(true)
    }
  }

  const handleSelectUser = (name) => {
    localStorage.setItem(CURRENT_USER_KEY, name)
    setCurrentUser(name)
    setShowTeamPicker(false)
  }

  const {
    content,
    ideas,
    team,
    loading,
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
  } = useSupabaseStore(currentUser)

  const { presentUsers } = usePresence(hasAccess ? currentUser : null)

  if (!hasAccess) {
    return <AccessGate onAccess={handleAccess} />
  }

  const handleCardClick = (item) => {
    setSelectedContent(item)
    setModalOpen(true)
  }

  const handleAddClick = () => {
    setSelectedContent(null)
    setModalOpen(true)
  }

  const handleSave = async (id, data) => {
    try {
      if (id) {
        await updateContent(id, data)
      } else {
        await addContent(data)
      }
    } catch (e) {
      console.error('Save error:', e)
    }
  }

  const handleImport = async (jsonData) => {
    if (await importData(jsonData)) {
      alert('Data imported successfully!')
    } else {
      alert('Failed to import data. Please check the file format.')
    }
  }

  const contentCounts = {
    pipeline: content.filter((c) => c.stage !== 'published').length,
    ideas: ideas.length,
  }

  const renderView = () => {
    switch (activeView) {
      case 'pipeline':
        return (
          <PipelineBoard
            content={content}
            onCardClick={handleCardClick}
            onMoveContent={moveContent}
            onAddClick={handleAddClick}
          />
        )
      case 'calendar':
        return (
          <div className="calendar-container">
            <div className="calendar-view-toggle">
              <button
                className={`calendar-toggle-btn ${calendarView === 'month' ? 'active' : ''}`}
                onClick={() => setCalendarView('month')}
              >
                Month
              </button>
              <button
                className={`calendar-toggle-btn ${calendarView === 'week' ? 'active' : ''}`}
                onClick={() => setCalendarView('week')}
              >
                Week
              </button>
            </div>
            {calendarView === 'month' ? (
              <MonthView
                content={content}
                onCardClick={handleCardClick}
                onAddClick={handleAddClick}
              />
            ) : (
              <WeekView
                content={content}
                onCardClick={handleCardClick}
                onAddClick={handleAddClick}
              />
            )}
          </div>
        )
      case 'ideas':
        return (
          <IdeasBank
            ideas={ideas}
            onAddIdea={addIdea}
            onPromote={promoteIdea}
            onDelete={deleteIdea}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      {showTeamPicker && <TeamPicker onSelect={handleSelectUser} />}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        contentCounts={contentCounts}
      />
      <Header
        onExport={exportData}
        onImport={handleImport}
        currentUser={currentUser}
        onChangeUser={() => setShowTeamPicker(true)}
        presenceSlot={
          <PresenceIndicator
            presentUsers={presentUsers}
            currentUser={currentUser}
            recentActivity={recentActivity}
          />
        }
      />
      <main className="main-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>Loading...</span>
          </div>
        ) : (
          <div className="page-content">{renderView()}</div>
        )}
      </main>
      <ContentModal
        isOpen={modalOpen}
        content={selectedContent}
        team={team}
        onSave={handleSave}
        onDelete={deleteContent}
        onClose={() => setModalOpen(false)}
      />
      <style>{`
        .calendar-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .calendar-view-toggle {
          display: flex;
          gap: var(--space-xs);
          background: var(--bg-secondary);
          padding: var(--space-xs);
          border-radius: var(--radius-md);
          width: fit-content;
        }
        .calendar-toggle-btn {
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }
        .calendar-toggle-btn:hover {
          color: var(--text-primary);
        }
        .calendar-toggle-btn.active {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          height: 300px;
          color: var(--text-secondary);
        }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--border-color);
          border-top-color: var(--accent-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
