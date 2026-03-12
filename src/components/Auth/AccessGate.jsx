import { useState } from 'react'
import { ACCESS_CODES } from '../../data/initialData'
import './AccessGate.css'

export function AccessGate({ onAccess }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ACCESS_CODES.includes(code.toLowerCase().trim())) {
      onAccess()
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  return (
    <div className="access-gate">
      <div className={`access-gate-card ${shake ? 'shake' : ''}`}>
        <div className="access-gate-logo">
          <img src="/pl-logo.png" alt="Peoples League" className="access-gate-img" />
        </div>
        <h1 className="access-gate-title">Content Calendar</h1>
        <p className="access-gate-subtitle">Peoples League HQ</p>

        <form onSubmit={handleSubmit} className="access-gate-form">
          <input
            type="password"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              setError(false)
            }}
            placeholder="Enter access code"
            className={`access-gate-input ${error ? 'error' : ''}`}
            autoFocus
          />
          {error && (
            <p className="access-gate-error">Invalid access code. Try again.</p>
          )}
          <button type="submit" className="access-gate-btn">
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
