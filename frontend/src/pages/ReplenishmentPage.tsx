import { useState } from 'react'
import { mockReplenishmentQueue } from '@/services/mockData'
import { RefreshCw, Zap, CheckCircle, Clock, Package, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const urgencyConfig = {
  critical: { label: 'Critical', className: 'badge-red', dot: 'bg-red-400' },
  high: { label: 'High', className: 'badge-yellow', dot: 'bg-yellow-400' },
  medium: { label: 'Medium', className: 'badge-teal', dot: 'bg-teal-400' },
  low: { label: 'Low', className: 'badge-green', dot: 'bg-green-400' },
}

const weeklyForecast = [
  { week: 'W1', expected: 420, replenished: 380, gap: 40 },
  { week: 'W2', expected: 510, replenished: 490, gap: 20 },
  { week: 'W3', expected: 480, replenished: 480, gap: 0 },
  { week: 'W4', expected: 560, replenished: 520, gap: 40 },
  { week: 'W5', expected: 590, replenished: 590, gap: 0 },
  { week: 'W6', expected: 540, replenished: 510, gap: 30 },
]

export default function ReplenishmentPage() {
  const [queue, setQueue] = useState(mockReplenishmentQueue)
  const [running, setRunning] = useState(false)
  const [approved, setApproved] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setApproved(prev => [...prev, id])
    toast.success(`Replenishment order ${id} approved and sent to WMS`)
  }

  const handleRunEngine = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      toast.success('Replenishment Engine run complete — 23 new orders queued')
    }, 3000)
  }

  const approveAll = () => {
    setApproved(queue.map(q => q.id))
    toast.success(`${queue.length} replenishment orders batch-approved`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <RefreshCw size={22} className="text-orange-400" />
            Replenishment Engine
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Event-aware, predictive inventory replenishment</p>
        </div>
        <div className="flex gap-2">
          <button onClick={approveAll} className="btn-secondary">
            <CheckCircle size={14} /> Approve All
          </button>
          <button onClick={handleRunEngine} disabled={running} className="btn-primary">
            <Zap size={14} />
            {running ? 'Running Engine…' : 'Run AI Engine'}
            {running && <span className="ml-1 w-3 h-3 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Orders in Queue', value: queue.length, icon: Package, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Critical Alerts', value: queue.filter(q => q.urgency === 'critical').length, icon: Zap, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Approved Today', value: approved.length, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Avg Lead Time', value: '4.1d', icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', bg)}>
              <Icon size={16} className={color} />
            </div>
            <div>
              <p className="stat-number text-xl">{value}</p>
              <p className="data-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">6-Week Demand vs Replenishment Forecast</h3>
          <span className="badge-teal flex items-center gap-1">
            <TrendingUp size={10} /> Prophet + XGBoost
          </span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyForecast} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#0D1F3C', border: '1px solid #162D60', borderRadius: '8px', fontSize: '12px' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
            <Bar dataKey="expected" name="Expected Demand" fill="#00C4B4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="replenished" name="Replenished" fill="#A855F7" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gap" name="Gap" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Replenishment Queue</h3>
          <span className="text-xs text-gray-500">{queue.length - approved.length} pending approval</span>
        </div>
        <div className="space-y-3">
          {queue.map(item => {
            const isApproved = approved.includes(item.id)
            const cfg = urgencyConfig[item.urgency as keyof typeof urgencyConfig]
            return (
              <div
                key={item.id}
                className={clsx(
                  'rounded-xl border p-4 transition-all',
                  isApproved
                    ? 'border-green-500/20 bg-green-500/5 opacity-60'
                    : 'border-navy-600 bg-navy-800/50 hover:border-navy-500'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <p className="data-label mb-0.5">SKU / Product</p>
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="font-mono text-xs text-gray-500">{item.sku}</p>
                    </div>
                    <div>
                      <p className="data-label mb-0.5">Store</p>
                      <p className="text-gray-300 text-sm">{item.store}</p>
                      <p className="text-xs text-gray-500">Lead: {item.leadTimeDays}d</p>
                    </div>
                    <div>
                      <p className="data-label mb-0.5">Stock / Reorder</p>
                      <p className="text-sm">
                        <span className="text-red-400 font-bold">{item.currentStock}</span>
                        <span className="text-gray-500"> / {item.reorderPoint}</span>
                      </p>
                      <p className="text-xs text-gray-500">Suggest: <span className="text-teal-400 font-medium">{item.suggestedQty} units</span></p>
                    </div>
                    <div>
                      <p className="data-label mb-0.5">AI Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-navy-700 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-400 rounded-full" style={{ width: `${item.confidence}%` }} />
                        </div>
                        <span className="text-xs text-white font-medium">{item.confidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={clsx('badge border', cfg.className)}>{cfg.label}</span>
                    {isApproved ? (
                      <span className="text-green-400 text-xs flex items-center gap-1 font-medium">
                        <CheckCircle size={12} /> Approved
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
