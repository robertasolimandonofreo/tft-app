import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function usePlayer(puuid: string) {
  return useQuery({
    queryKey: ['player', puuid],
    queryFn: async () => {
      const { data } = await api.get(`/summoner?puuid=${puuid}`)
      return data
    },
    enabled: !!puuid
  })
}
