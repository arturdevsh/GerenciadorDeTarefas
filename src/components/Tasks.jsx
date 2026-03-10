import { ChevronRightIcon } from 'lucide-react'

function Tasks({ tasks }) {
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
                <li key={task.id} className="flex gap-2">
                    <button className="rounded-lg w-full text-left bg-cyan-500/40 p-4 text-slate-100 shadow-md">
                        {task.title}
                    </button>
                    <button>
                        <ChevronRightIcon />
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default Tasks
