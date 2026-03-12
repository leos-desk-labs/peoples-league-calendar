import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await signIn(email.trim())
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/pl-logo.png" alt="Peoples League" />
        </div>
        <h1 className="login-title">Peoples League</h1>
        <p className="login-subtitle">Content Calendar</p>

        {sent ? (
          <div className="login-sent">
            <div className="login-sent-icon">✉️</div>
            <h2>Check your email</h2>
            <p>We sent a sign-in link to <strong>{email}</strong></p>
            <p className="login-sent-sub">Click the link in the email to sign in.</p>
            <button className="login-back-btn" onClick={() => setSent(false)}>
              Use a different email
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-label">Email address</label>
              <input
                type="email"
                className="login-input"
                placeholder="you@thepeoplesleague.golf"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>
            {error && <p className="login-error">{error}</p>}
            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Sign In with Email'}
            </button>
            <p className="login-hint">
              We'll send you a magic link — no password needed.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
