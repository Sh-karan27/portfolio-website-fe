import { useState } from 'react'
import useTheme from '../../hooks/useTheme'
import { loginAdmin } from '../../lib/api'

function AdminLogin({ onLoginSuccess, sessionExpired }) {
  // Mounting the hook here (even with no visible toggle on this screen)
  // makes sure the "dark" class is applied when /admin is opened directly,
  // not only after first visiting the public site.
  useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const admin = await loginAdmin(email, password)
      onLoginSuccess(admin)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg text-ink">
      <div className="w-[380px] max-w-[90vw] rounded-[3px] border border-line bg-card p-10 px-9">
        <div className="font-mono text-[12px] tracking-[0.02em] text-accent">ADMIN</div>
        <h1 className="mb-7 mt-2.5 font-serif text-[26px] font-semibold tracking-tight">Log in</h1>

        {sessionExpired && (
          <div className="mb-5 rounded-[2px] border border-line-2 px-3 py-2.5 text-[13px] text-ink-2">
            Session expired — please log in again.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mb-4.5 w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none"
          />

          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="mb-6.5 w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none"
          />

          {error && <div className="mb-4 text-[13px] text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-[2px] bg-accent py-3 text-[14.5px] font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
