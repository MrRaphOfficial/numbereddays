/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Lock, FileText } from "lucide-react";

interface FooterProps {
  onOpenAbout: () => void;
}

export default function Footer({ onOpenAbout }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[#E6E0D6] bg-white py-6 px-4 sm:px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Left copyright & disclaimer notice */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-charcoal">
            Numbered Days &copy; {currentYear}
          </p>
          <p className="text-[11px] text-slate-muted">
            Zero data stored. No cookies, no database writes, no browser persistence. Entertainment parody only.
          </p>
        </div>

        {/* Interactive Policy & Disclaimer Buttons */}
        <div className="flex flex-wrap justify-center gap-4 text-[11px] font-medium text-slate-muted">
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-[#D92D20] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Lock className="w-3.5 h-3.5 text-[#D92D20]" />
            <span>Zero-Storage Policy</span>
          </button>
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-[#D92D20] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-[#D92D20]" />
            <span>Global Disclaimer</span>
          </button>
          <button
            type="button"
            onClick={onOpenAbout}
            className="hover:text-[#D92D20] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-[#D92D20]" />
            <span>Online Safety</span>
          </button>
        </div>

        {/* Right attribution & Free AI notice */}
        <div className="text-xs text-slate-muted font-medium flex flex-col sm:items-end gap-0.5">
          <span>
            Built by <strong className="text-[#D92D20] font-bold">@MrRaphOfficial</strong>
          </span>
                </div>
      </div>
    </footer>
  );
}
