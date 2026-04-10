import { useUserStore } from '../../stores/userStore'
import { getTitleForLevel } from '../../lib/constants'
import { CharacterCanvas } from './CharacterCanvas'
import { XPBar } from './XPBar'
import { StatsPanel } from './StatsPanel'
import { SummaryCards } from './SummaryCards'
import styles from './HubScreen.module.css'

export function HubScreen() {
  const { username, level, xp, xpToNext, streakCount, stats } = useUserStore()
  const title = getTitleForLevel(level)

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.username}>{username || '...'}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.level}>LV {level}</span>
      </header>

      <section className={styles.portrait}>
        <CharacterCanvas />
      </section>

      <section className={styles.xp}>
        <XPBar xp={xp} xpToNext={xpToNext} />
      </section>

      <section className={styles.summary}>
        <SummaryCards streakCount={streakCount} questsToday={0} questsTotal={0} />
      </section>

      <section className={styles.stats}>
        <StatsPanel stats={stats} />
      </section>
    </div>
  )
}
