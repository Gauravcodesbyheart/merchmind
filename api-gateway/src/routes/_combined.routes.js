// markdown.routes.js
const mRouter = require('express').Router()
const iRouter = require('express').Router()
const aRouter = require('express').Router()
const axios = require('axios')
const AI = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const p = (method, path) => async (req, res, next) => {
  try { const r = await axios({ method, url: `${AI}${path}`, params: req.query, data: req.body }); res.json(r.data) }
  catch (e) { next(e) }
}
// Markdown
mRouter.get('/schedule', p('get', '/api/markdown/schedule'))
mRouter.get('/recommendations', p('get', '/api/markdown/recommendations'))
mRouter.post('/approve/:id', async (req, res, next) => {
  try { const r = await axios.post(`${AI}/api/markdown/approve/${req.params.id}`, req.body); res.json(r.data) }
  catch (e) { next(e) }
})
mRouter.post('/agent/run', p('post', '/api/markdown/agent/run'))
// Inventory
iRouter.get('/overview', p('get', '/api/inventory/overview'))
iRouter.get('/stock-levels', p('get', '/api/inventory/stock-levels'))
iRouter.get('/deadstock', p('get', '/api/inventory/deadstock'))
// Analytics
aRouter.get('/sales', p('get', '/api/analytics/sales'))
aRouter.get('/waste', p('get', '/api/analytics/waste'))
aRouter.get('/roi', p('get', '/api/analytics/roi'))

module.exports = { markdownRouter: mRouter, inventoryRouter: iRouter, analyticsRouter: aRouter }
