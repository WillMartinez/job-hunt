"use client";

import { ApplicationStats } from "@/types/application";
import { Briefcase, CheckCircle, TrendingUp, Zap } from "lucide-react";

interface StatsBarProps {
  stats: ApplicationStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const cards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Applied This Week",
      value: stats.thisWeek,
      icon: Zap,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "In Interview Pipeline",
      value: (stats.bySatus?.["phone-screen"] ?? 0) + (stats.bySatus?.interview ?? 0),
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Response Rate",
      value: `${stats.responseRate}%`,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <div className={`${bg} ${color} p-1.5 rounded-lg`}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}
