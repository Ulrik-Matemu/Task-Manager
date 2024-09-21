import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './taskList.css';
import EditTask from '../pages/edittask';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:5000/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const handleEdit = (id) => {
        setEditingTaskId(id);
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        setEditingTaskId(null);
    };

    const handleCancelEdit = () => {
        setEditingTaskId(null);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks(); // Refresh the task list
        } catch (error) {
            console.error('Error deleting task', error);
        }
    };

    return (
        <div className="task-list-container">
            <h1>Task List</h1>
            <div className="task-grid">
                {tasks.map(task => (
                    <div key={task._id} className="task-card">
                        {editingTaskId === task._id ? (
                            <EditTask
                                taskId={task._id}
                                onTaskUpdate={handleTaskUpdate}
                                onCancel={handleCancelEdit}
                            />
                        ) : (
                            <>
                                <h3 className="task-title">{task.title}</h3>
                                <p className="task-description">{task.description}</p>
                                <p className="task-info">Status: <span className={`status-${task.status.toLowerCase()}`}>{task.status}</span></p>
                                <p className="task-info">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                                <p className="task-info">Priority: <span className={`priority-${task.priority.toLowerCase()}`}>{task.priority}</span></p>
                                <div className="task-actions">
                                    <button onClick={() => handleEdit(task._id)} className="edit-btn">Edit</button>
                                    <button onClick={() => handleDelete(task._id)} className="delete-btn">Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
