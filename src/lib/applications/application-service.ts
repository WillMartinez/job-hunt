import { Application, ApplicationNote, ApplicationStats, ApplicationStatus } from "@/types/application";
import { Job } from "@/types/job";

const STORAGE_KEY = "job_hunt_applications";

export class ApplicationService {
  /**
   * Get all applications
   */
  static getApplications(): Application[] {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) return [];
      return JSON.parse(json);
    } catch (error) {
      console.error("Error loading applications:", error);
      return [];
    }
  }

  /**
   * Get a single application by ID
   */
  static getApplication(id: string): Application | null {
    const applications = this.getApplications();
    return applications.find((a) => a.id === id) || null;
  }

  /**
   * Create a new application from a Job
   */
  static createApplication(
    job: Job,
    status: ApplicationStatus = "saved"
  ): Application {
    const newApplication: Application = {
      id: this.generateId(),
      job,
      status,
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(status === "applied" ? { appliedAt: new Date().toISOString() } : {}),
    };
    const applications = this.getApplications();
    applications.push(newApplication);
    this.saveApplications(applications);
    return newApplication;
  }

  /**
   * Update application status and optional fields
   */
  static updateApplication(
    id: string,
    updates: Partial<Omit<Application, "id" | "createdAt">>
  ): Application | null {
    const applications = this.getApplications();
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) return null;

    // Auto-set appliedAt when transitioning to "applied"
    const wasApplied =
      updates.status === "applied" && !applications[index].appliedAt;

    applications[index] = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      ...(wasApplied ? { appliedAt: new Date().toISOString() } : {}),
    };

    this.saveApplications(applications);
    return applications[index];
  }

  /**
   * Delete an application
   */
  static deleteApplication(id: string): boolean {
    const applications = this.getApplications();
    const filtered = applications.filter((a) => a.id !== id);
    if (filtered.length === applications.length) return false;
    this.saveApplications(filtered);
    return true;
  }

  /**
   * Add a note to an application
   */
  static addNote(applicationId: string, content: string): Application | null {
    const application = this.getApplication(applicationId);
    if (!application) return null;

    const note: ApplicationNote = {
      id: this.generateId(),
      content,
      createdAt: new Date().toISOString(),
    };

    return this.updateApplication(applicationId, {
      notes: [...application.notes, note],
    });
  }

  /**
   * Get applications filtered by status
   */
  static getByStatus(status: ApplicationStatus): Application[] {
    return this.getApplications().filter((a) => a.status === status);
  }

  /**
   * Get aggregate stats for the dashboard
   */
  static getStats(): ApplicationStats {
    const applications = this.getApplications();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const byStatus = {
      saved: 0,
      applied: 0,
      "phone-screen": 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      withdrawn: 0,
    } as Record<ApplicationStatus, number>;

    let thisWeek = 0;
    let progressedCount = 0;
    let appliedCount = 0;

    for (const app of applications) {
      byStatus[app.status]++;
      if (app.appliedAt && new Date(app.appliedAt) >= weekAgo) thisWeek++;
      if (app.status === "applied" || app.status === "phone-screen" ||
          app.status === "interview" || app.status === "offer") appliedCount++;
      if (app.status === "phone-screen" || app.status === "interview" ||
          app.status === "offer") progressedCount++;
    }

    return {
      total: applications.length,
      bySatus: byStatus,
      thisWeek,
      responseRate:
        appliedCount > 0 ? Math.round((progressedCount / appliedCount) * 100) : 0,
    };
  }

  private static saveApplications(applications: Application[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error("Error saving applications:", error);
      throw new Error("Failed to save applications");
    }
  }

  private static generateId(): string {
    return `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
