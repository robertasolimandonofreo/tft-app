import { useState } from 'react'
import Link from 'next/link'
import { useSummoner, useHealthCheck } from '../src/hooks/usePlayer';

export default function Home() {
  const [puuid, setPuuid] = useState('')
  const [input, setInput] = useState('')
  
  const { data: healthData, isError: healthError } = useHealthCheck()
  const { data: summonerData, isLoading, error } = useSummoner(puuid)

  const handleSearch = () => {
    if (input.trim()) {
      setPuuid(input.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            TFT Stats Brasil
          </h1>
          <p className="text-xl text-blue-200">
            Estatísticas completas do Teamfight Tactics
          </p>
          
          {/* Health Status */}
          <div className="mt-4">
            {healthError ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-400">
                🔴 API Offline
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400">
                🟢 API Online
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link 
            href="/leagues" 
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-colors"
          >
            🏆 High Tier Leagues
          </Link>
          <Link 
            href="/ranked" 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            📊 Ranked Ladder
          </Link>
          <Link 
            href="/search" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            🔍 Advanced Search
          </Link>
        </div>

        {/* Quick Summoner Search */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Buscar Jogador
            </h2>
            
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Digite o PUUID do jogador"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={handleSearch}
                disabled={!input.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Buscar
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">Buscando jogador...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                <p className="text-red-300">
                  ❌ Erro ao buscar jogador. Verifique o PUUID e tente novamente.
                </p>
              </div>
            )}

            {/* Success State */}
            {summonerData && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  🎮 Dados do Jogador
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-300">Nome:</span>
                    <span className="text-white ml-2 font-semibold">
                      {summonerData.name || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">Level:</span>
                    <span className="text-white ml-2 font-semibold">
                      {summonerData.summonerLevel || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">PUUID:</span>
                    <span className="text-white ml-2 font-mono text-xs">
                      {summonerData.puuid || puuid}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-300">ID:</span>
                    <span className="text-white ml-2 font-mono text-xs">
                      {summonerData.id || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-3">
                  <Link 
                    href={`/player/${puuid}`}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Ver Perfil Completo
                  </Link>
                  <Link 
                    href={`/player/${puuid}/matches`}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Ver Partidas
                  </Link>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="mt-6 text-center text-white/60 text-sm">
              💡 O PUUID é um identificador único do jogador.
              <br />
              Você pode encontrá-lo usando ferramentas como op.gg ou similar.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}