import type { Quest } from '../../types'
import { DIFFICULTY_COLORS } from '../../lib/constants'
import styles from './QuestItem.module.css'

interface QuestItemProps {
  quest: Quest
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

export function QuestItem({ quest, onComplete, onDelete }: QuestItemProps) {
  const isCompleted = quest.completed_at !== null
  const dotColor = DIFFICULTY_COLORS[quest.difficulty]

  return (
    <div className={`${styles.row} ${isCompleted ? styles.completed : ''}`}>
      <div className={styles.left}>
        <span
          className={styles.dot}
          style={{ backgroundColor: dotColor }}
          aria-label={quest.difficulty}
        />
        <span className={styles.name}>{quest.name}</span>
      </div>

      <div className={styles.center}>
        <span className={styles.category}>{quest.category}</span>
        <span className={styles.xp}>+{quest.xp_reward} XP</span>
      </div>

      <div className={styles.right}>
        {!isCompleted && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(quest.id)}
            aria-label="Delete quest"
            title="Delete quest"
          >
            ✕
          </button>
        )}
        <button
          className={`${styles.completeBtn} ${isCompleted ? styles.completeBtnDone : ''}`}
          onClick={() => !isCompleted && onComplete(quest.id)}
          aria-label={isCompleted ? 'Quest completed' : 'Mark complete'}
          disabled={isCompleted}
        >
          {isCompleted ? '✓' : '□'}
        </button>
      </div>
    </div>
  )
}
