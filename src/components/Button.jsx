function Button({ children, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-lg bg-cyan-500/40 p-4 text-slate-100 hover:bg-cyan-900 transition"
        >
            {children}
        </button>
    )
}

export default Button
