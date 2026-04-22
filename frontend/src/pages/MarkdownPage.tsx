import { useState } from 'react'
import { mockMarkdownRecommendations } from '@/services/mockData'
import { Tag, Brain, CheckCircle, TrendingDown, DollarSign, Percent, Calendar } from 'lucide-react'
import { clsx } from 'clsx'
import toast from 'react-hot-toast'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'

const priceDecayCurve = [
  { day: 0, fullPrice: 100, aiMarkdown: 100, earlyMarkdown: 100 },
  { day: 14, fullPrice: 100, aiMarkdown: 100, earlyMarkdown: 80 },
  { day: 30, fullPrice: 100, aiMarkdown: 100, earlyMarkdown: 72 },
  { day: 45, fullPrice: 100, aiMarkdown: 85, earlyMarkdown: 68 },
  { day: 60, fullPrice: 100, aiMarkdown: 82, earlyMarkdown: 65 },
  { day: 75, fullPrice: 85, aiMarkdown: 80, earlyMarkdown: 60 },
  { day: 90, fullPrice: 65, aiMarkdown: 78, earlyMarkdown: 55 },
  { day: 105, fullPrice: 40, aiMarkdown: 75, earlyMarkdown: 50 },
  { day: 120, fullPrice: 20, aiMarkdown: 72, earlyMarkdown: 48 },
]

export default function MarkdownPage() {
  const [recs, setRecs] = useState(mockMarkdownRecommendations)
  const [agentRunning, setAgentRunning] = useState(false)
  const [agentLog, setAgentLog] = useState<string[]>([])
  const [approved, setApproved] = useState<string[]>([])

  const handleApprove = (id: string) => {
    setApproved(prev => [...prev, id])
    toast.success('Markdown scheduled — execution queued for optimal date')
  }

  const runAgent = () => {
    setAgentRunning(true)
    setAgentLog([])
    const steps = [
      '🔍 Scanning 1,247 SKUs for aging patterns…',
      '📊 Loading demand forecasts from Prophet model…',
      '🌐 Fetching external signals: weather, events, competitor prices…',
      '🧠 LangGraph agent reasoning: Step 1 — Classify urgency tiers…',
      '🧠 LangGraph agent reasoning: Step 2 — Calculate optimal discount depth…',
      '🧠 LangGraph agent reasoning: Step 3 — Identify inflection window…',
      '✅ 3 markdown recommendations generated with explainable rationale',
      '📋 Rationale saved to audit log',
    ]
    let i = 0
    const interval = setInterval(() => {
      if (i < steps.length) {
        setAgentLog(prev => [...prev, steps[i]])
        i++
      } else {
        clearInterval(interval)
        setAgentRunning(false)
        toast.success('LangGraph Markdown Agent completed successfully')
      }
    }, 600)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Tag size={22} className="text-purple-400" />
            Markdown Scheduler
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">LangGraph agentic markdown reasoning & timing optimizer</p>
        </div>
        <button
          onClick={runAgent}
          disabled={agentRunning}
          className="btn-primary"
        >
          <Brain size={14} />
          {agentRunning ? 'Agent Reasoning…' : 'Run LangGraph Agent'}
          {agentRunning && <span className="ml-1 w-3 h-3 border-2 border-navy-900/30 border-t-navy-900 rounded-full animate-spin" />}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Markdowns', value: recs.length, icon: Tag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Avg Discount Depth', value: '21.7%', icon: Percent, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Margin Impact', value: '-$124K', icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Revenue Recovered', value: '$890K', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price Decay Chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Price Realisation: AI Timing vs Manual</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceDecayCurve} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} label={{ value: 'Days on shelf', fill: '#6b7280', fontSize: 10, position: 'insideBottom', offset: -2 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: '#0D1F3C', border: '1px solid #162D60', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#e2e8f0' }}
                formatter={(val: number) => [`${val}%`]}
              />
              <ReferenceLine x={45} stroke="#00C4B4" strokeDasharray="4 2" label={{ value: 'AI Optimal', fill: '#00C4B4', fontSize: 10 }} />
              <Line type="monotone" dataKey="aiMarkdown" name="AI-Timed Markdown" stroke="#00C4B4" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="earlyMarkdown" name="Premature Markdown" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 2" dot={false} />
              <Line type="monotone" dataKey="fullPrice" name="Full Price (no action)" stroke="#6b7280" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Log */}
        <div className="card">
          <h3 className="section-title mb-3 flex items-center gap-2">
            <Brain size={14} className="text-purple-400" /> Agent Reasoning Log
          </h3>
          <div className="space-y-2 h-48 overflow-y-auto">
            {agentLog.length === 0 ? (
              <p className="text-xs text-gray-500 italic">Run the LangGraph agent to see step-by-step reasoning…</p>
            ) : (
              agentLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2 text-xs animate-slide-up">
                  <span className="text-gray-600 font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-gray-300">{log}</p>
                </div>
              ))
            )}
            {agentRunning && (
              <div className="flex items-center gap-2 text-xs text-purple-400">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                Processing…
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Markdown Recommendations */}
      <div className="space-y-4">
        <h3 className="section-title">Markdown Recommendations</h3>
        {recs.map(rec => {
          const isApproved = approved.includes(rec.id)
          return (
            <div
              key={rec.id}
              className={clsx(
                'card border transition-all',
                isApproved ? 'border-green-500/30 opacity-60' : 'border-navy-600 hover:border-purple-500/30'
              )}
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                      <Tag size={14} className="text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{rec.name}</p>
                      <p className="font-mono text-xs text-gray-500">{rec.sku} · {rec.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed bg-navy-700/50 rounded-lg p-3">
                    <span className="text-purple-400 font-medium">AI Rationale: </span>
                    {rec.rationale}
                  </p>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 lg:col-span-1">
                  <div>
                    <p className="data-label mb-0.5">Days on Shelf</p>
                    <p className={clsx('font-medium text-sm', rec.daysOnShelf > 90 ? 'text-red-400' : 'text-yellow-400')}>
                      {rec.daysOnShelf} days
                    </p>
                  </div>
                  <div>
                    <p className="data-label mb-0.5">Stock Units</p>
                    <p className="text-white text-sm font-medium">{rec.stockUnits.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="data-label mb-0.5 flex items-center gap-1"><Calendar size={10} /> Optimal Date</p>
                    <p className="text-teal-400 text-sm font-medium">{rec.optimalDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:col-span-1">
                  <div>
                    <p className="data-label mb-0.5">Current Price</p>
                    <p className="text-gray-300 text-sm">₹{rec.currentPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="data-label mb-0.5">New Price</p>
                    <p className="text-green-400 font-bold text-sm">₹{rec.newPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="data-label mb-0.5">Discount</p>
                    <p className="text-orange-400 font-bold">{rec.suggestedDiscount}%</p>
                  </div>
                  <div>
                    <p className="data-label mb-0.5">Proj. Sell-Through</p>
                    <p className="text-teal-400 font-medium">{rec.projectedSellThrough}%</p>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between lg:col-span-1">
                  <div className="text-right">
                    <p className="data-label mb-1">AI Confidence</p>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-navy-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${rec.confidence}%` }} />
                      </div>
                      <span className="text-sm font-medium text-white">{rec.confidence}%</span>
                    </div>
                  </div>
                  {isApproved ? (
                    <span className="text-green-400 text-xs flex items-center gap-1 font-medium">
                      <CheckCircle size={12} /> Scheduled
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(rec.id)}
                      className="btn-primary text-xs px-4 py-2"
                    >
                      <CheckCircle size={12} /> Approve Markdown
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
