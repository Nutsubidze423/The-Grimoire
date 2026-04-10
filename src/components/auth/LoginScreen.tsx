import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import styles from './LoginScreen.module.css'

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.title}>THE GRIMOIRE</div>
        <div className={styles.subtitle}>YOUR LIFE. YOUR LEGEND.</div>
        {sent ? (
          <div className={styles.sent}>
            <p>Magic link sent.</p>
            <p className={styles.sentSub}>Check your email and tap the link to enter.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={styles.input}
              required
              autoComplete="email"
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? 'SENDING…' : 'ENTER THE GRIMOIRE'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
