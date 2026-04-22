const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'merchmind_jwt_secret_2026')
    req.user = payload
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' })
  }
  next()
}

module.exports = { authenticateToken, authorizeRoles }
