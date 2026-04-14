import { Job } from "./job";

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "phone-screen"
  | "interview"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string; // ISO string
}

export interface Application {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt?: string; // ISO string — when actually submitted
  notes: ApplicationNote[];
  resumeVersion?: string; // label for which resume version was used
  coverLetter?: string;
  contactName?: string; // internal contact at company
  contactLinkedIn?: string;
  nextFollowUpAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ApplicationStats {
  total: number;
  bySatus: Record<ApplicationStatus, number>;
  thisWeek: number;
  responseRate: number; // percentage of applied → phone-screen or beyond
}
