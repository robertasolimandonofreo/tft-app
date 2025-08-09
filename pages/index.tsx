import { useState } from 'react'
import Link from 'next/link'
import { MainLayout } from '../src/components/layout/MainLayout'
import { useSummoner, useHealthCheck, useSearchPlayer } from '../src/hooks/usePlayer'

export default function Home() {
  const [puuid, setPuuid] = useState('')
  const [input, setInput] = useState('')
  const [gameName, setGameName] = useState('')
  const [tagLine, setTagLine] = useState('BR1')
  const [searchMode, setSearchMode] = useState<'puuid' | 'name'>('name')
  
  const { data: healthData, error: healthError } = useHealthCheck()
  const { data: summonerData, isLoading: summonerLoading, error: summonerError } = useSummoner(puuid)
  
  // Trigger search only when explicitly requested
  const [shouldSearch, setShouldSearch] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  
  const { data: playerData, isLoading: playerLoading, error: playerError } = useSearchPlayer(
    shouldSearch && searchMode === 'name' ? gameName.trim() : '',
    shouldSearch && searchMode === 'name' ? tagLine.trim() : undefined
  )

  const handlePuuidSearch = () => {
    if (input.trim()) {
      setPuuid(input.trim())
      setGameName('')
      setShouldSearch(false)
    }
  }

  const handleNameSearch = () => {
    if (gameName.trim()) {
      setPuuid('')
      setShouldSearch(true)
      setSearchKey(`${gameName.trim()}-${tagLine.trim()}-${Date.now()}`)
      console.log('🔍 Iniciando busca:', {
        gameName: gameName.trim(),
        tagLine: tagLine.trim(),
        searchKey
      })
    }
  }

  const clearSearch = () => {
    setPuuid('')
    setGameName('')
    setInput('')
    setShouldSearch(false)
    setSearchKey('')
  }

  const isLoading = summonerLoading || (playerLoading && shouldSearch)
  const error = summonerError || (shouldSearch ? playerError : null)
  const resultData = summonerData || (shouldSearch ? playerData : null)

  return (
    <MainLayout showNavigation={false}>
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            TFT Stats Brasil
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            A plataforma para análise de dados do Teamfight Tactics no Brasil. 
            Acompanhe rankings e análises dos melhores jogadores.
          </p>
          
          {/* Health Status */}
          <div className="flex justify-center">
            {healthError ? (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-red-500/20 text-red-400 border border-red-500/30">
                🔴 API Offline - Alguns dados podem estar desatualizados
              </span>
            ) : (
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30">
                🟢 API Online - Dados em tempo real
              </span>
            )}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <Link href="/leagues" className="group">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 hover:border-yellow-400/50 transition-all duration-300 group-hover:scale-105">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
              <h3 className="text-xl font-bold text-yellow-300 mb-2">High Tier Leagues</h3>
              <p className="text-yellow-200/80 text-sm">
                Challenger, Grandmaster e Master. Os melhores jogadores do servidor.
              </p>
            </div>
          </Link>
        </div>

        {/* Quick Search */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎮 Busca Rápida de Jogador
            </h2>
            
            {/* Search Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => {
                    setSearchMode('name')
                    clearSearch()
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchMode === 'name'
                      ? 'bg-blue-600 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Por Nome
                </button>
                <button
                  onClick={() => {
                    setSearchMode('puuid')
                    clearSearch()
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    searchMode === 'puuid'
                      ? 'bg-blue-600 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Por PUUID
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {searchMode === 'name' ? (
                /* Search by Name */
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Nome do jogador (ex: Doja Scat Cat)"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && gameName.trim()) {
                        handleNameSearch()
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Tag (BR1)"
                    value={tagLine}
                    onChange={(e) => setTagLine(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && gameName.trim()) {
                        handleNameSearch()
                      }
                    }}
                    className="w-24 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleNameSearch}
                    disabled={!gameName.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              ) : (
                /* Search by PUUID */
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Digite o PUUID do jogador"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && input.trim()) {
                        handlePuuidSearch()
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handlePuuidSearch}
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                  >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mx-auto mb-3"></div>
                  <p className="text-white/80">
                    Buscando jogador {gameName && `"${gameName}#${tagLine}"`}...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-300 text-center mb-3">
                    ❌ Jogador "{gameName}#{tagLine}" não encontrado.
                  </p>
                  <div className="text-red-400 text-sm space-y-1">
                    <p>• Verifique se o nome está correto (case-sensitive)</p>
                    <p>• Certifique-se que a tag está correta (BR1, BR2, etc.)</p>
                    <p>• Tente sem espaços extras no início ou fim</p>
                  </div>
                  <button
                    onClick={clearSearch}
                    className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors w-full"
                  >
                    Limpar e tentar novamente
                  </button>
                </div>
              )}

              {/* Success State */}
              {resultData && !isLoading && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">
                    ✅ Jogador Encontrado
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-300">Nome:</span>
                        <span className="text-white font-semibold">
                          {playerData ? `${playerData.gameName}#${playerData.tagLine}` : resultData.name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300">Level:</span>
                        <span className="text-white font-semibold">
                          {playerData ? playerData.summoner?.summonerLevel : resultData.summonerLevel || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-green-300">ID:</span>
                        <span className="text-white font-mono text-xs">
                          {playerData ? playerData.summoner?.id?.slice(0, 8) : resultData.id?.slice(0, 8) || 'N/A'}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-300">PUUID:</span>
                        <span className="text-white font-mono text-xs">
                          {(playerData?.puuid || puuid)?.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Link 
                      href={`/player/${playerData?.puuid || puuid}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Ver Perfil Completo
                    </Link>
                    <Link 
                      href={`/player/${playerData?.puuid || puuid}/matches`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Ver Partidas
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center text-white/60 text-sm space-y-2">
              <p>💡 <strong>Dicas de busca:</strong></p>
              <div className="text-xs space-y-1">
                <p>• Use o nome exato como aparece no jogo</p>
                <p>• Para "Doja Scat Cat", certifique-se da tag correta</p>
                <p>• Tente diferentes tags: BR1, BR2, etc.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            ⚡ Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-4xl">🚀</div>
              <h3 className="text-xl font-bold text-white">Dados em Tempo Real</h3>
              <p className="text-white/70">
                Informações atualizadas diretamente da API oficial da Riot Games
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl">🎯</div>
              <h3 className="text-xl font-bold text-white">Foco no Brasil</h3>
              <p className="text-white/70">
                Especializado no servidor brasileiro com dados regionais específicos
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/60 text-sm border-t border-white/10 pt-8">
          <p>
            🎮 TFT Stats Brasil não é afiliado à Riot Games • 
            Dados fornecidos pela API oficial do League of Legends
          </p>
        </div>
      </div>
    </MainLayout>
  )
}