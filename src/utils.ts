import { LeagueEntry } from './types'

const TIER_COLORS: Record<string, string> = {
  CHALLENGER: 'text-yellow-400',
  GRANDMASTER: 'text-red-400', 
  MASTER: 'text-purple-400',
}

const TIER_ICONS: Record<string, string> = {
  CHALLENGER: '👑',
  GRANDMASTER: '🔴',
  MASTER: '🟣',
}

export const getTierColor = (tier: string) => TIER_COLORS[tier] || 'text-blue-400'
export const getTierIcon = (tier: string) => TIER_ICONS[tier] || '🎯'

export const calculateWinrate = (wins: number, losses: number) => {
  const total = wins + losses
  return total > 0 ? Math.round((wins / total) * 100) : 0
}

export const getWinrateColor = (winrate: number) => {
  if (winrate >= 70) return 'text-green-400'
  if (winrate >= 60) return 'text-yellow-400'
  if (winrate >= 50) return 'text-orange-400'
  return 'text-red-400'
}

export const sortByRank = (a: LeagueEntry, b: LeagueEntry) => {
  const tierOrder: Record<string, number> = {
    CHALLENGER: 3, GRANDMASTER: 2, MASTER: 1
  }
  
  const tierDiff = (tierOrder[b.tier] || 0) - (tierOrder[a.tier] || 0)
  if (tierDiff !== 0) return tierDiff
  
  return b.leaguePoints - a.leaguePoints
}