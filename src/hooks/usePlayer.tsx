import { useQuery, useQueryClient } from '@tanstack/react-query'
import { summonerApi, leagueApi, healthApi } from '../services/api'
import { toast } from '../store/toastStore'
import type { Tier, Division, Queue, HighTierLeague, LeagueEntry, RatedLadderEntry } from '../types'

interface ApiError {
  response?: {
    status: number
  }
}

function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error
}

const queryDefaults = {
  retry: (failureCount: number, error: unknown) => {
    if (isApiError(error) && error.response?.status === 429) {
      toast.warning('Rate Limit', 'Muitas requisições. Aguarde um momento.')
      return false
    }
    return failureCount < 2
  },
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const { data } = await healthApi.check()
      return data
    },
    refetchInterval: 30000,
    ...queryDefaults,
  })
}

export function useSummoner(puuid: string) {
  return useQuery({
    queryKey: ['summoner', puuid],
    queryFn: async () => {
      try {
        const { data } = await summonerApi.getByPUUID(puuid)
        toast.success('Jogador encontrado', `Dados de ${data.name} carregados`)
        return data
      } catch (error: unknown) {
        if (isApiError(error) && error.response?.status === 404) {
          toast.error('Jogador não encontrado', 'Verifique o PUUID informado')
        }
        throw error
      }
    },
    enabled: !!puuid && puuid.length > 20,
    staleTime: 5 * 60 * 1000,
    ...queryDefaults,
  })
}

export function useHighTierLeagues() {
  const queryClient = useQueryClient()
  
  const challenger = useQuery({
    queryKey: ['league', 'challenger'],
    queryFn: async () => {
      const { data } = await leagueApi.getChallenger()
      return { ...data, tier: 'CHALLENGER' } as HighTierLeague
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const grandmaster = useQuery({
    queryKey: ['league', 'grandmaster'],
    queryFn: async () => {
      const { data } = await leagueApi.getGrandmaster()
      return { ...data, tier: 'GRANDMASTER' } as HighTierLeague
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const master = useQuery({
    queryKey: ['league', 'master'],
    queryFn: async () => {
      const { data } = await leagueApi.getMaster()
      return { ...data, tier: 'MASTER' } as HighTierLeague
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['league', 'challenger'] })
    queryClient.invalidateQueries({ queryKey: ['league', 'grandmaster'] })
    queryClient.invalidateQueries({ queryKey: ['league', 'master'] })
    toast.info('Atualizando dados', 'Carregando informações mais recentes...')
  }

  return {
    challenger,
    grandmaster,
    master,
    refreshAll,
    isLoading: challenger.isLoading || grandmaster.isLoading || master.isLoading,
    hasError: challenger.error || grandmaster.error || master.error,
    data: {
      challenger: challenger.data,
      grandmaster: grandmaster.data,
      master: master.data,
    }
  }
}

export function useLeagueEntries(tier: Tier, division: Division, page = 1) {
  return useQuery({
    queryKey: ['league', 'entries', tier, division, page],
    queryFn: async () => {
      const { data } = await leagueApi.getEntries(tier, division, page)
      return data
    },
    enabled: !!tier && !!division,
    staleTime: 30 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...queryDefaults,
  })
}

export function useLeagueByPUUID(puuid: string) {
  return useQuery({
    queryKey: ['league', 'by-puuid', puuid],
    queryFn: async () => {
      const { data } = await leagueApi.getByPUUID(puuid)
      return data as LeagueEntry[]
    },
    enabled: !!puuid && puuid.length > 20,
    staleTime: 60 * 60 * 1000,
    ...queryDefaults,
  })
}

export function useRatedLadder(queue: Queue) {
  return useQuery({
    queryKey: ['league', 'rated-ladder', queue],
    queryFn: async () => {
      const { data } = await leagueApi.getRatedLadder(queue)
      
      const entries = data.entries || []
      const stats = {
        totalPlayers: entries.length,
        averageRating: entries.length > 0 
          ? Math.round(entries.reduce((sum: number, e: RatedLadderEntry) => sum + (e.ratedRating || 0), 0) / entries.length)
          : 0,
        maxRating: entries.length > 0 
          ? Math.max(...entries.map((e: RatedLadderEntry) => e.ratedRating || 0))
          : 0,
        averageWins: entries.length > 0
          ? Math.round(entries.reduce((sum: number, e: RatedLadderEntry) => sum + (e.wins || 0), 0) / entries.length)
          : 0
      }
      
      return { ...data, stats }
    },
    enabled: !!queue,
    staleTime: 60 * 60 * 1000,
    ...queryDefaults,
  })
}

export function useBatchSummoners(puuids: string[]) {
  return useQuery({
    queryKey: ['summoners', 'batch', puuids.sort().join(',')],
    queryFn: async () => {
      const results = await Promise.allSettled(
        puuids.map(puuid => summonerApi.getByPUUID(puuid))
      )
      
      return results.map((result, index) => ({
        puuid: puuids[index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value.data : null,
        error: result.status === 'rejected' ? result.reason : null
      }))
    },
    enabled: puuids.length > 0 && puuids.every(p => p.length > 20),
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })
}