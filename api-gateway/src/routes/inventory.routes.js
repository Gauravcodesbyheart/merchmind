// inventory.routes.js
const router = require('express').Router()
const axios = require('axios')
const AI = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const p = (method, path) => async (req, res, next) => {
  try { const r = await axios({ method, url: `${AI}${path}`, params: req.query, data: req.body }); res.json(r.data) }
  catch (e) { next(e) }
}
router.get('/overview', p('get', '/api/inventory/overview'))
router.get('/stock-levels', p('get', '/api/inventory/stock-levels'))
router.get('/deadstock', p('get', '/api/inventory/deadstock'))
module.exports = router
