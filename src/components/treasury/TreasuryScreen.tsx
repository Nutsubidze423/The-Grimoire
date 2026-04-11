import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useTreasuryStore } from '../../stores/treasuryStore'
import { EXPENSE_CATEGORIES, getCurrentMonthYear } from '../../lib/constants'
import { BudgetCard } from './BudgetCard'
import { ExpenseForm } from './ExpenseForm'
import { SavingsVaultCard } from './SavingsVaultCard'
import { Modal } from '../ui/Modal'
import type { ExpenseCategory } from '../../types'
import styles from './TreasuryScreen.module.css'

function formatMonth(ym: string): string {
  const [y, m] = ym.split('-')
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return `${months[parseInt(m) - 1]} ${y}`
}

export function TreasuryScreen() {
  const session = useAuthStore(s => s.session)
  const { vault, loading, getSpentForCategory, getLimitForCategory, setBudgetLimit, addExpense, updateVault } = useTreasuryStore()
  const [showForm, setShowForm] = useState(false)

  const userId = session?.user.id ?? ''
  const month = getCurrentMonthYear()

  async function handleAddExpense(category: ExpenseCategory, amount: number, note: string | null, date: string) {
    await addExpense(userId, category, amount, note, date)
    setShowForm(false)
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>TREASURY</span>
          <span className={styles.month}>{formatMonth(month)}</span>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ EXPENSE</button>
      </header>

      {loading ? (
        <div className={styles.empty}>LOADING…</div>
      ) : (
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>BUDGETS</div>
            {EXPENSE_CATEGORIES.map(cat => (
              <BudgetCard
                key={cat}
                category={cat}
                spent={getSpentForCategory(cat)}
                limit={getLimitForCategory(cat)}
                onSetLimit={(c, amount) => setBudgetLimit(userId, c, amount)}
              />
            ))}
          </div>

          <div className={styles.vaultSection}>
            <SavingsVaultCard
              vault={vault}
              onUpdate={(saved) => updateVault(userId, saved)}
            />
          </div>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <ExpenseForm onSubmit={handleAddExpense} onClose={() => setShowForm(false)} />
      </Modal>
    </div>
  )
}
