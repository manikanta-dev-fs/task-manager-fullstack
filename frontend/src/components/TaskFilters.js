"use client";

export default function TaskFilters({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="toolbar">
      <input
        placeholder="Search tasks by title"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <select value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}