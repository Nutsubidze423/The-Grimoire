import type { StatKey } from '../../types'
import { STAT_META } from '../../lib/constants'
import styles from './StatBadge.module.css'

interface StatBadgeProps {
  statKey: StatKey
  value: number
}

export function StatBadge({ statKey, value }: StatBadgeProps) {
  const meta = STAT_META[statKey]
  const pct = Math.min(100, Math.round((value / 50) * 100))

  return (
    <div className={styles.row}>
      <span className={styles.icon}>{meta.icon}</span>
      <div className={styles.info}>
        <span className={styles.name}>{meta.label}</span>
        <div className={styles.track}>
          <div
            className={styles.fill}
            style={{ width: `${pct}%`, background: meta.color }}
          />
        </div>
      </div>
      <span className={styles.val}>{value}</span>
    </div>
  )
}
