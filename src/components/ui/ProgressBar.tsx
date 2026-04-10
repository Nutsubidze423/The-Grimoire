import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  color: string
  className?: string
}

export function ProgressBar({ value, max, color, className }: ProgressBarProps) {
  const pct = Math.round(Math.min(100, Math.max(0, (value / max) * 100)))

  return (
    <div className={`${styles.track} ${className ?? ''}`}>
      <div
        data-testid="fill"
        className={styles.fill}
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}
