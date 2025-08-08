import { MainLayout } from '../src/components/layout/MainLayout'
import { StatsCard, StatsGrid } from '../src/components/ui/StatsCard'
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner'
import { ErrorMessage } from '../src/components/ui/ErrorBoundary'
import { useHighTierLeagues, useRatedLadder } from '../src/hooks/usePlayer'

export default function AnalyticsPage() {
  const { data: highTierData, isLoading: highTierLoading, hasError: highTierError } = useHighTierLeagues()
  const { data: ladderData, isLoading: ladderLoading, error: ladderError } = useRatedLadder('RANKED_TFT')

  const isLoading = highTierLoading || ladderLoading
  const hasError = Boolean(highTierError) || Boolean(ladderError)

  const getAnalytics = () => {
    if (!highTierData?.challenger || !highTierData?.grandmaster || !highTierData?.master) {
      return null
    }

    const allHighTier = [
      ...highTierData.challenger.entries,
      ...highTierData.grandmaster.entries,
      ...highTierData.master.entries
    ]

    const totalPlayers = allHighTier.length
    const avgLP = Math.round(allHighTier.reduce((sum, p) => sum + p.leaguePoints, 0) / totalPlayers)
    const maxLP = Math.max(...allHighTier.map(p => p.leaguePoints))
    const minLP = Math.min(...allHighTier.map(p => p.leaguePoints))

    const winRates = allHighTier.map(p => {
      const total = p.wins + p.losses
      return total > 0 ? (p.wins / total) * 100 : 0
    })
    const avgWinRate = Math.round(winRates.reduce((sum, wr) => sum + wr, 0) / winRates.length)
    const maxWinRate = Math.max(...winRates)

    const activeStreaks = allHighTier.filter(p => p.hotStreak).length
    const veterans = allHighTier.filter(p => p.veteran).length
    const freshBlood = allHighTier.filter(p => p.freshBlood).length
    const inactive = allHighTier.filter(p => p.inactive).length

    const lpRanges = {
      '0-99': allHighTier.filter(p => p.leaguePoints < 100).length,
      '100-299': allHighTier.filter(p => p.leaguePoints >= 100 && p.leaguePoints < 300).length,
      '300-499': allHighTier.filter(p => p.leaguePoints >= 300 && p.leaguePoints < 500).length,
      '500+': allHighTier.filter(p => p.leaguePoints >= 500).length,
    }

    const tierDistribution = {
      challenger: highTierData.challenger.entries.length,
      grandmaster: highTierData.grandmaster.entries.length,
      master: highTierData.master.entries.length,
    }

    return {
      totalPlayers,
      avgLP,
      maxLP,
      minLP,
      avgWinRate,
      maxWinRate,
      activeStreaks,
      veterans,
      freshBlood,
      inactive,
      lpRanges,
      tierDistribution,
      activityRate: Math.round(((totalPlayers - inactive) / totalPlayers) * 100)
    }
  }

  const analytics = getAnalytics()

  return (
    <MainLayout title="Analytics" showBackButton>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            📈 Analytics
          </h1>
          <p className="text-blue-200 text-lg">
            Análise detalhada dos dados do TFT Brasil
          </p>
        </div>

        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando dados para análise..." />
        )}

        {hasError && (
          <ErrorMessage
            title="Erro ao carregar dados"
            message="Não foi possível carregar os dados para análise"
          />
        )}

        {!isLoading && !hasError && analytics && (
          <>
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                📊 Visão Geral
              </h2>
              <StatsGrid>
                <StatsCard
                  title="Total High Tier"
                  value={analytics.totalPlayers}
                  icon="👥"
                  color="blue"
                  subtitle="Master, GM, Challenger"
                />
                <StatsCard
                  title="LP Médio"
                  value={analytics.avgLP}
                  icon="⭐"
                  color="yellow"
                  subtitle={`Range: ${analytics.minLP} - ${analytics.maxLP}`}
                />
                <StatsCard
                  title="WR Médio"
                  value={`${analytics.avgWinRate}%`}
                  icon="🎯"
                  color="green"
                  subtitle={`Máximo: ${analytics.maxWinRate.toFixed(1)}%`}
                />
                <StatsCard
                  title="Taxa de Atividade"
                  value={`${analytics.activityRate}%`}
                  icon="🔥"
                  color="purple"
                  subtitle={`${analytics.inactive} inativos`}
                />
              </StatsGrid>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                🏆 Distribuição por Tier
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-yellow-300">👑 Challenger</h3>
                    <span className="text-3xl font-bold text-yellow-400">
                      {analytics.tierDistribution.challenger}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-yellow-200">% do Total:</span>
                      <span className="text-white font-semibold">
                        {((analytics.tierDistribution.challenger / analytics.totalPlayers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-red-300">🔴 Grandmaster</h3>
                    <span className="text-3xl font-bold text-red-400">
                      {analytics.tierDistribution.grandmaster}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-red-200">% do Total:</span>
                      <span className="text-white font-semibold">
                        {((analytics.tierDistribution.grandmaster / analytics.totalPlayers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-purple-300">🟣 Master</h3>
                    <span className="text-3xl font-bold text-purple-400">
                      {analytics.tierDistribution.master}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-200">% do Total:</span>
                      <span className="text-white font-semibold">
                        {((analytics.tierDistribution.master / analytics.totalPlayers) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                💎 Distribuição de League Points
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(analytics.lpRanges).map(([range, count]) => (
                  <div key={range} className="bg-white/10 border border-white/20 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2">
                        {count}
                      </div>
                      <div className="text-white font-semibold mb-1">
                        {range} LP
                      </div>
                      <div className="text-xs text-blue-300">
                        {((count / analytics.totalPlayers) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                🔥 Análise de Status dos Jogadores
              </h2>
              <StatsGrid>
                <StatsCard
                  title="Hot Streaks"
                  value={analytics.activeStreaks}
                  icon="🔥"
                  color="red"
                  subtitle={`${((analytics.activeStreaks / analytics.totalPlayers) * 100).toFixed(1)}% dos jogadores`}
                />
                <StatsCard
                  title="Veterans"
                  value={analytics.veterans}
                  icon="⭐"
                  color="purple"
                  subtitle={`${((analytics.veterans / analytics.totalPlayers) * 100).toFixed(1)}% dos jogadores`}
                />
                <StatsCard
                  title="Fresh Blood"
                  value={analytics.freshBlood}
                  icon="🆕"
                  color="green"
                  subtitle={`${((analytics.freshBlood / analytics.totalPlayers) * 100).toFixed(1)}% dos jogadores`}
                />
                <StatsCard
                  title="Inativos"
                  value={analytics.inactive}
                  icon="💤"
                  color="blue"
                  subtitle={`${((analytics.inactive / analytics.totalPlayers) * 100).toFixed(1)}% dos jogadores`}
                />
              </StatsGrid>
            </div>

            {ladderData && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  🏅 Estatísticas do Ladder
                </h2>
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {ladderData.stats?.totalPlayers || 0}
                      </div>
                      <div className="text-white font-semibold">Total no Ladder</div>
                      <div className="text-blue-300 text-sm">Jogadores ativos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {ladderData.stats?.averageRating?.toLocaleString() || 0}
                      </div>
                      <div className="text-white font-semibold">Rating Médio</div>
                      <div className="text-blue-300 text-sm">Pontuação média</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {ladderData.stats?.maxRating?.toLocaleString() || 0}
                      </div>
                      <div className="text-white font-semibold">Maior Rating</div>
                      <div className="text-blue-300 text-sm">Rank #1</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {ladderData.stats?.averageWins || 0}
                      </div>
                      <div className="text-white font-semibold">Vitórias Médias</div>
                      <div className="text-blue-300 text-sm">Por jogador</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold text-white mb-6">
                💡 Insights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-300 mb-4">🎯 Competitividade</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Win Rate Médio:</span>
                      <span className="text-white font-semibold">{analytics.avgWinRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Jogadores em Hot Streak:</span>
                      <span className="text-white font-semibold">
                        {((analytics.activeStreaks / analytics.totalPlayers) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-200">Taxa de Atividade:</span>
                      <span className="text-white font-semibold">{analytics.activityRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-green-300 mb-4">📊 Distribuição</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-200">Maior concentração:</span>
                      <span className="text-white font-semibold">
                        {Object.entries(analytics.lpRanges).reduce((a, b) => 
                          analytics.lpRanges[a[0] as keyof typeof analytics.lpRanges] > 
                          analytics.lpRanges[b[0] as keyof typeof analytics.lpRanges] ? a : b
                        )[0]} LP
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-200">Tier dominante:</span>
                      <span className="text-white font-semibold">
                        {analytics.tierDistribution.master > analytics.tierDistribution.grandmaster + analytics.tierDistribution.challenger 
                          ? 'Master' : 'High Tier'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-200">Variação LP:</span>
                      <span className="text-white font-semibold">
                        {analytics.maxLP - analytics.minLP} pontos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center text-white/60 text-sm">
          📊 Dados atualizados automaticamente • Análise baseada nos últimos dados disponíveis
        </div>
      </div>
    </MainLayout>
  )
}