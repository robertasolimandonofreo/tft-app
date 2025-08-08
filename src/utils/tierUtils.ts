import type { Tier, Division } from '../types'

const TIER_ORDER: Record<Tier, number> = {
  'IRON': 0,
  'BRONZE': 1,
  'SILVER': 2,
  'GOLD': 3,
  'PLATINUM': 4,
  'EMERALD': 5,
  'DIAMOND': 6,
}

const DIVISION_ORDER: Record<Division, number> = {
  'IV': 0,
  'III': 1,
  'II': 2,
  'I': 3,
}

const HIGH_TIER_ORDER = {
  'MASTER': 7,
  'GRANDMASTER': 8,
  'CHALLENGER': 9,
}

export function getTierOrder(tier: string): number {
  if (tier in TIER_ORDER) {
    return TIER_ORDER[tier as Tier]
  }
  if (tier in HIGH_TIER_ORDER) {
    return HIGH_TIER_ORDER[tier as keyof typeof HIGH_TIER_ORDER]
  }
  return 0
}

export function getDivisionOrder(division: string): number {
  return DIVISION_ORDER[division as Division] || 0
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    'IRON': 'text-gray-400',
    'BRONZE': 'text-amber-700',
    'SILVER': 'text-gray-300',
    'GOLD': 'text-yellow-400',
    'PLATINUM': 'text-cyan-400',
    'EMERALD': 'text-emerald-400',
    'DIAMOND': 'text-blue-400',
    'MASTER': 'text-purple-400',
    'GRANDMASTER': 'text-red-400',
    'CHALLENGER': 'text-yellow-300',
  }
  return colors[tier] || 'text-gray-400'
}

export function getTierIcon(tier: string): string {
  const icons: Record<string, string> = {
    'IRON': '🥉',
    'BRONZE': '🥉',
    'SILVER': '🥈',
    'GOLD': '🥇',
    'PLATINUM': '💎',
    'EMERALD': '💚',
    'DIAMOND': '💎',
    'MASTER': '🟣',
    'GRANDMASTER': '🔴',
    'CHALLENGER': '👑',
  }
  return icons[tier] || '🎯'
}

export function getRankIcon(rank?: string): string {
  const icons: Record<string, string> = {
    'I': '①',
    'II': '②',
    'III': '③',
    'IV': '④',
  }
  return rank ? icons[rank] || '' : ''
}

export function compareRanks(
  a: { tier: string; rank?: string; leaguePoints: number },
  b: { tier: string; rank?: string; leaguePoints: number }
): number {
  return comparePlayers(a, b)
}

export function comparePlayers(
  a: { tier: string; rank?: string; leaguePoints: number },
  b: { tier: string; rank?: string; leaguePoints: number }
): number {
  const tierDiff = getTierOrder(b.tier) - getTierOrder(a.tier)
  if (tierDiff !== 0) return tierDiff

  if (a.rank && b.rank) {
    const rankDiff = getDivisionOrder(b.rank) - getDivisionOrder(a.rank)
    if (rankDiff !== 0) return rankDiff
  }

  return b.leaguePoints - a.leaguePoints
}

export function formatTierRank(tier: string, rank?: string): string {
  if (!rank || ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier)) {
    return tier
  }
  return `${tier} ${rank}`
}