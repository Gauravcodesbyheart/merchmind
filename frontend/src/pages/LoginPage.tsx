import { useState } from 'react'
import { useAuthStore } from '@/hooks/useAuthStore'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const demoCredentials = [
  { role: 'Merchandise Planner', email: 'planner@merchmind.ai', color: 'teal' },
  { role: 'Store Manager', email: 'manager@merchmind.ai', color: 'purple' },
  { role: 'Finance / CFO', email: 'finance@merchmind.ai', color: 'orange' },
  { role: 'Admin', email: 'admin@merchmind.ai', color: 'green' },
]

export default function LoginPage() {
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome to MerchMind!')
    } catch {
      toast.error('Invalid credentials. Use demo accounts below.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 30% 70%, rgba(0,196,180,0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 70% 30%, rgba(168,85,247,0.06) 0%, transparent 60%)
        `
      }}
    >
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left — Brand */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center">
              <Zap size={20} className="text-navy-900" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-white">MerchMind</h1>
              <p className="text-xs text-teal-400">AI-Driven Merchandising</p>
            </div>
          </div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            Intelligent<br />
            <span className="text-teal-400">Assortment,</span><br />
            Replenishment &<br />
            Markdown AI
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Reduce waste by 30%, lift revenue by 25%, and protect margins with agentic AI that reasons through every merchandising decision.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Waste Reduction', value: '30%' },
              { label: 'Revenue Lift', value: '25%' },
              { label: 'ROI Timeline', value: '18mo' },
              { label: 'Markdown Accuracy', value: '40%' },
            ].map(({ label, value }) => (
              <div key={label} className="card-glass">
                <p className="font-display font-bold text-2xl text-teal-400">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login form */}
        <div>
          <div className="card border border-navy-600 max-w-sm mx-auto">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
                <Zap size={14} className="text-navy-900" />
              </div>
              <span className="font-display font-bold text-white">MerchMind</span>
            </div>
            <h3 className="font-display font-semibold text-white text-xl mb-1">Sign in</h3>
            <p className="text-sm text-gray-500 mb-6">Access your merchandising dashboard</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="data-label block mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-3 py-2.5 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="data-label block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2.5 pr-10 rounded-lg bg-navy-700 border border-navy-600 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-2.5"
              >
                {loading ? 'Signing in…' : 'Sign in'}
                {!loading && <ArrowRight size={14} />}
              </button>
            </form>

            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-3 text-center">Demo accounts (password: demo123)</p>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentials.map(({ role, email: dEmail }) => (
                  <button
                    key={dEmail}
                    onClick={() => fillDemo(dEmail)}
                    className="text-left px-3 py-2 rounded-lg bg-navy-700 border border-navy-600 hover:border-teal-500/50 transition-all"
                  >
                    <p className="text-xs font-medium text-white">{role}</p>
                    <p className="text-xs text-gray-500 truncate">{dEmail.split('@')[0]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
