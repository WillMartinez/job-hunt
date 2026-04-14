export interface Contact {
  id: string;
  name: string;
  headline?: string; // LinkedIn headline / job title
  company: string;
  linkedInUrl?: string;
  email?: string;
  notes?: string;
  addedAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ContactStats {
  total: number;
  withEmail: number;
  byCompany: Record<string, number>;
}
