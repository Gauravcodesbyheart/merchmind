require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { createServer } = require('http')
const { Server } = require('socket.io')
const rateLimit = require('express-rate-limit')
const logger = require('./config/logger')

const authRoutes = require('./routes/auth.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const assortmentRoutes = require('./routes/assortment.routes')
const replenishmentRoutes = require('./routes/replenishment.routes')
const markdownRoutes = require('./routes/markdown.routes')
const inventoryRoutes = require('./routes/inventory.routes')
const analyticsRoutes = require('./routes/analytics.routes')

const { authenticateToken } = require('./middleware/auth.middleware')
const { errorHandler } = require('./middleware/error.middleware')

const app = express()
const httpServer = createServer(app)

// ── WebSocket Setup ────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000' },
})

io.on('connection', (socket) => {
  logger.info(`WS client connected: ${socket.id}`)
  // Simulate real-time POS data push every 5s
  const interval = setInterval(() => {
    socket.emit('pos_update', {
      timestamp: new Date().toISOString(),
      storeId: `store_${Math.floor(Math.random() * 50) + 1}`,
      salesVelocity: (Math.random() * 2 + 0.5).toFixed(2),
      activeTransactions: Math.floor(Math.random() * 20) + 5,
    })
  }, 5000)
  socket.on('disconnect', () => clearInterval(interval))
})

// ── Middleware ─────────────────────────────────────────────────
app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '5mb' }))
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }))

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200,
  standardHeaders: true,
  message: { error: 'Too many requests, please try again later.' },
})
app.use('/api', apiLimiter)

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/dashboard', authenticateToken, dashboardRoutes)
app.use('/api/assortment', authenticateToken, assortmentRoutes)
app.use('/api/replenishment', authenticateToken, replenishmentRoutes)
app.use('/api/markdown', authenticateToken, markdownRoutes)
app.use('/api/inventory', authenticateToken, inventoryRoutes)
app.use('/api/analytics', authenticateToken, analyticsRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'merchmind-api-gateway', ts: new Date() }))

// Error handler
app.use(errorHandler)

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  logger.info(`MerchMind API Gateway running on port ${PORT}`)
})

module.exports = { app, io }
