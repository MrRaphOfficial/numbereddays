/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Info } from "lucide-react";

interface GlobalDisclaimerProps {
  onOpenDetails: () => void;
}

export default function GlobalDisclaimer({ onOpenDetails }: GlobalDisclaimerProps) {
  return (
    <div
      role="region"
      aria-label="Global Disclaimer and Privacy Notice"
      className="w-full bg-[#181615] text-white border-b border-white/10 px-4 py-2 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] leading-snug">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 hidden xs:block" />
          <p className="text-white/90 font-medium">
            <span className="font-bold text-white uppercase tracking-wider mr-1.5">
              Disclaimer:
            </span>
            &ldquo;Dad&rsquo;s Expectations Checker&rdquo; is satirical Free AI entertainment only—not real advice.{" "}
            <span className="text-emerald-300 font-semibold">
              Zero Data Stored:
            </span>{" "}
            All calculations &amp; Google Sign-In stay strictly in-memory for your active session; nothing is saved to any database, cookies, or browser storage.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDetails}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
        >
          <Info className="w-3 h-3" />
          <span>Safety &amp; Privacy</span>
        </button>
      </div>
    </div>
  );
}
