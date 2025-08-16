import { useState, useEffect } from 'react'
import Link from 'next/link'
import { searchPlayer, checkHealth } from '../src/api'
import { calculateWinrate, getWinrateColor } from '../src/utils'

export default function Home() {
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('BR1')
  const [playerData, setPlayerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [healthData, setHealthData] = useState<any>(null)

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await checkHealth()
        setHealthData(response.data)
      } catch (err) {
        console.error('Health check failed:', err)
      }
    }

    checkApiHealth()
    const interval = setInterval(checkApiHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = async () => {
    if (gameName.trim().length < 2) return

    setIsLoading(true)
    setError(null)
    setPlayerData(null)

    try {
      const response = await searchPlayer(gameName.trim(), tagLine.trim())
      setPlayerData(response)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setGameName('')
    setTagLine('BR1')
    setPlayerData(null)
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" data-cy="home-page">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <div className="text-center space-y-6 mb-12">
          <h1 
            className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            data-cy="main-title"
          >
            TFT Stats Brasil
          </h1>
          <p className="text-xl text-blue-200 leading-relaxed" data-cy="main-description">
            Acompanhe rankings e análises dos melhores jogadores do TFT Brasil
          </p>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm border" data-cy="api-status">
            {healthData ? (
              <span className="bg-green-500/20 text-green-400 border-green-500/30" data-cy="api-status-online">
                🟢 API Online
              </span>
            ) : (
              <span className="bg-red-500/20 text-red-400 border-red-500/30" data-cy="api-status-offline">
                🔴 API Offline
              </span>
            )}
          </div>
        </div>

        <div className="mb-12">
          <Link href="/leagues" className="group block max-w-md mx-auto" data-cy="leagues-link">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-2" data-cy="leagues-title">High Tier Leagues</h3>
              <p className="text-yellow-200/80 text-sm" data-cy="leagues-description">
                Os melhores jogadores: Challenger, Grandmaster e Master
              </p>
            </div>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20" data-cy="search-section">
          <h2 className="text-2xl font-bold text-white mb-6 text-center" data-cy="search-title">
            🎮 Busca de Jogador
          </h2>

          <div className="flex gap-3 mb-4" data-cy="search-form">
            <input
              type="text"
              placeholder="Nome do jogador"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-cy="search-input-gamename"
            />
            <input
              type="text"
              placeholder="BR1"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-24 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-cy="search-input-tagline"
            />
            <button 
              onClick={handleSearch}
              disabled={gameName.length < 2 || isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              data-cy="search-button"
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4" data-cy="search-error">
              <p className="text-red-300 text-center" data-cy="search-error-message">
                ❌ Jogador não encontrado: "{gameName}#{tagLine}"
              </p>
              <button
                onClick={handleClear}
                className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg w-full"
                data-cy="search-error-retry"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {playerData?.data && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6" data-cy="search-result">
              <h3 className="text-lg font-bold text-white mb-4 text-center" data-cy="search-result-title">
                ✅ {playerData.data.gameName}#{playerData.data.tagLine}
              </h3>
              
              {playerData.data.league ? (
                <div className="space-y-4" data-cy="search-result-league">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center" data-cy="search-result-stats">
                    <div data-cy="search-result-tier">
                      <div className="text-green-300 text-xs">Tier</div>
                      <div className="text-white font-bold">
                        {playerData.data.league.tier} {playerData.data.league.rank || ''}
                      </div>
                    </div>
                    <div data-cy="search-result-lp">
                      <div className="text-green-300 text-xs">LP</div>
                      <div className="text-yellow-400 font-bold">
                        {playerData.data.league.leaguePoints}
                      </div>
                    </div>
                    <div data-cy="search-result-wins">
                      <div className="text-green-300 text-xs">Vitórias</div>
                      <div className="text-green-400 font-bold">
                        {playerData.data.league.wins}
                      </div>
                    </div>
                    <div data-cy="search-result-losses">
                      <div className="text-green-300 text-xs">Derrotas</div>
                      <div className="text-red-400 font-bold">
                        {playerData.data.league.losses}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center" data-cy="search-result-winrate">
                    {(() => {
                      const winrate = calculateWinrate(
                        playerData.data.league.wins, 
                        playerData.data.league.losses
                      )
                      return (
                        <div className={`text-2xl font-bold ${getWinrateColor(winrate)}`}>
                          {winrate}% Winrate
                        </div>
                      )
                    })()}
                  </div>
                </div>
              ) : (
                <div className="text-center text-yellow-400" data-cy="search-result-no-rank">
                  📋 Sem dados de rank disponíveis
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-white/60 text-sm mt-8" data-cy="footer">
          🎮 TFT Stats Brasil não é afiliado à Riot Games
        </div>
      </div>
    </div>
  )
}