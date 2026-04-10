import { ProgressBar } from '../ui/ProgressBar'
import styles from './XPBar.module.css'

interface XPBarProps {
  xp: number
  xpToNext: number
}

export function XPBar({ xp, xpToNext }: XPBarProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>EXPERIENCE</span>
        <span className={styles.value}>{xp} / {xpToNext}</span>
      </div>
      <ProgressBar
        value={xp}
        max={xpToNext}
        color="linear-gradient(90deg, #8b6b20, #c9a84c, #e8d090)"
        className={styles.bar}
      />
    </div>
  )
}
