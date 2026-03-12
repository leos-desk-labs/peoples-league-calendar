import { Badge } from '../shared/Badge'
import { Button } from '../shared/Button'
import './IdeaCard.css'

export function IdeaCard({ idea, onPromote, onDelete }) {
  return (
    <div className="idea-card">
      <div className="idea-card-header">
        <Badge variant={idea.type === 'long-form' ? 'type-long' : 'type-short'}>
          {idea.type === 'long-form' ? 'Long' : 'Short'}
        </Badge>
      </div>
      <h4 className="idea-card-title">{idea.title}</h4>
      {idea.description && (
        <p className="idea-card-desc">{idea.description}</p>
      )}
      {idea.tags?.length > 0 && (
        <div className="idea-card-tags">
          {idea.tags.map((tag) => (
            <span key={tag} className="idea-card-tag">{tag}</span>
          ))}
        </div>
      )}
      <div className="idea-card-actions">
        <Button variant="ghost" size="sm" onClick={() => onDelete(idea.id)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 4h8M5.5 4V3a1 1 0 011-1h1a1 1 0 011 1v1M6 6.5v3M8 6.5v3M4 4l.5 7a1 1 0 001 1h3a1 1 0 001-1l.5-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <Button variant="primary" size="sm" onClick={() => onPromote(idea.id)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 11V3m0 0L4 6m3-3l3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Start
        </Button>
      </div>
    </div>
  )
}
