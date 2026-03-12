import { useEffect, useRef } from 'react'
import { Button } from './Button'
import './Modal.css'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>
      <div className={`modal modal-${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
