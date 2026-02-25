"use client";

import TaskItem from "components/TaskItem";

export default function TaskList({ tasks, onToggleStatus, onDelete }) {
  if (!tasks.length) {
    return <p className="muted">No tasks found.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}