import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { query } from './db.js'
import tasksRoutes from './routes/tasks.js'
import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/tasks', tasksRoutes)

app.get('/', (req, res) => {
    res.send({ status: 'ok', message: 'Tarefas API' })
})

// Garante que as tabelas existam (ajuda a iniciar o projeto sem precisar rodar SQL manualmente)
async function ensureDatabase() {
    await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

    // Se a tabela já existia, garanta que as colunas/índices existem
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT`)
    await query(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users(username)`
    )
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email TEXT`)
    await query(
        `CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email)`
    )

    await query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `)

    // Se a tabela existed anteriormente sem user_id, adiciona a coluna e vincula as tarefas a um usuário
    await query(`ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id INTEGER`)
    await query(
        `UPDATE tasks SET user_id = (SELECT MIN(id) FROM users) WHERE user_id IS NULL`
    )
    await query(`
      DO $$
      BEGIN
        ALTER TABLE tasks ADD CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END;
      $$;
    `)
    await query(`ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL`)
}

ensureDatabase()
    .then(() => {
        app.listen(port, () => {
            console.log(`API rodando em http://localhost:${port}`)
        })
    })
    .catch((err) => {
        console.error('Erro ao inicializar banco de dados:', err)
        process.exit(1)
    })
