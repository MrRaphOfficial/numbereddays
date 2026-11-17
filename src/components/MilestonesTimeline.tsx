/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Award,
  CheckCircle2,
  Circle,
  CalendarRange,
  Timer,
  Sun,
  Map,
  Moon,
  Cake,
} from "lucide-react";
import { LifeMilestone } from "../types";

interface MilestonesTimelineProps {
  milestones: LifeMilestone[];
}

export default function MilestonesTimeline({ milestones }: MilestonesTimelineProps) {
  const [filter, setFilter] = useState<"all" | "reached" | "upcoming">("all");

  const filteredMilestones = milestones
    .filter((ms) => {
      if (filter === "reached") return ms.reached;
      if (filter === "upcoming") return !ms.reached;
      return true;
    })
    .sort((a, b) => {
      if (a.reached && b.reached) {
        return Math.abs(a.daysToOrAgo) - Math.abs(b.daysToOrAgo);
      }
      if (!a.reached && !b.reached) {
        return a.daysToOrAgo - b.daysToOrAgo;
      }
      return a.reached ? -1 : 1;
    });

  const renderUnitIcon = (unit: string) => {
    switch (unit) {
      case "seconds":
        return <Timer className="w-4 h-4 text-[#D92D20]" />;
      case "days":
        return <Sun className="w-4 h-4 text-[#D92D20]" />;
      case "weeks":
        return <Map className="w-4 h-4 text-[#D92D20]" />;
      case "months":
        return <Moon className="w-4 h-4 text-[#D92D20]" />;
      default:
        return <Cake className="w-4 h-4 text-[#D92D20]" />;
    }
  };

  return (
    <div className="editorial-surface rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-5 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#D92D20] shrink-0" />
          <div>
            <h3 className="text-base font-bold text-charcoal">
              Chronological Milestones Path
            </h3>
          </div>
        </div>

        {/* Segmented Filter */}
        <div
          role="group"
          aria-label="Filter milestones by status"
          className="inline-flex bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-1 shrink-0 self-start sm:self-auto"
        >
          {(["all", "reached", "upcoming"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === mode
                  ? "bg-[#181615] text-white"
                  : "text-slate-muted hover:text-charcoal"
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-[#E6E0D6] ml-3 pl-5 space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredMilestones.length === 0 ? (
          <div className="py-12 text-center text-slate-muted border border-dashed border-[#E6E0D6] rounded-xl bg-[#FAF8F5]">
            <CalendarRange className="w-7 h-7 mx-auto stroke-[1.5] text-slate-muted/60 mb-2" />
            <p className="text-xs font-medium">
              No milestones match the active filter.
            </p>
          </div>
        ) : (
          filteredMilestones.map((ms) => (
            <div key={ms.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[29px] top-4 z-10 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-white">
                {ms.reached ? (
                  <CheckCircle2 className="w-4 h-4 text-[#D92D20]" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-[#BEB5AA]" />
                )}
              </div>

              <div
                className={`p-3.5 rounded-xl border transition-colors ${
                  ms.reached
                    ? "bg-[#FAF8F5] border-[#E6E0D6]"
                    : "bg-white border-[#E6E0D6] hover:border-[#D5CCC0]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center shrink-0">
                      {renderUnitIcon(ms.unit)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-charcoal truncate">
                        {ms.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-muted font-mono tabular-nums">
                        <span>{ms.targetDate}</span>
                        <span>·</span>
                        <span className="text-charcoal font-medium">
                          {ms.valueStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 pl-11 sm:pl-0">
                    {ms.reached ? (
                      <span className="text-xs font-semibold text-emerald-700">
                        Completed
                      </span>
                    ) : (
                      <div className="font-mono tabular-nums">
                        <span className="text-xs font-semibold text-[#D92D20] block">
                          {ms.daysToOrAgo.toLocaleString()} days left
                        </span>
                        <span className="text-[11px] text-slate-muted block">
                          ~{(ms.daysToOrAgo / 365).toFixed(1)} years
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
