import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchChallenger, fetchGrandmaster, fetchMaster } from '../src/api'
import { getTierColor, getTierIcon, calculateWinrate, getWinrateColor, sortByRank } from '../src/utils'
import { LeagueEntry } from '../src/types'

export default function Leagues() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTier, setActiveTier] = useState<'all' | 'challenger' | 'grandmaster' | 'master'>('all')
  const [challengerData, setChallengerData] = useState<any>(null)
  const [grandmasterData, setGrandmasterData] = useState<any>(null)
  const [masterData, setMasterData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        const [challengerResponse, grandmasterResponse, masterResponse] = await Promise.all([
          fetchChallenger().catch(() => null),
          fetchGrandmaster().catch(() => null), 
          fetchMaster().catch(() => null)
        ])

        setChallengerData(challengerResponse)
        setGrandmasterData(grandmasterResponse)
        setMasterData(masterResponse)

        if (!challengerResponse && !grandmasterResponse && !masterResponse) {
          setHasError(true)
        }
      } catch (error) {
        console.error('Error fetching league data:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getAllPlayers = () => {
    const players: LeagueEntry[] = []
    
    if (challengerData?.data?.entries) {
      players.push(...challengerData.data.entries.slice(0, 10))
    }
    if (grandmasterData?.data?.entries) {
      players.push(...grandmasterData.data.entries.slice(0, 10))
    }
    if (masterData?.data?.entries) {
      players.push(...masterData.data.entries.slice(0, 10))
    }

    return players.sort(sortByRank)
  }

  const getFilteredPlayers = () => {
    let players = getAllPlayers()

    if (activeTier !== 'all') {
      players = players.filter(p => p.tier.toLowerCase() === activeTier)
    }

    if (searchTerm) {
      players = players.filter(p => 
        p.summonerName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return players
  }

  const filteredPlayers = getFilteredPlayers()
  const allPlayers = getAllPlayers()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" data-cy="leagues-loading">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" data-cy="loading-spinner"></div>
            <p className="text-white/80" data-cy="loading-text">Carregando rankings...</p>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" data-cy="leagues-error">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-2xl mb-4">❌</div>
            <h3 className="text-xl font-bold text-red-300 mb-2" data-cy="error-title">Erro ao carregar</h3>
            <p className="text-red-400" data-cy="error-message">Não foi possível carregar os rankings</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" data-cy="leagues-page">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        <div className="mb-6">
          <Link href="/" className="text-blue-300 hover:text-blue-200" data-cy="back-home-link">
            ← Voltar ao início
          </Link>
        </div>

        <div className="text-center mb-8" data-cy="leagues-header">
          <h1 className="text-4xl font-bold text-white mb-4" data-cy="leagues-title">
            🏆 TOP 10 High Tier Leagues
          </h1>
          <p className="text-blue-200" data-cy="leagues-description">
            Os 10 melhores jogadores de cada tier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-cy="stats-cards">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4" data-cy="stats-total">
            <h3 className="font-semibold text-white text-sm mb-2">Total Players</h3>
            <div className="text-2xl font-bold text-blue-400">{allPlayers.length}</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4" data-cy="stats-challenger">
            <h3 className="font-semibold text-white text-sm mb-2">Challenger</h3>
            <div className="text-2xl font-bold text-yellow-400">
              {challengerData?.data?.entries?.slice(0, 10).length || 0}
            </div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4" data-cy="stats-grandmaster">
            <h3 className="font-semibold text-white text-sm mb-2">Grandmaster</h3>
            <div className="text-2xl font-bold text-red-400">
              {grandmasterData?.data?.entries?.slice(0, 10).length || 0}
            </div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4" data-cy="stats-master">
            <h3 className="font-semibold text-white text-sm mb-2">Master</h3>
            <div className="text-2xl font-bold text-purple-400">
              {masterData?.data?.entries?.slice(0, 10).length || 0}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8" data-cy="filters-section">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2" data-cy="tier-filters">
              {[
                { key: 'all' as const, label: 'Todos' },
                { key: 'challenger' as const, label: 'Challenger' },
                { key: 'grandmaster' as const, label: 'Grandmaster' },
                { key: 'master' as const, label: 'Master' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTier(key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTier === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/20 text-white/80 hover:bg-white/30'
                  }`}
                  data-cy={`filter-${key}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Buscar jogador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-cy="search-player-input"
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20" data-cy="rankings-table">
          <div className="bg-black/30 px-6 py-4">
            <h3 className="text-xl font-bold text-white" data-cy="rankings-table-title">
              🏆 TOP {filteredPlayers.length} Players
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full" data-cy="rankings-table-content">
              <thead className="bg-black/30">
                <tr className="text-left">
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-rank">Rank</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-player">Jogador</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-tier">Tier</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-lp">LP</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-wl">W/L</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold" data-cy="header-wr">WR%</th>
                </tr>
              </thead>
              <tbody data-cy="rankings-table-body">
                {filteredPlayers.map((entry, index) => {
                  const winRate = calculateWinrate(entry.wins, entry.losses)
                  const position = index + 1
                  const positionEmoji = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🏆'
                  
                  return (
                    <tr 
                      key={entry.summonerId || index} 
                      className="border-b border-white/10 hover:bg-white/5"
                      data-cy={`player-row-${index}`}
                    >
                      <td className="px-6 py-4" data-cy={`player-winrate-${index}`}>
                        <span className={`font-semibold ${getWinrateColor(winRate)}`}>
                          {winRate}%
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-white/70 text-sm mt-8" data-cy="results-summary">
          Exibindo TOP {filteredPlayers.length} de {allPlayers.length} jogadores
        </div>
      </div>
    </div>
  )
}