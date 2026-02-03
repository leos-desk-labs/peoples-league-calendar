import './Sidebar.css'

const NAV_ITEMS = [
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="3" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7.5" y="6" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="3" width="5" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 8h16M6 2v4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ideas',
    label: 'Ideas',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2a6 6 0 014 10.5V14a1 1 0 01-1 1H7a1 1 0 01-1-1v-1.5A6 6 0 0110 2z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M7 17h6M8 19h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function Sidebar({ activeView, onViewChange, contentCounts }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/logo.svg" alt="" width="40" height="40" />
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Peoples League</span>
          <span className="sidebar-brand-tagline">Content Calendar</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            <span className="sidebar-nav-label">{item.label}</span>
            {contentCounts?.[item.id] > 0 && (
              <span className="sidebar-nav-count">{contentCounts[item.id]}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Content Types</h3>
        <div className="sidebar-type-list">
          <div className="sidebar-type-item">
            <span className="sidebar-type-dot" style={{ background: 'var(--type-long)' }} />
            <span>Long-form</span>
          </div>
          <div className="sidebar-type-item">
            <span className="sidebar-type-dot" style={{ background: 'var(--type-short)' }} />
            <span>Short-form</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
