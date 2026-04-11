import { useState } from 'react'
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../../lib/constants'
import type { ExpenseCategory } from '../../types'
import styles from './ExpenseForm.module.css'

interface ExpenseFormProps {
  onSubmit: (category: ExpenseCategory, amount: number, note: string | null, date: string) => void
  onClose: () => void
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function ExpenseForm({ onSubmit, onClose }: ExpenseFormProps) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(todayStr())
  const [amountError, setAmountError] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) { setAmountError(true); return }
    onSubmit(category, parsed, note.trim() || null, date)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="exp-amount">AMOUNT</label>
        <input
          id="exp-amount"
          className={`${styles.input} ${amountError ? styles.inputError : ''}`}
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={e => { setAmount(e.target.value); if (amountError) setAmountError(false) }}
        />
        {amountError && <span className={styles.errorMsg}>AMOUNT REQUIRED</span>}
      </div>

      <div className={styles.field}>
        <span className={styles.label}>CATEGORY</span>
        <div className={styles.btnGrid}>
          {EXPENSE_CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              className={`${styles.catBtn} ${category === c ? styles.catBtnActive : ''}`}
              style={category === c ? { borderColor: CATEGORY_COLORS[c], color: CATEGORY_COLORS[c] } : undefined}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="exp-note">NOTE (OPTIONAL)</label>
        <input
          id="exp-note"
          className={styles.input}
          type="text"
          placeholder="What was this for?"
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="exp-date">DATE</label>
        <input
          id="exp-date"
          className={styles.input}
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>CANCEL</button>
        <button type="submit" className={styles.submitBtn}>LOG EXPENSE</button>
      </div>
    </form>
  )
}
