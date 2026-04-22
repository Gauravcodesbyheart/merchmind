import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
  color?: 'teal' | 'purple' | 'orange' | 'green' | 'yellow'
  subtitle?: string
  icon?: React.ReactNode
}

const colorMap = {
  teal: 'from-teal-500/10 to-teal-600/5 border-teal-500/20 text-teal-400',
  purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
  orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
  green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-400',
  yellow: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
}

export default function KPICard({
  title, value, unit, change, changeLabel, color = 'teal', subtitle, icon,
}: KPICardProps) {
  const colorClasses = colorMap[color]

  return (
    <div className={clsx('rounded-xl border p-5 bg-gradient-to-br transition-all hover:scale-[1.01]', colorClasses)}>
      <div className="flex items-start justify-between mb-3">
        <p className="data-label">{title}</p>
        {icon && <span className="opacity-60">{icon}</span>}
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className={clsx('stat-number text-3xl', colorClasses.split(' ').pop())}>{value}</span>
        {unit && <span className="text-gray-400 text-sm mb-1">{unit}</span>}
      </div>
      {subtitle && <p className="text-xs text-gray-500 mb-2">{subtitle}</p>}
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {change > 0 ? (
            <TrendingUp size={12} className="text-green-400" />
          ) : change < 0 ? (
            <TrendingDown size={12} className="text-red-400" />
          ) : (
            <Minus size={12} className="text-gray-400" />
          )}
          <span className={clsx('text-xs font-medium', change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400')}>
            {change > 0 ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-xs text-gray-500">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
