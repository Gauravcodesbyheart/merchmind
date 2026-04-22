import { Package, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Treemap,
} from 'recharts'
import { clsx } from 'clsx'

const inventoryStats = [
  { label: 'Total SKUs', value: '12,847', icon: Package, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { label: 'Healthy Stock', value: '68%', icon: BarChart2, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Overstock Risk', value: '22%', icon: TrendingDown, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Stockout Risk', value: '10%', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
]

const pieData = [
  { name: 'Healthy', value: 68, color: '#22C55E' },
  { name: 'Overstock', value: 22, color: '#F59E0B' },
  { name: 'Stockout', value: 10, color: '#EF4444' },
]

const treemapData = [
  { name: 'Apparel', size: 4200, fill: '#00C4B4' },
  { name: 'Footwear', size: 2800, fill: '#A855F7' },
  { name: 'Accessories', size: 1900, fill: '#F59E0B' },
  { name: 'Home & Living', size: 1500, fill: '#22C55E' },
  { name: 'Electronics', size: 1200, fill: '#FF6B35' },
  { name: 'Sports', size: 900, fill: '#3B82F6' },
  { name: 'Beauty', size: 600, fill: '#EC4899' },
]

const deadstockItems = [
  { sku: 'SKU-0551', name: 'Linen Shirt S', days: 134, units: 340, value: '₹2.72L', category: 'Apparel' },
  { sku: 'SKU-6678', name: 'Wool Cardigan L', days: 121, units: 510, value: '₹5.10L', category: 'Outerwear' },
  { sku: 'SKU-9923', name: 'Formal Trousers 32', days: 108, units: 220, value: '₹3.30L', category: 'Apparel' },
  { sku: 'SKU-4451', name: 'Patent Leather Heels', days: 97, units: 180, value: '₹4.50L', category: 'Footwear' },
  { sku: 'SKU-7712', name: 'Winter Gloves M', days: 145, units: 620, value: '₹1.86L', category: 'Accessories' },
]

const COLORS = ['#22C55E', '#F59E0B', '#EF4444']

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 30
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#9ca3af" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={11}>
      {`${name} ${value}%`}
    </text>
  )
}

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Package size={22} className="text-green-400" />
          Inventory Intelligence
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Multichannel inventory visibility and deadstock analysis</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map(({ label, value, icon: Icon, color, bg }) => (
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card flex flex-col items-center">
          <h3 className="section-title mb-4 self-start">Stock Health Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={CustomPieLabel}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0D1F3C', border: '1px solid #162D60', borderRadius: '8px', fontSize: '12px' }}
                formatter={(v: number) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            {pieData.map(({ name, color }) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-xs text-gray-400">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="section-title mb-4">Inventory Value by Category (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              content={({ x, y, width, height, name, value, fill }: any) => (
                <g>
                  <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.8} stroke="#0A1628" strokeWidth={2} rx={4} />
                  {width > 60 && height > 30 && (
                    <>
                      <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="white" fontSize={11} fontWeight="600">{name}</text>
                      <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={10}>₹{value}L</text>
                    </>
                  )}
                </g>
              )}
            />
          </ResponsiveContainer>
        </div>
      </div>

      {/* Deadstock Report */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title flex items-center gap-2">
            <AlertTriangle size={14} className="text-yellow-400" />
            Deadstock Risk Report
          </h3>
          <span className="badge-yellow">{deadstockItems.length} SKUs at risk</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-700">
                {['SKU', 'Product', 'Category', 'Days on Shelf', 'Units', 'Locked Value', 'Risk'].map(h => (
                  <th key={h} className="text-left py-2 px-3 data-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deadstockItems.map(row => (
                <tr key={row.sku} className="border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-xs text-gray-400">{row.sku}</td>
                  <td className="py-2.5 px-3 text-white font-medium">{row.name}</td>
                  <td className="py-2.5 px-3 text-gray-400">{row.category}</td>
                  <td className="py-2.5 px-3">
                    <span className={clsx(
                      'font-medium',
                      row.days > 120 ? 'text-red-400' : row.days > 90 ? 'text-yellow-400' : 'text-orange-400'
                    )}>
                      {row.days}d
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-300">{row.units}</td>
                  <td className="py-2.5 px-3 text-gray-300 font-medium">{row.value}</td>
                  <td className="py-2.5 px-3">
                    <span className={clsx(
                      'badge border',
                      row.days > 120 ? 'badge-red' : 'badge-yellow'
                    )}>
                      {row.days > 120 ? 'Critical' : 'High'}
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
