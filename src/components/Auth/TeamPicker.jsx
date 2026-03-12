import { useState } from 'react'
import { TEAM_MEMBERS } from '../../data/initialData'
import './TeamPicker.css'

export function TeamPicker({ onSelect }) {
  const [selected, setSelected] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selected) onSelect(selected)
  }

  return (
    <div className="team-picker-overlay">
      <div className="team-picker-card">
        <div className="team-picker-logo">
          <img src="/pl-logo.png" alt="PL" className="team-picker-img" />
        </div>
        <h2 className="team-picker-title">Who are you?</h2>
        <p className="team-picker-subtitle">
          Select your name to track your contributions.
        </p>
        <form onSubmit={handleSubmit} className="team-picker-form">
          <div className="team-picker-grid">
            {TEAM_MEMBERS.map((member) => (
              <button
                key={member}
                type="button"
                className={`team-picker-member ${selected === member ? 'active' : ''}`}
                onClick={() => setSelected(member)}
              >
                <span className="team-picker-avatar">
                  {member.charAt(0)}
                </span>
                <span>{member}</span>
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="team-picker-btn"
            disabled={!selected}
          >
            Let's go →
          </button>
        </form>
      </div>
    </div>
  )
}
