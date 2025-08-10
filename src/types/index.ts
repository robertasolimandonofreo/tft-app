export interface Summoner {
  id: string
  accountId: string
  puuid: string
  name: string
  profileIconId: number
  revisionDate: number
  summonerLevel: number
}

// League types
export interface MiniSeries {
  target: number
  wins: number
  losses: number
  progress: string
}

export interface LeagueEntry {
  leagueId?: string
  summonerId?: string        // Manter por compatibilidade
  puuid?: string            // Adicionar PUUID
  summonerName?: string     // Pode vir vazio e ser preenchido
  queueType?: string
  tier: string
  rank?: string
  leaguePoints: number
  wins: number
  losses: number
  hotStreak: boolean
  veteran: boolean
  freshBlood: boolean
  inactive: boolean
  miniSeries?: MiniSeries
}

export interface HighTierLeague {
  leagueId: string
  entries: LeagueEntry[]
  tier: string
  name: string
  queue: string
}

export interface LeagueEntriesResponse {
  entries: LeagueEntry[]
  page: number
  tier: string
  division: string
  hasMore: boolean
}

// UI types
export interface ApiError {
  message: string
  status?: number
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Constants
export const TIERS = [
  'IRON', 'BRONZE', 'SILVER', 'GOLD', 
  'PLATINUM', 'EMERALD', 'DIAMOND'
] as const

export interface PlayerSearchResult {
  account: {
    puuid: string
    gameName: string
    tagLine: string
  }
  summoner?: {
    id: string
    summonerLevel: number
    profileIconId: number
  }
  league?: LeagueEntry
  puuid: string
  gameName: string
  tagLine: string
}
export const DIVISIONS = ['IV', 'III', 'II', 'I'] as const

export const QUEUES = ['RANKED_TFT'] as const

export type Tier = typeof TIERS[number]
export type Division = typeof DIVISIONS[number]
export type Queue = typeof QUEUES[number]