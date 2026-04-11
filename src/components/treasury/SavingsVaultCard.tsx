import { useState } from 'react'
import { ProgressBar } from '../ui/ProgressBar'
import type { SavingsVault } from '../../types'
import styles from './SavingsVaultCard.module.css'

interface SavingsVaultCardProps {
  vault: SavingsVault | null
  onUpdate: (saved: number) => void
}

export function SavingsVaultCard({ vault, onUpdate }: SavingsVaultCardProps) {
  const [goalInput, setGoalInput] = useState('')

  function handleSetGoal(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(goalInput)
    if (!isNaN(parsed) && parsed > 0) onUpdate(parsed)
  }

  if (!vault) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>◎</span>
          <span className={styles.name}>SAVINGS VAULT</span>
        </div>
        <form className={styles.setupForm} onSubmit={handleSetGoal}>
          <input
            className={styles.input}
            type="number"
            min="1"
            step="1"
            placeholder="Goal amount…"
            value={goalInput}
            onChange={e => setGoalInput(e.target.value)}
          />
          <button type="submit" className={styles.setBtn}>SET GOAL</button>
        </form>
      </div>
    )
  }

  const pct = vault.goal_amount > 0 ? Math.min(100, (vault.saved_amount / vault.goal_amount) * 100) : 0

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.icon}>◎</span>
        <span className={styles.name}>{vault.goal_name}</span>
        <span className={styles.pct}>{pct.toFixed(0)}%</span>
      </div>
      <ProgressBar value={vault.saved_amount} max={vault.goal_amount} color="#c9a84c" className={styles.bar} />
      <div className={styles.footer}>
        <button className={styles.adj} onClick={() => onUpdate(Math.max(0, vault.saved_amount - 10))}>−</button>
        <span className={styles.amounts}>{vault.saved_amount.toFixed(2)} / {vault.goal_amount.toFixed(2)}</span>
        <button className={styles.adj} onClick={() => onUpdate(vault.saved_amount + 10)}>+</button>
      </div>
    </div>
  )
}
