import { useState } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { Header } from './components/Layout/Header'
import { PipelineBoard } from './components/Pipeline/PipelineBoard'
import { MonthView } from './components/Calendar/MonthView'
import { WeekView } from './components/Calendar/WeekView'
import { IdeasBank } from './components/Ideas/IdeasBank'
import { ContentModal } from './components/Content/ContentModal'
import { useContentStore } from './hooks/useContentStore'

function App() {
  const [activeView, setActiveView] = useState('pipeline')
  const [calendarView, setCalendarView] = useState('month')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)

  const {
    content,
    ideas,
    team,
    addContent,
    updateContent,
    deleteContent,
    moveContent,
    addIdea,
    deleteIdea,
    promoteIdea,
    exportData,
    importData,
  } = useContentStore()

  const handleCardClick = (item) => {
    setSelectedContent(item)
    setModalOpen(true)
  }

  const handleAddClick = () => {
    setSelectedContent(null)
    setModalOpen(true)
  }

  const handleSave = (id, data) => {
    if (id) {
      updateContent(id, data)
    } else {
      addContent(data)
    }
  }

  const handleImport = (jsonData) => {
    if (importData(jsonData)) {
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
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        contentCounts={contentCounts}
      />
      <Header onExport={exportData} onImport={handleImport} />
      <main className="main-content">
        <div className="page-content">{renderView()}</div>
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
      `}</style>
    </div>
  )
}

export default App
