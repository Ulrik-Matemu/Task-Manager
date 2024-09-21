import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditTask.css';

const EditTask = ({ taskId, onTaskUpdate, onCancel }) => {
    const [task, setTask] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTask();
    }, [taskId]);

    const fetchTask = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const taskData = response.data;
            setTask(taskData);
            setTitle(taskData.title);
            setDescription(taskData.description);
            setStatus(taskData.status);
            setDueDate(taskData.dueDate.split('T')[0]); // Format date for input
            setPriority(taskData.priority);
            setIsLoading(false);
        } catch (error) {
            setError('Error fetching task');
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedTask = { title, description, status, dueDate, priority };
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onTaskUpdate(response.data);
        } catch (error) {
            setError('Error updating task');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="edit-task-container">
            <h2 className="edit-task-title">Edit Task</h2>
            <form onSubmit={handleSubmit} className="edit-task-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-input"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="form-input"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Update Task</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditTask;