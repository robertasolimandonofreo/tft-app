import { MainLayout } from '../src/components/layout/MainLayout'
import { LoadingSpinner } from '../src/components/ui/LoadingSpinner'
import { ErrorMessage } from '../src/components/ui/ErrorBoundary'
import { useRatedLadder } from '../src/hooks/usePlayer'
import type { RatedLadderEntry } from '../src/types'

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

export default function RankedPage() {
  const { data, isLoading, error } = useRatedLadder('RANKED_TFT')

  return (
    <MainLayout title="Ranked Ladder" showBackButton>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Rated Ladder
          </h1>
          <p className="text-blue-200 text-lg">
            Top jogadores do ladder ranqueado
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <LoadingSpinner size="lg" text="Carregando ladder..." />
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            title="Erro ao carregar ladder"
            message={getErrorMessage(error)}
          />
        )}

        {/* Content */}
        {!isLoading && !error && data && (
          <>
            {/* Ladder Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6 border border-white/20">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">
                  🏆 {data.queue} - {data.tier}
                </h2>
                <div className="text-purple-300">
                  {data.entries?.length || 0} jogadores no top
                </div>
              </div>
            </div>

            {/* Ladder Table */}
            {data.entries && data.entries.length > 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20">
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
                        .sort((a: RatedLadderEntry, b: RatedLadderEntry) => (b.ratedRating || 0) - (a.ratedRating || 0))
                        .map((entry: RatedLadderEntry, index: number) => {
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
                                  {(entry.ratedRating || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-blue-400 font-semibold">
                                  {(entry.leaguePoints || 0).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-green-400 font-semibold">
                                  {entry.wins || 0}
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
            {data.entries && data.entries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Math.max(...data.entries.map((e: RatedLadderEntry) => e.ratedRating || 0)).toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Maior Rating</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(data.entries.reduce((sum: number, e: RatedLadderEntry) => sum + (e.ratedRating || 0), 0) / data.entries.length).toLocaleString()}
                  </div>
                  <div className="text-white/80 text-sm">Rating Médio</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(data.entries.reduce((sum: number, e: RatedLadderEntry) => sum + (e.wins || 0), 0) / data.entries.length)}
                  </div>
                  <div className="text-white/80 text-sm">Vitórias Médias</div>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center border border-white/20">
                  <div className="text-2xl font-bold text-purple-400">
                    {data.entries.length}
                  </div>
                  <div className="text-white/80 text-sm">Total de Jogadores</div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="text-center text-white/60 text-sm">
          💡 Dados do ladder atualizados automaticamente a cada hora
        </div>
      </div>
    </MainLayout>
  )
}