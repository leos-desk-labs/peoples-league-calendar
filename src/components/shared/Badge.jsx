import './Badge.css'

export function Badge({ children, variant = 'default', color, size = 'sm' }) {
  const style = color ? { '--badge-color': color } : {}

  return (
    <span className={`badge badge-${variant} badge-${size}`} style={style}>
      {children}
    </span>
  )
}
