import { useState } from 'react'
import { ProgressBar } from '../ui/ProgressBar'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../lib/constants'
import type { ExpenseCategory } from '../../types'
import styles from './BudgetCard.module.css'

interface BudgetCardProps {
  category: ExpenseCategory
  spent: number
  limit: number
  onSetLimit: (category: ExpenseCategory, amount: number) => void
}

export function BudgetCard({ category, spent, limit, onSetLimit }: BudgetCardProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')

  const isOver = limit > 0 && spent > limit
  const icon = CATEGORY_ICONS[category]
  const color = isOver ? 'var(--color-error)' : CATEGORY_COLORS[category]

  function handleConfirm() {
    const parsed = parseFloat(inputVal)
    if (!isNaN(parsed) && parsed > 0) {
      onSetLimit(category, parsed)
      setEditing(false)
      setInputVal('')
    }
  }

  return (
    <div className={styles.card} onClick={() => !editing && setEditing(true)}>
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.name}>{category}</span>
        {isOver && <span className={styles.cursed}>CURSED</span>}
      </div>

      {limit === 0 ? (
        <div className={styles.noLimit}>SET LIMIT</div>
      ) : (
        <ProgressBar
          value={spent}
          max={limit}
          color={color}
          className={styles.bar}
        />
      )}

      <div className={styles.footer}>
        {limit === 0 ? (
          <span className={styles.footerText}>NO LIMIT SET</span>
        ) : (
          <span className={styles.footerText}>
            {spent.toFixed(2)} / {limit.toFixed(2)}
          </span>
        )}
      </div>

      {editing && (
        <div className={styles.editor} onClick={e => e.stopPropagation()}>
          <input
            className={styles.input}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            autoFocus
          />
          <button className={styles.confirm} onClick={handleConfirm}>OK</button>
          <button className={styles.cancel} onClick={() => setEditing(false)}>X</button>
        </div>
      )}
    </div>
  )
}
