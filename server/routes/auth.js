import express from 'express'
import bcrypt from 'bcrypt'
import { query } from '../db.js'
import { signToken } from '../middleware/auth.js'

const router = express.Router()

// Cadastro de usuário (username + email + senha)
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res
            .status(400)
            .json({ error: 'Usuário, email e senha são obrigatórios' })
    }

    try {
        const existingUser = await query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        )
        if (existingUser.rowCount > 0) {
            return res
                .status(409)
                .json({ error: 'Nome de usuário já cadastrado' })
        }

        const existingEmail = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        )
        if (existingEmail.rowCount > 0) {
            return res.status(409).json({ error: 'Email já cadastrado' })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const result = await query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        )

        const user = result.rows[0]
        const token = signToken(user)

        res.status(201).json({ user, token })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao cadastrar usuário' })
    }
})

// Login (pode usar username ou email)
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body

    if (!identifier || !password) {
        return res
            .status(400)
            .json({ error: 'Nome de usuário/email e senha são obrigatórios' })
    }

    try {
        const result = await query(
            'SELECT id, username, email, password_hash FROM users WHERE username = $1 OR email = $1',
            [identifier]
        )
        const user = result.rows[0]

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        )
        if (!passwordMatches) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        // Se existirem tarefas sem dono (user_id NULL), atribui ao usuário ao logar pela primeira vez
        await query('UPDATE tasks SET user_id = $1 WHERE user_id IS NULL', [
            user.id,
        ])

        const token = signToken(user)
        res.json({
            user: { id: user.id, username: user.username, email: user.email },
            token,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao realizar login' })
    }
})

export default router
