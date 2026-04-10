import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useQuestStore } from '../../stores/questStore'
import { QuestList } from './QuestList'
import { QuestForm, type NewQuestInput } from './QuestForm'
import { Modal } from '../ui/Modal'
import styles from './QuestsScreen.module.css'

export function QuestsScreen() {
  const session = useAuthStore(s => s.session)
  const { quests, loading, addQuest, completeQuest, deleteQuest } = useQuestStore()
  const [showForm, setShowForm] = useState(false)

  const userId = session?.user.id ?? ''

  async function handleAdd(input: NewQuestInput) {
    await addQuest(userId, input)
    setShowForm(false)
  }

  function handleComplete(id: string) {
    completeQuest(id, userId)
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.title}>QUEST LOG</span>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ NEW</button>
      </header>

      {loading ? (
        <div className={styles.empty}>LOADING…</div>
      ) : (
        <div className={styles.list}>
          <QuestList
            quests={quests}
            onComplete={handleComplete}
            onDelete={deleteQuest}
          />
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <QuestForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
