import { useQuery, useQueryClient } from '@tanstack/react-query'
import { summonerApi, leagueApi, healthApi, api } from '../services/api'
import { toast } from '../store/toastStore'
import type { Tier, Division, Queue, HighTierLeague, LeagueEntry } from '../types'

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
      console.log('🔍 Buscando dados Challenger...')
      const { data } = await leagueApi.getChallenger()
      
      console.log('📊 Dados Challenger recebidos:', {
        total: data.entries?.length,
        firstEntry: data.entries?.[0],
        hasNames: data.entries?.filter((e: any) => e.summonerName && e.summonerName !== '').length
      })
      
      const processedData = { 
        ...data, 
        tier: 'CHALLENGER',
        entries: data.entries?.map((entry: any) => ({
          ...entry,
          summonerName: entry.summonerName || 'Carregando...'
        })) || []
      } as HighTierLeague
      
      console.log('✅ Dados Challenger processados:', processedData)
      return processedData
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const grandmaster = useQuery({
    queryKey: ['league', 'grandmaster'],
    queryFn: async () => {
      console.log('🔍 Buscando dados Grandmaster...')
      const { data } = await leagueApi.getGrandmaster()
      
      console.log('📊 Dados Grandmaster recebidos:', {
        total: data.entries?.length,
        firstEntry: data.entries?.[0],
        hasNames: data.entries?.filter((e: any) => e.summonerName && e.summonerName !== '').length
      })
      
      const processedData = { 
        ...data, 
        tier: 'GRANDMASTER',
        entries: data.entries?.map((entry: any) => ({
          ...entry,
          summonerName: entry.summonerName || 'Carregando...'
        })) || []
      } as HighTierLeague
      
      console.log('✅ Dados Grandmaster processados:', processedData)
      return processedData
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const master = useQuery({
    queryKey: ['league', 'master'],
    queryFn: async () => {
      console.log('🔍 Buscando dados Master...')
      const { data } = await leagueApi.getMaster()
      
      console.log('📊 Dados Master recebidos:', {
        total: data.entries?.length,
        firstEntry: data.entries?.[0],
        hasNames: data.entries?.filter((e: any) => e.summonerName && e.summonerName !== '').length
      })
      
      const processedData = { 
        ...data, 
        tier: 'MASTER',
        entries: data.entries?.map((entry: any) => ({
          ...entry,
          summonerName: entry.summonerName || 'Carregando...'
        })) || []
      } as HighTierLeague
      
      console.log('✅ Dados Master processados:', processedData)
      return processedData
    },
    staleTime: 30 * 60 * 1000,
    ...queryDefaults,
  })

  const refreshAll = () => {
    console.log('🔄 Invalidando cache de todas as leagues...')
    queryClient.invalidateQueries({ queryKey: ['league', 'challenger'] })
    queryClient.invalidateQueries({ queryKey: ['league', 'grandmaster'] })
    queryClient.invalidateQueries({ queryKey: ['league', 'master'] })
    toast.info('Atualizando dados', 'Carregando informações mais recentes...')
  }

  const isLoading = challenger.isLoading || grandmaster.isLoading || master.isLoading
  const hasError = challenger.error || grandmaster.error || master.error

  console.log('🏆 Estado das leagues:', {
    isLoading,
    hasError: !!hasError,
    challenger: {
      isLoading: challenger.isLoading,
      error: !!challenger.error,
      dataExists: !!challenger.data,
      entriesCount: challenger.data?.entries?.length
    },
    grandmaster: {
      isLoading: grandmaster.isLoading,
      error: !!grandmaster.error,
      dataExists: !!grandmaster.data,
      entriesCount: grandmaster.data?.entries?.length
    },
    master: {
      isLoading: master.isLoading,
      error: !!master.error,
      dataExists: !!master.data,
      entriesCount: master.data?.entries?.length
    }
  })

  return {
    challenger,
    grandmaster,
    master,
    refreshAll,
    isLoading,
    hasError,
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

export function useSearchPlayer(gameName: string, tagLine?: string) {
  return useQuery({
    queryKey: ['search', 'player', gameName, tagLine || 'BR1'],
    queryFn: async () => {
      if (!gameName || gameName.trim().length < 2) {
        throw new Error('Nome do jogador deve ter pelo menos 2 caracteres')
      }

      const cleanGameName = gameName.trim()
      const cleanTagLine = (tagLine || 'BR1').trim()
      
      console.log('🔍 Buscando jogador:', { 
        originalGameName: gameName,
        cleanGameName,
        originalTagLine: tagLine,
        cleanTagLine,
        url: `/search/player?gameName=${encodeURIComponent(cleanGameName)}&tagLine=${encodeURIComponent(cleanTagLine)}`
      })
      
      try {
        const response = await api.get('/search/player', {
          params: {
            gameName: cleanGameName,
            tagLine: cleanTagLine
          }
        })
        
        console.log('✅ Jogador encontrado:', response.data)
        toast.success('Jogador encontrado', `${response.data.gameName}#${response.data.tagLine}`)
        
        return response.data
      } catch (error: any) {
        console.error('❌ Erro na busca:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          gameName: cleanGameName,
          tagLine: cleanTagLine
        })
        
        if (error.response?.status === 404) {
          toast.error('Jogador não encontrado', `"${cleanGameName}#${cleanTagLine}" não existe ou está em outra região`)
        } else if (error.response?.status === 429) {
          toast.warning('Muitas requisições', 'Aguarde um momento antes de tentar novamente')
        } else {
          toast.error('Erro na busca', 'Tente novamente em alguns segundos')
        }
        
        throw error
      }
    },
    enabled: !!gameName && gameName.trim().length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (isApiError(error) && error.response?.status === 404) return false
      if (isApiError(error) && error.response?.status === 429) return false
      return failureCount < 1
    },
    retryDelay: 2000,
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