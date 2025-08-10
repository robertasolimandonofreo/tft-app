export interface LeagueEntry {
    summonerId?: string
    puuid?: string
    summonerName?: string
    tier: string
    rank?: string
    leaguePoints: number
    wins: number
    losses: number
    hotStreak: boolean
    veteran: boolean
    freshBlood: boolean
    inactive: boolean
  }
  
  export interface HighTierLeague {
    entries: LeagueEntry[]
    tier: string
  }
  
  export interface PlayerSearchResult {
    puuid: string
    gameName: string
    tagLine: string
    league?: LeagueEntry
  }