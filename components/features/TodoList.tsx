import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Todo, Priority } from '../../types';
import { useAppContext } from '../../context/AppContext';

// Config kept outside to prevent re-initialization
const priorityConfig = {
    [Priority.High]: { color: 'bg-red-500', order: 1, label: 'High Priority' },
    [Priority.Medium]: { color: 'bg-yellow-500', order: 2, label: 'Medium Priority' },
    [Priority.Low]: { color: 'bg-blue-500', order: 3, label: 'Low Priority' },
};

export const TodoList: React.FC = () => {
    const { currentUser, updateUserTodos } = useAppContext();
    
    // Derived state from context is safer than duplicating it into local state
    // assuming updateUserTodos updates the context immediately.
    // If you need optimistic UI updates, local state is fine, but needs careful syncing.
    const [localTodos, setLocalTodos] = useState<Todo[]>([]);
    const [inputText, setInputText] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.Medium);
    const [isSorted, setIsSorted] = useState(false);
    
    // Ref to track timeouts for cleanup
    const deleteTimeouts = useRef<Set<NodeJS.Timeout>>(new Set());

    // Sync with context, but only if local changes aren't pending (simplified sync here)
    useEffect(() => {
        if (currentUser?.todos) {
            setLocalTodos(currentUser.todos);
        }
    }, [currentUser]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            deleteTimeouts.current.forEach(clearTimeout);
        };
    }, []);

    const persistTodos = (newTodos: Todo[]) => {
        setLocalTodos(newTodos);
        updateUserTodos(newTodos);
    };

    const handleAddTask = () => {
        if (!inputText.trim()) return;
        
        const newTodo: Todo = {
            id: Date.now(),
            text: inputText.trim(),
            completed: false,
            priority: priority,
        };
        
        persistTodos([...localTodos, newTodo]);
        setInputText('');
        setPriority(Priority.Medium);
    };

    const handleToggleTodo = (id: number) => {
        const newTodos = localTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        persistTodos(newTodos);
    };
    
    const handleDeleteTodo = (id: number) => {
        // Optimistic UI update for animation
        const tempTodos = localTodos.map(todo =>
            todo.id === id ? { ...todo, deleting: true } : todo
        );
        setLocalTodos(tempTodos);

        const timeoutId = setTimeout(() => {
            // Functional state update ensures we don't work with stale data
            setLocalTodos(current => {
                const finalTodos = current.filter(todo => todo.id !== id);
                updateUserTodos(finalTodos); // Sync with context after animation
                return finalTodos;
            });
            deleteTimeouts.current.delete(timeoutId);
        }, 500);

        deleteTimeouts.current.add(timeoutId);
    };

    const sortedTodos = useMemo(() => {
        const baseList = [...localTodos];
        if (!isSorted) return baseList;

        return baseList.sort((a, b) => {
            // Sort completed items to the bottom
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            // Then sort by priority
            return priorityConfig[a.priority].order - priorityConfig[b.priority].order;
        });
    }, [localTodos, isSorted]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden h-full">
            <div className="flex items-center justify-between mb-3 px-1">
                 <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">
                    To-Do List
                 </h2>
                 <button 
                    onClick={() => setIsSorted(!isSorted)}
                    className={`text-xs px-2 py-1 rounded-md transition-colors font-medium ${
                        isSorted 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                    title={isSorted ? "Switch to unsorted view" : "Sort by priority and status"}
                    aria-pressed={isSorted}
                >
                    {isSorted ? 'Sorted' : 'Sort'}
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4 px-1">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    placeholder="Add a new task..."
                    className="flex-grow bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-sm text-slate-800 dark:text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors"
                    aria-label="New task text"
                />
                <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-2 text-sm text-slate-800 dark:text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition-colors cursor-pointer"
                    aria-label="Task priority"
                >
                    <option value={Priority.High}>High</option>
                    <option value={Priority.Medium}>Medium</option>
                    <option value={Priority.Low}>Low</option>
                </select>
                <button
                    onClick={handleAddTask}
                    disabled={!inputText.trim()}
                    className="bg-red-600 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1 min-h-0">
                {localTodos.length === 0 ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8 italic">
                        No tasks yet. Add one above!
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {sortedTodos.map(todo => (
                            <li 
                                key={todo.id} 
                                className={`flex items-center justify-between bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-transparent p-2 rounded-md group transition-all duration-500 ease-in-out overflow-hidden ${
                                    todo.deleting ? 'opacity-0 -translate-x-4 max-h-0 !p-0 !my-0 !border-0' : 'max-h-20 opacity-100'
                                }`}
                            >
                                <div className="flex items-center overflow-hidden flex-1 mr-2">
                                    <input
                                        type="checkbox"
                                        checked={todo.completed}
                                        onChange={() => handleToggleTodo(todo.id)}
                                        className="w-4 h-4 text-red-600 bg-gray-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded focus:ring-red-500 cursor-pointer flex-shrink-0"
                                        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
                                    />
                                    <span 
                                        className={`ml-3 text-sm truncate select-none cursor-pointer ${
                                            todo.completed 
                                            ? 'line-through text-slate-400 dark:text-slate-500' 
                                            : 'text-slate-700 dark:text-slate-300'
                                        }`}
                                        onClick={() => handleToggleTodo(todo.id)}
                                    >
                                        {todo.text}
                                    </span>
                                </div>
                                <div className="flex items-center flex-shrink-0">
                                    <span 
                                        className={`w-3 h-3 rounded-full ml-3 ${priorityConfig[todo.priority].color}`}
                                        title={priorityConfig[todo.priority].label}
                                        aria-label={priorityConfig[todo.priority].label}
                                    ></span>
                                    <button
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity ml-2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                                        title="Delete task"
                                        aria-label={`Delete task: ${todo.text}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};