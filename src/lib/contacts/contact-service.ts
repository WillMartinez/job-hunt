import { Contact, ContactStats } from "@/types/contact";

const STORAGE_KEY = "job_hunt_contacts";

export class ContactService {
  static getContacts(): Contact[] {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (!json) return [];
      return JSON.parse(json);
    } catch (error) {
      console.error("Error loading contacts:", error);
      return [];
    }
  }

  static getContact(id: string): Contact | null {
    return this.getContacts().find((c) => c.id === id) || null;
  }

  static createContact(
    data: Omit<Contact, "id" | "addedAt" | "updatedAt">
  ): Contact {
    const contact: Contact = {
      ...data,
      id: this.generateId(),
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const contacts = this.getContacts();
    contacts.push(contact);
    this.saveContacts(contacts);
    return contact;
  }

  static updateContact(
    id: string,
    updates: Partial<Omit<Contact, "id" | "addedAt">>
  ): Contact | null {
    const contacts = this.getContacts();
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return null;
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveContacts(contacts);
    return contacts[index];
  }

  static deleteContact(id: string): boolean {
    const contacts = this.getContacts();
    const filtered = contacts.filter((c) => c.id !== id);
    if (filtered.length === contacts.length) return false;
    this.saveContacts(filtered);
    return true;
  }

  /**
   * Import contacts from LinkedIn CSV export
   * LinkedIn CSV format: First Name, Last Name, Email Address, Company, Position, Connected On, Profile URL
   */
  static importFromLinkedInCSV(csvText: string): Contact[] {
    const lines = csvText.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
    const imported: Contact[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });

      const firstName = row["First Name"] || "";
      const lastName = row["Last Name"] || "";
      const name = `${firstName} ${lastName}`.trim();
      if (!name) continue;

      const contact = this.createContact({
        name,
        company: row["Company"] || "",
        headline: row["Position"] || undefined,
        email: row["Email Address"] || undefined,
        linkedInUrl: row["Profile URL"] || undefined,
      });
      imported.push(contact);
    }

    return imported;
  }

  /**
   * Get contacts grouped by company — useful for finding warm connections at target companies
   */
  static getByCompany(): Record<string, Contact[]> {
    const contacts = this.getContacts();
    return contacts.reduce<Record<string, Contact[]>>((acc, contact) => {
      const company = contact.company || "Unknown";
      if (!acc[company]) acc[company] = [];
      acc[company].push(contact);
      return acc;
    }, {});
  }

  static getStats(): ContactStats {
    const contacts = this.getContacts();
    const byCompany: Record<string, number> = {};
    let withEmail = 0;

    for (const c of contacts) {
      if (c.email) withEmail++;
      const company = c.company || "Unknown";
      byCompany[company] = (byCompany[company] || 0) + 1;
    }

    return { total: contacts.length, withEmail, byCompany };
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  private static saveContacts(contacts: Contact[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error("Error saving contacts:", error);
      throw new Error("Failed to save contacts");
    }
  }

  private static generateId(): string {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
