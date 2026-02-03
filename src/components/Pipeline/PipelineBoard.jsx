import { useState } from 'react'
import { Button } from '../shared/Button'
import { PipelineColumn } from './PipelineColumn'
import { LONG_FORM_STAGES, SHORT_FORM_STAGES } from '../../data/initialData'
import './PipelineBoard.css'

export function PipelineBoard({ content, onCardClick, onMoveContent, onAddClick }) {
  const [activeType, setActiveType] = useState('all')

  const stages = activeType === 'long-form' ? LONG_FORM_STAGES :
                 activeType === 'short-form' ? SHORT_FORM_STAGES :
                 LONG_FORM_STAGES

  const filteredContent = activeType === 'all'
    ? content
    : content.filter((item) => item.type === activeType)

  const getItemsForStage = (stageId) => {
    if (activeType === 'all') {
      return content.filter((item) => {
        const itemStages = item.type === 'long-form' ? LONG_FORM_STAGES : SHORT_FORM_STAGES
        return itemStages.some((s) => s.id === stageId) && item.stage === stageId
      })
    }
    return filteredContent.filter((item) => item.stage === stageId)
  }

  return (
    <div className="pipeline-board">
      <div className="pipeline-header">
        <div className="pipeline-filters">
          <button
            className={`pipeline-filter ${activeType === 'all' ? 'active' : ''}`}
            onClick={() => setActiveType('all')}
          >
            All Content
          </button>
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
          />
        ))}
      </div>
    </div>
  )
}
