"use client";

import { useState } from "react";

export default function CreateTaskForm({ onCreate, loading }) {
  const [form, setForm] = useState({ title: "", description: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(form);
    setForm({ title: "", description: "" });
  };

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>New Task</h2>
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
}