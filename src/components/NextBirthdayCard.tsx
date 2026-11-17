/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gift, CalendarDays } from "lucide-react";
import { NextBirthdayCountdown } from "../types";

interface NextBirthdayCardProps {
  countdown: NextBirthdayCountdown;
  birthDate: Date;
  onShareBirthday?: () => void;
}

export default function NextBirthdayCard({
  countdown,
  birthDate,
}: NextBirthdayCardProps) {
  const today = new Date();
  const nextYear = today.getFullYear();
  let cdTarget = new Date(nextYear, birthDate.getMonth(), birthDate.getDate());
  if (cdTarget.getTime() < today.getTime()) {
    cdTarget.setFullYear(nextYear + 1);
  }

  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    const isLeapYear = (year: number) =>
      (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    if (!isLeapYear(cdTarget.getFullYear())) {
      cdTarget = new Date(cdTarget.getFullYear(), 1, 28);
    }
  }

  const formattedDate = cdTarget.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.max(0, Math.min(100, countdown.percentageRemaining));
  const strokeDashoffset =
    circumference - (clampedPercent / 100) * circumference;

  const isBirthdayToday = countdown.months === 0 && countdown.days === 0;

  return (
    <div className="editorial-surface rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-5 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2 min-w-0">
          <Gift className="w-4 h-4 text-[#D92D20] shrink-0" />
          <h3 className="text-base font-bold text-charcoal truncate">
            Next Birthday Countdown
          </h3>
        </div>
        <span className="text-xs font-mono font-semibold text-[#D92D20] shrink-0">
          {countdown.dayOfWeek}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial Progress Meter */}
        <div className="relative shrink-0 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[#EFEAE2] fill-none"
              strokeWidth="6"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-[#D92D20] fill-none transition-all duration-500"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {isBirthdayToday ? (
              <div>
                <p className="text-xs font-bold text-[#D92D20] uppercase tracking-wide">
                  Today
                </p>
                <Gift className="w-4 h-4 mx-auto text-[#D92D20] mt-0.5" />
              </div>
            ) : (
              <div>
                <span
                  style={{ fontFamily: "var(--font-display)" }}
                  className="text-2xl font-bold text-charcoal leading-none tabular-nums"
                >
                  {Math.round(clampedPercent)}%
                </span>
                <span className="text-[10px] font-medium text-slate-muted block mt-1">
                  Remaining
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Date & Breakdown */}
        <div className="flex-1 w-full text-center sm:text-left space-y-3.5">
          <div>
            <p className="text-[11px] font-medium text-slate-muted">
              Next Celebration
            </p>
            <p className="text-sm sm:text-base font-bold text-charcoal flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <CalendarDays className="w-4 h-4 text-[#D92D20] shrink-0" />
              <span>{formattedDate}</span>
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Months", value: countdown.months, accent: true },
              { label: "Days", value: countdown.days, accent: false },
              { label: "Hours", value: countdown.hours, accent: false },
              { label: "Mins", value: countdown.minutes, accent: false },
            ].map((cell) => (
              <div
                key={cell.label}
                className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl py-2 px-1"
              >
                <span
                  className={`block font-mono font-bold text-sm sm:text-base tabular-nums ${
                    cell.accent ? "text-[#D92D20]" : "text-charcoal"
                  }`}
                >
                  {cell.value}
                </span>
                <span className="text-[10px] text-slate-muted font-medium">
                  {cell.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 pt-3.5 border-t border-[#E6E0D6] text-xs text-slate-muted">
        {isBirthdayToday
          ? "Happy Birthday — enjoy your new orbit around the sun."
          : `Your next birthday lands on a ${countdown.dayOfWeek}.`}
      </p>
    </div>
  );
}
