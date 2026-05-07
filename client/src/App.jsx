import { useEffect, useState } from "react";

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const fetchTodos = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${apiBaseUrl}/api/todos`);
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            setError("Failed to fetch todos");
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async () => {
        if (!title.trim()) {
            setError("Todo title cannot be empty");
            return;
        }

        try {
            const res = await fetch(`${apiBaseUrl}/api/todos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title })
            });
            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
                return;
            }
            setTitle("");
            setError(null);
            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
            setError("Failed to add todo");
        }
    };

    const updateTodo = async (todoId, payload) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/todos/${todoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
                return;
            }

            setError(null);
            fetchTodos();
        } catch (error) {
            setError("Failed to update todo");
        }
    };

    const deleteTodo = async (todoId) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/todos/${todoId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const error = await res.json();
                setError(error.error);
                return;
            }

            setError(null);
            fetchTodos();
        } catch (error) {
            setError("Failed to delete todo");
        }
    };

    const startEditing = (todo) => {
        setEditingId(todo._id);
        setEditingTitle(todo.title);
        setError(null);
    };

    const saveEdit = async (todoId) => {
        if (!editingTitle.trim()) {
            setError("Todo title cannot be empty");
            return;
        }
        await updateTodo(todoId, { title: editingTitle });
        setEditingId(null);
        setEditingTitle("");
    };

    const completedCount = todos.filter(t => t.completed).length;

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="card p-8 mb-8 text-center">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        My Todo List
                    </h1>
                    <p className="text-gray-600">Stay organized and productive</p>
                    {todos.length > 0 && (
                        <div className="mt-4 flex justify-center gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{todos.length}</p>
                                <p className="text-sm text-gray-500">Total Tasks</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
                                <p className="text-sm text-gray-500">Completed</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 font-bold"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Input Form */}
                <div className="card p-6 mb-8">
                    <div className="flex gap-3">
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyPress={e => e.key === "Enter" && addTodo()}
                            placeholder="Add a new task..."
                            className="input-field"
                        />
                        <button onClick={addTodo} className="btn-primary">
                            Add
                        </button>
                    </div>
                </div>

                {/* Todos List */}
                <div className="card overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>Loading your tasks...</p>
                        </div>
                    ) : todos.length === 0 ? (
                        <div className="p-8 text-center">
                            <p className="text-gray-500 mb-4">No todos yet. Create your first one!</p>
                            <div className="text-4xl">📝</div>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {todos.map((todo) => (
                                <li key={todo._id} className="todo-item">
                                    <label className="flex items-center gap-3 flex-1">
                                        <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={(e) => updateTodo(todo._id, { completed: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded cursor-pointer"
                                        />
                                        {editingId === todo._id ? (
                                            <input
                                                value={editingTitle}
                                                onChange={(e) => setEditingTitle(e.target.value)}
                                                onKeyPress={e => e.key === "Enter" && saveEdit(todo._id)}
                                                className="input-field text-sm"
                                                autoFocus
                                            />
                                        ) : (
                                            <span className={`flex-1 text-lg ${todo.completed
                                                    ? "line-through text-gray-400"
                                                    : "text-gray-800"
                                                }`}>
                                                {todo.title}
                                            </span>
                                        )}
                                    </label>

                                    <div className="flex gap-2">
                                        {editingId === todo._id ? (
                                            <>
                                                <button
                                                    onClick={() => saveEdit(todo._id)}
                                                    className="btn-primary text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditingTitle("");
                                                    }}
                                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(todo)}
                                                    className="btn-edit"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteTodo(todo._id)}
                                                    className="btn-secondary text-sm"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Progress Bar */}
                {todos.length > 0 && (
                    <div className="mt-8 card p-6">
                        <p className="text-sm text-gray-600 mb-2">Progress</p>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300"
                                style={{ width: `${(completedCount / todos.length) * 100}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            {completedCount} of {todos.length} tasks completed
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;