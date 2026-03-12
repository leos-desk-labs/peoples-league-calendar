import { ContentCard } from '../Content/ContentCard'
import './PipelineColumn.css'

export function PipelineColumn({ stage, items, onCardClick, onMoveContent, allStages }) {
  const handleMoveClick = (e, item, direction) => {
    e.stopPropagation()
    const currentIndex = allStages.findIndex((s) => s.id === item.stage)
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < allStages.length) {
      onMoveContent(item.id, allStages[newIndex].id)
    }
  }

  return (
    <div className="pipeline-column">
      <div className="pipeline-column-header">
        <div
          className="pipeline-column-dot"
          style={{ background: stage.color }}
        />
        <h3 className="pipeline-column-title">{stage.label}</h3>
        <span className="pipeline-column-count">{items.length}</span>
      </div>
      <div className="pipeline-column-content">
        {items.map((item) => {
          const currentIndex = allStages.findIndex((s) => s.id === item.stage)
          const canMoveBack = currentIndex > 0
          const canMoveForward = currentIndex < allStages.length - 1

          return (
            <div key={item.id} className="pipeline-card-wrapper">
              <ContentCard content={item} onClick={() => onCardClick(item)} />
              <div className="pipeline-card-actions">
                {canMoveBack && (
                  <button
                    className="pipeline-move-btn"
                    onClick={(e) => handleMoveClick(e, item, 'back')}
                    title={`Move to ${allStages[currentIndex - 1].label}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M9 3L5 7l4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
                {canMoveForward && (
                  <button
                    className="pipeline-move-btn forward"
                    onClick={(e) => handleMoveClick(e, item, 'forward')}
                    title={`Move to ${allStages[currentIndex + 1].label}`}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M5 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {items.length === 0 && (
          <div className="pipeline-empty">No content</div>
        )}
      </div>
    </div>
  )
}
