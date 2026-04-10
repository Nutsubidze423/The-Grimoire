import { useState } from 'react'
import type { QuestDifficulty, QuestCategory, QuestType } from '../../types'
import { XP_BY_DIFFICULTY, QUEST_CATEGORIES, DIFFICULTY_COLORS } from '../../lib/constants'
import styles from './QuestForm.module.css'

export interface NewQuestInput {
  name: string
  difficulty: QuestDifficulty
  category: QuestCategory
  quest_type: QuestType
  due_date: string | null
  xp_reward: number
}

interface QuestFormProps {
  onSubmit: (input: NewQuestInput) => void
  onClose: () => void
}

const DIFFICULTIES: QuestDifficulty[] = ['Easy', 'Medium', 'Hard', 'Legendary']

export function QuestForm({ onSubmit, onClose }: QuestFormProps) {
  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('Easy')
  const [category, setCategory] = useState<QuestCategory>('Personal')
  const [questType, setQuestType] = useState<QuestType>('daily')
  const [dueDate, setDueDate] = useState('')
  const [nameError, setNameError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSubmit({
      name: name.trim(),
      difficulty,
      category,
      quest_type: questType,
      due_date: dueDate || null,
      xp_reward: XP_BY_DIFFICULTY[difficulty],
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="quest-name">QUEST NAME</label>
        <input
          id="quest-name"
          className={`${styles.input} ${nameError ? styles.inputError : ''}`}
          type="text"
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (nameError) setNameError(false)
          }}
          placeholder="Enter quest name…"
          autoComplete="off"
        />
        {nameError && <span className={styles.errorMsg}>NAME REQUIRED</span>}
      </div>

      <div className={styles.field}>
        <span className={styles.label}>DIFFICULTY</span>
        <div className={styles.btnGroup}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              type="button"
              className={`${styles.diffBtn} ${difficulty === d ? styles.diffBtnActive : ''}`}
              style={difficulty === d ? { borderColor: DIFFICULTY_COLORS[d], color: DIFFICULTY_COLORS[d] } : undefined}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="quest-category">CATEGORY</label>
        <select
          id="quest-category"
          className={styles.select}
          value={category}
          onChange={e => setCategory(e.target.value as QuestCategory)}
        >
          {QUEST_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>TYPE</span>
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={`${styles.typeBtn} ${questType === 'daily' ? styles.typeBtnActive : ''}`}
            onClick={() => setQuestType('daily')}
          >
            DAILY
          </button>
          <button
            type="button"
            className={`${styles.typeBtn} ${questType === 'oneoff' ? styles.typeBtnActive : ''}`}
            onClick={() => setQuestType('oneoff')}
          >
            ONE-OFF
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="quest-due">DUE DATE (OPTIONAL)</label>
        <input
          id="quest-due"
          className={styles.input}
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className={styles.xpPreview}>
        XP REWARD: <span style={{ color: DIFFICULTY_COLORS[difficulty] }}>+{XP_BY_DIFFICULTY[difficulty]}</span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          CANCEL
        </button>
        <button type="submit" className={styles.submitBtn}>
          ADD QUEST
        </button>
      </div>
    </form>
  )
}
