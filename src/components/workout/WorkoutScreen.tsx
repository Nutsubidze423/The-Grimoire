import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useWorkoutStore } from '../../stores/workoutStore'
import { WorkoutForm } from './WorkoutForm'
import { WorkoutItem } from './WorkoutItem'
import { Modal } from '../ui/Modal'
import type { WorkoutIntensity, MuscleGroup } from '../../types'
import styles from './WorkoutScreen.module.css'

function formatToday(): string {
  const d = new Date()
  const days = ['SUN','MON','TUE','WED','THU','FRI','SAT']
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`
}

export function WorkoutScreen() {
  const session = useAuthStore(s => s.session)
  const { workouts, loading, logWorkout, deleteWorkout } = useWorkoutStore()
  const [showForm, setShowForm] = useState(false)

  const userId = session?.user.id ?? ''

  async function handleLog(exerciseName: string, muscleGroup: MuscleGroup, intensity: WorkoutIntensity) {
    await logWorkout(userId, exerciseName, muscleGroup, intensity)
    setShowForm(false)
  }

  const todayStr = new Date().toDateString()
  const todayWorkouts = workouts.filter(w => new Date(w.logged_at).toDateString() === todayStr)
  const olderWorkouts = workouts.filter(w => new Date(w.logged_at).toDateString() !== todayStr)

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>TRAINING LOG</span>
          <span className={styles.date}>{formatToday()}</span>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ LOG</button>
      </header>

      {loading ? (
        <div className={styles.empty}>LOADING…</div>
      ) : workouts.length === 0 ? (
        <div className={styles.empty}>
          <div>NO WORKOUTS LOGGED</div>
          <div className={styles.emptySub}>TAP + LOG TO START</div>
        </div>
      ) : (
        <div className={styles.body}>
          {todayWorkouts.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>TODAY</div>
              {todayWorkouts.map(w => (
                <WorkoutItem key={w.id} workout={w} onDelete={id => deleteWorkout(id)} />
              ))}
            </div>
          )}
          {olderWorkouts.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>RECENT</div>
              {olderWorkouts.map(w => (
                <WorkoutItem key={w.id} workout={w} onDelete={id => deleteWorkout(id)} />
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <WorkoutForm onSubmit={handleLog} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
