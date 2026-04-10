import styles from './SummaryCards.module.css'

interface SummaryCardsProps {
  streakCount: number
  questsToday: number
  questsTotal: number
}

export function SummaryCards({ streakCount, questsToday, questsTotal }: SummaryCardsProps) {
  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <span className={styles.value}>{streakCount}</span>
        <span className={styles.label}>STREAK</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{questsToday}/{questsTotal}</span>
        <span className={styles.label}>TODAY</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value} style={{ color: 'var(--color-success)' }}>0g</span>
        <span className={styles.label}>GOLD</span>
      </div>
    </div>
  )
}
