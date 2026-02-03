import { useState, useEffect } from 'react'
import { Button } from '../shared/Button'
import { LONG_FORM_STAGES, SHORT_FORM_STAGES, CONTENT_TAGS } from '../../data/initialData'
import './ContentForm.css'

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'short-form',
  stage: 'idea',
  shootDate: '',
  releaseDate: '',
  assignee: '',
  tags: [],
  notes: '',
}

export function ContentForm({ content, team, onSave, onDelete, onClose }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const isEditing = !!content?.id

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        type: content.type || 'short-form',
        stage: content.stage || 'idea',
        shootDate: content.shootDate || '',
        releaseDate: content.releaseDate || '',
        assignee: content.assignee || '',
        tags: content.tags || [],
        notes: content.notes || '',
      })
    }
  }, [content])

  const stages = formData.type === 'long-form' ? LONG_FORM_STAGES : SHORT_FORM_STAGES

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      stage: 'idea',
    }))
  }

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSave(formData)
  }

  return (
    <form className="content-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter content title..."
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Brief description..."
          rows={2}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Content Type</label>
          <div className="form-type-toggle">
            <button
              type="button"
              className={`form-type-btn ${formData.type === 'long-form' ? 'active long' : ''}`}
              onClick={() => handleTypeChange('long-form')}
            >
              Long-form
            </button>
            <button
              type="button"
              className={`form-type-btn ${formData.type === 'short-form' ? 'active short' : ''}`}
              onClick={() => handleTypeChange('short-form')}
            >
              Short-form
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Stage</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="form-select"
          >
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Shoot Date</label>
          <input
            type="date"
            name="shootDate"
            value={formData.shootDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Assignee</label>
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="form-select"
        >
          <option value="">Unassigned</option>
          {team.map((member) => (
            <option key={member} value={member}>
              {member}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <div className="form-tags">
          {CONTENT_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`form-tag ${formData.tags.includes(tag) ? 'active' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="form-textarea"
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="form-actions">
        {isEditing && (
          <Button type="button" variant="danger" onClick={() => onDelete(content.id)}>
            Delete
          </Button>
        )}
        <div className="form-actions-right">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Create Content'}
          </Button>
        </div>
      </div>
    </form>
  )
}
