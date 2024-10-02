import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/todos/')
      .then((res) => setTodos(res.data))
      .catch((err) => console.log(err));
  }, []);

  const addTodo = () => {
    if (!title) {
      alert('Please enter a task title');
      return;
    }

    axios
      .post('http://127.0.0.1:8000/api/todos/', { title, completed: false })
      .then((res) => setTodos([...todos, res.data]))
      .catch((err) => console.log(err));

    setTitle('');
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/todos/${id}/`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)))
      .catch((err) => console.log(err));
  };

  const startEditing = (id, title) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const editTodo = () => {
    axios
      .put(`http://127.0.0.1:8000/api/todos/${editingId}/`, { title: editingTitle, completed: false })
      .then((res) => {
        setTodos(todos.map((todo) => (todo.id === editingId ? res.data : todo)));
        setEditingId(null);
        setEditingTitle('');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">To-Do List</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md w-full p-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="space-y-4">
          {todos.map((todo) => (
            <li key={todo.id} className="flex justify-between items-center">
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="border border-gray-300 rounded-md w-full p-2 mr-2"
                  />
                  <button
                    onClick={editTodo}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-800">{todo.title}</span>
                  <div>
                    <button
                      onClick={() => startEditing(todo.id, todo.title)}
                      className="text-yellow-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
