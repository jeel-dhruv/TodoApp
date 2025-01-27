import React, { useState, useEffect } from "react";

// AddTodo Component
const AddTodo = ({ onAdd }) => {
  const [newTask, setNewTask] = useState("");

  const handleAdd = () => {
    if (newTask.trim()) {
      onAdd(newTask);
      setNewTask("");
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        className="border p-2 rounded w-full shadow focus:ring focus:ring-blue-300"
      />
      <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow">
        Add
      </button>
    </div>
  );
};

// TodoItem Component
const TodoItem = ({ task, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-2 border-b hover:bg-gray-100">
      <div
        className={`cursor-pointer ${task.completed ? "line-through text-gray-500" : "text-black"} hover:text-blue-500`}
        onClick={() => onToggle(task.id)}
      >
        {task.todo}
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700"
      >
        Delete
      </button>
    </div>
  );
};

// Filter Component
const Filter = ({ currentFilter, onFilterChange }) => {
  return (
    <div className="flex space-x-4 mb-4">
      {[
        { label: "All", value: "all" },
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
      ].map((filter) => (
        <button
          key={filter.value}
          className={`px-4 py-2 rounded shadow ${
            currentFilter === filter.value
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

// TodoList Component
const TodoList = ({ tasks, onToggle, onDelete }) => {
  return (
    <div className="border rounded p-4 space-y-2 bg-white shadow-md">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

// Main TodoApp Component
const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Fetch tasks from the API on initial render
    fetch(process.env.REACT_APP_TODO_URL)
      .then((response) => response.json())
      .then((data) => setTasks(data.todos))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const addTask = (text) => {
    const newTask = {
      todo: text,
      completed: false,
      userId: 1, // Assuming a static userId for simplicity
    };

    fetch(`${process.env.REACT_APP_TODO_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => setTasks((prev) => [...prev, data]))
      .catch((error) => console.error("Error adding task:", error));
  };

  const toggleTask = (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);

    fetch(`${process.env.REACT_APP_TODO_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !taskToUpdate.completed }),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      })
      .catch((error) => console.error("Error toggling task:", error));
  };

  const deleteTask = (id) => {
    fetch(`${process.env.REACT_APP_TODO_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow-lg bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">To-Do List</h1>
      <AddTodo onAdd={addTask} />
      <Filter currentFilter={filter} onFilterChange={setFilter} />
      <TodoList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
    </div>
  );
};

export default TodoApp;
