import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { useUserStore } from '../../stores/userStore'
import { xpToNext } from '../../lib/constants'
import styles from './OnboardingScreen.module.css'

export function OnboardingScreen() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const session = useAuthStore(s => s.session)
  const setUsername_ = useUserStore(s => s.setUsername)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return
    setLoading(true)
    setError(null)

    const userId = session.user.id
    const trimmed = username.trim().toUpperCase()

    const { error: userError } = await supabase
      .from('users')
      .insert({ id: userId, username: trimmed })

    if (userError) {
      setError(userError.code === '23505' ? 'Username taken. Try another.' : userError.message)
      setLoading(false)
      return
    }

    const { error: statsError } = await supabase
      .from('user_stats')
      .insert({ user_id: userId, xp_to_next: xpToNext(1) })

    if (statsError) {
      setError(statsError.message)
      setLoading(false)
      return
    }

    setUsername_(trimmed)
    navigate('/hub', { replace: true })
  }

  return (
    <div className={styles.screen}>
      <div className={styles.inner}>
        <div className={styles.title}>NAME YOUR WARRIOR</div>
        <p className={styles.subtitle}>This is how you appear in the chronicles.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="WARRIOR NAME"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className={styles.input}
            maxLength={20}
            minLength={2}
            required
            autoComplete="off"
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'FORGING…' : 'BEGIN YOUR LEGEND'}
          </button>
        </form>
      </div>
    </div>
  )
}
