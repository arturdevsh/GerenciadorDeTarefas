import Input from './input'
import { useState } from 'react'

function AddTask({ onTaskAdd }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (title.trim() === '' || description.trim() === '') {
            return
        }
        onTaskAdd(title, description)
        setTitle('')
        setDescription('')
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6 list-none p-0">
            <Input
                type="text"
                placeholder="Título da tarefa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <Input
                type="text"
                placeholder="Descrição da tarefa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button
                type="submit"
                className="w-full rounded-lg bg-cyan-950 p-4 text-slate-100/80 hover:bg-cyan-800 hover:text-slate-100 transition"
            >
                Adicionar Tarefa
            </button>
        </form>
    )
}

export default AddTask
