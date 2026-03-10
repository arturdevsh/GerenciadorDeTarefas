import { useState } from 'react'
import Tasks from './components/Tasks'
import './App.css'

function App() {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: 'Task 1',
            description: 'Description of Task 1',
            completed: false,
        },
        {
            id: 2,
            title: 'Task 2',
            description: 'Description of Task 2',
            completed: false,
        },
        {
            id: 3,
            title: 'Task 3',
            description: 'Description of Task 3',
            completed: false,
        },
    ])

    function onTaskClick(taskId) {
        const newTasks = tasks.map((task) => {
            if (task.id === taskId) {
                return { ...task, completed: !task.completed }
            }

            return task
        })

        setTasks(newTasks)
    }

    function onTaskDelete(taskId) {
        const newTasks = tasks.filter((task) => task.id !== taskId)

        setTasks(newTasks)
    }

    return (
        <div className="w-screen h-screen bg-cyan-500 flex justify-center p-6">
            <div className="w-[500px] h-full bg-cyan-700 rounded-lg p-6">
                <h1 className="text-3xl text-slate-100 font-bold text-center">
                    To Do List
                </h1>

                <Tasks
                    tasks={tasks}
                    onTaskClick={onTaskClick}
                    onTaskDelete={onTaskDelete}
                />
            </div>
        </div>
    )
}

export default App
