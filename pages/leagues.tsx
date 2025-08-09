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

  // Debug: Verificar dados recebidos
  useEffect(() => {
    console.log('🏆 League Page - Dados recebidos:', {
      isLoading,
      hasError: !!hasError,
      data: {
        challenger: data.challenger ? {
          exists: true,
          entriesCount: data.challenger.entries?.length || 0,
          firstEntry: data.challenger.entries?.[0],
          sampleNames: data.challenger.entries?.slice(0, 3).map(e => e.summonerName)
        } : null,
        grandmaster: data.grandmaster ? {
          exists: true,
          entriesCount: data.grandmaster.entries?.length || 0,
          sampleNames: data.grandmaster.entries?.slice(0, 3).map(e => e.summonerName)
        } : null,
        master: data.master ? {
          exists: true,
          entriesCount: data.master.entries?.length || 0,
          sampleNames: data.master.entries?.slice(0, 3).map(e => e.summonerName)
        } : null
      }
    })
  }, [data, isLoading, hasError])

  const handlePlayerClick = (entry: LeagueEntry) => {
    console.log('🎮 Player clicked:', entry)
    toast.info('Jogador selecionado', `Perfil de ${entry.summonerName}`)
  }

  const getFilteredPlayers = () => {
    console.log('🔍 Filtrando players, tier ativo:', activeTier)
    
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
      console.log('📊 Todos os players:', players.length)
    } else {
      players = data[activeTier]?.entries || []
      console.log(`📊 Players ${activeTier}:`, players.length)
    }

    if (searchTerm) {
      const originalCount = players.length
      players = players.filter(player =>
        player.summonerName && player.summonerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      console.log(`🔍 Filtro "${searchTerm}": ${originalCount} → ${players.length}`)
    }

    const sortedPlayers = players.sort(compareRanks)
    console.log('✅ Players finais ordenados:', sortedPlayers.length)
    
    // Debug: Verificar nomes dos primeiros players
    console.log('👥 Primeiros 5 players:', sortedPlayers.slice(0, 5).map(p => ({
      summonerName: p.summonerName,
      tier: p.tier,
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

    console.log('📈 Stats calculadas:', stats)
    return stats
  }

  const stats = getTierStats()

  return (
    <MainLayout title="High Tier Leagues" showBackButton>
      <div className="space-y-8">
        {/* Debug Info */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-300">
          <h3 className="font-bold mb-2">🐛 Debug Info</h3>
          <div className="text-sm space-y-1">
            <div>Loading: {isLoading ? 'Sim' : 'Não'}</div>
            <div>Error: {hasError ? 'Sim' : 'Não'}</div>
            <div>Challenger: {data.challenger ? `${data.challenger.entries?.length || 0} entries` : 'Não carregado'}</div>
            <div>Grandmaster: {data.grandmaster ? `${data.grandmaster.entries?.length || 0} entries` : 'Não carregado'}</div>
            <div>Master: {data.master ? `${data.master.entries?.length || 0} entries` : 'Não carregado'}</div>
            <div>Players filtrados: {filteredPlayers.length}</div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 High Tier Leagues
          </h1>
          <p className="text-blue-200 text-lg">
            Os melhores jogadores do TFT Brasil
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando rankings..." />
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
                📊 Visão Geral
              </h2>
              <StatsGrid>
                <StatsCard
                  title="Total de Jogadores"
                  value={stats.total}
                  icon="👥"
                  color="blue"
                  subtitle="Master, GM, Challenger"
                />
                <StatsCard
                  title="Challenger"
                  value={stats.challenger}
                  icon="👑"
                  color="yellow"
                  subtitle="Elite do servidor"
                />
                <StatsCard
                  title="LP Médio"
                  value={stats.avgLP}
                  icon="⭐"
                  color="purple"
                  subtitle={`Máximo: ${stats.topLP}`}
                />
                <StatsCard
                  title="Grandmaster + Master"
                  value={stats.grandmaster + stats.master}
                  icon="🔥"
                  color="red"
                  subtitle="High tier players"
                />
              </StatsGrid>
            </div>

            {/* Controls */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Tier Filter */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all' as const, label: 'Todos', count: stats.total },
                    { key: 'challenger' as const, label: 'Challenger', count: stats.challenger },
                    { key: 'grandmaster' as const, label: 'Grandmaster', count: stats.grandmaster },
                    { key: 'master' as const, label: 'Master', count: stats.master },
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

                {/* Search */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Buscar jogador..."
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

            {/* Players Table */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black/30">
                    <tr className="text-left">
                      <th className="px-6 py-4 text-blue-300 font-semibold">#</th>
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

                        // Debug do nome do jogador
                        console.log(`🎮 Renderizando entry ${index}:`, {
                          summonerName: entry.summonerName,
                          tier: entry.tier,
                          lp: entry.leaguePoints
                        })

                        return (
                          <tr 
                            key={entry.summonerId || index}
                            onClick={() => handlePlayerClick(entry)}
                            className="border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {index < 3 && (
                                  <span className="text-xl mr-2">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </span>
                                )}
                                <span className="text-blue-400 font-bold">
                                  #{index + 1}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-white font-semibold">
                                {entry.summonerName || 'Nome não disponível'}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {entry.queueType}
                              </div>
                              {/* Debug info */}
                              <div className="text-xs text-yellow-300 opacity-70">
                                ID: {entry.summonerId?.slice(0, 8)}...
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
                              <span className="text-yellow-400 font-bold">
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
              🔄 Dados atualizados automaticamente a cada 30 minutos • 
              Total de {filteredPlayers.length} jogadores exibidos
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}