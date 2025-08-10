import { useState, useEffect } from 'react'
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

  useEffect(() => {
    console.log('🏆 League Page - Dados TOP 10 recebidos:', {
      isLoading,
      hasError: !!hasError,
      data: {
        challenger: data.challenger ? {
          exists: true,
          tier: data.challenger.tier,
          entriesCount: data.challenger.entries?.length || 0,
          firstEntry: data.challenger.entries?.[0],
          sampleEntries: data.challenger.entries?.slice(0, 3).map(e => ({
            summonerName: e.summonerName,
            tier: e.tier,
            rank: e.rank,
            leaguePoints: e.leaguePoints
          }))
        } : null,
        grandmaster: data.grandmaster ? {
          exists: true,
          tier: data.grandmaster.tier,
          entriesCount: data.grandmaster.entries?.length || 0,
          sampleEntries: data.grandmaster.entries?.slice(0, 3).map(e => ({
            summonerName: e.summonerName,
            tier: e.tier,
            rank: e.rank,
            leaguePoints: e.leaguePoints
          }))
        } : null,
        master: data.master ? {
          exists: true,
          tier: data.master.tier,
          entriesCount: data.master.entries?.length || 0,
          sampleEntries: data.master.entries?.slice(0, 3).map(e => ({
            summonerName: e.summonerName,
            tier: e.tier,
            rank: e.rank,
            leaguePoints: e.leaguePoints
          }))
        } : null
      }
    })
  }, [data, isLoading, hasError])

  const handlePlayerClick = (entry: LeagueEntry) => {
    console.log('Player clicked:', entry)
    toast.info('Jogador selecionado', `Perfil de ${entry.summonerName}`)
  }

  const getFilteredPlayers = () => {
    console.log('Filtering TOP 10 players, active tier:', activeTier)
    
    if (!data.challenger || !data.grandmaster || !data.master) {
      console.log('❌ Dados não disponíveis ainda')
      return []
    }

    let players: LeagueEntry[] = []

    if (activeTier === 'all') {
      players = [
        ...(data.challenger.entries || []),
        ...(data.grandmaster.entries || []),
        ...(data.master.entries || [])
      ]
      console.log('📊 Todos os TOP players:', players.length)
    } else {
      players = data[activeTier]?.entries || []
      console.log(`📊 TOP 10 ${activeTier}:`, players.length)
    }

    if (searchTerm) {
      const originalCount = players.length
      players = players.filter(player =>
        player.summonerName && player.summonerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      console.log(`🔍 Filtro &ldquo;${searchTerm}&rdquo;: ${originalCount} → ${players.length}`)
    }

    const sortedPlayers = players.sort(compareRanks)
    console.log('Final TOP players sorted:', sortedPlayers.length)
    
    console.log('👥 TOP 5 players com tiers:', sortedPlayers.slice(0, 5).map(p => ({
      summonerName: p.summonerName,
      tier: p.tier,
      rank: p.rank,
      lp: p.leaguePoints
    })))

    return sortedPlayers
  }

  const filteredPlayers = getFilteredPlayers()

  const getTierStats = () => {
    if (!data.challenger || !data.grandmaster || !data.master) {
      return null
    }

    const allPlayers = [
      ...(data.challenger.entries || []),
      ...(data.grandmaster.entries || []),
      ...(data.master.entries || [])
    ]

    const stats = {
      total: allPlayers.length,
      challenger: data.challenger.entries?.length || 0,
      grandmaster: data.grandmaster.entries?.length || 0,
      master: data.master.entries?.length || 0,
      avgLP: allPlayers.length > 0 ? Math.round(allPlayers.reduce((sum, p) => sum + p.leaguePoints, 0) / allPlayers.length) : 0,
      topLP: allPlayers.length > 0 ? Math.max(...allPlayers.map(p => p.leaguePoints)) : 0
    }

    console.log('Calculated TOP stats:', stats)
    return stats
  }

  const stats = getTierStats()

  return (
    <MainLayout title="TOP 10 High Tier Leagues" showBackButton>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 TOP 10 High Tier Leagues
          </h1>
          <p className="text-blue-200 text-lg">
            Os 10 melhores jogadores de cada tier do TFT Brasil
          </p>
        </div>

        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando TOP 10 rankings..." />
        )}

        {Boolean(hasError) && (
          <ErrorMessage
            title="Erro ao carregar TOP 10"
            message="Não foi possível carregar os melhores jogadores"
            onRetry={refreshAll}
          />
        )}

        {!isLoading && !Boolean(hasError) && stats && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                📊 Visão Geral TOP 10
              </h2>
              <StatsGrid>
                <StatsCard
                  title="Total TOP Players"
                  value={stats.total}
                  icon="👥"
                  color="blue"
                  subtitle="10 melhores por tier"
                />
                <StatsCard
                  title="TOP 10 Challenger"
                  value={stats.challenger}
                  icon="👑"
                  color="yellow"
                  subtitle="Elite absoluta"
                />
                <StatsCard
                  title="LP Médio TOP"
                  value={stats.avgLP}
                  icon="⭐"
                  color="purple"
                  subtitle={`Máximo: ${stats.topLP}`}
                />
                <StatsCard
                  title="GM + Master TOP"
                  value={stats.grandmaster + stats.master}
                  icon="🔥"
                  color="red"
                  subtitle="20 melhores combinados"
                />
              </StatsGrid>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all' as const, label: 'TOP 30 (Todos)', count: stats.total },
                    { key: 'challenger' as const, label: 'TOP 10 Challenger', count: stats.challenger },
                    { key: 'grandmaster' as const, label: 'TOP 10 Grandmaster', count: stats.grandmaster },
                    { key: 'master' as const, label: 'TOP 10 Master', count: stats.master },
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

                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar nos TOP players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={refreshAll}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    🔄 Atualizar TOP
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <div className="bg-black/30 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  TOP {filteredPlayers.length} Players
                  {searchTerm && (
                    <span className="text-yellow-300 text-sm ml-2">
                      (filtrado: &ldquo;{searchTerm}&rdquo;)
                    </span>
                  )}
                </h3>
              </div>
              
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
                      filteredPlayers.map((entry, index) => {
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

                        const getTierName = (tier: string) => {
                          switch (tier) {
                            case 'CHALLENGER': return 'Challenger'
                            case 'GRANDMASTER': return 'Grandmaster'
                            case 'MASTER': return 'Master'
                            default: return tier || 'Unknown'
                          }
                        }

                        const getRankDisplay = (position: number) => {
                          if (position === 0) return { emoji: '🥇', text: '#1', class: 'text-yellow-400' }
                          if (position === 1) return { emoji: '🥈', text: '#2', class: 'text-gray-300' }
                          if (position === 2) return { emoji: '🥉', text: '#3', class: 'text-amber-600' }
                          if (position < 10) return { emoji: '🏆', text: `#${position + 1}`, class: 'text-blue-400' }
                          return { emoji: '⭐', text: `#${position + 1}`, class: 'text-purple-400' }
                        }

                        const rankDisplay = getRankDisplay(index)

                        console.log(`Rendering TOP entry ${index + 1}:`, {
                          summonerName: entry.summonerName,
                          tier: entry.tier,
                          tierName: getTierName(entry.tier),
                          lp: entry.leaguePoints
                        })

                        return (
                          <tr 
                            key={entry.summonerId || index}
                            onClick={() => handlePlayerClick(entry)}
                            className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                  {rankDisplay.emoji}
                                </span>
                                <span className={`font-bold text-lg ${rankDisplay.class}`}>
                                  {rankDisplay.text}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-white font-semibold text-lg group-hover:text-blue-300 transition-colors">
                                  {entry.summonerName || 'Nome não disponível'}
                                </div>
                                <div className="text-gray-400 text-sm">
                                  {entry.queueType}
                                </div>

                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                  {getTierIcon(entry.tier)}
                                </span>
                                <div className="flex flex-col">
                                  <span className={`font-semibold text-lg ${getTierColor(entry.tier)}`}>
                                    {getTierName(entry.tier)}
                                  </span>
                                  {entry.rank && (
                                    <span className="text-sm text-white/70">
                                      {entry.rank}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-yellow-400 font-bold text-lg">
                                {entry.leaguePoints.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-green-400 font-semibold text-lg">
                                {entry.wins}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-red-400 font-semibold text-lg">
                                {entry.losses}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-semibold text-lg ${
                                parseFloat(winRate) >= 70 ? 'text-green-400' :
                                parseFloat(winRate) >= 60 ? 'text-yellow-400' : 
                                parseFloat(winRate) >= 50 ? 'text-orange-400' : 'text-red-400'
                              }`}>
                                {winRate}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {entry.hotStreak && (
                                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium">
                                    🔥 Hot Streak
                                  </span>
                                )}
                                {entry.veteran && (
                                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                                    ⭐ Veteran
                                  </span>
                                )}
                                {entry.freshBlood && (
                                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                                    🆕 Fresh Blood
                                  </span>
                                )}
                                {entry.inactive && (
                                  <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-medium">
                                    💤 Inativo
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
                              <div className="space-y-2">
                                <div className="text-2xl">🔍</div>
                                <div>Nenhum TOP player encontrado para &ldquo;{searchTerm}&rdquo;</div>
                                <button
                                  onClick={() => setSearchTerm('')}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                  Limpar filtro
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="text-2xl">📭</div>
                                <div>Nenhum TOP player disponível</div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
              <div className="space-y-2 text-white/70">
                <div className="text-lg font-semibold text-white">
                  🏆 Exibindo TOP {filteredPlayers.length} players de {stats.total} total
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}