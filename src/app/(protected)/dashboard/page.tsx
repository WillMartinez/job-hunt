"use client";

import { StatsBar } from "@/components/dashboard/StatsBar";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationService } from "@/lib/applications/application-service";
import { useAuth } from "@/lib/auth/auth-context";
import { Application } from "@/types/application";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export default function DashboardPage() {
  const { userEmail } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);

  const loadApplications = useCallback(() => {
    setApplications(ApplicationService.getApplications());
  }, []);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const stats = ApplicationService.getStats();
  const recentApps = applications
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  const firstName = userEmail?.split("@")[0] ?? "there";

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Hey {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your job search overview.</p>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* Recent activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
          <Link
            href="/applications"
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-500 mb-4">No applications yet. Let's find some jobs!</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              Find Jobs
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {recentApps.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onUpdate={loadApplications}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
