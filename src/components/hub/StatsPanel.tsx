import { STAT_KEYS } from '../../lib/constants'
import type { StatValues } from '../../types'
import { StatBadge } from './StatBadge'
import styles from './StatsPanel.module.css'

interface StatsPanelProps {
  stats: StatValues
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>ATTRIBUTES</div>
      <div className={`${styles.grid} scroll-y`}>
        {STAT_KEYS.map(key => (
          <StatBadge key={key} statKey={key} value={stats[key]} />
        ))}
      </div>
    </div>
  )
}
