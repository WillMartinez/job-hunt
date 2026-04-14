"use client";

import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { ApplicationService } from "@/lib/applications/application-service";
import { Application, ApplicationStatus } from "@/types/application";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const STATUS_TABS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "phone-screen", label: "Phone Screen" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | "all">("all");

  const loadApplications = useCallback(() => {
    setApplications(ApplicationService.getApplications());
  }, []);

  useEffect(() => { loadApplications(); }, [loadApplications]);

  const filtered =
    activeTab === "all"
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const counts = STATUS_TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? applications.length
        : applications.filter((a) => a.status === tab.value).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Applications</h1>
        <p className="text-gray-500 text-sm">Track every application from saved to offer.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === value
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {label}
            {counts[value] > 0 && (
              <span
                className={`ml-1.5 text-xs ${
                  activeTab === value ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {counts[value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No applications here yet.</p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Find Jobs to Apply
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onUpdate={loadApplications}
              />
            ))}
        </div>
      )}
    </div>
  );
}
