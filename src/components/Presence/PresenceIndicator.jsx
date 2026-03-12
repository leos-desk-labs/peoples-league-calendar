import './PresenceIndicator.css'

export function PresenceIndicator({ presentUsers, currentUser, recentActivity }) {
  const others = presentUsers.filter((u) => u.name !== currentUser)

  return (
    <div className="presence-indicator">
      {recentActivity && Date.now() - recentActivity.timestamp < 5000 && (
        <span className="presence-activity">
          <span className="presence-pulse" />
          Live update
        </span>
      )}
      {others.length > 0 && (
        <div className="presence-users">
          {others.slice(0, 5).map((user) => (
            <div
              key={user.name}
              className="presence-avatar"
              title={`${user.name} is viewing`}
            >
              {user.name.charAt(0)}
            </div>
          ))}
          {others.length > 5 && (
            <div className="presence-avatar presence-more">
              +{others.length - 5}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
