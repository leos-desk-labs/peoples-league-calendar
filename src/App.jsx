import { useState } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { PipelineBoard } from './components/Pipeline/PipelineBoard'
import { MonthView } from './components/Calendar/MonthView'
import { WeekView } from './components/Calendar/WeekView'
import { IdeasBank } from './components/Ideas/IdeasBank'
import { ContentModal } from './components/Content/ContentModal'
import { LoginPage } from './components/Auth/LoginPage'
import { useAuth } from './context/AuthContext'
import { useSupabaseStore } from './hooks/useSupabaseStore'

function AppContent() {
  const { user, displayName, signOut } = useAuth()
  const [activeView, setActiveView] = useState('pipeline')
  const [calendarView, setCalendarView] = useState('month')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)

  const {
    content,
    ideas,
    loading,
    addContent,
    updateContent,
    deleteContent,
    moveContent,
    addIdea,
    deleteIdea,
    promoteIdea,
    exportData,
  } = useSupabaseStore(user, displayName)

  const handleCardClick = (item) => {
    setSelectedContent(item)
    setModalOpen(true)
  }

  const handleAddClick = () => {
    setSelectedContent(null)
    setModalOpen(true)
  }

  const handleSave = async (id, data) => {
    if (id) {
      await updateContent(id, data)
    } else {
      await addContent(data)
    }
    setModalOpen(false)
  }

  const handleDelete = async (id) => {
    await deleteContent(id)
    setModalOpen(false)
  }

  const contentCounts = {
    pipeline: content.filter((c) => c.stage !== 'published' && c.stage !== 'sf-published' && c.stage !== 'sp-published').length,
    ideas: ideas.length,
  }

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Loading...</span>
        </div>
      )
    }

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
                onMoveContent={moveContent}
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
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        contentCounts={contentCounts}
        displayName={displayName}
        userEmail={user?.email}
        onSignOut={signOut}
      />
      <Header
        onExport={exportData}
        displayName={displayName}
        onSignOut={signOut}
      />
      <main className="main-content">
        <div className="page-content">{renderView()}</div>
      </main>
      <ContentModal
        isOpen={modalOpen}
        content={selectedContent}
        team={[]}
        onSave={handleSave}
        onDelete={handleDelete}
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
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          padding: var(--space-2xl);
          color: var(--text-secondary);
        }
        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border-default);
          border-top-color: var(--pl-lime);
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

function App() {
  return <AppContent />
}

export default App
