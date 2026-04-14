"use client";

import { useJobs } from "@/lib/jobs/job-context";
import { ApplicationService } from "@/lib/applications/application-service";
import { Job } from "@/types/job";
import { Bookmark, BookmarkCheck, Building2, Clock, ExternalLink, MapPin, Tag } from "lucide-react";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const SOURCE_LABELS: Record<string, string> = {
  remotive: "Remotive",
  themuse: "The Muse",
  linkedin: "LinkedIn",
  manual: "Manual",
};

export function JobCard({ job, onApply }: JobCardProps) {
  const { saveJob, unsaveJob, isJobSaved } = useJobs();
  const saved = isJobSaved(job.id);
  const [tracked, setTracked] = useState(false);

  const handleSave = () => {
    if (saved) unsaveJob(job.id); else saveJob(job);
  };

  const handleTrackApplication = () => {
    ApplicationService.createApplication(job, "applied");
    setTracked(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="w-10 h-10 rounded-lg object-contain border border-gray-100 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
            <p className="text-sm text-gray-600 truncate">{job.company}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
          title={saved ? "Unsave" : "Save job"}
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {job.remote ? "Remote" : job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(job.postedAt)}
        </span>
        <span className="capitalize text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {job.jobType}
        </span>
        {job.salary?.min && (
          <span className="text-green-700 font-medium text-xs">
            {job.salary.currency ?? "$"}{(job.salary.min / 1000).toFixed(0)}k
            {job.salary.max && job.salary.max !== job.salary.min
              ? `–${(job.salary.max / 1000).toFixed(0)}k`
              : ""}
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Source badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          via {SOURCE_LABELS[job.source] ?? job.source}
        </span>

        <div className="flex items-center gap-2">
          {tracked ? (
            <span className="text-xs text-green-700 font-medium">✓ Tracked</span>
          ) : (
            <button
              onClick={handleTrackApplication}
              className="text-xs text-gray-600 hover:text-blue-700 font-medium transition-colors"
            >
              + Track
            </button>
          )}
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
