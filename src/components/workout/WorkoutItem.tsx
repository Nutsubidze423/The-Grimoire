import type { Workout } from '../../types'
import { MUSCLE_GROUP_ICONS, INTENSITY_COLORS } from '../../lib/constants'
import styles from './WorkoutItem.module.css'

interface WorkoutItemProps {
  workout: Workout
  onDelete: (id: string) => void
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function WorkoutItem({ workout, onDelete }: WorkoutItemProps) {
  const icon = MUSCLE_GROUP_ICONS[workout.muscle_group]
  const color = INTENSITY_COLORS[workout.intensity]

  return (
    <div className={styles.row}>
      <div className={styles.left}>
        <span className={styles.icon}>{icon}</span>
        <div className={styles.info}>
          <span className={styles.name}>{workout.exercise_name}</span>
          <span className={styles.group}>{workout.muscle_group}</span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.intensity} style={{ color, borderColor: color }}>
          {workout.intensity.toUpperCase()}
        </span>
        <span className={styles.xp}>+{workout.xp_reward} XP</span>
        <span className={styles.time}>{formatTime(workout.logged_at)}</span>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(workout.id)}
          aria-label="Delete workout"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
