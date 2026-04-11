import { useState } from 'react'
import type { WorkoutIntensity, MuscleGroup } from '../../types'
import { MUSCLE_GROUPS, MUSCLE_GROUP_ICONS, XP_BY_INTENSITY, INTENSITY_COLORS } from '../../lib/constants'
import styles from './WorkoutForm.module.css'

interface WorkoutFormProps {
  onSubmit: (exerciseName: string, muscleGroup: MuscleGroup, intensity: WorkoutIntensity) => void
  onClose: () => void
}

const INTENSITIES: WorkoutIntensity[] = ['Light', 'Medium', 'Heavy']

export function WorkoutForm({ onSubmit, onClose }: WorkoutFormProps) {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest')
  const [intensity, setIntensity] = useState<WorkoutIntensity>('Medium')
  const [nameError, setNameError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSubmit(name.trim(), muscleGroup, intensity)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="exercise-name">EXERCISE</label>
        <input
          id="exercise-name"
          className={`${styles.input} ${nameError ? styles.inputError : ''}`}
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (nameError) setNameError(false)
          }}
          placeholder="e.g. Push-ups, Running…"
          autoComplete="off"
        />
        {nameError && <span className={styles.errorMsg}>NAME REQUIRED</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="muscle-group">MUSCLE GROUP</label>
        <select
          id="muscle-group"
          className={styles.select}
          value={muscleGroup}
          onChange={e => setMuscleGroup(e.target.value as MuscleGroup)}
        >
          {MUSCLE_GROUPS.map(g => (
            <option key={g} value={g}>{MUSCLE_GROUP_ICONS[g]} {g}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>INTENSITY</span>
        <div className={styles.btnGroup}>
          {INTENSITIES.map(i => (
            <button
              key={i}
              type="button"
              className={`${styles.intensityBtn} ${intensity === i ? styles.intensityBtnActive : ''}`}
              style={intensity === i ? { borderColor: INTENSITY_COLORS[i], color: INTENSITY_COLORS[i] } : undefined}
              onClick={() => setIntensity(i)}
            >
              {i.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.xpPreview}>
        XP REWARD: <span style={{ color: INTENSITY_COLORS[intensity] }}>+{XP_BY_INTENSITY[intensity]}</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          CANCEL
        </button>
        <button type="submit" className={styles.submitBtn}>
          LOG WORKOUT
        </button>
      </div>
    </form>
  )
}
