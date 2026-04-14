"use client";

import { AuthProvider, useAuth } from "@/lib/auth/auth-context";
import { JobProvider } from "@/lib/jobs/job-context";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProtectedContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <JobProvider>
        <ProtectedContent>{children}</ProtectedContent>
      </JobProvider>
    </AuthProvider>
  );
}
