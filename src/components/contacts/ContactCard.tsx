"use client";

import { ContactService } from "@/lib/contacts/contact-service";
import { Contact } from "@/types/contact";
import { Building2, ExternalLink, Mail, Trash2 } from "lucide-react";

interface ContactCardProps {
  contact: Contact;
  onUpdate: () => void;
}

export function ContactCard({ contact, onUpdate }: ContactCardProps) {
  const handleDelete = () => {
    if (confirm(`Remove ${contact.name}?`)) {
      ContactService.deleteContact(contact.id);
      onUpdate();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-semibold text-blue-700 text-sm">
          {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
            <Building2 className="w-3 h-3 shrink-0" />
            {contact.company}
            {contact.headline && ` · ${contact.headline}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title={contact.email}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}
        {contact.linkedInUrl && (
          <a
            href={contact.linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={handleDelete}
          className="text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
