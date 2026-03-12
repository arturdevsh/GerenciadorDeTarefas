import { useEffect, useState } from 'react'
import axios from 'axios'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Tasks from './components/Tasks'
import TaskDetails from './components/TaskDetails'
import './App.css'
import AddTask from './components/AddTask'

function AuthForm({ mode, setMode, onLogin, onSignup }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()
        if (mode === 'login') {
            await onLogin(username, password)
        } else {
            await onSignup(username, email, password)
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 justify-center">
                <button
                    type="button"
                    className={`rounded-lg px-4 py-2 ${
                        mode === 'login'
                            ? 'bg-cyan-900 text-white'
                            : 'bg-cyan-500/40 text-slate-100'
                    }`}
                    onClick={() => setMode('login')}
                >
                    Login
                </button>
                <button
                    type="button"
                    className={`rounded-lg px-4 py-2 ${
                        mode === 'signup'
                            ? 'bg-cyan-900 text-white'
                            : 'bg-cyan-500/40 text-slate-100'
                    }`}
                    onClick={() => setMode('signup')}
                >
                    Cadastro
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full rounded-lg bg-cyan-500/40 p-4 text-slate-100"
                    placeholder={
                        mode === 'login'
                            ? 'Nome de usuário ou email'
                            : 'Nome de usuário'
                    }
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                />
                {mode === 'signup' && (
                    <input
                        className="w-full rounded-lg bg-cyan-500/40 p-4 text-slate-100"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                )}
                <input
                    className="w-full rounded-lg bg-cyan-500/40 p-4 text-slate-100"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                />
                <button
                    type="submit"
                    className="w-full rounded-lg bg-cyan-950 p-4 text-slate-100/80 hover:bg-cyan-800 hover:text-slate-100 transition"
                >
                    {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                </button>
            </form>
        </div>
    )
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// Sempre manda o token salvo no localStorage (se existir)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        }
    }
    return config
})

function App() {
    const [tasks, setTasks] = useState([])
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        if (!saved || !token) return null
        return JSON.parse(saved)
    })
    const [authMode, setAuthMode] = useState('login')
    const navigate = useNavigate()

    function saveAuth(userData, token) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        setUser(userData)
    }

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setUser(null)
        setTasks([])
    }

    async function handleLogin(identifier, password) {
        try {
            const response = await api.post('/auth/login', {
                identifier,
                password,
            })
            saveAuth(response.data.user, response.data.token)
        } catch (error) {
            console.error('Erro ao fazer login:', error)
            alert('Falha no login. Verifique suas credenciais.')
        }
    }

    async function handleSignup(username, email, password) {
        try {
            const response = await api.post('/auth/signup', {
                username,
                email,
                password,
            })
            saveAuth(response.data.user, response.data.token)
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error)
            alert(
                'Falha no cadastro. Talvez o nome de usuário ou email já esteja em uso.'
            )
        }
    }

    async function onTaskClick(taskId) {
        const task = tasks.find((task) => task.id === taskId)
        if (!task) return

        const updated = { ...task, completed: !task.completed }

        try {
            await api.put(`/tasks/${taskId}`, updated)
            setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)))
        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error)
        }
    }

    async function onTaskDelete(taskId) {
        try {
            await api.delete(`/tasks/${taskId}`)
            setTasks((prev) => prev.filter((task) => task.id !== taskId))
        } catch (error) {
            console.error('Erro ao deletar tarefa:', error)
        }
    }

    async function onTaskAdd(title, description) {
        try {
            const response = await api.post('/tasks', { title, description })
            setTasks((prev) => [...prev, response.data])
        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
        }
    }

    function onTaskView(taskId) {
        navigate(`/tasks/${taskId}`)
    }

    useEffect(() => {
        if (!user) {
            setTasks([])
            return
        }

        async function loadTasks() {
            try {
                const response = await api.get('/tasks')
                setTasks(response.data)
            } catch (error) {
                console.error('Erro ao carregar tarefas:', error)
            }
        }

        loadTasks()
    }, [user])

    return (
        <div className="w-screen h-screen bg-cyan-500 flex justify-center p-6">
            <div className="w-[500px] h-full bg-cyan-700 rounded-lg p-6 ">
                <h1 className="text-3xl text-slate-100 font-bold text-center">
                    To Do List
                </h1>

                {!user ? (
                    <AuthForm
                        mode={authMode}
                        setMode={setAuthMode}
                        onLogin={handleLogin}
                        onSignup={handleSignup}
                    />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-200">
                                {user.username} ({user.email})
                            </span>
                            <button
                                onClick={logout}
                                className="rounded-lg bg-red-500/50 px-4 py-2 text-slate-100 hover:bg-red-600"
                            >
                                Sair
                            </button>
                        </div>

                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <>
                                        <AddTask onTaskAdd={onTaskAdd} />
                                        <Tasks
                                            tasks={tasks}
                                            onTaskClick={onTaskClick}
                                            onTaskDelete={onTaskDelete}
                                            onTaskView={onTaskView}
                                        />
                                    </>
                                }
                            />
                            <Route
                                path="/tasks/:id"
                                element={<TaskDetails tasks={tasks} />}
                            />
                        </Routes>
                    </>
                )}
            </div>
        </div>
    )
}

export default App
