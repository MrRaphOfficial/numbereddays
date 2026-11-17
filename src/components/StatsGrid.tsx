/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, Hourglass, Calendar, Compass, Timer, Activity } from "lucide-react";
import { TimeLivedStats } from "../types";

interface StatsGridProps {
  stats: TimeLivedStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const gridItems = [
    {
      id: "stats-months",
      label: "Months Lived",
      value: stats.totalMonths,
      icon: Calendar,
      description: "Complete lunar cycles",
    },
    {
      id: "stats-weeks",
      label: "Weeks Lived",
      value: stats.totalWeeks,
      icon: Compass,
      description: "Seven-day spans",
    },
    {
      id: "stats-days",
      label: "Days Lived",
      value: stats.totalDays,
      icon: Hourglass,
      description: "Earth rotations completed",
    },
    {
      id: "stats-hours",
      label: "Hours Lived",
      value: stats.totalHours,
      icon: Clock,
      description: "Elapsed hourly marks",
    },
    {
      id: "stats-minutes",
      label: "Minutes Lived",
      value: stats.totalMinutes,
      icon: Timer,
      description: "Sixty-second loops",
    },
    {
      id: "stats-seconds",
      label: "Seconds Lived",
      value: stats.totalSeconds,
      icon: Activity,
      description: "Live chronological ticker",
      isLive: true,
    },
  ];

  return (
    <div className="editorial-surface rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-5 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#D92D20] shrink-0" />
          <h3 className="text-base font-bold text-charcoal">
            Accumulated Numerical Metrics
          </h3>
        </div>
        <span className="text-xs text-slate-muted hidden sm:inline">
          Real-time chronological totals
        </span>
      </div>

      {/* Clean 2x3 / 3x2 Stat Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gridItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-4 flex flex-col justify-between transition-colors hover:border-[#D5CCC0]"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-muted truncate">
                  {item.label}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {item.isLive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  )}
                  <Icon className="w-4 h-4 text-[#D92D20]" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-charcoal tracking-tight tabular-nums truncate">
                  {item.value.toLocaleString()}
                </div>
                <p className="text-xs text-slate-muted mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
