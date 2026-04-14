"use client";

import { JobCard } from "@/components/jobs/JobCard";
import { JobSearch } from "@/components/jobs/JobSearch";
import { useJobs } from "@/lib/jobs/job-context";
import { Loader2, SearchX } from "lucide-react";
import { useEffect } from "react";

export default function JobsPage() {
  const { jobs, loading, error, total, searchJobs } = useJobs();

  // Load default results on mount
  useEffect(() => {
    if (jobs.length === 0) searchJobs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Jobs</h1>
        <p className="text-gray-500 text-sm">
          Searching Remotive and The Muse in real-time.
        </p>
      </div>

      <JobSearch />

      {error && (
        <div className="bg-red-50 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <SearchX className="w-10 h-10 mb-3 text-gray-300" />
          <p className="font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try a different keyword or leave it blank to browse all</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">{total.toLocaleString()} results</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
