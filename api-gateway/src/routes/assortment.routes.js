// assortment.routes.js
const router = require('express').Router()
const axios = require('axios')
const AI_ENGINE = process.env.AI_ENGINE_URL || 'http://localhost:8000'
const proxy = (method, path) => async (req, res, next) => {
  try {
    const resp = await axios({ method, url: `${AI_ENGINE}${path}`, params: req.query, data: req.body })
    res.json(resp.data)
  } catch (e) { next(e) }
}
router.get('/recommendations', proxy('get', '/api/assortment/recommendations'))
router.get('/score/:skuId', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${AI_ENGINE}/api/assortment/score/${req.params.skuId}`)
    res.json(data)
  } catch (e) { next(e) }
})
router.post('/optimize', proxy('post', '/api/assortment/optimize'))
module.exports = router
