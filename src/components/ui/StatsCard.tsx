import { ReactNode } from 'react'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  subtitle?: string
}

const colorClasses = {
  blue: 'border-blue-500/30 bg-blue-500/10',
  green: 'border-green-500/30 bg-green-500/10',
  yellow: 'border-yellow-500/30 bg-yellow-500/10',
  red: 'border-red-500/30 bg-red-500/10',
  purple: 'border-purple-500/30 bg-purple-500/10',
}

const iconColorClasses = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  yellow: 'text-yellow-400',
  red: 'text-red-400',
  purple: 'text-purple-400',
}

export function StatsCard({ title, value, icon, color = 'blue', subtitle }: StatsCardProps) {
  return (
    <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {icon && (
          <span className={`text-2xl ${iconColorClasses[color]}`}>
            {icon}
          </span>
        )}
      </div>
      <div className={`text-3xl font-bold mb-2 ${iconColorClasses[color]}`}>
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-white/70">
          {subtitle}
        </div>
      )}
    </div>
  )
}

interface StatsGridProps {
  children: ReactNode
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  )
}