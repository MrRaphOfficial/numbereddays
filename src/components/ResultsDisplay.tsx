/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ClipboardCheck, Clipboard } from "lucide-react";
import { useState, useEffect } from "react";
import { AgeBreakdown } from "../types";

function CountUpNumber({ end, duration = 0.65 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const endValue = end;
    if (endValue === 0) {
      setCount(0);
      return;
    }

    const totalMs = duration * 1000;
    const frameTime = 16;
    const totalFrames = Math.max(1, Math.floor(totalMs / frameTime));
    const increment = endValue / totalFrames;
    let currentFrame = 0;

    const timer = setInterval(() => {
      currentFrame++;
      const currentVal = Math.floor(increment * currentFrame);
      if (currentFrame >= totalFrames || currentVal >= endValue) {
        clearInterval(timer);
        setCount(endValue);
      } else {
        setCount(currentVal);
      }
    }, frameTime);

    return () => clearInterval(timer);
  }, [end, duration]);

  return <span className="tabular-nums">{count}</span>;
}

interface ResultsDisplayProps {
  age: AgeBreakdown;
  activeName: string;
}

export default function ResultsDisplay({ age, activeName }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const text = `${
      activeName ? `${activeName}'s` : "My"
    } exact age is ${age.years} years, ${age.months} months, and ${
      age.days
    } days old! Calculated with Numbered Days.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const pronoun = activeName || "You";

  return (
    <div className="editorial-surface rounded-2xl p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E6E0D6]">
        <div>
          <h3 className="text-base font-bold text-charcoal">
            Exact Age Breakdown
          </h3>
          <p className="text-xs text-slate-muted">
            Calendar-precise years, months, and residual days
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal hover:bg-[#F4EFE6] flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          title="Copy age summary to clipboard"
          aria-label="Copy age summary to clipboard"
        >
          {copied ? (
            <>
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Copied</span>
            </>
          ) : (
            <>
              <Clipboard className="w-3.5 h-3.5 text-slate-muted" />
              <span>Copy Age</span>
            </>
          )}
        </button>
      </div>

      {/* Clean 3-column typographic metric strip without nested card boxes */}
      <div className="grid grid-cols-3 divide-x divide-[#E6E0D6] py-3">
        <div className="px-3 sm:px-5 text-center">
          <div
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-5xl font-bold text-[#D92D20] tracking-tight leading-none"
          >
            <CountUpNumber end={age.years} />
          </div>
          <p className="text-xs font-semibold text-charcoal mt-2">
            {age.years === 1 ? "Year" : "Years"}
          </p>
          <p className="text-[11px] text-slate-muted mt-0.5">
            {age.years === 1 ? "orbit completed" : "orbits completed"}
          </p>
        </div>

        <div className="px-3 sm:px-5 text-center">
          <div
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-5xl font-bold text-charcoal tracking-tight leading-none"
          >
            <CountUpNumber end={age.months} />
          </div>
          <p className="text-xs font-semibold text-charcoal mt-2">
            {age.months === 1 ? "Month" : "Months"}
          </p>
          <p className="text-[11px] text-slate-muted mt-0.5">elapsed</p>
        </div>

        <div className="px-3 sm:px-5 text-center">
          <div
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-5xl font-bold text-charcoal tracking-tight leading-none"
          >
            <CountUpNumber end={age.days} />
          </div>
          <p className="text-xs font-semibold text-charcoal mt-2">
            {age.days === 1 ? "Day" : "Days"}
          </p>
          <p className="text-[11px] text-slate-muted mt-0.5">residual</p>
        </div>
      </div>

      <p className="mt-5 pt-4 border-t border-[#E6E0D6] text-sm text-slate-muted leading-relaxed">
        <strong className="text-charcoal font-semibold">{pronoun}</strong>{" "}
        {age.years === 0 && age.months === 0 && age.days === 0
          ? "were born today!"
          : `have completed ${age.years} full ${
              age.years === 1 ? "year" : "years"
            }, ${age.months} ${age.months === 1 ? "month" : "months"}, and ${
              age.days
            } ${age.days === 1 ? "day" : "days"} on Earth.`}
      </p>
    </div>
  );
}
