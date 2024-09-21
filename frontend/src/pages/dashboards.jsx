import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(() => {
    JSON.parse(false);
  });
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks", error);
      setError("No Tasks Found, Try Adding Task.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleQuickTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Clear the form and refresh tasks
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        priority: "medium",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksDueToday = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = tasks
    .filter((task) => new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const statusData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [
          tasks.filter((task) => task.status === "pending").length,
          tasks.filter((task) => task.status === "in-progress").length,
          completedTasks,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="body">
      <div className="dashboard">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="darkmodetoggler">
          <div class="background">
            <button
              class="change-theme__icon"
              onClick={toggleDarkMode}
            ></button>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="card task-overview" id="card">
            <h2>Task Overview</h2>
            <div className="stat-container">
              <div className="stat">
                <span className="stat-value">{totalTasks}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat">
                <span className="stat-value">{tasksDueToday.length}</span>
                <span className="stat-label">Due Today</span>
              </div>
              <div className="stat">
                <span className="stat-value">{completedTasks}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <div className="tasks-due-today">
              <h3>Tasks Due Today</h3>
              <ul className="task-list">
                {tasksDueToday.map((task) => (
                  <li key={task._id} className="task-item">
                    <span className="task-title">{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card quick-links" id="card">
            <h2>Quick Links</h2>
            <Link to="/tasklist" className="btn">
              All Tasks
            </Link>
            <Link to="/addTask" className="btn">
              Create New Task
            </Link>
          </div>

          <div className="card task-status-breakdown" id="card">
            <h2>Task Status Breakdown</h2>
            <Pie data={statusData} />
          </div>

          <div className="card task-reminders" id="card">
            <h2>Upcoming Tasks</h2>
            <ul className="reminder-list">
              {upcomingTasks.slice(0, 5).map((task) => {
                const daysUntilDue = Math.ceil(
                  (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
                );
                let urgencyClass = "low-urgency";
                if (daysUntilDue <= 1) {
                  urgencyClass = "high-urgency";
                } else if (daysUntilDue <= 3) {
                  urgencyClass = "medium-urgency";
                }
                return (
                  <li
                    key={task._id}
                    className={`reminder-item ${urgencyClass}`}
                  >
                    <span className="reminder-title">{task.title}</span>
                    <span className="reminder-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card productivity-insights" id="card">
            <h2>Productivity Insights</h2>
            <div className="completion-rate">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path
                  className="circle-bg"
                  d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="circle"
                  strokeDasharray={`${completionRate}, 100`}
                  d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="percentage">
                  {completionRate.toFixed(0)}%
                </text>
              </svg>
              <span>Task Completion Rate</span>
            </div>
          </div>

          <div className="card quick-task-creation" id="card">
            <h2>Quick Task Creation</h2>
            <form className="quick-task-form" onSubmit={handleQuickTaskSubmit}>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Task title"
                className="form-input"
                required
              />
              <textarea
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Task description"
                className="form-input"
                required
              ></textarea>
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button type="submit" className="btn">
                Create Task
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
