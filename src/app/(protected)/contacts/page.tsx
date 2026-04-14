"use client";

import { ContactCard } from "@/components/contacts/ContactCard";
import { ContactService } from "@/lib/contacts/contact-service";
import { Contact } from "@/types/contact";
import { Building2, Plus, Upload, Users } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "", company: "", headline: "", email: "", linkedInUrl: "",
  });
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadContacts = useCallback(() => {
    setContacts(ContactService.getContacts());
  }, []);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    ContactService.createContact({
      name: newContact.name,
      company: newContact.company,
      headline: newContact.headline || undefined,
      email: newContact.email || undefined,
      linkedInUrl: newContact.linkedInUrl || undefined,
    });
    setNewContact({ name: "", company: "", headline: "", email: "", linkedInUrl: "" });
    setShowAdd(false);
    loadContacts();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const imported = ContactService.importFromLinkedInCSV(text);
      setImportStatus(`Imported ${imported.length} contacts`);
      loadContacts();
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  const filtered = search
    ? contacts.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
      )
    : contacts;

  const byCompany = ContactService.getByCompany();
  const topCompanies = Object.entries(byCompany)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Contacts</h1>
          <p className="text-gray-500 text-sm">
            Import your LinkedIn connections to find warm intros at target companies.
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import LinkedIn CSV
          </button>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ {importStatus}
        </div>
      )}

      {/* Add contact form */}
      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-gray-900 text-sm">New Contact</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {(["name", "company", "headline", "email", "linkedInUrl"] as const).map((field) => (
              <input
                key={field}
                placeholder={field === "linkedInUrl" ? "LinkedIn URL" : field.charAt(0).toUpperCase() + field.slice(1)}
                value={newContact[field]}
                onChange={(e) => setNewContact((prev) => ({ ...prev, [field]: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddContact}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top companies sidebar + contacts list */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar: top companies */}
        {topCompanies.length > 0 && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Top Companies
              </h3>
              <ul className="space-y-2">
                {topCompanies.map(([company, count]) => (
                  <li key={company} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate">{company}</span>
                    <span className="ml-2 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium shrink-0">
                      {count.length}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Contacts list */}
        <div className={topCompanies.length > 0 ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search contacts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No contacts yet.</p>
              <p className="text-sm text-gray-400">
                Export your connections from LinkedIn Settings → Data privacy → Get a copy of your data, then import the CSV here.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filtered.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onUpdate={loadContacts} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
