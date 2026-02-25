"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "components/AuthForm";
import { useAuth } from "context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (payload) => {
    setError("");
    setLoading(true);

    try {
      await register(payload);
      router.replace("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}