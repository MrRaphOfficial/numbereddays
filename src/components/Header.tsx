/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Info, Clock, Search, User, LogOut, ShieldCheck, X, Sparkles } from "lucide-react";
import type { User as FirebaseUser } from "firebase/auth";

interface HeaderProps {
  onOpenAbout: () => void;
  onBrandClick?: () => void;
  isLiveTickerEnabled: boolean;
  onToggleLiveTicker: () => void;
  hasCalculation: boolean;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  googleUser: FirebaseUser | null;
  authLoading: boolean;
  authError: string;
  onGoogleSignIn: () => Promise<void>;
  onGoogleSignOut: () => Promise<void>;
  onUseGoogleNameInAudit?: () => void;
}

export default function Header({
  onOpenAbout,
  onBrandClick,
  isLiveTickerEnabled,
  onToggleLiveTicker,
  hasCalculation,
  searchQuery,
  onSearchChange,
  googleUser,
  authLoading,
  authError,
  onGoogleSignIn,
  onGoogleSignOut,
  onUseGoogleNameInAudit,
}: HeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvatarLoadError(false);
  }, [googleUser?.photoURL]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const userInitial = (googleUser?.displayName || googleUser?.email || "G")
    .charAt(0)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E6E0D6] px-4 sm:px-6">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Brand */}
        <button
          type="button"
          onClick={onBrandClick}
          className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
          title="Return to All Pins"
        >
          <div className="w-9 h-9 rounded-xl bg-[#D92D20] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-[#B42318] transition-colors shrink-0">
            N
          </div>
          <div className="hidden xs:block">
            <h1
              id="brand-logo"
              style={{ fontFamily: "var(--font-display)" }}
              className="text-base sm:text-lg font-bold tracking-tight text-charcoal leading-none whitespace-nowrap"
            >
              Numbered Days
            </h1>
            <p className="text-[11px] font-medium text-slate-muted leading-none mt-1 whitespace-nowrap">
              Expectations Ledger
            </p>
          </div>
        </button>

        {/* Center Live Filter Search Box */}
        <div className="flex-grow max-w-md mx-2 hidden md:block">
          <div className="relative w-full flex items-center text-slate-muted">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value.slice(0, 50))}
              placeholder={
                hasCalculation
                  ? "Filter boards or milestones (seconds, zodiac, birthday)..."
                  : "Filter views or enter birthdate below..."
              }
              aria-label="Filter milestones or boards"
              className="w-full text-[13px] font-medium pl-10 pr-8 py-2 rounded-xl bg-[#FAF8F5] text-charcoal placeholder-slate-muted/80 border border-[#E6E0D6] focus:border-[#D92D20] focus:bg-white outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 p-1 rounded-lg hover:bg-black/5 text-slate-muted cursor-pointer"
                aria-label="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Controls & Google Sign-In */}
        <div className="flex items-center gap-2 shrink-0">
          {hasCalculation && (
            <button
              id="btn-toggle-live"
              type="button"
              onClick={onToggleLiveTicker}
              className={`text-xs font-semibold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border cursor-pointer whitespace-nowrap shrink-0 ${
                isLiveTickerEnabled
                  ? "bg-[#D92D20] text-white border-[#D92D20] hover:bg-[#B42318]"
                  : "bg-[#FAF8F5] hover:bg-[#F4EFE6] text-charcoal border-[#E6E0D6]"
              }`}
              title="Toggle Live Real-Time Ticker"
              aria-label="Toggle Live Real-Time Ticker"
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {isLiveTickerEnabled ? "Live Clock" : "Static Clock"}
              </span>
            </button>
          )}

          <button
            id="btn-about-info"
            type="button"
            onClick={onOpenAbout}
            className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E6E0D6] text-charcoal transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0"
            title="Methodology, Safety & Disclaimer"
            aria-label="Show Methodology, Safety & Disclaimer"
          >
            <Info className="w-3.5 h-3.5 text-slate-muted shrink-0" />
            <span className="hidden sm:inline">Methodology</span>
          </button>

          {/* Interactive Google Profile Trigger & Popover */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              id="btn-google-profile"
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              disabled={authLoading}
              className={`h-9 rounded-xl flex items-center gap-2 transition-colors cursor-pointer border whitespace-nowrap shrink-0 ${
                googleUser
                  ? "pl-1.5 pr-3 bg-white hover:bg-[#FAF8F5] border-[#E6E0D6] text-charcoal"
                  : "px-3 bg-[#181615] hover:bg-[#2E2A27] text-white border-[#181615]"
              }`}
              title={
                googleUser
                  ? `Signed in as ${googleUser.displayName || "Google User"}`
                  : "Sign in with Google (Session-Only)"
              }
              aria-label="Profile and Google Sign-In"
              aria-expanded={isProfileMenuOpen}
            >
              {googleUser ? (
                <>
                  {googleUser.photoURL && !avatarLoadError ? (
                    <img
                      src={googleUser.photoURL}
                      alt={googleUser.displayName || "Profile"}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarLoadError(true)}
                      className="w-6 h-6 rounded-lg object-cover border border-[#E6E0D6]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-[#D92D20] text-white flex items-center justify-center text-xs font-bold">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-charcoal max-w-[90px] truncate hidden sm:inline">
                    {googleUser.displayName?.split(" ")[0] || "Profile"}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {authLoading ? "Connecting..." : "Google Sign-In"}
                  </span>
                </>
              )}
            </button>

            {isProfileMenuOpen && (
              <div
                role="dialog"
                aria-label="Google Profile Menu"
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E6E0D6] shadow-xl p-4 space-y-3 z-50"
              >
                {googleUser ? (
                  <>
                    <div className="flex items-center gap-3 pb-3 border-b border-[#E6E0D6]">
                      {googleUser.photoURL && !avatarLoadError ? (
                        <img
                          src={googleUser.photoURL}
                          alt={googleUser.displayName || "Profile"}
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarLoadError(true)}
                          className="w-10 h-10 rounded-xl object-cover border border-[#E6E0D6] shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#D92D20] text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-charcoal truncate">
                          {googleUser.displayName || "Google User"}
                        </p>
                        <p className="text-[11px] text-slate-muted truncate">
                          {googleUser.email || "Session authenticated"}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-start gap-2 text-[11px] text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">
                        <strong>Zero-Storage Active:</strong> Your Google session stays in RAM only and clears when you sign out or refresh.
                      </span>
                    </div>

                    {hasCalculation && onUseGoogleNameInAudit && (
                      <button
                        type="button"
                        onClick={() => {
                          onUseGoogleNameInAudit();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E6E0D6] text-charcoal text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D92D20]" />
                        <span>Personalize Active Board Name</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        await onGoogleSignOut();
                        setIsProfileMenuOpen(false);
                      }}
                      disabled={authLoading}
                      className="w-full py-2 px-3 rounded-xl bg-[#181615] hover:bg-[#2E2A27] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out &amp; Clear Session</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-charcoal">
                        Profile Sign-In (Google)
                      </h3>
                      <p className="text-[11px] text-slate-muted leading-relaxed">
                        Sign in with your Google account to personalize your session name for Dads Expectation.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-start gap-2 text-[11px] text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">
                        <strong>No Data Stored:</strong> Zero database writes, cookies, or browser storage. Everything vanishes when you leave.
                      </span>
                    </div>

                    {authError && (
                      <p className="text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-2">
                        {authError}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        await onGoogleSignIn();
                      }}
                      disabled={authLoading}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#181615] hover:bg-[#2E2A27] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                        />
                      </svg>
                      <span>{authLoading ? "Signing in..." : "Continue with Google"}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
