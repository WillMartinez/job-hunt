"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { Briefcase, LayoutDashboard, LogOut, Search, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Find Jobs", icon: Search },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/contacts", label: "Contacts", icon: Users },
];

export function Header() {
  const { userEmail, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Job Hunt</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="text-sm text-gray-500 hidden sm:block">
                {userEmail}
              </span>
            )}
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden border-t border-gray-100 flex">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
              pathname === href
                ? "text-blue-700"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
