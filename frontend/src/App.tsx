import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/hooks/useAuthStore'
import Layout from '@/components/common/Layout'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import AssortmentPage from '@/pages/AssortmentPage'
import ReplenishmentPage from '@/pages/ReplenishmentPage'
import MarkdownPage from '@/pages/MarkdownPage'
import InventoryPage from '@/pages/InventoryPage'
import AnalyticsPage from '@/pages/AnalyticsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="assortment" element={<AssortmentPage />} />
        <Route path="replenishment" element={<ReplenishmentPage />} />
        <Route path="markdown" element={<MarkdownPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
