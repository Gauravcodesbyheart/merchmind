// markdown.routes.js
const router = require('express').Router()
const axios = require('axios')
const AI = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const p = (method, path) => async (req, res, next) => {
  try { const r = await axios({ method, url: `${AI}${path}`, params: req.query, data: req.body }); res.json(r.data) }
  catch (e) { next(e) }
}
router.get('/schedule', p('get', '/api/markdown/schedule'))
router.get('/recommendations', p('get', '/api/markdown/recommendations'))
router.post('/approve/:id', async (req, res, next) => {
  try { const r = await axios.post(`${AI}/api/markdown/approve/${req.params.id}`, req.body); res.json(r.data) }
  catch(e) { next(e) }
})
router.post('/agent/run', p('post', '/api/markdown/agent/run'))
module.exports = router
