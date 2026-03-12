import { useState } from 'react'
import { Button } from '../shared/Button'
import { PipelineColumn } from './PipelineColumn'
import { LONG_FORM_STAGES, SHORT_FORM_STAGES, STATIC_POST_STAGES, getStagesForType } from '../../data/initialData'
import './PipelineBoard.css'

export function PipelineBoard({ content, onCardClick, onMoveContent, onAddClick }) {
  const [activeType, setActiveType] = useState('long-form')
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const stages = getStagesForType(activeType)

  const filteredContent = content.filter((item) => item.type === activeType)

  const getItemsForStage = (stageId) => {
    return filteredContent.filter((item) => item.stage === stageId)
  }

  const handleDragOver = (e, stageId) => {
    e.preventDefault()
    setDragOverColumn(stageId)
  }

  const handleDrop = (e, stageId) => {
    e.preventDefault()
    setDragOverColumn(null)
    const itemId = e.dataTransfer.getData('text/plain')
    if (itemId) {
      onMoveContent(itemId, stageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  return (
    <div className="pipeline-board">
      <div className="pipeline-header">
        <div className="pipeline-filters">
          <button
            className={`pipeline-filter long ${activeType === 'long-form' ? 'active' : ''}`}
            onClick={() => setActiveType('long-form')}
          >
            Long-form
          </button>
          <button
            className={`pipeline-filter short ${activeType === 'short-form' ? 'active' : ''}`}
            onClick={() => setActiveType('short-form')}
          >
            Short-form
          </button>
          <button
            className={`pipeline-filter static ${activeType === 'static-post' ? 'active' : ''}`}
            onClick={() => setActiveType('static-post')}
          >
            Static Posts
          </button>
        </div>
        <Button variant="primary" onClick={onAddClick}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Content
        </Button>
      </div>

      <div className="pipeline-columns">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage.id}
            stage={stage}
            items={getItemsForStage(stage.id)}
            onCardClick={onCardClick}
            onMoveContent={onMoveContent}
            allStages={stages}
            isDragOver={dragOverColumn === stage.id}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDrop={(e) => handleDrop(e, stage.id)}
            onDragLeave={handleDragLeave}
          />
        ))}
      </div>
    </div>
  )
}
