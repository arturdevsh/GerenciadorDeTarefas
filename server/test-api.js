async function main() {
    // Cria um usuário de teste (se ainda não existir)
    await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'testuser',
            email: 'testuser@example.com',
            password: '123456',
        }),
    })

    const login = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'testuser', password: '123456' }),
    })

    const data = await login.json()
    console.log('login', login.status, data)
    if (!data.token) return

    const token = data.token
    const create = await fetch('http://localhost:4000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: 'teste', description: 'desc' }),
    })

    console.log('create', create.status, await create.json())

    const list = await fetch('http://localhost:4000/tasks', {
        headers: { Authorization: `Bearer ${token}` },
    })
    console.log('tasks', list.status, await list.json())
}

main().catch(console.error)
