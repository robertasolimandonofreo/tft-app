import { useState } from 'react'
import Link from 'next/link'
import { useLeagueEntries } from '../src/hooks/usePlayer'
import { TIERS, DIVISIONS } from '../src/types'
import type { Tier, Division } from '../src/types'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-blue-300 hover:text-blue-200 mb-4 transition-colors"
          >
            ← Voltar ao início
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Busca Avançada
          </h1>
          <p className="text-blue-200">
            Explore jogadores por tier e divisão
          </p>
        </div>

        {/* Search Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
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
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white/80">Carregando jogadores...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
              <p className="text-red-300">❌ Erro ao carregar dados</p>
              <p className="text-red-400 text-sm mt-2">{error.message}</p>
            </div>
          )}

          {data && (
            <>
              {/* Results Header */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    🏅 {selectedTier} {selectedDivision}
                  </h2>
                  <div className="text-blue-300">
                    {data.entries.length} jogadores • Página {data.page}
                  </div>
                </div>
              </div>

              {/* Results Table */}
              {data.entries.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
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
                        {data.entries.map((entry, index) => {
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
              <div className="flex justify-center items-center gap-4 mt-6">
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
        </div>

        {/* Info */}
        <div className="text-center mt-8 text-white/60 text-sm">
          💡 Cada página mostra até 200 jogadores • Dados atualizados a cada 30 minutos
        </div>
      </div>
    </div>
  )
}