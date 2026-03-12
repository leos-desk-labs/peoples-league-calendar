import { Button } from '../shared/Button'
import './Header.css'

export function Header({ onExport, displayName, onSignOut }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <img src="/pl-logo.png" alt="Peoples League" width="32" height="32" style={{ borderRadius: '50%' }} />
          <span className="header-title">Content Calendar</span>
        </div>
      </div>
      <div className="header-right">
        <Button variant="ghost" size="sm" onClick={onExport}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2v8m0 0l3-3m-3 3L5 7M2 10v2a2 2 0 002 2h8a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Export
        </Button>
        {displayName && (
          <span className="header-user">{displayName}</span>
        )}
      </div>
    </header>
  )
}
