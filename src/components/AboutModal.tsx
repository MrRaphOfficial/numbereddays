/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Sparkles, AlertCircle, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#181615]/45 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            id="about-modal-box"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-modal-title"
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#E6E0D6] p-6 sm:p-8 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-muted hover:text-charcoal hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              aria-label="Close dialogue"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E6E0D6] text-[#D92D20]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2
                id="about-modal-title"
                style={{ fontFamily: "var(--font-display)" }}
                className="text-xl font-bold text-charcoal"
              >
                Methodology, Safety &amp; Disclaimer
              </h2>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-sm text-slate-muted leading-relaxed">
              <p>
                Welcome to <strong className="text-charcoal">Numbered Days</strong>. All temporal calculations follow strict calendar precision locally in your browser.
              </p>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-2">
                <h3 className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero-Storage &amp; Online Safety Guarantee
                </h3>
                <ul className="text-xs text-emerald-900/90 space-y-1.5 list-disc pl-4">
                  <li>
                    <strong>No Data Stored:</strong> Your birthdates, profiles, and chat messages are never written to any database, cookies, <code>localStorage</code>, or <code>IndexedDB</code>.
                  </li>
                  <li>
                    <strong>Google Sign-In Privacy:</strong> Profile login uses strictly in-memory authentication (<code>inMemoryPersistence</code>). Signing out or closing the tab clears your session immediately.
                  </li>
                  <li>
                    <strong>Free Zero-Config AI:</strong> &ldquo;Dad&rsquo;s Expectations Checker&rdquo; and &ldquo;Dads Expectation&rdquo; run via server-side free-tier AI requiring no API keys or setup from you, with sanitized requests and rate-limited endpoints.
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 space-y-1.5">
                <h3 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4 text-amber-700" />
                  Global Entertainment Disclaimer
                </h3>
                <p className="text-xs text-amber-900/90">
                  &ldquo;Dad&rsquo;s Expectations Checker&rdquo; and &ldquo;Dads Expectation&rdquo; are satirical, comedic AI personas created strictly for entertainment and lighthearted motivation. Outputs do not constitute professional, career, financial, psychological, or medical advice.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D6] space-y-2">
                <h3 className="font-semibold text-charcoal flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-[#D92D20]" />
                  Leap Years &amp; Calendar Precision
                </h3>
                <p className="text-xs">
                  Months vary from 28 to 31 days. When subtracting birthdates, exact preceding month lengths are borrowed rather than using rough 30.4-day approximations. February 29 birthdays project onto February 28 in non-leap years.
                </p>
              </div>

              <div className="border-t border-[#E6E0D6] pt-3 flex items-center justify-between text-xs text-slate-muted font-mono">
                <span>Numbered Days</span>
                <span>
                  Built by <strong className="text-[#D92D20]">@MrRaphOfficial</strong>
                </span>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-5 rounded-xl bg-[#181615] hover:bg-[#2E2A27] text-white font-semibold transition-colors text-sm cursor-pointer"
              >
                Back to Numbered Days
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
