import Link from 'next/link'
import { useRatedLadder } from '../src/hooks/usePlayer'

export default function RankedPage() {
  const { data, isLoading, error } = useRatedLadder('RANKED_TFT')

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
            📊 Rated Ladder
          </h1>
          <p className="text-blue-200">
            Top jogadores do ladder ranqueado
          </p>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-white/80">Carregando ladder...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
              <p className="text-red-300">❌ Erro ao carregar ladder</p>
              <p className="text-red-400 text-sm mt-2">{error.message}</p>
            </div>
          )}

          {data && (
            <>
              {/* Ladder Info */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    🏆 {data.queue} - {data.tier}
                  </h2>
                  <div className="text-purple-300">
                    {data.entries.length} jogadores no top
                  </div>
                </div>
              </div>

              {/* Ladder Table */}
              {data.entries.length > 0 ? (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-black/30">
                        <tr className="text-left">
                          <th className="px-6 py-4 text-purple-300 font-semibold">#</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">Jogador</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">Tier</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">Rating</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">LP</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">Vitórias</th>
                          <th className="px-6 py-4 text-purple-300 font-semibold">Última Atualização</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.entries
                          .sort((a, b) => b.ratedRating - a.ratedRating)
                          .map((entry, index) => {
                            const lastUpdate = entry.previousUpdate 
                              ? new Date(entry.previousUpdate * 1000).toLocaleDateString('pt-BR')
                              : 'N/A'

                            return (
                              <tr 
                                key={entry.summonerId}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    {index < 3 && (
                                      <span className="text-2xl mr-2">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                      </span>
                                    )}
                                    <span className="text-purple-400 font-bold">
                                      #{index + 1}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-white font-semibold">
                                    {entry.summonerName}
                                  </div>
                                  <div className="text-gray-400 text-sm">
                                    ID: {entry.summonerId}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                                    {entry.ratedTier}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-yellow-400 font-bold text-lg">
                                    {entry.ratedRating.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-blue-400 font-semibold">
                                    {entry.leaguePoints.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-green-400 font-semibold">
                                    {entry.wins}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-gray-400 text-sm">
                                    {lastUpdate}
                                  </span>
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
                  <p className="text-yellow-300">⚠️ Nenhum jogador encontrado no ladder</p>
                </div>
              )}

              {/* Stats Summary */}
              {data.entries.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {Math.max(...data.entries.map(e => e.ratedRating)).toLocaleString()}
                    </div>
                    <div className="text-white/80 text-sm">Maior Rating</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.round(data.entries.reduce((sum, e) => sum + e.ratedRating, 0) / data.entries.length).toLocaleString()}
                    </div>
                    <div className="text-white/80 text-sm">Rating Médio</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {Math.round(data.entries.reduce((sum, e) => sum + e.wins, 0) / data.entries.length)}
                    </div>
                    <div className="text-white/80 text-sm">Vitórias Médias</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {data.entries.length}
                    </div>
                    <div className="text-white/80 text-sm">Total de Jogadores</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info */}
        <div className="text-center mt-8 text-white/60 text-sm">
          💡 Dados do ladder atualizados automaticamente a cada hora
        </div>
      </div>
    </div>
  )
}