import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ task = {}, onTaskSubmit }) => {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "pending");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const newTask = { title, description, status, dueDate, priority };
    const token = localStorage.getItem('token');

    try {
      let response;
      if (task._id) {
        // Update existing task
        response = await axios.put(
          `http://localhost:5000/tasks/${task._id}`,
          newTask,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage("Task updated successfully!");
      } else {
        // Create a new task
        response = await axios.post("http://localhost:5000/tasks", newTask, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage("Task created successfully!");
      }

      if (typeof onTaskSubmit === "function") {
        onTaskSubmit(response.data);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setMessage(`Bad request: ${JSON.stringify(error.response.data)}`);
        } else {
          setMessage(`Server error: ${error.response.status}`);
        }
      } else if (error.request) {
        setMessage("No response received from server");
      } else {
        setMessage(`Error: ${error.message}`);
      }
      console.error("Error details:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Task Form</h2>
      <div className="card shadow">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="status" className="form-label">Status</label>
                <select
                  className="form-select"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="dueDate" className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="priority" className="form-label">Priority</label>
                <select
                  className="form-select"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="d-grid">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : (task._id ? 'Update Task' : 'Create Task')}
              </button>
            </div>
            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
