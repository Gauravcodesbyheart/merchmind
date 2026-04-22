const router = require('express').Router()
const axios = require('axios')
const AI = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const p = (method, path) => async (req, res, next) => {
  try { const r = await axios({ method, url: `${AI}${path}`, params: req.query, data: req.body }); res.json(r.data) }
  catch (e) { next(e) }
}
router.get('/sales', p('get', '/api/analytics/sales'))
router.get('/waste', p('get', '/api/analytics/waste'))
router.get('/roi', p('get', '/api/analytics/roi'))
module.exports = router
