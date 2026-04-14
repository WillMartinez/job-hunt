import { Job, JobSearchResult } from "@/types/job";

// ─── Remotive API ────────────────────────────────────────────────────────────
// Completely free, no auth required. Remote jobs focused.
// Docs: https://remotive.com/api/docs

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

interface RemotiveResponse {
  jobs: RemotiveJob[];
  "job-count": number;
}

function mapRemotiveJob(job: RemotiveJob): Job {
  return {
    id: `remotive_${job.id}`,
    title: job.title,
    company: job.company_name,
    companyLogo: job.company_logo,
    location: job.candidate_required_location || "Remote",
    remote: true,
    description: job.description,
    tags: job.tags || [],
    jobType: mapJobType(job.job_type),
    url: job.url,
    source: "remotive",
    postedAt: job.publication_date,
    salary: parseSalary(job.salary),
  };
}

// ─── The Muse API ─────────────────────────────────────────────────────────────
// Free tier: 500 req/day. No auth needed for basic search.
// Docs: https://www.themuse.com/developers/api/v2

interface MuseJob {
  id: number;
  name: string;
  short_name: string;
  refs: { landing_page: string };
  company: { name: string; short_name: string };
  locations: { name: string }[];
  categories: { name: string }[];
  levels: { name: string; short_name: string }[];
  tags: { name: string; short_name: string }[];
  contents: string;
  publication_date: string;
}

interface MuseResponse {
  results: MuseJob[];
  page: number;
  page_count: number;
  total: number;
}

function mapMuseJob(job: MuseJob): Job {
  const location = job.locations?.map((l) => l.name).join(", ") || "Unknown";
  const isRemote = location.toLowerCase().includes("remote") ||
    location.toLowerCase().includes("flexible");

  return {
    id: `muse_${job.id}`,
    title: job.name,
    company: job.company?.name || "Unknown",
    location,
    remote: isRemote,
    description: job.contents,
    tags: [
      ...(job.categories?.map((c) => c.name) || []),
      ...(job.levels?.map((l) => l.name) || []),
    ],
    jobType: "full-time",
    url: job.refs?.landing_page || "",
    source: "themuse",
    postedAt: job.publication_date,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapJobType(raw: string): Job["jobType"] {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("contract")) return "contract";
  if (lower.includes("part")) return "part-time";
  if (lower.includes("freelance")) return "freelance";
  if (lower.includes("intern")) return "internship";
  return "full-time";
}

function parseSalary(raw: string): Job["salary"] | undefined {
  if (!raw) return undefined;
  const matches = raw.match(/[\d,]+/g);
  if (!matches) return undefined;
  const nums = matches.map((m) => parseInt(m.replace(/,/g, ""), 10));
  return {
    min: nums[0],
    max: nums[1] ?? nums[0],
    currency: raw.includes("$") ? "USD" : undefined,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface JobSearchParams {
  query?: string;
  category?: string;
  location?: string;
  page?: number;
}

/**
 * Search Remotive for remote jobs
 */
export async function searchRemotive(
  params: JobSearchParams
): Promise<JobSearchResult> {
  const url = new URL("https://remotive.com/api/remote-jobs");
  if (params.query) url.searchParams.set("search", params.query);
  if (params.category) url.searchParams.set("category", params.category);
  url.searchParams.set("limit", "20");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 }, // cache 5 min
  });

  if (!res.ok) throw new Error(`Remotive API error: ${res.status}`);

  const data: RemotiveResponse = await res.json();
  const jobs = data.jobs.map(mapRemotiveJob);

  return {
    jobs,
    total: data["job-count"],
    page: 1,
    hasMore: false,
  };
}

/**
 * Search The Muse for jobs (mix of remote + on-site)
 */
export async function searchMuse(
  params: JobSearchParams
): Promise<JobSearchResult> {
  const url = new URL("https://www.themuse.com/api/public/jobs");
  if (params.query) url.searchParams.set("category", params.query);
  if (params.location) url.searchParams.set("location", params.location);
  url.searchParams.set("page", String(params.page ?? 1));
  url.searchParams.set("descending", "true");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`The Muse API error: ${res.status}`);

  const data: MuseResponse = await res.json();
  const jobs = data.results.map(mapMuseJob);

  return {
    jobs,
    total: data.total,
    page: data.page,
    hasMore: data.page < data.page_count,
  };
}

/**
 * Search both sources and merge results
 */
export async function searchAllBoards(
  params: JobSearchParams
): Promise<JobSearchResult> {
  const results = await Promise.allSettled([
    searchRemotive(params),
    searchMuse(params),
  ]);

  const allJobs: Job[] = [];
  let total = 0;

  for (const result of results) {
    if (result.status === "fulfilled") {
      allJobs.push(...result.value.jobs);
      total += result.value.total;
    }
  }

  // Sort by most recent
  allJobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  return {
    jobs: allJobs,
    total,
    page: params.page ?? 1,
    hasMore: false,
  };
}
