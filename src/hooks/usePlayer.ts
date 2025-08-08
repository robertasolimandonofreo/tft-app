import { useQuery } from '@tanstack/react-query'
import { summonerApi, leagueApi, healthApi } from '../services/api'
import type { Tier, Division, Queue } from '../types'

// Health check hook
export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await healthApi.check()
      return data
    },
    refetchInterval: 30000,
    retry: 3,
  })
}

// Summoner hooks
export function useSummoner(puuid: string) {
  return useQuery({
    queryKey: ['summoner', puuid],
    queryFn: async () => {
      const { data } = await summonerApi.getByPUUID(puuid)
      return data
    },
    enabled: !!puuid,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// High tier league hooks
export function useChallenger() {
  return useQuery({
    queryKey: ['league', 'challenger'],
    queryFn: async () => {
      const { data } = await leagueApi.getChallenger()
      return data
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useGrandmaster() {
  return useQuery({
    queryKey: ['league', 'grandmaster'],
    queryFn: async () => {
      const { data } = await leagueApi.getGrandmaster()
      return data
    },
    staleTime: 30 * 60 * 1000,
  })
}

export function useMaster() {
  return useQuery({
    queryKey: ['league', 'master'],
    queryFn: async () => {
      const { data } = await leagueApi.getMaster()
      return data
    },
    staleTime: 30 * 60 * 1000,
  })
}

// League entries hook
export function useLeagueEntries(tier: Tier, division: Division, page = 1) {
  return useQuery({
    queryKey: ['league', 'entries', tier, division, page],
    queryFn: async () => {
      const { data } = await leagueApi.getEntries(tier, division, page)
      return data
    },
    enabled: !!tier && !!division,
    staleTime: 30 * 60 * 1000,
  })
}

// League by PUUID hook
export function useLeagueByPUUID(puuid: string) {
  return useQuery({
    queryKey: ['league', 'by-puuid', puuid],
    queryFn: async () => {
      const { data } = await leagueApi.getByPUUID(puuid)
      return data
    },
    enabled: !!puuid,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}

// Rated ladder hook
export function useRatedLadder(queue: Queue) {
  return useQuery({
    queryKey: ['league', 'rated-ladder', queue],
    queryFn: async () => {
      const { data } = await leagueApi.getRatedLadder(queue)
      return data
    },
    enabled: !!queue,
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}