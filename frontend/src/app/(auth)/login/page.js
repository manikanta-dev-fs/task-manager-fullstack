"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthForm from "components/AuthForm";
import { useAuth } from "context/AuthContext";

function LoginPageContent() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (payload) => {
    setError("");
    setLoading(true);

    try {
      await login(payload);
      const next = searchParams.get("next") || "/dashboard";
      router.replace(next);
    } catch (err) {
      setError(err?.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="login" onSubmit={handleSubmit} loading={loading} error={error} />;
}

export default function LoginPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
