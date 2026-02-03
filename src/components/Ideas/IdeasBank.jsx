import { useState } from 'react'
import { Button } from '../shared/Button'
import { IdeaCard } from './IdeaCard'
import { CONTENT_TAGS } from '../../data/initialData'
import './IdeasBank.css'

export function IdeasBank({ ideas, onAddIdea, onPromote, onDelete }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    type: 'short-form',
    tags: [],
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newIdea.title.trim()) return
    onAddIdea(newIdea)
    setNewIdea({ title: '', description: '', type: 'short-form', tags: [] })
    setIsAdding(false)
  }

  const handleTagToggle = (tag) => {
    setNewIdea((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const longFormIdeas = ideas.filter((i) => i.type === 'long-form')
  const shortFormIdeas = ideas.filter((i) => i.type === 'short-form')

  return (
    <div className="ideas-bank">
      <div className="ideas-header">
        <div>
          <h2 className="ideas-title">Ideas Bank</h2>
          <p className="ideas-subtitle">
            Capture content ideas. When ready, click "Start" to move them into production.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsAdding(true)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Idea
        </Button>
      </div>

      {isAdding && (
        <form className="ideas-form" onSubmit={handleSubmit}>
          <div className="ideas-form-row">
            <input
              type="text"
              value={newIdea.title}
              onChange={(e) => setNewIdea((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="What's your idea?"
              className="ideas-form-input"
              autoFocus
            />
            <div className="ideas-form-type">
              <button
                type="button"
                className={`ideas-type-btn ${newIdea.type === 'long-form' ? 'active long' : ''}`}
                onClick={() => setNewIdea((prev) => ({ ...prev, type: 'long-form' }))}
              >
                Long
              </button>
              <button
                type="button"
                className={`ideas-type-btn ${newIdea.type === 'short-form' ? 'active short' : ''}`}
                onClick={() => setNewIdea((prev) => ({ ...prev, type: 'short-form' }))}
              >
                Short
              </button>
            </div>
          </div>
          <textarea
            value={newIdea.description}
            onChange={(e) => setNewIdea((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description (optional)"
            className="ideas-form-textarea"
            rows={2}
          />
          <div className="ideas-form-tags">
            {CONTENT_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`ideas-tag-btn ${newIdea.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="ideas-form-actions">
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Idea
            </Button>
          </div>
        </form>
      )}

      <div className="ideas-sections">
        <div className="ideas-section">
          <h3 className="ideas-section-title">
            <span className="ideas-section-dot short" />
            Short-form Ideas
            <span className="ideas-section-count">{shortFormIdeas.length}</span>
          </h3>
          <div className="ideas-grid">
            {shortFormIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onPromote={onPromote}
                onDelete={onDelete}
              />
            ))}
            {shortFormIdeas.length === 0 && (
              <div className="ideas-empty">No short-form ideas yet</div>
            )}
          </div>
        </div>

        <div className="ideas-section">
          <h3 className="ideas-section-title">
            <span className="ideas-section-dot long" />
            Long-form Ideas
            <span className="ideas-section-count">{longFormIdeas.length}</span>
          </h3>
          <div className="ideas-grid">
            {longFormIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onPromote={onPromote}
                onDelete={onDelete}
              />
            ))}
            {longFormIdeas.length === 0 && (
              <div className="ideas-empty">No long-form ideas yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
