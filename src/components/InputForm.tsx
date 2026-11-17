/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from "react";
import { Calendar, AlertCircle, ArrowRight } from "lucide-react";

interface InputFormProps {
  initialDob: string;
  initialTob: string;
  onCalculate: (dob: string, tob: string) => void;
  isLoading: boolean;
}

export default function InputForm({
  initialDob,
  initialTob,
  onCalculate,
  isLoading,
}: InputFormProps) {
  const [dob, setDob] = useState(initialDob);
  const [tob, setTob] = useState(initialTob);
  const [error, setError] = useState("");

  useEffect(() => {
    setDob(initialDob);
    setTob(initialTob);
  }, [initialDob, initialTob]);

  const todayString = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }

    const birthDateObj = new Date(dob);
    const currentDate = new Date();
    currentDate.setHours(23, 59, 59, 999);

    if (Number.isNaN(birthDateObj.getTime()) || birthDateObj > currentDate) {
      setError("Please choose a valid birth date in the past or today.");
      return;
    }

    onCalculate(dob, tob || "00:00");
  };

  return (
    <div className="editorial-surface rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] text-[#D92D20] flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-charcoal leading-tight">
            Birth Parameters
          </h2>
          <p className="text-xs text-slate-muted">
            Processed locally in memory
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="dob-input"
            className="block text-xs font-semibold text-charcoal"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob-input"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              setError("");
            }}
            max={todayString}
            className={`w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border bg-[#FAF8F5] text-charcoal outline-none transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-[#D92D20]/20 cursor-pointer ${
              error
                ? "border-rose-500 focus:border-rose-500"
                : "border-[#E6E0D6] focus:border-[#D92D20]"
            }`}
            required
            aria-required="true"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="tob-input"
            className="flex items-center justify-between text-xs font-semibold text-charcoal"
          >
            <span>Time of Birth</span>
            <span className="text-[11px] font-normal text-slate-muted">
              Optional · for live clock
            </span>
          </label>
          <input
            type="time"
            id="tob-input"
            value={tob}
            onChange={(e) => setTob(e.target.value)}
            className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal outline-none transition-colors focus:bg-white focus:border-[#D92D20] focus-visible:ring-2 focus-visible:ring-[#D92D20]/20 cursor-pointer"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <p className="leading-snug">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-5 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D92D20]"
          aria-label="Calculate exact age"
        >
          <span>{isLoading ? "Calculating..." : "Calculate Exact Age"}</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </form>
    </div>
  );
}
