import { useNavigate, useParams } from 'react-router-dom'

function TaskDetails({ tasks }) {
    const navigate = useNavigate()
    const { id } = useParams()
    const taskId = Number(id)
    const task = tasks.find((t) => t.id === taskId)

    if (!task) {
        return (
            <div className="space-y-4 text-slate-100">
                <p className="text-lg font-semibold">Tarefa não encontrada.</p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="rounded-lg bg-cyan-950 p-4 text-slate-100/80 hover:bg-cyan-800 hover:text-slate-100 transition"
                >
                    Voltar
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4 mx-auto text-slate-100">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <p className="text-sm text-cyan-200">{task.description}</p>
            <p className="text-sm">
                Status:{' '}
                <span
                    className={
                        task.completed ? 'text-emerald-300' : 'text-slate-200'
                    }
                >
                    {task.completed ? 'Concluída' : 'Pendente'}
                </span>
            </p>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-lg bg-cyan-950 p-4 text-slate-100/80 hover:bg-cyan-800 hover:text-slate-100 transition"
            >
                Voltar para lista
            </button>
        </div>
    )
}

export default TaskDetails
