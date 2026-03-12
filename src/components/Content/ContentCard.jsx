import { Badge } from '../shared/Badge'
import { formatShortDate } from '../../utils/dates'
import { LONG_FORM_STAGES, SHORT_FORM_STAGES, STATIC_POST_STAGES } from '../../data/initialData'
import './ContentCard.css'

function getStagesForType(type) {
  if (type === 'long-form') return LONG_FORM_STAGES
  if (type === 'short-form') return SHORT_FORM_STAGES
  if (type === 'static') return STATIC_POST_STAGES
  return SHORT_FORM_STAGES
}

function getTypeLabel(type) {
  if (type === 'long-form') return 'Long'
  if (type === 'short-form') return 'Short'
  if (type === 'static') return 'Static'
  return type
}

function getTypeBadge(type) {
  if (type === 'long-form') return 'type-long'
  if (type === 'short-form') return 'type-short'
  if (type === 'static') return 'type-static'
  return 'type-short'
}

export function ContentCard({ content, onClick, compact = false }) {
  const stages = getStagesForType(content.type)
  const currentStage = stages.find((s) => s.id === content.stage)

  return (
    <div
      className={`content-card ${compact ? 'content-card-compact' : ''}`}
      onClick={onClick}
    >
      <div className="content-card-header">
        <Badge variant={getTypeBadge(content.type)}>
          {getTypeLabel(content.type)}
        </Badge>
        {content.assignee && (
          <span className="content-card-assignee">{content.assignee}</span>
        )}
      </div>

      <h4 className="content-card-title">{content.title}</h4>

      {!compact && content.description && (
        <p className="content-card-desc">{content.description}</p>
      )}

      <div className="content-card-footer">
        <div className="content-card-dates">
          {content.shootDate && (
            <div className="content-card-date">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 4v2l1.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Shoot: {formatShortDate(content.shootDate)}</span>
            </div>
          )}
          {content.releaseDate && (
            <div className="content-card-date release">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 4l4 3 4-3M2 5v4a1 1 0 001 1h6a1 1 0 001-1V5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Release: {formatShortDate(content.releaseDate)}</span>
            </div>
          )}
        </div>

        {content.tags?.length > 0 && !compact && (
          <div className="content-card-tags">
            {content.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="content-card-tag">
                {tag}
              </span>
            ))}
            {content.tags.length > 2 && (
              <span className="content-card-tag">+{content.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>

      {content.updatedBy && !compact && (
        <div className="content-card-meta">
          <span className="content-card-editor">Edited by {content.updatedBy}</span>
        </div>
      )}

      <div
        className="content-card-stage-indicator"
        style={{ '--stage-color': currentStage?.color }}
      />
    </div>
  )
}
