import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'
import KPICard from '@/components/common/KPICard'
import AlertCard from '@/components/common/AlertCard'
import {
  mockKPIs, mockAlerts, mockDemandTrend, mockInventoryByCategory,
} from '@/services/mockData'
import { useAuthStore } from '@/hooks/useAuthStore'
import {
  TrendingUp, Package, Tag, RefreshCw, Activity,
  DollarSign, Leaf, Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="card-glass border border-navy-600 px-3 py-2 text-xs">
        <p className="text-gray-300 font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [period, setPeriod] = useState<'3m' | '6m' | '12m'>('6m')
  const [alerts, setAlerts] = useState(mockAlerts)

  const handleApprove = (id: string) => {
    toast.success('Action approved and queued for execution')
    setAlerts(a => a.filter(x => x.id !== id))
  }
  const handleDismiss = (id: string) => {
    setAlerts(a => a.filter(x => x.id !== id))
  }

  const displayData = period === '3m'
    ? mockDemandTrend.slice(-3)
    : period === '6m'
    ? mockDemandTrend.slice(-6)
    : mockDemandTrend

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Strategic Command Center
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Welcome back, {user?.name} · Real-time sync across 142 global nodes
          </p>
        </div>
        <div className="flex gap-2">
          {(['3m', '6m', '12m'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p
                  ? 'bg-teal-500 text-navy-900'
                  : 'bg-navy-700 text-gray-400 hover:text-white border border-navy-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Waste Reduction"
          value={mockKPIs.wasteReduction}
          unit="%"
          change={8}
          changeLabel="vs last quarter"
          color="green"
          icon={<Leaf size={16} />}
        />
        <KPICard
          title="Revenue Lift"
          value={mockKPIs.revenueLift}
          unit="%"
          change={3.2}
          changeLabel="vs target"
          color="teal"
          icon={<TrendingUp size={16} />}
        />
        <KPICard
          title="Markdown Accuracy"
          value={mockKPIs.markdownAccuracy}
          unit="%"
          change={12}
          changeLabel="vs manual"
          color="purple"
          icon={<Tag size={16} />}
        />
        <KPICard
          title="Annual Savings"
          value="$5.7M"
          subtitle="Projected 18-month ROI: 3×"
          change={18}
          changeLabel="vs forecast"
          color="yellow"
          icon={<DollarSign size={16} />}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-orange-500/15 flex items-center justify-center">
            <Activity size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="stat-number text-lg">{mockKPIs.deadstockRate}%</p>
            <p className="data-label">Deadstock Rate</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center">
            <Package size={16} className="text-red-400" />
          </div>
          <div>
            <p className="stat-number text-lg">{mockKPIs.stockoutRate}%</p>
            <p className="data-label">Stockout Rate</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center">
            <RefreshCw size={16} className="text-teal-400" />
          </div>
          <div>
            <p className="stat-number text-lg">{mockKPIs.fullPriceSellThrough}%</p>
            <p className="data-label">Full-Price Sell-Through</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <Clock size={16} className="text-purple-400" />
          </div>
          <div>
            <p className="stat-number text-lg">&lt;24h</p>
            <p className="data-label">Planning Cycle</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Demand Trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Demand Trend & Forecast</h3>
            <span className="badge-teal">AI Forecast</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={displayData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C4B4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C4B4" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="actual" name="Actual" stroke="#00C4B4" strokeWidth={2} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="forecast" name="AI Forecast" stroke="#A855F7" strokeWidth={2} strokeDasharray="4 2" fill="url(#colorForecast)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory by Category */}
        <div className="card">
          <h3 className="section-title mb-4">Inventory Health</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockInventoryByCategory} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={false} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="healthy" name="Healthy" fill="#22C55E" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="overstock" name="Overstock" fill="#F59E0B" stackId="a" />
              <Bar dataKey="stockout" name="Stockout" fill="#EF4444" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Alerts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="section-title">AI Mind Queue — Pending Actions</h3>
          <span className="badge-yellow">{alerts.length} pending</span>
        </div>
        {alerts.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500 text-sm">All recommendations actioned. AI is monitoring…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {alerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onApprove={handleApprove}
                onDismiss={handleDismiss}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
