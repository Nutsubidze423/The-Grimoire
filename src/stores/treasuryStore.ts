import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { getCurrentMonthYear } from '../lib/constants'
import type { Budget, Expense, SavingsVault, ExpenseCategory } from '../types'

interface TreasuryState {
  budgets: Budget[]
  expenses: Expense[]
  vault: SavingsVault | null
  loading: boolean
  currentMonth: string  // 'YYYY-MM'

  fetchTreasury: (userId: string) => Promise<void>
  addExpense: (userId: string, category: ExpenseCategory, amount: number, note: string | null, date: string) => Promise<void>
  setBudgetLimit: (userId: string, category: ExpenseCategory, limitAmount: number) => Promise<void>
  updateVault: (userId: string, savedAmount: number) => Promise<void>
  deleteExpense: (expenseId: string) => Promise<void>

  // derived helpers
  getSpentForCategory: (category: ExpenseCategory) => number
  getLimitForCategory: (category: ExpenseCategory) => number
}

export const useTreasuryStore = create<TreasuryState>((set, get) => ({
  budgets: [],
  expenses: [],
  vault: null,
  loading: false,
  currentMonth: getCurrentMonthYear(),

  fetchTreasury: async (userId: string) => {
    set({ loading: true })
    const month = getCurrentMonthYear()
    set({ currentMonth: month })

    const [expRes, budRes, vaultRes] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', userId)
        .gte('expense_date', `${month}-01`)
        .order('created_at', { ascending: false }),
      supabase.from('budgets').select('*').eq('user_id', userId).eq('month_year', month),
      supabase.from('savings_vault').select('*').eq('user_id', userId).single(),
    ])

    set({
      expenses: (expRes.data ?? []) as Expense[],
      budgets: (budRes.data ?? []) as Budget[],
      vault: vaultRes.data as SavingsVault | null,
      loading: false,
    })
  },

  addExpense: async (userId, category, amount, note, date) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ user_id: userId, category, amount, note, expense_date: date })
      .select().single()
    if (!error && data) set({ expenses: [data as Expense, ...get().expenses] })
  },

  setBudgetLimit: async (userId, category, limitAmount) => {
    const month = get().currentMonth
    const { data, error } = await supabase
      .from('budgets')
      .upsert({ user_id: userId, category, month_year: month, limit_amount: limitAmount },
               { onConflict: 'user_id,category,month_year' })
      .select().single()
    if (!error && data) {
      const existing = get().budgets.filter(b => !(b.category === category && b.month_year === month))
      set({ budgets: [...existing, data as Budget] })
    }
  },

  updateVault: async (userId, savedAmount) => {
    const vault = get().vault
    if (vault) {
      const { data } = await supabase
        .from('savings_vault').update({ saved_amount: savedAmount }).eq('user_id', userId).select().single()
      if (data) set({ vault: data as SavingsVault })
    } else {
      const { data } = await supabase
        .from('savings_vault').insert({ user_id: userId, saved_amount: savedAmount }).select().single()
      if (data) set({ vault: data as SavingsVault })
    }
  },

  deleteExpense: async (expenseId) => {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
    if (!error) set({ expenses: get().expenses.filter(e => e.id !== expenseId) })
  },

  getSpentForCategory: (category) =>
    get().expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0),

  getLimitForCategory: (category) =>
    get().budgets.find(b => b.category === category)?.limit_amount ?? 0,
}))
