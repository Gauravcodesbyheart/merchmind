const logger = require('../config/logger')

const errorHandler = (err, req, res, _next) => {
  logger.error(`${err.status || 500} — ${err.message}`)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
