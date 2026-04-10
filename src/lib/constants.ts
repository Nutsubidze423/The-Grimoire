import type { QuestDifficulty, QuestCategory } from '../types'

export const STAT_KEYS = [
  'strength',
  'intelligence',
  'agility',
  'wisdom',
  'discipline',
  'vitality',
  'creativity',
  'charisma',
  'serenity',
  'endurance',
  'courage',
] as const

export interface StatMeta {
  label: string
  icon: string
  color: string
}

export const STAT_META: Record<typeof STAT_KEYS[number], StatMeta> = {
  strength:     { label: 'STRENGTH',     icon: '⚔',  color: '#cc4444' },
  intelligence: { label: 'INTELLIGENCE', icon: '◈',  color: '#4466cc' },
  agility:      { label: 'AGILITY',      icon: '▶',  color: '#44cc88' },
  wisdom:       { label: 'WISDOM',       icon: '◆',  color: '#c9a84c' },
  discipline:   { label: 'DISCIPLINE',   icon: '✦',  color: '#8844cc' },
  vitality:     { label: 'VITALITY',     icon: '♥',  color: '#dd3344' },
  creativity:   { label: 'CREATIVITY',   icon: '✧',  color: '#cc6699' },
  charisma:     { label: 'CHARISMA',     icon: '◉',  color: '#dd8833' },
  serenity:     { label: 'SERENITY',     icon: '❋',  color: '#44aa88' },
  endurance:    { label: 'ENDURANCE',    icon: '◎',  color: '#dd6622' },
  courage:      { label: 'COURAGE',      icon: '▲',  color: '#e8c040' },
}

export const LEVEL_TITLES: Array<{ minLevel: number; title: string }> = [
  { minLevel: 1,  title: 'Initiate' },
  { minLevel: 5,  title: 'Apprentice' },
  { minLevel: 10, title: 'Warrior' },
  { minLevel: 15, title: 'Veteran' },
  { minLevel: 20, title: 'Champion' },
  { minLevel: 25, title: 'Elite' },
  { minLevel: 30, title: 'Master' },
  { minLevel: 35, title: 'Grand Master' },
  { minLevel: 40, title: 'Legendary' },
  { minLevel: 45, title: 'Mythic' },
  { minLevel: 50, title: 'Prestige Ready' },
]

/** XP required to level up from `level`. Curve: floor(100 * 1.4^(level-1)) */
export const xpToNext = (level: number): number =>
  Math.floor(100 * Math.pow(1.4, level - 1))

/** Human-readable title for a given level */
export const getTitleForLevel = (level: number): string => {
  const matching = LEVEL_TITLES.filter(t => level >= t.minLevel)
  return matching[matching.length - 1]?.title ?? 'Initiate'
}

export const DEFAULT_STATS: Record<typeof STAT_KEYS[number], number> = {
  strength: 0, intelligence: 0, agility: 0, wisdom: 0,
  discipline: 0, vitality: 0, creativity: 0, charisma: 0,
  serenity: 0, endurance: 0, courage: 0,
}

export const XP_BY_DIFFICULTY: Record<QuestDifficulty, number> = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
  Legendary: 100,
}

export const QUEST_CATEGORIES: QuestCategory[] = [
  'Personal', 'Work', 'Errands', 'Health', 'Finance', 'Social', 'Learning', 'Custom',
]

export const DIFFICULTY_COLORS: Record<QuestDifficulty, string> = {
  Easy: '#44cc88',
  Medium: '#c9a84c',
  Hard: '#cc4444',
  Legendary: '#8844cc',
}
