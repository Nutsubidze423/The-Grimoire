import { describe, it, expect, vi, beforeEach } from 'vitest'

// --- Supabase mock -----------------------------------------------------------

const mockExpenses = [
  {
    id: 'e1',
    user_id: 'u1',
    category: 'Food & Dining' as const,
    amount: 25.5,
    note: 'Lunch',
    expense_date: '2026-04-10',
    created_at: '2026-04-10T12:00:00Z',
  },
  {
    id: 'e2',
    user_id: 'u1',
    category: 'Food & Dining' as const,
    amount: 14.0,
    note: null,
    expense_date: '2026-04-09',
    created_at: '2026-04-09T09:00:00Z',
  },
]

const mockBudgets = [
  {
    id: 'b1',
    user_id: 'u1',
    category: 'Food & Dining' as const,
    month_year: '2026-04',
    limit_amount: 300,
    created_at: '2026-04-01T00:00:00Z',
  },
]

const mockVault = {
  id: 'v1',
  user_id: 'u1',
  goal_name: 'Emergency Fund',
  goal_amount: 5000,
  saved_amount: 1200,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
}

const mockNewExpense = {
  id: 'e3',
  user_id: 'u1',
  category: 'Transport' as const,
  amount: 10,
  note: null,
  expense_date: '2026-04-10',
  created_at: '2026-04-10T13:00:00Z',
}

const mockUpsertedBudget = {
  id: 'b2',
  user_id: 'u1',
  category: 'Transport' as const,
  month_year: '2026-04',
  limit_amount: 150,
  created_at: '2026-04-10T00:00:00Z',
}

// Chainable builder
function makeChain(resolvedValue: { data: unknown; error: null | string }) {
  const chain: Record<string, unknown> = {}
  const terminal = vi.fn().mockResolvedValue(resolvedValue)

  chain.single = terminal
  chain.then = (resolve: (v: unknown) => void) =>
    Promise.resolve(resolvedValue).then(resolve)

  for (const method of ['select', 'eq', 'gte', 'order', 'insert', 'update', 'delete', 'upsert']) {
    chain[method] = vi.fn(() => chain)
  }

  return chain
}

// Per-table chains
const expensesChain = makeChain({ data: mockExpenses, error: null })
const budgetsChain = makeChain({ data: mockBudgets, error: null })
const vaultChain = makeChain({ data: mockVault, error: null })

// insert / upsert on expenses returns new expense
const insertExpenseChain = makeChain({ data: mockNewExpense, error: null })
;(insertExpenseChain.select as ReturnType<typeof vi.fn>).mockReturnValue(insertExpenseChain)
;(expensesChain.insert as ReturnType<typeof vi.fn>).mockReturnValue(insertExpenseChain)

// upsert on budgets returns upserted budget
const upsertBudgetChain = makeChain({ data: mockUpsertedBudget, error: null })
;(upsertBudgetChain.select as ReturnType<typeof vi.fn>).mockReturnValue(upsertBudgetChain)
;(budgetsChain.upsert as ReturnType<typeof vi.fn>).mockReturnValue(upsertBudgetChain)

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'budgets') return budgetsChain
      if (table === 'savings_vault') return vaultChain
      return expensesChain  // 'expenses'
    }),
  },
}))

// --- Store import (after mock) -----------------------------------------------
import { useTreasuryStore } from '../treasuryStore'

// -----------------------------------------------------------------------------

beforeEach(() => {
  useTreasuryStore.setState({
    budgets: [],
    expenses: [],
    vault: null,
    loading: false,
  })
  vi.clearAllMocks()
})

describe('treasuryStore', () => {
  it('fetchTreasury sets expenses, budgets, and vault', async () => {
    await useTreasuryStore.getState().fetchTreasury('u1')
    const { expenses, budgets, vault, loading } = useTreasuryStore.getState()

    expect(expenses).toHaveLength(2)
    expect(expenses[0].id).toBe('e1')
    expect(budgets).toHaveLength(1)
    expect(budgets[0].category).toBe('Food & Dining')
    expect(vault).not.toBeNull()
    expect(vault?.goal_name).toBe('Emergency Fund')
    expect(loading).toBe(false)
  })

  it('addExpense inserts and prepends to list', async () => {
    useTreasuryStore.setState({ expenses: [...mockExpenses] })

    await useTreasuryStore.getState().addExpense('u1', 'Transport', 10, null, '2026-04-10')
    const { expenses } = useTreasuryStore.getState()

    expect(expenses).toHaveLength(3)
    expect(expenses[0].id).toBe('e3')  // prepended
    expect(expenses[0].category).toBe('Transport')
  })

  it('getSpentForCategory sums correctly', () => {
    useTreasuryStore.setState({ expenses: [...mockExpenses] })

    const spent = useTreasuryStore.getState().getSpentForCategory('Food & Dining')
    expect(spent).toBeCloseTo(39.5)

    const zero = useTreasuryStore.getState().getSpentForCategory('Transport')
    expect(zero).toBe(0)
  })

  it('setBudgetLimit upserts and updates budgets list', async () => {
    useTreasuryStore.setState({ budgets: [...mockBudgets], currentMonth: '2026-04' })

    await useTreasuryStore.getState().setBudgetLimit('u1', 'Transport', 150)
    const { budgets } = useTreasuryStore.getState()

    const transportBudget = budgets.find(b => b.category === 'Transport')
    expect(transportBudget).toBeDefined()
    expect(transportBudget?.limit_amount).toBe(150)
    // original Food & Dining budget still present
    expect(budgets.find(b => b.category === 'Food & Dining')).toBeDefined()
  })
})
