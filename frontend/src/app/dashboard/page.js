"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "components/ProtectedRoute";
import CreateTaskForm from "components/CreateTaskForm";
import TaskFilters from "components/TaskFilters";
import TaskList from "components/TaskList";
import api from "services/api";
import { useAuth } from "context/AuthContext";

const LIMIT = 10;

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: LIMIT });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loadingList, setLoadingList] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const queryStatus = useMemo(() => (status === "all" ? undefined : status), [status]);

  const fetchTasks = useCallback(async (page = 1) => {
    setLoadingList(true);
    setError("");

    try {
      const params = { page, limit: LIMIT };
      if (queryStatus) params.status = queryStatus;
      if (search.trim()) params.search = search.trim();

      const response = await api.get("/api/tasks", { params });
      setTasks(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, totalPages: 1, total: 0, limit: LIMIT });
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to fetch tasks");
    } finally {
      setLoadingList(false);
    }
  }, [queryStatus, search]);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks, queryStatus, search]);

  const handleCreateTask = async (payload) => {
    setCreating(true);
    setError("");

    try {
      await api.post("/api/tasks", payload);
      await fetchTasks(1);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (task) => {
    setError("");

    try {
      const nextStatus = task.status === "completed" ? "pending" : "completed";
      await api.put(`/api/tasks/${task._id}`, { status: nextStatus });
      await fetchTasks(pagination.page);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    setError("");

    try {
      await api.delete(`/api/tasks/${taskId}`);
      const targetPage = tasks.length === 1 && pagination.page > 1 ? pagination.page - 1 : pagination.page;
      await fetchTasks(targetPage);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to delete task");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <h1 style={{ margin: 0 }}>Dashboard</h1>
            <p className="muted" style={{ margin: "0.35rem 0 0" }}>
              Signed in as {user?.email}
            </p>
          </div>

          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </header>

        {error ? <p className="error">{error}</p> : null}

        <section className="dashboard-grid">
          <CreateTaskForm onCreate={handleCreateTask} loading={creating} />

          <div className="panel">
            <TaskFilters
              search={searchInput}
              status={status}
              onSearchChange={setSearchInput}
              onStatusChange={setStatus}
            />

            {loadingList ? (
              <p className="muted">Loading tasks...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTask}
              />
            )}

            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => fetchTasks(Math.max(pagination.page - 1, 1))}
                disabled={pagination.page <= 1 || loadingList}
              >
                Previous
              </button>

              <span className="muted">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                className="btn btn-secondary"
                onClick={() => fetchTasks(Math.min(pagination.page + 1, pagination.totalPages))}
                disabled={pagination.page >= pagination.totalPages || loadingList}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
