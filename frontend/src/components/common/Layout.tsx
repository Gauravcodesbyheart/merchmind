import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, ShoppingBag, RefreshCw, Tag, Package,
  BarChart3, LogOut, Bell, Settings, Menu, X, Zap,
  ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { clsx } from 'clsx'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Command Center', exact: true },
  { path: '/assortment', icon: ShoppingBag, label: 'Assortment AI' },
  { path: '/replenishment', icon: RefreshCw, label: 'Replenishment' },
  { path: '/markdown', icon: Tag, label: 'Markdown Scheduler' },
  { path: '/inventory', icon: Package, label: 'Inventory' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [alertCount] = useState(4)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      {/* Sidebar */}
      <aside
        className={clsx(
          'flex flex-col flex-shrink-0 transition-all duration-300 border-r border-navy-700',
          sidebarOpen ? 'w-60' : 'w-16'
        )}
        style={{ background: 'rgba(10,22,40,0.98)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-navy-700">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
            <Zap size={16} className="text-navy-900" />
          </div>
          {sidebarOpen && (
            <div>
              <span className="font-display font-bold text-white text-sm">MerchMind</span>
              <span className="block text-xs text-teal-400 -mt-0.5">AI Merchandising</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-gray-500 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 group',
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-navy-700/50'
                )
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="font-medium">{label}</span>
                  <ChevronRight size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-navy-700 p-3">
          {sidebarOpen && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0] ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-sm',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut size={14} />
            {sidebarOpen && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-navy-700 bg-navy-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="pulse-dot"></span>
            <span className="text-xs text-gray-400">Live sync — 142 nodes active</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative btn-secondary px-3 py-1.5">
              <Bell size={14} />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-orange text-white text-xs flex items-center justify-center font-bold">
                  {alertCount}
                </span>
              )}
            </button>
            <button className="btn-secondary px-3 py-1.5">
              <Settings size={14} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
