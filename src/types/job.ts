export type JobSource = "remotive" | "themuse" | "linkedin" | "manual";

export type JobType =
  | "full-time"
  | "part-time"
  | "contract"
  | "freelance"
  | "internship"
  | "other";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  remote: boolean;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description: string;
  tags: string[];
  jobType: JobType;
  url: string;
  source: JobSource;
  postedAt: string; // ISO string
  savedAt?: string; // ISO string — when user saved it
}

export interface JobFilters {
  query: string;
  location: string;
  remote: boolean | null;
  jobType: JobType | null;
  tags: string[];
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  hasMore: boolean;
}
