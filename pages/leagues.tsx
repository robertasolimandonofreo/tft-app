import { useState } from 'react'
import { MainLayout } from '../src/components/layout/MainLayout'
import { StatsCard, StatsGrid } from '../src/components/ui/StatsCard'
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner'
import { ErrorMessage } from '../src/components/ui/ErrorBoundary'
import { useHighTierLeagues } from '../src/hooks/usePlayer'
import { compareRanks } from '../src/utils/tierUtils'
import { toast } from '../src/store/toastStore'
import type { LeagueEntry } from '../src/types'

type ActiveTier = 'challenger' | 'grandmaster' | 'master' | 'all'

export default function LeaguesPage() {
  const [activeTier, setActiveTier] = useState<ActiveTier>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data, isLoading, hasError, refreshAll } = useHighTierLeagues()

  const handlePlayerClick = (entry: LeagueEntry) => {
    toast.info('Jogador selecionado', `Perfil de ${entry.summonerName}`)
  }

  const getFilteredPlayers = () => {
    if (!data.challenger || !data.grandmaster || !data.master) {
      return []
    }

    let players: LeagueEntry[] = []

    if (activeTier === 'all') {
      // Pegar TOP 10 de cada tier (máximo 30 total)
      const topChallenger = data.challenger.entries.slice(0, 10)
      const topGrandmaster = data.grandmaster.entries.slice(0, 10) 
      const topMaster = data.master.entries.slice(0, 10)
      
      players = [...topChallenger, ...topGrandmaster, ...topMaster]
    } else {
      // Pegar TOP 10 do tier específico
      players = data[activeTier]?.entries.slice(0, 10) || []
    }

    if (searchTerm) {
      players = players.filter(player =>
        player.summonerName?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      )
    }

    return players.sort(compareRanks)
  }

  const filteredPlayers = getFilteredPlayers()

  const getTierStats = () => {
    if (!data.challenger || !data.grandmaster || !data.master) {
      return null
    }

    // Sempre considerar apenas TOP 10 de cada tier
    const top10Challenger = data.challenger.entries.slice(0, 10)
    const top10Grandmaster = data.grandmaster.entries.slice(0, 10)
    const top10Master = data.master.entries.slice(0, 10)
    
    const allTop10Players = [...top10Challenger, ...top10Grandmaster, ...top10Master]

    return {
      total: allTop10Players.length,
      challenger: top10Challenger.length,
      grandmaster: top10Grandmaster.length,
      master: top10Master.length,
      avgLP: Math.round(allTop10Players.reduce((sum, p) => sum + p.leaguePoints, 0) / allTop10Players.length),
      topLP: Math.max(...allTop10Players.map(p => p.leaguePoints))
    }
  }

  const stats = getTierStats()

  const getDisplayCount = (tier: ActiveTier) => {
    if (!stats) return 0
    
    switch (tier) {
      case 'all': 
        return Math.min(30, stats.total) // Máximo 30 (10 de cada tier)
      case 'challenger': 
        return Math.min(10, stats.challenger)
      case 'grandmaster': 
        return Math.min(10, stats.grandmaster)  
      case 'master': 
        return Math.min(10, stats.master)
      default: 
        return 0
    }
  }

  return (
    <MainLayout title="TOP 10 High Tier" showBackButton>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            👑 TOP 10 Brasil TFT
          </h1>
          <p className="text-blue-200 text-lg">
            Os 10 melhores jogadores de cada tier no servidor brasileiro
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando TOP 10..." />
        )}

        {/* Error State */}
        {Boolean(hasError) && (
          <ErrorMessage
            title="Erro ao carregar dados"
            message="Não foi possível carregar os rankings"
            onRetry={refreshAll}
          />
        )}

        {/* Content */}
        {!isLoading && !Boolean(hasError) && stats && (
          <>
            {/* Stats Overview */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                📊 Estatísticas dos TOP 10
              </h2>
              <StatsGrid>
                <StatsCard
                  title="Challenger TOP 10"
                  value={`${stats.challenger}/10`}
                  icon="👑"
                  color="yellow"
                  subtitle="Elite absoluta"
                />
                <StatsCard
                  title="Grandmaster TOP 10"
                  value={`${stats.grandmaster}/10`}
                  icon="🔴"
                  color="red"
                  subtitle="Alta competição"
                />
                <StatsCard
                  title="Master TOP 10"
                  value={`${stats.master}/10`}
                  icon="🟣"
                  color="purple"
                  subtitle="Jogadores dedicados"
                />
                <StatsCard
                  title="LP Médio TOP 10"
                  value={stats.avgLP}
                  icon="⭐"
                  color="blue"
                  subtitle={`Máximo: ${stats.topLP}`}
                />
              </StatsGrid>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Tier Filter */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all' as const, label: 'Todos TOP 10', count: getDisplayCount('all') },
                    { key: 'challenger' as const, label: 'Challenger', count: getDisplayCount('challenger') },
                    { key: 'grandmaster' as const, label: 'Grandmaster', count: getDisplayCount('grandmaster') },
                    { key: 'master' as const, label: 'Master', count: getDisplayCount('master') },
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTier(key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTier === key
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 text-white/80 hover:bg-white/30'
                      }`}
                    >
                      {label} ({count})
                    </button>
                  ))}
                </div>

                {/* Search and Actions */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar no TOP 10..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={refreshAll}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    🔄 Atualizar
                  </button>
                </div>
              </div>
            </div>

            {/* TOP 10 Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/30">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-blue-300 font-semibold">Rank</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">Jogador</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">Tier</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">LP</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">Vitórias</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">Derrotas</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">WR%</th>
                      <th className="px-6 py-4 text-blue-300 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlayers.length > 0 ? (
                      filteredPlayers.slice(0, 30).map((entry, index) => { // Máximo 30 na tabela
                        const winRate = entry.wins + entry.losses > 0 
                          ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)
                          : '0.0'

                        const getTierColor = (tier: string) => {
                          switch (tier) {
                            case 'CHALLENGER': return 'text-yellow-400'
                            case 'GRANDMASTER': return 'text-red-400'
                            case 'MASTER': return 'text-purple-400'
                            default: return 'text-blue-400'
                          }
                        }

                        const getTierIcon = (tier: string) => {
                          switch (tier) {
                            case 'CHALLENGER': return '👑'
                            case 'GRANDMASTER': return '🔴'
                            case 'MASTER': return '🟣'
                            default: return '🎯'
                          }
                        }

                        const getRankIcon = (index: number) => {
                          if (index === 0) return '🥇'
                          if (index === 1) return '🥈'
                          if (index === 2) return '🥉'
                          return `#${index + 1}`
                        }

                        // Função para gerar chave única
                        const getUniqueKey = (entry: LeagueEntry, index: number): string => {
                          if (entry.puuid) return entry.puuid
                          if (entry.summonerId) return entry.summonerId
                          return `entry-${index}`
                        }

                        return (
                          <tr 
                            key={getUniqueKey(entry, index)}
                            onClick={() => handlePlayerClick(entry)}
                            className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="text-2xl font-bold text-yellow-400">
                                  {getRankIcon(index)}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-white font-semibold">
                                {entry.summonerName || 'Carregando...'}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {entry.queueType || 'RANKED_TFT'}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">
                                  {getTierIcon(entry.tier)}
                                </span>
                                <span className={`font-semibold ${getTierColor(entry.tier)}`}>
                                  {entry.tier}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-yellow-400 font-bold text-lg">
                                {entry.leaguePoints.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-green-400 font-semibold">
                                {entry.wins}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-red-400 font-semibold">
                                {entry.losses}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold ${
                                parseFloat(winRate) >= 60 ? 'text-green-400' :
                                parseFloat(winRate) >= 50 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {winRate}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {entry.hotStreak && (
                                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                    🔥
                                  </span>
                                )}
                                {entry.veteran && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                    ⭐
                                  </span>
                                )}
                                {entry.freshBlood && (
                                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                    🆕
                                  </span>
                                )}
                                {entry.inactive && (
                                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                                    💤
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="text-white/60">
                            {searchTerm ? (
                              <>
                                🔍 Nenhum jogador encontrado para &quot;{searchTerm}&quot;
                              </>
                            ) : (
                              <>
                                📭 Nenhum jogador disponível
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-white/60 text-sm">
              👑 Mostrando TOP 10 de cada tier • 
              🔄 Dados atualizados automaticamente • 
              Total de {filteredPlayers.length} jogadores exibidos
              {activeTier === 'all' && (
                <span className="block mt-1">
                  📋 Máximo 30 jogadores (10 de cada tier)
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}