import { Button } from '../shared/Button'
import './Header.css'

export function Header({ onExport, onImport }) {
  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          onImport(event.target.result)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <img src="/logo.svg" alt="Peoples League" width="32" height="32" />
          <span className="header-title">Content Calendar</span>
        </div>
      </div>
      <div className="header-right">
        <Button variant="ghost" size="sm" onClick={handleImport}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 10V2m0 0L5 5m3-3l3 3M2 10v2a2 2 0 002 2h8a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Import
        </Button>
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
      </div>
    </header>
  )
}
