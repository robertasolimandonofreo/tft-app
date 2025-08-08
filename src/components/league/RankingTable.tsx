import { LeagueEntry } from '../../types'
import { getTierColor, getRankIcon } from '../../utils/tierUtils'

interface RankingTableProps {
  entries: LeagueEntry[]
  showRank?: boolean
  showMiniSeries?: boolean
  onPlayerClick?: (entry: LeagueEntry) => void
  className?: string
}

export function RankingTable({
  entries,
  showRank = true,
  showMiniSeries = true,
  onPlayerClick,
  className = ''
}: RankingTableProps) {
  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `#${index + 1}`
    }
  }

  const getWinRate = (wins: number, losses: number) => {
    const total = wins + losses
    if (total === 0) return 0
    return Math.round((wins / total) * 100)
  }

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'text-green-400'
    if (winRate >= 60) return 'text-yellow-400'
    if (winRate >= 50) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className={`bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/30">
            <tr className="text-left">
              {showRank && (
                <th className="px-4 py-3 text-blue-300 font-semibold">#</th>
              )}
              <th className="px-4 py-3 text-blue-300 font-semibold">Jogador</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Tier</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">LP</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">W/L</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">WR%</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Status</th>
              {showMiniSeries && (
                <th className="px-4 py-3 text-blue-300 font-semibold">Série</th>
              )}
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const winRate = getWinRate(entry.wins, entry.losses)
              const tierColor = getTierColor(entry.tier)
              
              return (
                <tr
                  key={entry.summonerId || index}
                  className={`
                    border-b border-white/10 hover:bg-white/5 transition-colors
                    ${onPlayerClick ? 'cursor-pointer' : ''}
                  `}
                  onClick={() => onPlayerClick?.(entry)}
                >
                  {showRank && (
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-purple-400">
                          {getPositionIcon(index)}
                        </span>
                      </div>
                    </td>
                  )}
                  
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-white font-semibold">
                        {entry.summonerName || 'Unknown'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {entry.queueType}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getRankIcon(entry.tier)}
                      </span>
                      <div>
                        <span className={`font-semibold ${tierColor}`}>
                          {entry.tier}
                        </span>
                        <span className="text-white ml-1">
                          {entry.rank}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="text-yellow-400 font-bold">
                      {entry.leaguePoints.toLocaleString()}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      <span className="text-green-400 font-semibold">
                        {entry.wins}
                      </span>
                      <span className="text-gray-400 mx-1">/</span>
                      <span className="text-red-400 font-semibold">
                        {entry.losses}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${getWinRateColor(winRate)}`}>
                      {winRate}%
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
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
                  
                  {showMiniSeries && (
                    <td className="px-4 py-3">
                      {entry.miniSeries ? (
                        <div className="text-xs">
                          <div className="text-white font-mono">
                            {entry.miniSeries.progress}
                          </div>
                          <div className="text-gray-400">
                            {entry.miniSeries.wins}W {entry.miniSeries.losses}L
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}