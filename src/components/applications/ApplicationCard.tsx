"use client";

import { ApplicationService } from "@/lib/applications/application-service";
import { Application, ApplicationStatus } from "@/types/application";
import { Building2, ChevronDown, ExternalLink, MapPin, Trash2 } from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string }
> = {
  saved: { label: "Saved", color: "bg-gray-100 text-gray-700" },
  applied: { label: "Applied", color: "bg-blue-100 text-blue-700" },
  "phone-screen": { label: "Phone Screen", color: "bg-yellow-100 text-yellow-700" },
  interview: { label: "Interview", color: "bg-purple-100 text-purple-700" },
  offer: { label: "Offer 🎉", color: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-600" },
  withdrawn: { label: "Withdrawn", color: "bg-gray-100 text-gray-500" },
};

const STATUS_ORDER: ApplicationStatus[] = [
  "saved", "applied", "phone-screen", "interview", "offer", "rejected", "withdrawn"
];

interface ApplicationCardProps {
  application: Application;
  onUpdate: () => void;
}

export function ApplicationCard({ application, onUpdate }: ApplicationCardProps) {
  const { job, status, appliedAt, notes } = application;
  const config = STATUS_CONFIG[status];
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    ApplicationService.updateApplication(application.id, { status: newStatus });
    onUpdate();
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    ApplicationService.addNote(application.id, newNote.trim());
    setNewNote("");
    onUpdate();
  };

  const handleDelete = () => {
    if (confirm("Remove this application?")) {
      ApplicationService.deleteApplication(application.id);
      onUpdate();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} className="w-full h-full rounded-lg object-contain" />
            ) : (
              <Building2 className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-gray-900 text-sm truncate">{job.title}</h3>
            <p className="text-xs text-gray-500 truncate">{job.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={handleDelete} className="text-gray-300 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <MapPin className="w-3 h-3" />
        <span>{job.remote ? "Remote" : job.location}</span>
        {appliedAt && (
          <>
            <span>·</span>
            <span>Applied {new Date(appliedAt).toLocaleDateString()}</span>
          </>
        )}
      </div>

      {/* Status selector */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
              s === status
                ? STATUS_CONFIG[s].color + " ring-2 ring-offset-1 ring-current"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Notes toggle */}
      <button
        onClick={() => setShowNotes(!showNotes)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showNotes ? "rotate-180" : ""}`} />
        {notes.length} note{notes.length !== 1 ? "s" : ""}
      </button>

      {showNotes && (
        <div className="mt-3 space-y-2">
          {notes.map((note) => (
            <p key={note.id} className="text-xs text-gray-600 bg-gray-50 rounded p-2">
              {note.content}
              <span className="block text-gray-400 mt-1">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </p>
          ))}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a note…"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
              className="flex-1 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNote}
              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
