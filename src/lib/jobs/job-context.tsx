"use client";

import { Job, JobFilters, JobSearchResult } from "@/types/job";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  filters: JobFilters;
  setFilters: (filters: Partial<JobFilters>) => void;
  searchJobs: (filters?: Partial<JobFilters>) => Promise<void>;
  savedJobs: Job[];
  saveJob: (job: Job) => void;
  unsaveJob: (jobId: string) => void;
  isJobSaved: (jobId: string) => boolean;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

const DEFAULT_FILTERS: JobFilters = {
  query: "",
  location: "",
  remote: null,
  jobType: null,
  tags: [],
};

export function JobProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filters, setFiltersState] = useState<JobFilters>(DEFAULT_FILTERS);

  const setFilters = useCallback((updates: Partial<JobFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...updates }));
  }, []);

  const searchJobs = useCallback(
    async (overrides?: Partial<JobFilters>) => {
      const activeFilters = overrides
        ? { ...filters, ...overrides }
        : filters;

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (activeFilters.query) params.set("query", activeFilters.query);
        if (activeFilters.location) params.set("location", activeFilters.location);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        if (!res.ok) throw new Error(`Search failed: ${res.status}`);

        const data: JobSearchResult = await res.json();
        setJobs(data.jobs);
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  const saveJob = useCallback((job: Job) => {
    setSavedJobs((prev) => {
      if (prev.find((j) => j.id === job.id)) return prev;
      return [...prev, { ...job, savedAt: new Date().toISOString() }];
    });
  }, []);

  const unsaveJob = useCallback((jobId: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  }, []);

  const isJobSaved = useCallback(
    (jobId: string) => savedJobs.some((j) => j.id === jobId),
    [savedJobs]
  );

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        total,
        hasMore,
        filters,
        setFilters,
        searchJobs,
        savedJobs,
        saveJob,
        unsaveJob,
        isJobSaved,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
}
