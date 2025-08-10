import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

export const fetchChallenger = () => api.get('/league/challenger')
export const fetchGrandmaster = () => api.get('/league/grandmaster')  
export const fetchMaster = () => api.get('/league/master')
export const searchPlayer = (gameName: string, tagLine = 'BR1') => 
  api.get('/search/player', { params: { gameName, tagLine } })
export const checkHealth = () => api.get('/healthz')