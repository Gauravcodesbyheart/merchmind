const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const JWT_SECRET = process.env.JWT_SECRET || 'merchmind_jwt_secret_2026'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h'

// In production: replace with DB lookup
const USERS_DB = {
  'planner@merchmind.ai': {
    id: '1', name: 'Priya Sharma', role: 'planner',
    passwordHash: bcrypt.hashSync('demo123', 10),
  },
  'manager@merchmind.ai': {
    id: '2', name: 'Rahul Verma', role: 'manager',
    passwordHash: bcrypt.hashSync('demo123', 10),
  },
  'finance@merchmind.ai': {
    id: '3', name: 'Ananya Das', role: 'finance',
    passwordHash: bcrypt.hashSync('demo123', 10),
  },
  'admin@merchmind.ai': {
    id: '4', name: 'Admin User', role: 'admin',
    passwordHash: bcrypt.hashSync('demo123', 10),
  },
}

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ error: error.details[0].message })

    const { email, password } = value
    const user = USERS_DB[email]
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { userId: user.id, email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', require('../middleware/auth.middleware').authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

// POST /api/auth/refresh
router.post('/refresh', (req, res) => {
  const { token } = req.body
  try {
    const payload = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true })
    const newToken = jwt.sign(
      { userId: payload.userId, email: payload.email, role: payload.role, name: payload.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )
    res.json({ token: newToken })
  } catch {
    res.status(401).json({ error: 'Cannot refresh token' })
  }
})

module.exports = router
