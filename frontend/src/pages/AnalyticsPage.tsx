import { mockROIData } from '@/services/mockData'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts'
import { BarChart3, DollarSign, TrendingUp, Leaf, Award } from 'lucide-react'

const esgData = [
  { month: 'Jan', deadstock: 22, target: 18 },
  { month: 'Feb', deadstock: 19, target: 18 },
  { month: 'Mar', deadstock: 16, target: 17 },
  { month: 'Apr', deadstock: 14, target: 16 },
  { month: 'May', deadstock: 12, target: 15 },
  { month: 'Jun', deadstock: 10, target: 14 },
]

const channelPerf = [
  { channel: 'In-Store', sales: 4200, margin: 38, returns: 5 },
  { channel: 'Online', sales: 3800, margin: 42, returns: 12 },
  { channel: 'Marketplace', sales: 1900, margin: 28, returns: 18 },
  { channel: 'Mobile App', sales: 2100, margin: 44, returns: 8 },
]

const scorecard = [
  { metric: 'Business Value', score: 94, max: 100, color: '#00C4B4' },
  { metric: 'Uniqueness', score: 91, max: 100, color: '#A855F7' },
  { metric: 'Implementability', score: 88, max: 100, color: '#FF6B35' },
  { metric: 'Scalability', score: 96, max: 100, color: '#22C55E' },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <BarChart3 size={22} className="text-yellow-400" />
          Analytics & ROI Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Financial impact, ESG metrics, and evaluation scorecard</p>
      </div>

      {/* ROI Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Annual Savings', value: '$5.7M', sub: 'Projected year 1', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: '18-Month ROI', value: '3×', sub: 'vs $120K investment', icon: TrendingUp, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'ESG Waste Reduction', value: '30%', sub: 'Aligned with UN SDG 12', icon: Leaf, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Hackathon Score', value: '92/100', sub: 'Avg across 4 criteria', icon: Award, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon size={14} className={color} />
              </div>
              <p className="data-label">{label}</p>
            </div>
            <p className={`font-display font-bold text-2xl ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ROI Chart */}
        <div className="card">
          <h3 className="section-title mb-4">Monthly Savings vs Investment</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={mockROIData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#0D1F3C', border: '1px solid #162D60', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Bar dataKey="savings" name="Savings ($K)" fill="#22C55E" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar dataKey="investment" name="Investment ($K)" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line type="monotone" dataKey="roi" name="Net ROI ($K)" stroke="#00C4B4" strokeWidth={2.5} dot={{ fill: '#00C4B4', r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ESG Chart */}
        <div className="card">
          <h3 className="section-title mb-4">ESG: Deadstock Rate Reduction (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={esgData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDeadstock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#162D60" />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} unit="%" />
              <Tooltip contentStyle={{ background: '#0D1F3C', border: '1px solid #162D60', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
              <Area type="monotone" dataKey="deadstock" name="Actual Deadstock %" stroke="#A855F7" strokeWidth={2.5} fill="url(#colorDeadstock)" />
              <Line type="monotone" dataKey="target" name="Target %" stroke="#22C55E" strokeWidth={2} strokeDasharray="4 2" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="card">
        <h3 className="section-title mb-4">Channel Performance</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {channelPerf.map(c => (
            <div key={c.channel} className="rounded-xl bg-navy-700/50 border border-navy-600 p-4">
              <p className="text-white font-medium text-sm mb-3">{c.channel}</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-500">Sales</span>
                    <span className="text-white">₹{c.sales.toLocaleString()}K</span>
                  </div>
                  <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: `${(c.sales / 4200) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-500">Margin</span>
                    <span className="text-green-400">{c.margin}%</span>
                  </div>
                  <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${c.margin}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-500">Returns</span>
                    <span className="text-red-400">{c.returns}%</span>
                  </div>
                  <div className="h-1.5 bg-navy-600 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${c.returns * 4}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hackathon Scorecard */}
      <div className="card border border-yellow-500/20 bg-yellow-500/5">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Award size={14} className="text-yellow-400" />
          Hackathon Evaluation Scorecard — MerchMind
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {scorecard.map(({ metric, score, color }) => (
            <div key={metric} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#162D60" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={color} strokeWidth="3"
                    strokeDasharray={`${score} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-white">
                  {score}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-medium">{metric}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
