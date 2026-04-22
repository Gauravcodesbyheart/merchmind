import { clsx } from 'clsx'
import { AlertTriangle, ArrowUpCircle, Tag, Truck, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface Alert {
  id: string
  type: 'replenishment' | 'assortment' | 'markdown' | 'supply'
  severity: 'high' | 'medium' | 'low'
  sku: string
  message: string
  confidence: number
  action: string
  store: string
}

const typeConfig = {
  replenishment: { icon: ArrowUpCircle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  assortment: { icon: AlertTriangle, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  markdown: { icon: Tag, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  supply: { icon: Truck, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
}

const severityBadge = {
  high: 'bg-red-500/15 text-red-400 border-red-500/20',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/15 text-green-400 border-green-500/20',
}

interface AlertCardProps {
  alert: Alert
  onApprove?: (id: string) => void
  onDismiss?: (id: string) => void
}

export default function AlertCard({ alert, onApprove, onDismiss }: AlertCardProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'dismissed'>('pending')
  const config = typeConfig[alert.type]
  const Icon = config.icon

  return (
    <div
      className={clsx(
        'rounded-xl border p-4 transition-all duration-300',
        config.bg,
        status !== 'pending' && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-3">
        <Icon size={16} className={clsx('mt-0.5 flex-shrink-0', config.color)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs text-gray-400">{alert.sku}</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-400">{alert.store}</span>
            <span className={clsx('badge border ml-auto', severityBadge[alert.severity])}>
              {alert.severity}
            </span>
          </div>
          <p className="text-sm text-gray-300 mb-2">{alert.message}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full"
                  style={{ width: `${alert.confidence}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{alert.confidence}% confidence</span>
            </div>
            {status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => { onApprove?.(alert.id); setStatus('approved') }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 text-xs font-medium transition-colors"
                >
                  <CheckCircle size={11} /> Approve
                </button>
                <button
                  onClick={() => { onDismiss?.(alert.id); setStatus('dismissed') }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-navy-700 text-gray-400 hover:bg-navy-600 text-xs transition-colors"
                >
                  <XCircle size={11} /> Dismiss
                </button>
              </div>
            )}
            {status !== 'pending' && (
              <span className={clsx('text-xs font-medium', status === 'approved' ? 'text-green-400' : 'text-gray-500')}>
                {status === 'approved' ? '✓ Approved' : 'Dismissed'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
