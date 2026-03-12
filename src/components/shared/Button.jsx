import './Button.css'

export function Button({
  children,
  variant = 'default',
  size = 'md',
  icon,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  )
}
