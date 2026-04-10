import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Modal } from '../ui/Modal'
import styles from './TabBar.module.css'

const TABS = [
  { to: '/hub',       icon: '⌂', label: 'HUB' },
  { to: '/quests',    icon: '≡', label: 'QUESTS' },
  { to: '/vault',     icon: '◈', label: 'VAULT' },
  { to: '/character', icon: '⚔', label: 'CHAR' },
] as const

export function TabBar() {
  const [quickAddOpen, setQuickAddOpen] = useState(false)

  return (
    <>
      <nav className={styles.bar}>
        {TABS.slice(0, 2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }>
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </NavLink>
        ))}

        <button className={styles.addBtn} onClick={() => setQuickAddOpen(true)} aria-label="Quick add">
          +
        </button>

        {TABS.slice(2).map(tab => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.active : ''}`
          }>
            <span className={styles.icon}>{tab.icon}</span>
            <span className={styles.label}>{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <Modal open={quickAddOpen} onClose={() => setQuickAddOpen(false)}>
        <p className={styles.comingSoon}>QUICK ADD</p>
        <p className={styles.comingSoonSub}>Quest · Expense · Workout — Phase 2</p>
      </Modal>
    </>
  )
}
