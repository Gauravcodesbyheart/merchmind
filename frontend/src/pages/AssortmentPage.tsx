import { useState } from 'react'
import { mockAssortmentScores } from '@/services/mockData'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis,
} from 'recharts'
import { ShoppingBag, Cpu, TrendingUp, AlertTriangle, Play, Download } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'

const skuData = [
  { sku: 'SKU-1023', name: 'Blue Denim Jacket L', category: 'Outerwear', region: 'North', score: 88, velocity: 4.2, stock: 45, action: 'expand' },
  { sku: 'SKU-0774', name: 'White Sneakers US9', category: 'Footwear', region: 'South', score: 74, velocity: 2.8, stock: 120, action: 'hold' },
  { sku: 'SKU-2201', name: 'Floral Midi Dress M', category: 'Apparel', region: 'East', score: 61, velocity: 1.4, stock: 280, action: 'reduce' },
  { sku: 'SKU-3340', name: 'Sports Joggers XL', category: 'Apparel', region: 'West', score: 92, velocity: 5.1, stock: 30, action: 'expand' },
  { sku: 'SKU-0551', name: 'Linen Shirt S', category: 'Apparel', region: 'Online', score: 55, velocity: 0.9, stock: 340, action: 'exit' },
  { sku: 'SKU-4412', name: 'Canvas Tote Bag', category: 'Accessories', region: 'North', score: 79, velocity: 3.6, stock: 85, action: 'hold' },
  { sku: 'SKU-5501', name: 'Running Shorts M', category: 'Activewear', region: 'Online', score: 95, velocity: 6.2, stock: 20, action: 'expand' },
  { sku: 'SKU-6678', name: 'Wool Cardigan L', category: 'Outerwear', region: 'South', score: 42, velocity: 0.5, stock: 510, action: 'exit' },
]

const actionConfig = {
  expand: { label: 'Expand', className: 'badge-green' },
  hold: { label: 'Hold', className: 'badge-teal' },
  reduce: { label: 'Reduce', className: 'badge-yellow' },
  exit: { label: 'Exit', className: 'badge-red' },
}

const radarData = [
  { subject: 'Sell-Through', A: 85, fullMark: 100 },
  { subject: 'Margin', A: 72, fullMark: 100 },
  { subject: 'Velocity', A: 90, fullMark: 100 },
  { subject: 'Availability', A: 68, fullMark: 100 },
  { subject: 'Trend Fit', A: 88, fullMark: 100 },
  { subject: 'Demand Cluster', A: 76, fullMark: 100 },
]

export default function AssortmentPage() {
  const [running, setRunning] = useState(false)
  const [filterAction, setFilterAction] = useState<string>('all')

  const handleRunOptimizer = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      toast.success('Assortment Optimizer completed — 312 SKU recommendations updated')
    }, 2500)
  }

  const filtered = filterAction === 'all' ? skuData : skuData.filter(s => s.action === filterAction)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <ShoppingBag size={22} className="text-teal-400" />
            Assortment Optimizer
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-driven SKU × Store × Region analysis</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Download size={14} /> Export
          </button>
          <button
            onClick={handleRunOptimizer}
            disabled={running}
            className="btn-primary"
          >
            <Cpu size={14} />
            {running ? 'Optimizing…' : 'Run AI Optimizer'}
            {running && <span className="ml-1 w-3 h-3 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />}
          </button>
        </div>
      </div>

      {/* Region Scores */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {mockAssortmentScores.map(r => (
          <div key={r.region} className="card hover:border-teal-500/30 transition-all cursor-pointer">
            <p className="data-label mb-2">{r.region}</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="font-display font-bold text-2xl text-white">{r.score}</span>
              <span className="text-gray-500 text-sm mb-0.5">/100</span>
            </div>
            <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${r.score}%`,
                  background: r.score > 80 ? '#22C55E' : r.score > 65 ? '#00C4B4' : '#F59E0B',
                }}
              />
            </div>
            <p className="text-xs text-green-400 font-medium">{r.opportunity}</p>
            <p className="text-xs text-gray-500">{r.lowPerformers} low performers</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="section-title mb-4">Assortment Health Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#162D60" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#00C4B4" fill="#00C4B4" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="section-title mb-4">SKU Velocity vs. Stock Level (Bubble = Score)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
              <XAxis dataKey="velocity" name="Velocity" unit=" u/d" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <YAxis dataKey="stock" name="Stock" tick={{ fill: '#6b7280', fontSize: 11 }} />
              <ZAxis dataKey="score" range={[40, 300]} />
              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ payload }) => {
                  if (payload?.length) {
                    const d = payload[0].payload
                    return (
                      <div className="card-glass border border-navy-600 px-3 py-2 text-xs">
                        <p className="text-white font-medium">{d.name}</p>
                        <p className="text-gray-400">Velocity: {d.velocity} u/day</p>
                        <p className="text-gray-400">Stock: {d.stock} units</p>
                        <p className="text-teal-400">Score: {d.score}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={skuData} fill="#00C4B4" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SKU Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">SKU Recommendations</h3>
          <div className="flex gap-2">
            {['all', 'expand', 'hold', 'reduce', 'exit'].map(f => (
              <button
                key={f}
                onClick={() => setFilterAction(f)}
                className={clsx(
                  'px-3 py-1 rounded-full text-xs font-medium transition-all capitalize',
                  filterAction === f
                    ? 'bg-teal-500 text-navy-900'
                    : 'bg-navy-700 text-gray-400 hover:text-white'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                {['SKU', 'Product', 'Category', 'Region', 'AI Score', 'Velocity', 'Stock', 'Action'].map(h => (
                  <th key={h} className="text-left py-2 px-3 data-label font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.sku} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-gray-400">{row.sku}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{row.name}</td>
                  <td className="py-2.5 px-3 text-gray-400">{row.category}</td>
                  <td className="py-2.5 px-3 text-gray-400">{row.region}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 bg-navy-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.score}%`,
                            background: row.score > 80 ? '#22C55E' : row.score > 60 ? '#00C4B4' : '#F59E0B',
                          }}
                        />
                      </div>
                      <span className="text-white font-medium">{row.score}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-gray-300">{row.velocity} u/d</td>
                  <td className="py-2.5 px-3 text-gray-300">{row.stock}</td>
                  <td className="py-2.5 px-3">
                    <span className={clsx('badge border', actionConfig[row.action as keyof typeof actionConfig].className)}>
                      {actionConfig[row.action as keyof typeof actionConfig].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
