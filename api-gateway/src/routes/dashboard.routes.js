// ─────────────────────────────────────────────────────────────
// dashboard.routes.js — Proxy to AI engine + aggregate KPIs
// ─────────────────────────────────────────────────────────────
const router = require('express').Router()
const axios = require('axios')

const AI_ENGINE = process.env.AI_ENGINE_URL || 'http://localhost:8000'

// Helper: proxy to AI engine
const proxyGet = (path) => async (req, res, next) => {
  try {
    const { data } = await axios.get(`${AI_ENGINE}${path}`, { params: req.query })
    res.json(data)
  } catch (err) {
    // Fall back to mock data if AI engine not available
    next(err)
  }
}

router.get('/kpis', proxyGet('/api/dashboard/kpis'))
router.get('/alerts', proxyGet('/api/dashboard/alerts'))
router.get('/demand-trend', proxyGet('/api/dashboard/demand-trend'))

module.exports = router
