"use client";

import { useJobs } from "@/lib/jobs/job-context";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";

export function JobSearch() {
  const { filters, setFilters, searchJobs, loading } = useJobs();
  const [query, setQuery] = useState(filters.query);
  const [location, setLocation] = useState(filters.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ query, location });
    searchJobs({ query, location });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Job title, skill, or keyword…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <input
        type="text"
        placeholder="Location or 'remote'"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-48 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Search className="w-4 h-4" />
        )}
        Search
      </button>
    </form>
  );
}
