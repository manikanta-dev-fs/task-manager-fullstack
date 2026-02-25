"use client";

import Link from "next/link";
import { useState } from "react";

export default function AuthForm({
  type,
  onSubmit,
  loading,
  error,
}) {
  const isRegister = type === "register";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isRegister) {
      onSubmit({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      return;
    }

    onSubmit({
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="page">
      <div className="card">
        <h1>{isRegister ? "Create account" : "Login"}</h1>
        {error ? <p className="error">{error}</p> : null}
        <form onSubmit={handleSubmit}>
          {isRegister ? (
            <label className="field">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="muted" style={{ marginTop: "0.75rem" }}>
          {isRegister ? "Already have an account? " : "Need an account? "}
          <Link className="link" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
}