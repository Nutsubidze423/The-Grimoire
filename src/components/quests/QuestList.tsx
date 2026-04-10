import type { Quest } from '../../types'
import { QuestItem } from './QuestItem'
import styles from './QuestList.module.css'

interface QuestListProps {
  quests: Quest[]
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

const MAX_COMPLETED_SHOWN = 5

export function QuestList({ quests, onComplete, onDelete }: QuestListProps) {
  const active = quests.filter(q => q.completed_at === null)
  const completed = quests.filter(q => q.completed_at !== null)
  const completedVisible = completed.slice(0, MAX_COMPLETED_SHOWN)
  const completedOverflow = completed.length - MAX_COMPLETED_SHOWN

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionHeader}>ACTIVE</h3>
        {active.length === 0 ? (
          <p className={styles.placeholder}>NO ACTIVE QUESTS</p>
        ) : (
          <div className={styles.list}>
            {active.map(quest => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>

      {completed.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionHeader}>COMPLETED</h3>
          <div className={styles.list}>
            {completedVisible.map(quest => (
              <QuestItem
                key={quest.id}
                quest={quest}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
            {completedOverflow > 0 && (
              <p className={styles.overflow}>…{completedOverflow} more</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
