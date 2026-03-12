import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

export function LoginPage() {
  const { signIn, verifyOtp } = useAuth()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState('email') // 'email' | 'code'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    const { error } = await signIn(email.trim())
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setStep('code')
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    const { error } = await verifyOtp(email.trim(), code.trim())
    setLoading(false)
    if (error) {
      setError('Invalid code. Please try again.')
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    const { error } = await signIn(email.trim())
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setError('')
      setCode('')
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

        {step === 'email' ? (
          <form className="login-form" onSubmit={handleSendCode}>
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
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Login Code'}
            </button>
            <p className="login-hint">We'll email you a 6-digit code. No password needed.</p>
          </form>
        ) : (
          <div className="login-code-step">
            <p className="login-code-info">
              Code sent to <strong>{email}</strong>
            </p>
            <form className="login-form" onSubmit={handleVerifyCode}>
              <div className="login-field">
                <label className="login-label">Enter your code</label>
                <input
                  type="text"
                  className="login-input login-code-input"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-btn" disabled={loading || code.length < 6}>
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>
            <div className="login-code-actions">
              <button className="login-back-btn" onClick={handleResend} disabled={loading}>
                Resend code
              </button>
              <button className="login-back-btn" onClick={() => { setStep('email'); setCode(''); setError('') }}>
                Use a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
