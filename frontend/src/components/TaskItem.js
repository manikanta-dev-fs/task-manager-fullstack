"use client";

export default function TaskItem({ task, onToggleStatus, onDelete }) {
  const isCompleted = task.status === "completed";

  return (
    <article className="task-item">
      <div>
        <h3>{task.title}</h3>
        <p>{task.description || "No description"}</p>
        <p className="muted" style={{ marginTop: "0.4rem" }}>
          Status: {task.status}
        </p>
      </div>

      <div className="task-actions">
        <button className="btn btn-secondary" onClick={() => onToggleStatus(task)}>
          Mark as {isCompleted ? "Pending" : "Completed"}
        </button>

        <button className="btn btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}