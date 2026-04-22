// replenishment.routes.js
const router = require('express').Router()
const axios = require('axios')
const AI = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const p = (method, path) => async (req, res, next) => {
  try { const r = await axios({ method, url: `${AI}${path}`, params: req.query, data: req.body }); res.json(r.data) }
  catch (e) { next(e) }
}
router.get('/queue', p('get', '/api/replenishment/queue'))
router.get('/forecast', p('get', '/api/replenishment/forecast'))
router.post('/approve/:orderId', async (req, res, next) => {
  try { const r = await axios.post(`${AI}/api/replenishment/approve/${req.params.orderId}`, req.body); res.json(r.data) }
  catch (e) { next(e) }
})
router.post('/run', p('post', '/api/replenishment/run'))
module.exports = router
