'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Edit3, X, Filter, Sun, Moon, User, Settings } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedUserName = localStorage.getItem('userName');
    
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedUserName) {
      setUserName(savedUserName);
      setShowWelcome(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (userName) {
      localStorage.setItem('userName', userName);
    }
  }, [todos, darkMode, userName]);

  // Add new todo
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date().toLocaleDateString(),
        completedAt: null
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Toggle todo completion
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { 
        ...todo, 
        completed: !todo.completed,
        completedAt: !todo.completed ? new Date().toLocaleDateString() : null
      } : todo
    ));
  };

  // Start editing
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  // Save edit
  const saveEdit = () => {
    if (editText.trim() !== '') {
      setTodos(todos.map(todo =>
        todo.id === editId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditId(null);
      setEditText('');
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  // Set user name
  const saveUserName = () => {
    if (userName.trim() !== '') {
      setShowWelcome(false);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // Stats
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showWelcome) {
        saveUserName();
      } else {
        addTodo();
      }
    }
  };

  // Theme classes
  const themeClasses = darkMode 
    ? {
        bg: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
        text: 'text-gray-100',
        card: 'bg-gray-800 border-gray-700',
        input: 'bg-gray-700 border-gray-600 text-white placeholder-gray-400',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondaryButton: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
        stats: 'text-gray-300',
        divider: 'divide-gray-700'
      }
    : {
        bg: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
        text: 'text-gray-900',
        card: 'bg-white border-gray-200',
        input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
        button: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondaryButton: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        stats: 'text-gray-600',
        divider: 'divide-gray-100'
      };

  // Welcome Modal
  if (showWelcome) {
    return (
      <div className={`min-h-screen ${themeClasses.bg} flex items-center justify-center p-4`}>
        <div className={`${themeClasses.card} rounded-2xl shadow-2xl p-8 max-w-md w-full border`}>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Welcome! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              What should we call you?
            </p>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name..."
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
              autoFocus
            />
            
            <button
              onClick={saveUserName}
              disabled={!userName.trim()}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                userName.trim() 
                  ? themeClasses.button 
                  : 'bg-gray-400 cursor-not-allowed text-gray-200'
              }`}
            >
              <Check size={20} />
              Start Organizing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.bg} ${themeClasses.text} transition-colors duration-300`}>
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              ✨ {userName}&apos;s Todo
            </h1>
            <p className={`mt-2 ${themeClasses.stats}`}>
              {activeTodos} tasks to complete • {completedTodos} done
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${themeClasses.secondaryButton}`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all duration-200 ${themeClasses.secondaryButton}`}
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`${themeClasses.card} rounded-2xl shadow-lg p-6 mb-6 border animate-fade-in`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-2 rounded-lg ${themeClasses.secondaryButton}`}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input}`}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    darkMode ? 'bg-blue-500' : 'bg-gray-300'
                  } relative`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${
                    darkMode ? 'left-7' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Todo Card */}
        <div className={`${themeClasses.card} rounded-2xl shadow-lg p-6 mb-6 border`}>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done today?"
              className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${themeClasses.input}`}
            />
            <button
              onClick={addTodo}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 ${themeClasses.button}`}
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
        </div>

        {/* Stats and Filters */}
        <div className={`${themeClasses.card} rounded-2xl shadow-lg p-6 mb-6 border`}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Stats */}
            <div className="flex gap-4 sm:gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{totalTodos}</div>
                <div className={themeClasses.stats}>Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{activeTodos}</div>
                <div className={themeClasses.stats}>Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{completedTodos}</div>
                <div className={themeClasses.stats}>Completed</div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'all' 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : themeClasses.secondaryButton
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'active' 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : themeClasses.secondaryButton
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === 'completed' 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : themeClasses.secondaryButton
                }`}
              >
                Completed
              </button>
            </div>

            {/* Clear Completed */}
            {completedTodos > 0 && (
              <button
                onClick={clearCompleted}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 hover:scale-105"
              >
                <Trash2 size={16} />
                Clear Completed
              </button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className={`${themeClasses.card} rounded-2xl shadow-lg overflow-hidden border`}>
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16">
              <Filter size={64} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className="text-xl font-medium mb-2">
                {todos.length === 0 
                  ? "Ready to be productive? Add your first task! 🚀" 
                  : "No tasks match this filter"}
              </p>
              <p className={themeClasses.stats}>
                {todos.length === 0 ? "Start by adding a task above" : "Try changing your filter"}
              </p>
            </div>
          ) : (
            <div className={`divide-y ${themeClasses.divider}`}>
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 hover:bg-opacity-50 transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    backgroundColor: darkMode 
                      ? 'rgba(31, 41, 55, 0.5)' 
                      : 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  {editId === todo.id ? (
                    // Edit Mode
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className={`flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${themeClasses.input}`}
                        autoFocus
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-500 hover:bg-green-500 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 text-red-500 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                          todo.completed
                            ? 'bg-green-500 border-green-500 text-white shadow-lg'
                            : `border-gray-400 hover:border-green-400 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`
                        }`}
                      >
                        {todo.completed && <Check size={14} />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-lg break-words ${
                            todo.completed
                              ? 'line-through opacity-60'
                              : 'font-medium'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 rounded-full">
                            Created: {todo.createdAt}
                          </span>
                          {todo.completed && todo.completedAt && (
                            <span className="text-xs px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 rounded-full">
                              Completed: {todo.completedAt}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(todo)}
                          className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                          disabled={todo.completed}
                          title="Edit task"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-all duration-200"
                          title="Delete task"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="text-center mt-8">
          <div className={`inline-flex flex-wrap gap-4 justify-center text-sm ${themeClasses.stats}`}>
            <span>💡 Click task to edit</span>
            <span>⚡ Press Enter to add quickly</span>
            <span>🎯 {activeTodos} tasks remaining</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}