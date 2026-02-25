"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/login${next}`);
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user) {
    return <main className="page muted">Loading...</main>;
  }

  return children;
}