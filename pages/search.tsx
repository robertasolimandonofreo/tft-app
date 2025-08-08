import { useState } from 'react'
import { MainLayout } from '../src/components/layout/MainLayout'
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner'
import { ErrorMessage } from '../src/components/ui/ErrorBoundary'
import { useLeagueEntries } from '../src/hooks/usePlayer'
import { TIERS, DIVISIONS } from '../src/types'
import type { Tier, Division, LeagueEntry } from '../src/types'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Erro desconhecido'
}

export default function SearchPage() {
  const [selectedTier, setSelectedTier] = useState<Tier>('GOLD')
  const [selectedDivision, setSelectedDivision] = useState<Division>('I')
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, error } = useLeagueEntries(
    selectedTier, 
    selectedDivision, 
    currentPage
  )

  const handleSearch = () => {
    setCurrentPage(1)
  }

  return (
    <MainLayout title="Busca Avançada" showBackButton>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔍 Busca Avançada
          </h1>
          <p className="text-blue-200 text-lg">
            Explore jogadores por tier e divisão
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Tier Select */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Tier
              </label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as Tier)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TIERS.map(tier => (
                  <option key={tier} value={tier} className="bg-gray-900">
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            {/* Division Select */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Divisão
              </label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value as Division)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DIVISIONS.map(division => (
                  <option key={division} value={division} className="bg-gray-900">
                    {division}
                  </option>
                ))}
              </select>
            </div>

            {/* Page Input */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Página
              </label>
              <input
                type="number"
                min="1"
                value={currentPage}
                onChange={(e) => setCurrentPage(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando jogadores..." />
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            title="Erro ao carregar dados"
            message={getErrorMessage(error)}
          />
        )}

        {/* Results */}
        {!isLoading && !error && data && (
          <>
            {/* Results Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  🏅 {selectedTier} {selectedDivision}
                </h2>
                <div className="text-blue-300">
                  {data.entries?.length || 0} jogadores • Página {data.page}
                </div>
              </div>
            </div>

            {/* Results Table */}
            {data.entries && data.entries.length > 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-black/30">
                      <tr className="text-left">
                        <th className="px-6 py-4 text-blue-300 font-semibold">Jogador</th>
                        <th className="px-6 py-4 text-blue-300 font-semibold">LP</th>
                        <th className="px-6 py-4 text-blue-300 font-semibold">Vitórias</th>
                        <th className="px-6 py-4 text-blue-300 font-semibold">Derrotas</th>
                        <th className="px-6 py-4 text-blue-300 font-semibold">WR%</th>
                        <th className="px-6 py-4 text-blue-300 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.entries.map((entry: LeagueEntry, index: number) => {
                        const winRate = entry.wins + entry.losses > 0 
                          ? ((entry.wins / (entry.wins + entry.losses)) * 100).toFixed(1)
                          : '0.0'

                        return (
                          <tr 
                            key={entry.summonerId || index}
                            className="border-b border-white/10 hover:bg-white/5 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="text-white font-semibold">
                                {entry.summonerName || 'Unknown'}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {entry.queueType}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-yellow-300 font-bold">
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
                                    🔥 Hot
                                  </span>
                                )}
                                {entry.veteran && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                                    ⭐ Vet
                                  </span>
                                )}
                                {entry.freshBlood && (
                                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                                    🆕 New
                                  </span>
                                )}
                                {entry.inactive && (
                                  <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
                                    💤 Inativo
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 text-center">
                <p className="text-yellow-300">⚠️ Nenhum jogador encontrado nesta página</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                ← Anterior
              </button>
              
              <span className="text-white">
                Página {currentPage}
              </span>
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!data.hasMore}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Próxima →
              </button>
            </div>
          </>
        )}

        {/* Info */}
        <div className="text-center text-white/60 text-sm">
          💡 Cada página mostra até 200 jogadores • Dados atualizados a cada 30 minutos
        </div>
      </div>
    </MainLayout>
  )
}