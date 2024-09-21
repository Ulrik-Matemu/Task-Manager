import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpForm from "./pages/signup";
import SignIn from "./pages/signin";
import TaskList from "./pages/taskList";
import Header from "./components/header";
import TaskFor from "./pages/Todo";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboards";
import TeamList from "./pages/teamList";
import CreateTeam from "./pages/createTeam";
import TeamDetails from "./pages/teamDetails";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/" element={<SignIn />} />
            <Route
              path="/teams"
              element={
                <ProtectedRoute>
                  <TeamList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-team"
              element={
                <ProtectedRoute>
                  <CreateTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teams/:id"
              element={
                <ProtectedRoute>
                  <TeamDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasklist"
              element={
                <ProtectedRoute>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addTask"
              element={
                <ProtectedRoute>
                  <TaskFor />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
