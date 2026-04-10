import { describe, it, expect } from 'vitest'
import { xpToNext, getTitleForLevel, STAT_KEYS, STAT_META } from '../constants'

describe('xpToNext', () => {
  it('returns 100 for level 1', () => {
    expect(xpToNext(1)).toBe(100)
  })
  it('increases with each level', () => {
    expect(xpToNext(2)).toBeGreaterThan(xpToNext(1))
    expect(xpToNext(5)).toBeGreaterThan(xpToNext(4))
  })
  it('returns a positive integer for all levels 1-50', () => {
    for (let i = 1; i <= 50; i++) {
      expect(Number.isInteger(xpToNext(i))).toBe(true)
      expect(xpToNext(i)).toBeGreaterThan(0)
    }
  })
})

describe('getTitleForLevel', () => {
  it('returns Initiate for level 1', () => {
    expect(getTitleForLevel(1)).toBe('Initiate')
  })
  it('returns Apprentice at level 5', () => {
    expect(getTitleForLevel(5)).toBe('Apprentice')
  })
  it('returns Warrior at level 10', () => {
    expect(getTitleForLevel(10)).toBe('Warrior')
  })
  it('uses the highest matching title', () => {
    expect(getTitleForLevel(12)).toBe('Warrior')
    expect(getTitleForLevel(15)).toBe('Veteran')
  })
})

describe('STAT_META', () => {
  it('has an entry for every stat key', () => {
    STAT_KEYS.forEach(key => {
      expect(STAT_META[key]).toBeDefined()
      expect(STAT_META[key].label).toBeTruthy()
      expect(STAT_META[key].icon).toBeTruthy()
      expect(STAT_META[key].color).toMatch(/^#[0-9a-f]{6}$/i)
    })
  })
})
