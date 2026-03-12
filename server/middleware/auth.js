import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'mude_esta_chave'

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = { id: payload.sub, username: payload.username, email: payload.email }
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' })
  }
}

export function signToken(user) {
  return jwt.sign(
    { username: user.username, email: user.email },
    JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn: '7d',
    }
  )
}
