import { ChevronRightIcon, Trash2 } from 'lucide-react'

function Tasks({ tasks, onTaskClick, onTaskDelete }) {
    if (!tasks?.length) {
        return (
            <div className="text-slate-100">
                <p>Nenhuma tarefa cadastrada.</p>
            </div>
        )
    }

    return (
        <ul className="space-y-4 mt-6 list-none p-0">
            {tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onTaskClick(task.id)}
                        className={`flex-1 rounded-lg bg-cyan-500/40 p-4 text-left shadow-md hover:bg-cyan-900 transition
                            ${task.completed ? 'text-emerald-300 bg-emerald-500/20' : 'text-slate-100'}`}
                    >
                        {task.title}
                    </button>
                    <button
                        type="button"
                        className="p-4 bg-cyan-500/40 text-slate-100/80 hover:bg-cyan-900 rounded-lg hover:text-slate-100"
                    >
                        <ChevronRightIcon />
                    </button>
                    <button
                        type="button"
                        onClick={() => onTaskDelete(task.id)}
                        className="rounded-lg bg-red-500/30 p-4 text-slate-100/80 hover:bg-red-900 hover:text-slate-100 transition"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default Tasks
