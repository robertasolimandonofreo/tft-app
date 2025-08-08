import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded')
    }
    return Promise.reject(error)
  }
)

// Summoner API
export const summonerApi = {
  getByPUUID: (puuid: string) => api.get(`/summoner?puuid=${puuid}`),
}

// League API
export const leagueApi = {
  getChallenger: () => api.get('/league/challenger'),
  getGrandmaster: () => api.get('/league/grandmaster'),
  getMaster: () => api.get('/league/master'),
  getEntries: (tier: string, division: string, page = 1) => 
    api.get(`/league/entries?tier=${tier}&division=${division}&page=${page}`),
  getByPUUID: (puuid: string) => 
    api.get(`/league/by-puuid?puuid=${puuid}`),
  getRatedLadder: (queue: string) => 
    api.get(`/league/rated-ladder?queue=${queue}`),
}

// Health check
export const healthApi = {
  check: () => api.get('/healthz'),
}