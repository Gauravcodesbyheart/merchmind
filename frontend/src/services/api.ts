import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('merchmind-auth') || '{}')
  if (auth?.state?.token) {
    config.headers.Authorization = `Bearer ${auth.state.token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('merchmind-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Dashboard ───────────────────────────────────────────────
export const getDashboardKPIs = () => api.get('/dashboard/kpis')
export const getDashboardAlerts = () => api.get('/dashboard/alerts')
export const getDemandTrend = (period: string) => api.get(`/dashboard/demand-trend?period=${period}`)

// ─── Assortment ───────────────────────────────────────────────
export const getAssortmentRecommendations = (params?: Record<string, string>) =>
  api.get('/assortment/recommendations', { params })
export const getAssortmentScore = (skuId: string) => api.get(`/assortment/score/${skuId}`)
export const runAssortmentOptimizer = (payload: object) => api.post('/assortment/optimize', payload)

// ─── Replenishment ───────────────────────────────────────────
export const getReplenishmentQueue = () => api.get('/replenishment/queue')
export const getReplenishmentForecast = (skuId: string, storeId: string) =>
  api.get(`/replenishment/forecast?sku=${skuId}&store=${storeId}`)
export const approveReplenishment = (orderId: string) =>
  api.post(`/replenishment/approve/${orderId}`)
export const runReplenishmentEngine = () => api.post('/replenishment/run')

// ─── Markdown ────────────────────────────────────────────────
export const getMarkdownSchedule = () => api.get('/markdown/schedule')
export const getMarkdownRecommendations = () => api.get('/markdown/recommendations')
export const approveMarkdown = (id: string, discount: number) =>
  api.post(`/markdown/approve/${id}`, { discount })
export const runMarkdownAgent = (payload: object) => api.post('/markdown/agent/run', payload)

// ─── Inventory ───────────────────────────────────────────────
export const getInventoryOverview = () => api.get('/inventory/overview')
export const getStockLevels = (filters?: object) => api.get('/inventory/stock-levels', { params: filters })
export const getDeadstockReport = () => api.get('/inventory/deadstock')

// ─── Analytics ───────────────────────────────────────────────
export const getSalesAnalytics = (period: string) => api.get(`/analytics/sales?period=${period}`)
export const getWasteMetrics = () => api.get('/analytics/waste')
export const getROIReport = () => api.get('/analytics/roi')

export default api
