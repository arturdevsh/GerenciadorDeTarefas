import express from 'express'
import { query } from '../db.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Todas as rotas abaixo precisam de um usuário autenticado
router.use(authenticate)

// Listar todas as tarefas do usuário
router.get('/', async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar tarefas' })
    }
})

// Buscar uma tarefa por ID (do usuário atual)
router.get('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }
        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao buscar tarefa' })
    }
})

// Criar nova tarefa
router.post('/', async (req, res) => {
    const { title, description } = req.body
    try {
        const result = await query(
            'INSERT INTO tasks (user_id, title, description, completed) VALUES ($1, $2, $3, false) RETURNING *',
            [req.user.id, title, description]
        )
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao criar tarefa' })
    }
})

// Atualizar tarefa (apenas completed / title / description)
router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { title, description, completed } = req.body

    try {
        const result = await query(
            'UPDATE tasks SET title = $1, description = $2, completed = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, description, completed, id, req.user.id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }

        res.json(result.rows[0])
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao atualizar tarefa' })
    }
})

// Deletar tarefa
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const result = await query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2',
            [id, req.user.id]
        )
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Tarefa não encontrada' })
        }
        res.status(204).end()
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Erro ao deletar tarefa' })
    }
})

export default router
