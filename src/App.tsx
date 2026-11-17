/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  MessageSquare,
  History,
  Compass,
  Target,
  LayoutGrid,
  Sparkles,
  RefreshCw,
  ArrowRight,
  SlidersHorizontal,
  SearchX,
} from "lucide-react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

import Header from "./components/Header";
import GlobalDisclaimer from "./components/GlobalDisclaimer";
import AboutModal from "./components/AboutModal";
import InputForm from "./components/InputForm";
import HistorySystem from "./components/HistorySystem";
import ResultsDisplay from "./components/ResultsDisplay";
import NextBirthdayCard from "./components/NextBirthdayCard";
import StatsGrid from "./components/StatsGrid";
import ZodiacDetails from "./components/ZodiacDetails";
import MilestonesTimeline from "./components/MilestonesTimeline";
import ExpectationDadChat from "./components/ExpectationDadChat";
import Footer from "./components/Footer";
import SafeIllustration from "./components/SafeIllustration";

import heroIllustration from "./assets/images/numbered_days_hero_1794920319800.jpg";
import dadPortrait from "./assets/images/dad_expectations_avatar_1794920321125.jpg";
import cosmosIllustration from "./assets/images/cosmos_milestones_spot_1794920320462.jpg";

import { auth, signInWithGoogle, signOutGoogle, testConnection } from "./firebase";
import { SavedProfile } from "./types";
import {
  parseBirthDateTime,
  calculateAgeBreakdown,
  calculateTimeLivedStats,
  getZodiacInfo,
  calculateNextBirthday,
  getLifeMilestones,
} from "./utils/ageCalculator";

interface DadPreviewSlide {
  age: number;
  text: string;
  hope: string;
  isAiGenerated?: boolean;
}

const DEFAULT_SAMPLES: SavedProfile[] = [
  {
    id: "seed-profile-1",
    name: "Ada Lovelace",
    dateOfBirth: "1815-12-10",
    timeOfBirth: "13:00",
    relation: "Other",
    avatarStyle: 4,
  },
  {
    id: "seed-profile-2",
    name: "Albert Einstein",
    dateOfBirth: "1879-03-14",
    timeOfBirth: "11:30",
    relation: "Other",
    avatarStyle: 2,
  },
];

const INITIAL_PREVIEW_JOKES: DadPreviewSlide[] = [
  {
    age: 21,
    text: "Only 21? Why you no manager yet? When I was 21, I led 4 global companies and climbed Mount Everest with a heavy backpack and only one shoe!",
    hope: "In any case, you've got a brilliant spark of hope. Go conquer your doubts!",
  },
  {
    age: 25,
    text: "Only 25? Back in my day, your cousin Timmy already bought 3 cloud hosting centers and was coding with his feet on a broken unicycle while fighting off tigers!",
    hope: "But hey, you are extremely clever. Put down the phone, trust yourself and start your empire!",
  },
  {
    age: 18,
    text: "Only 18? At your age, I was already paying taxes, running a delivery fleet, and walking up mountains backwards in the freezing rain to get to school!",
    hope: "Still, you have raw tenacity. 98% of your days are ahead of you, go make them count!",
  },
  {
    age: 30,
    text: "Only 30? When I was 30, I had already retired from corporate life twice, bought three houses, and established a local library in my garage with my bare hands!",
    hope: "But that being said, you are in your prime. There is plenty of time to turn potential into power!",
  },
  {
    age: 40,
    text: "Only 40? At 40, your aunt was a world-class neurosurgeon, held six patents, and still coached three little league soccer teams after cooking family dinner!",
    hope: "But I guess you have a resilient heart. Step up your game, I am quietly backing you all the way!",
  },
];

type BoardFilter = "all" | "input" | "audit" | "stats" | "stars" | "timeline";

const BOARD_TABS: {
  id: BoardFilter;
  label: string;
  icon: typeof LayoutGrid;
  summary: string;
}[] = [
  {
    id: "all",
    label: "All Pins",
    icon: LayoutGrid,
    summary: "Complete temporal overview across every card and audit.",
  },
  {
    id: "input",
    label: "Temporal Input",
    icon: History,
    summary: "Enter birth parameters or switch between temporary session profiles.",
  },
  {
    id: "audit",
    label: "Dad's Life Audit",
    icon: MessageSquare,
    summary: "Free AI life audit and interactive conversation with Dads Expectation.",
  },
  {
    id: "stats",
    label: "Numerical Metrics",
    icon: Target,
    summary: "Live biological totals in months, weeks, days, hours, minutes, and seconds.",
  },
  {
    id: "stars",
    label: "Sun & Stars",
    icon: Compass,
    summary: "Western zodiac, lunar animal cycle, birthstone, and next birthday countdown.",
  },
  {
    id: "timeline",
    label: "Milestones Path",
    icon: Award,
    summary: "Completed and upcoming life checkpoints on your chronological timeline.",
  },
];

function getSampleDobForAge(age: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - age);
  return d.toISOString().split("T")[0];
}

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Google Auth State (strictly in-memory session; zero storage)
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Live real-time ticker toggle
  const [isLiveTickerEnabled, setIsLiveTickerEnabled] = useState(true);

  // Active board filtering & search filter
  const [activeBoard, setActiveBoard] = useState<BoardFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Time reference (updated every second if live ticker is active)
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Input states synchronized (memory only)
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("00:00");

  // Session-only quick profiles (never written to localStorage or any database)
  const [profiles, setProfiles] = useState<SavedProfile[]>(DEFAULT_SAMPLES);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Selected parameters for active calculations (memory only)
  const [activeCalculation, setActiveCalculation] = useState<{
    dob: string;
    tob: string;
    profileName: string;
  } | null>(null);

  // Dynamic Dad Onboarding Checker slides
  const [previewSlides, setPreviewSlides] = useState<DadPreviewSlide[]>(INITIAL_PREVIEW_JOKES);
  const [previewJokeIndex, setPreviewJokeIndex] = useState(0);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewNotice, setPreviewNotice] = useState("");

  // 1. Purge any legacy browser storage & connect in-memory auth listener
  useEffect(() => {
    try {
      localStorage.removeItem("aera_profiles");
    } catch {
      // Ignore storage access errors in restricted contexts
    }

    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Ticker Interval Clock
  useEffect(() => {
    if (!isLiveTickerEnabled || !activeCalculation) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isLiveTickerEnabled, activeCalculation]);

  // 2.5 Rotating Onboarding Carousel
  useEffect(() => {
    const previewInterval = setInterval(() => {
      setPreviewJokeIndex((prev) => (prev + 1) % previewSlides.length);
    }, 5500);
    return () => clearInterval(previewInterval);
  }, [previewSlides.length]);

  // Google Sign-In / Sign-Out handlers (in-memory only)
  const handleGoogleSignIn = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setGoogleUser(user);
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/popup-closed-by-user") {
        setAuthError("Sign-in popup was closed before completing.");
      } else if (code === "auth/popup-blocked") {
        setAuthError("Popup was blocked by your browser. Please allow popups for this site.");
      } else {
        setAuthError("Unable to complete Google Sign-In right now. Please try again.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    setAuthError("");
    setAuthLoading(true);
    try {
      await signOutGoogle();
      setGoogleUser(null);
      if (activeCalculation && !activeProfileId) {
        setActiveCalculation({ ...activeCalculation, profileName: "You" });
      }
    } catch {
      setAuthError("Unable to sign out right now.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUseGoogleNameInAudit = () => {
    if (!googleUser?.displayName || !activeCalculation) return;
    const safeName = googleUser.displayName.replace(/[<>]/g, "").trim().slice(0, 40);
    if (safeName) {
      setActiveProfileId(null);
      setActiveCalculation({ ...activeCalculation, profileName: safeName });
    }
  };

  // Free AI Live Preview Audit generator (no API key or user config required)
  const handleGenerateAiPreview = async () => {
    if (isGeneratingPreview) return;
    setIsGeneratingPreview(true);
    setPreviewNotice("");

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 18000);

    try {
      const res = await fetch("/api/preview-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({}),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.text || !data?.hope) {
        throw new Error(data?.error || "Free AI preview is temporarily busy.");
      }

      const freshSlide: DadPreviewSlide = {
        age: Number(data.age) || 25,
        text: String(data.text),
        hope: String(data.hope),
        isAiGenerated: true,
      };

      setPreviewSlides((prev) => [freshSlide, ...prev.slice(0, 6)]);
      setPreviewJokeIndex(0);
    } catch (err) {
      setPreviewNotice(
        err instanceof Error && err.name === "AbortError"
          ? "Preview request timed out. Showing rotating audits."
          : err instanceof Error
            ? err.message
            : "Free AI preview is temporarily busy."
      );
    } finally {
      window.clearTimeout(timeoutId);
      setIsGeneratingPreview(false);
    }
  };

  // 3. Main actions (all strictly in-memory)
  const handleCalculate = (dobVal: string, tobVal: string, overrideName?: string) => {
    setDob(dobVal);
    setTob(tobVal);

    const matchingProfile = profiles.find(
      (p) =>
        p.dateOfBirth === dobVal &&
        (p.timeOfBirth === tobVal || (!p.timeOfBirth && tobVal === "00:00"))
    );

    const googleFallbackName = googleUser?.displayName
      ? googleUser.displayName.replace(/[<>]/g, "").trim().slice(0, 40)
      : "You";

    setActiveCalculation({
      dob: dobVal,
      tob: tobVal || "00:00",
      profileName: overrideName || (matchingProfile ? matchingProfile.name : googleFallbackName),
    });

    setCurrentTime(new Date());
  };

  const handleSelectProfile = (profile: SavedProfile) => {
    setDob(profile.dateOfBirth);
    setTob(profile.timeOfBirth || "00:00");
    setActiveProfileId(profile.id);
    handleCalculate(profile.dateOfBirth, profile.timeOfBirth || "00:00", profile.name);
  };

  const handleAddProfile = (newProfileData: Omit<SavedProfile, "id">) => {
    const id = `profile-${Date.now()}`;
    const newProfile: SavedProfile = { ...newProfileData, id };
    setProfiles((prev) => [newProfile, ...prev]);
    handleSelectProfile(newProfile);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (activeProfileId === id) {
      setActiveProfileId(null);
    }
  };

  const handleQuickSample = (targetBoard?: BoardFilter) => {
    const sampleDob = getSampleDobForAge(25);
    setActiveProfileId(null);
    handleCalculate(sampleDob, "09:00", googleUser?.displayName?.split(" ")[0] || "Explorer");
    if (targetBoard) {
      setActiveBoard(targetBoard);
    }
  };

  // 4. Computation Engine
  const calculationsResult = useMemo(() => {
    if (!activeCalculation) return null;

    try {
      const birthDate = parseBirthDateTime(activeCalculation.dob, activeCalculation.tob);

      if (Number.isNaN(birthDate.getTime()) || birthDate > currentTime) {
        return null;
      }

      const ageBreakdown = calculateAgeBreakdown(birthDate, currentTime);
      const timeLivedStats = calculateTimeLivedStats(birthDate, currentTime);
      const zodiacInfo = getZodiacInfo(birthDate);
      const nextBirthday = calculateNextBirthday(birthDate, currentTime);
      const milestones = getLifeMilestones(birthDate, currentTime);

      return {
        birthDate,
        ageBreakdown,
        timeLivedStats,
        zodiacInfo,
        nextBirthday,
        milestones,
      };
    } catch {
      return null;
    }
  }, [activeCalculation, currentTime]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredMilestones = useMemo(() => {
    if (!calculationsResult) return [];
    if (!normalizedQuery) return calculationsResult.milestones;
    return calculationsResult.milestones.filter(
      (ms) =>
        ms.name.toLowerCase().includes(normalizedQuery) ||
        ms.valueStr.toLowerCase().includes(normalizedQuery) ||
        ms.targetDate.includes(normalizedQuery)
    );
  }, [calculationsResult, normalizedQuery]);

  const matchesSection = (keywords: string[]) => {
    if (!normalizedQuery) return true;
    return keywords.some((k) => k.includes(normalizedQuery) || normalizedQuery.includes(k));
  };

  const activeSlide = previewSlides[previewJokeIndex] || INITIAL_PREVIEW_JOKES[0];
  const currentTabMeta = BOARD_TABS.find((t) => t.id === activeBoard) || BOARD_TABS[0];

  // Shared Dad's Expectations Checker Preview Card (used in Onboarding All & Audit tabs)
  const renderDadPreviewCard = (showLaunchButton = true) => (
    <div className="editorial-surface rounded-2xl p-6 flex flex-col justify-between space-y-5">
      <div>
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#E6E0D6]">
          <div className="flex items-center gap-3 min-w-0">
            <SafeIllustration
              src={dadPortrait}
              alt="Dad's Expectations Checker editorial portrait"
              fallbackLabel="Dad"
              className="w-11 h-11 rounded-full object-cover border border-[#E6E0D6] shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-base font-bold text-charcoal truncate">
                Dad&rsquo;s Expectations Checker
              </h3>
              <p className="text-xs text-slate-muted truncate">
                {activeSlide.isAiGenerated
                  ? "Live Free-AI Audit · Zero setup"
                  : "Rotating Audit Preview · Free AI"}
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold text-[#D92D20] shrink-0">
            Age {activeSlide.age}
          </span>
        </div>

        {/* Carousel Quote Box */}
        <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-4 min-h-[144px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${previewJokeIndex}-${activeSlide.text.slice(0, 12)}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-charcoal leading-relaxed">
                &ldquo;{activeSlide.text}&rdquo;
              </p>
              <p className="text-xs text-slate-muted border-l-2 border-[#D92D20] pl-3 leading-relaxed">
                <strong className="text-[#D92D20] font-semibold mr-1">Hope:</strong>
                {activeSlide.hope}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {previewNotice && (
          <p className="text-xs font-medium text-amber-700 mt-2.5">
            {previewNotice}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-[#E6E0D6] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleGenerateAiPreview}
            disabled={isGeneratingPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181615] hover:bg-[#2E2A27] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {isGeneratingPreview ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>
              {isGeneratingPreview ? "Asking Free AI..." : "Generate Fresh Free-AI Audit"}
            </span>
          </button>

          {/* Slide dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            {previewSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPreviewJokeIndex(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  idx === previewJokeIndex
                    ? "bg-[#D92D20] w-5"
                    : "bg-[#D8D1C7] w-2 hover:bg-[#BFB6AA]"
                }`}
                title={`Go to audit ${idx + 1}`}
                aria-label={`Go to audit ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {showLaunchButton && (
          <button
            type="button"
            onClick={() => handleQuickSample("audit")}
            className="w-full py-2 px-3 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] hover:bg-[#F4EFE6] text-xs font-semibold text-charcoal flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open Interactive Dads Expectation Chat (Sample Age 25)</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D92D20]" />
          </button>
        )}
      </div>
    </div>
  );

  // Determine whether any calculated pins match current filter + searchQuery
  const showInputPin =
    (activeBoard === "all" || activeBoard === "input") &&
    matchesSection(["input", "birth", "profile", "date", "time", "quick"]);
  const showAgeBreakdownPin =
    (activeBoard === "all" || activeBoard === "stats" || activeBoard === "audit") &&
    matchesSection(["age", "years", "months", "days", "breakdown", "orbits"]);
  const showDadChatPin =
    (activeBoard === "all" || activeBoard === "audit") &&
    matchesSection(["dad", "expectation", "audit", "chat", "ai", "joke"]);
  const showNextBirthdayPin =
    (activeBoard === "all" || activeBoard === "stars" || activeBoard === "stats") &&
    matchesSection(["birthday", "countdown", "next", "gift", "remaining"]);
  const showZodiacPin =
    (activeBoard === "all" || activeBoard === "stars") &&
    matchesSection(["zodiac", "stars", "sign", "birthstone", "season", "chinese", "cosmos"]);
  const showStatsPin =
    (activeBoard === "all" || activeBoard === "stats") &&
    matchesSection(["stats", "seconds", "minutes", "hours", "weeks", "days", "months", "numbers", "metrics"]);
  const showTimelinePin =
    (activeBoard === "all" || activeBoard === "timeline") &&
    (filteredMilestones.length > 0 ||
      matchesSection(["milestone", "timeline", "history", "path"]));

  const hasAnyCalculatedMatches =
    showInputPin ||
    showAgeBreakdownPin ||
    showDadChatPin ||
    showNextBirthdayPin ||
    showZodiacPin ||
    showStatsPin ||
    showTimelinePin;

  return (
    <div className="min-h-screen bg-butter-white text-charcoal font-sans flex flex-col justify-between selection:bg-[#D92D20]/10 selection:text-[#D92D20] overflow-x-hidden">
      <div>
        <Header
          onOpenAbout={() => setIsAboutOpen(true)}
          onBrandClick={() => {
            setActiveBoard("all");
            setSearchQuery("");
          }}
          isLiveTickerEnabled={isLiveTickerEnabled}
          onToggleLiveTicker={() => setIsLiveTickerEnabled(!isLiveTickerEnabled)}
          hasCalculation={!!calculationsResult}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          googleUser={googleUser}
          authLoading={authLoading}
          authError={authError}
          onGoogleSignIn={handleGoogleSignIn}
          onGoogleSignOut={handleGoogleSignOut}
          onUseGoogleNameInAudit={handleUseGoogleNameInAudit}
        />

        <GlobalDisclaimer onOpenDetails={() => setIsAboutOpen(true)} />
      </div>

      {/* Main Workspace */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 md:px-8 space-y-6">
        {/* Clean Editorial Segmented Navigation Bar */}
        <nav aria-label="Board Views" className="w-full overflow-x-auto pb-1">
          <div
            role="tablist"
            className="flex items-center justify-start lg:justify-center gap-2 min-w-max"
          >
            {BOARD_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeBoard === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveBoard(tab.id)}
                  className={`text-xs sm:text-[13px] font-semibold px-3.5 py-2 rounded-xl border transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#181615] text-white border-[#181615]"
                      : "bg-white text-charcoal border-[#E6E0D6] hover:bg-[#F4EFE6]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-[#F04438]" : "text-slate-muted"
                    }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Workspace Content */}
        <AnimatePresence mode="wait">
          {!calculationsResult ? (
            /* PRE-CALCULATION VIEWS: EVERY TAB HAS AN INTUITIVE INTERACTIVE VIEW */
            <motion.div
              key={`onboarding-${activeBoard}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Tab Context Header */}
              {activeBoard === "all" ? (
                <div className="max-w-2xl mx-auto text-center space-y-2.5 pt-2">
                  <h2
                    style={{ fontFamily: "var(--font-display)" }}
                    className="text-3xl sm:text-5xl font-bold text-charcoal tracking-tight leading-[1.1]"
                  >
                    dare to discover your{" "}
                    <span className="text-[#D92D20]">NUMBERED DAYS??!</span>
                  </h2>
                  <p className="text-sm sm:text-base text-slate-muted leading-relaxed">
                    Enter your birth parameters to inspect exact chronological metrics, celestial alignments, life milestones, and Dad&rsquo;s Free AI audit.
                  </p>
                </div>
              ) : (
                <div className="editorial-surface rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <currentTabMeta.icon className="w-4 h-4 text-[#D92D20]" />
                      <h2
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-xl sm:text-2xl font-bold text-charcoal"
                      >
                        {currentTabMeta.label}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-muted">
                      {currentTabMeta.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleQuickSample(activeBoard)}
                      className="px-3.5 py-2 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <span>Preview Sample (Age 25)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveBoard("all")}
                      className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E6E0D6] text-xs font-semibold text-charcoal transition-colors cursor-pointer whitespace-nowrap"
                    >
                      All Pins
                    </button>
                  </div>
                </div>
              )}

              {/* Tab-Specific Onboarding Content */}
              {activeBoard === "all" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 5 columns: Birth Form & Session Quick Profiles */}
                  <div className="lg:col-span-5 space-y-6">
                    <InputForm
                      initialDob={dob}
                      initialTob={tob}
                      onCalculate={(d, t) => {
                        setActiveProfileId(null);
                        handleCalculate(d, t);
                      }}
                      isLoading={false}
                    />
                    <HistorySystem
                      profiles={profiles}
                      activeProfileId={activeProfileId}
                      onSelectProfile={handleSelectProfile}
                      onAddProfile={handleAddProfile}
                      onDeleteProfile={handleDeleteProfile}
                    />
                  </div>

                  {/* Right 7 columns: Editorial Hero Illustration + Dad Preview */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="editorial-surface rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12">
                      <div className="sm:col-span-5 bg-[#FAF8F5]">
                        <SafeIllustration
                          src={heroIllustration}
                          alt="Editorial hourglass and calendar ledger illustration"
                          fallbackLabel="Temporal Ledger"
                          className="w-full h-44 sm:h-full object-cover"
                        />
                      </div>
                      <div className="sm:col-span-7 p-6 flex flex-col justify-between gap-4">
                        <div className="space-y-1.5">
                          <h3 className="text-base font-bold text-charcoal">
                            Your Chronological Ledger
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
                            Pick a quick profile or enter any birth date to inspect exact orbital cycles, upcoming milestones, and live second-by-second totals—zero data stored.
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectProfile(profiles[0] || DEFAULT_SAMPLES[0])}
                            className="px-3.5 py-2 rounded-xl bg-[#181615] hover:bg-[#2E2A27] text-white text-xs font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <span>Try Ada Lovelace</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickSample("all")}
                            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E6E0D6] text-xs font-semibold text-charcoal transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Try Sample Age 25
                          </button>
                        </div>
                      </div>
                    </div>

                    {renderDadPreviewCard(true)}
                  </div>
                </div>
              )}

              {activeBoard === "input" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <InputForm
                    initialDob={dob}
                    initialTob={tob}
                    onCalculate={(d, t) => {
                      setActiveProfileId(null);
                      handleCalculate(d, t);
                    }}
                    isLoading={false}
                  />
                  <HistorySystem
                    profiles={profiles}
                    activeProfileId={activeProfileId}
                    onSelectProfile={handleSelectProfile}
                    onAddProfile={handleAddProfile}
                    onDeleteProfile={handleDeleteProfile}
                  />
                </div>
              )}

              {activeBoard === "audit" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7">{renderDadPreviewCard(true)}</div>
                  <div className="lg:col-span-5 space-y-6">
                    <InputForm
                      initialDob={dob}
                      initialTob={tob}
                      onCalculate={(d, t) => {
                        setActiveProfileId(null);
                        handleCalculate(d, t);
                        setActiveBoard("audit");
                      }}
                      isLoading={false}
                    />
                  </div>
                </div>
              )}

              {activeBoard === "stats" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 editorial-surface rounded-2xl p-6 space-y-5">
                    <div className="border-b border-[#E6E0D6] pb-3">
                      <h3 className="text-base font-bold text-charcoal">
                        What Numerical Metrics Measures
                      </h3>
                      <p className="text-xs text-slate-muted mt-0.5">
                        Enter a birthdate to unlock live ticking totals calculated locally in memory.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { label: "Months Lived", sample: "300" },
                        { label: "Weeks Lived", sample: "1,304" },
                        { label: "Days Lived", sample: "9,131" },
                        { label: "Hours Lived", sample: "219,144" },
                        { label: "Minutes Lived", sample: "13,148,640" },
                        { label: "Seconds Lived", sample: "788,918,400" },
                      ].map((metric) => (
                        <div
                          key={metric.label}
                          className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-3.5"
                        >
                          <span className="text-xs text-slate-muted block">
                            {metric.label}
                          </span>
                          <span className="text-base sm:text-lg font-mono font-bold text-charcoal tabular-nums mt-1 block">
                            {metric.sample}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-muted">
                      Example figures shown for a 25-year span. Enter your own birthdate or click Preview Sample above to launch your live ticker.
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    <InputForm
                      initialDob={dob}
                      initialTob={tob}
                      onCalculate={(d, t) => {
                        setActiveProfileId(null);
                        handleCalculate(d, t);
                        setActiveBoard("stats");
                      }}
                      isLoading={false}
                    />
                  </div>
                </div>
              )}

              {(activeBoard === "stars" || activeBoard === "timeline") && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-7 editorial-surface rounded-2xl overflow-hidden">
                    <SafeIllustration
                      src={cosmosIllustration}
                      alt="Celestial orbits and winding milestones path illustration"
                      fallbackLabel="Sun, Stars & Milestones"
                      className="w-full h-52 sm:h-60 object-cover border-b border-[#E6E0D6]"
                    />
                    <div className="p-6 space-y-3">
                      <h3 className="text-base font-bold text-charcoal">
                        {activeBoard === "stars"
                          ? "Celestial Signs, Birthstone & Birthday Countdown"
                          : "Chronological Milestones Along Your Path"}
                      </h3>
                      <p className="text-sm text-slate-muted leading-relaxed">
                        {activeBoard === "stars"
                          ? "Reveal your Western solar sign, Chinese lunar animal year, birth weekday, seasonal alignment, and radial countdown to your next birthday."
                          : "Inspect reached and upcoming life checkpoints—including 10,000 days on Earth, 1 billion seconds lived, and major birthday decades."}
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-5">
                    <InputForm
                      initialDob={dob}
                      initialTob={tob}
                      onCalculate={(d, t) => {
                        setActiveProfileId(null);
                        handleCalculate(d, t);
                        setActiveBoard(activeBoard);
                      }}
                      isLoading={false}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            /* CALCULATED VIEWS: CLEAN SINGLE-LEVEL BENTO & FOCUSED BOARD TABS */
            <motion.div
              key={`results-${activeBoard}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Active Profile Summary Bar */}
              <div className="w-full bg-[#181615] text-white rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#D92D20] text-white flex items-center justify-center text-lg font-bold shrink-0">
                    {(activeCalculation?.profileName || "Y").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2
                        style={{ fontFamily: "var(--font-display)" }}
                        className="text-xl sm:text-2xl font-bold tracking-tight truncate"
                      >
                        {activeCalculation?.profileName || "You"}&rsquo;s Ledger
                      </h2>
                      <span className="text-xs font-mono font-semibold text-[#F04438] tabular-nums">
                        {calculationsResult.ageBreakdown.years} Years Old
                      </span>
                    </div>
                    <p className="text-xs text-white/75 mt-1 font-mono tabular-nums">
                      Born {activeCalculation?.dob} · {activeCalculation?.tob || "00:00"} · In-memory session only
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {activeBoard !== "all" && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveBoard("all");
                        setSearchQuery("");
                      }}
                      className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3.5 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      View All Pins
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveBoard("input");
                      setSearchQuery("");
                    }}
                    className="text-xs font-semibold text-[#181615] bg-white hover:bg-[#FAF8F5] px-3.5 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Edit Birth Parameters</span>
                  </button>
                </div>
              </div>

              {!hasAnyCalculatedMatches ? (
                <div className="editorial-surface rounded-2xl p-10 text-center space-y-3">
                  <SearchX className="w-8 h-8 mx-auto text-slate-muted" />
                  <h3 className="text-base font-bold text-charcoal">
                    No boards match &ldquo;{searchQuery}&rdquo; on {currentTabMeta.label}
                  </h3>
                  <p className="text-xs text-slate-muted">
                    Clear your filter or switch back to All Pins to view every card.
                  </p>
                  <div className="flex justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="px-4 py-2 rounded-xl bg-[#181615] text-white text-xs font-semibold cursor-pointer"
                    >
                      Clear Filter
                    </button>
                    {activeBoard !== "all" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveBoard("all");
                        }}
                        className="px-4 py-2 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-semibold text-charcoal cursor-pointer"
                      >
                        Go to All Pins
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* ALL PINS TAB: BALANCED 12-COL EDITORIAL BENTO */}
                  {activeBoard === "all" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      {showAgeBreakdownPin && (
                        <div className={showNextBirthdayPin ? "lg:col-span-7" : "lg:col-span-12"}>
                          <ResultsDisplay
                            age={calculationsResult.ageBreakdown}
                            activeName={activeCalculation?.profileName || ""}
                          />
                        </div>
                      )}

                      {showNextBirthdayPin && (
                        <div className={showAgeBreakdownPin ? "lg:col-span-5" : "lg:col-span-12"}>
                          <NextBirthdayCard
                            countdown={calculationsResult.nextBirthday}
                            birthDate={calculationsResult.birthDate}
                          />
                        </div>
                      )}

                      {showDadChatPin && (
                        <div className={showZodiacPin ? "lg:col-span-7" : "lg:col-span-12"}>
                          <ExpectationDadChat
                            userAgeYears={calculationsResult.ageBreakdown.years}
                            profileName={activeCalculation?.profileName || "Son/Daughter"}
                            dob={activeCalculation?.dob || ""}
                            zodiacInfo={calculationsResult.zodiacInfo}
                          />
                        </div>
                      )}

                      {showZodiacPin && (
                        <div className={showDadChatPin ? "lg:col-span-5" : "lg:col-span-12"}>
                          <ZodiacDetails zodiac={calculationsResult.zodiacInfo} />
                        </div>
                      )}

                      {showStatsPin && (
                        <div className="lg:col-span-12">
                          <StatsGrid stats={calculationsResult.timeLivedStats} />
                        </div>
                      )}

                      {showTimelinePin && (
                        <div className="lg:col-span-12">
                          <MilestonesTimeline milestones={filteredMilestones} />
                        </div>
                      )}

                      {showInputPin && (
                        <>
                          <div className="lg:col-span-6">
                            <InputForm
                              initialDob={dob}
                              initialTob={tob}
                              onCalculate={(d, t) => {
                                setActiveProfileId(null);
                                handleCalculate(d, t);
                              }}
                              isLoading={false}
                            />
                          </div>
                          <div className="lg:col-span-6">
                            <HistorySystem
                              profiles={profiles}
                              activeProfileId={activeProfileId}
                              onSelectProfile={handleSelectProfile}
                              onAddProfile={handleAddProfile}
                              onDeleteProfile={handleDeleteProfile}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* TEMPORAL INPUT TAB */}
                  {activeBoard === "input" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      <InputForm
                        initialDob={dob}
                        initialTob={tob}
                        onCalculate={(d, t) => {
                          setActiveProfileId(null);
                          handleCalculate(d, t);
                        }}
                        isLoading={false}
                      />
                      <HistorySystem
                        profiles={profiles}
                        activeProfileId={activeProfileId}
                        onSelectProfile={handleSelectProfile}
                        onAddProfile={handleAddProfile}
                        onDeleteProfile={handleDeleteProfile}
                      />
                    </div>
                  )}

                  {/* DAD'S LIFE AUDIT TAB */}
                  {activeBoard === "audit" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {showDadChatPin && (
                        <div className="lg:col-span-8">
                          <ExpectationDadChat
                            userAgeYears={calculationsResult.ageBreakdown.years}
                            profileName={activeCalculation?.profileName || "Son/Daughter"}
                            dob={activeCalculation?.dob || ""}
                            zodiacInfo={calculationsResult.zodiacInfo}
                          />
                        </div>
                      )}
                      {showAgeBreakdownPin && (
                        <div className={showDadChatPin ? "lg:col-span-4 space-y-6" : "lg:col-span-12"}>
                          <ResultsDisplay
                            age={calculationsResult.ageBreakdown}
                            activeName={activeCalculation?.profileName || ""}
                          />
                          <div className="editorial-surface rounded-2xl p-5 space-y-2">
                            <p className="text-xs font-bold text-charcoal">
                              Audit Profile Context
                            </p>
                            <p className="text-xs text-slate-muted leading-relaxed">
                              Born on a <strong className="text-charcoal">{calculationsResult.zodiacInfo.dayOfWeek}</strong> in{" "}
                              <strong className="text-charcoal">{calculationsResult.zodiacInfo.season}</strong> ({calculationsResult.zodiacInfo.westernSign} · Year of the {calculationsResult.zodiacInfo.chineseAnimal}).
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NUMERICAL METRICS TAB */}
                  {activeBoard === "stats" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                      {showAgeBreakdownPin && (
                        <div className={showNextBirthdayPin ? "lg:col-span-7" : "lg:col-span-12"}>
                          <ResultsDisplay
                            age={calculationsResult.ageBreakdown}
                            activeName={activeCalculation?.profileName || ""}
                          />
                        </div>
                      )}
                      {showNextBirthdayPin && (
                        <div className={showAgeBreakdownPin ? "lg:col-span-5" : "lg:col-span-12"}>
                          <NextBirthdayCard
                            countdown={calculationsResult.nextBirthday}
                            birthDate={calculationsResult.birthDate}
                          />
                        </div>
                      )}
                      {showStatsPin && (
                        <div className="lg:col-span-12">
                          <StatsGrid stats={calculationsResult.timeLivedStats} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUN & STARS TAB */}
                  {activeBoard === "stars" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {showZodiacPin && (
                        <div className="lg:col-span-7">
                          <ZodiacDetails zodiac={calculationsResult.zodiacInfo} />
                        </div>
                      )}
                      <div className={showZodiacPin ? "lg:col-span-5 space-y-6" : "lg:col-span-12 space-y-6"}>
                        {showNextBirthdayPin && (
                          <NextBirthdayCard
                            countdown={calculationsResult.nextBirthday}
                            birthDate={calculationsResult.birthDate}
                          />
                        )}
                        <div className="editorial-surface rounded-2xl overflow-hidden">
                          <SafeIllustration
                            src={cosmosIllustration}
                            alt="Celestial orbits and lunar alignment illustration"
                            fallbackLabel="Celestial Alignment"
                            className="w-full h-40 object-cover border-b border-[#E6E0D6]"
                          />
                          <div className="p-4 flex items-center justify-between text-xs text-slate-muted">
                            <span>
                              {calculationsResult.zodiacInfo.westernSign} {calculationsResult.zodiacInfo.westernSymbol}
                            </span>
                            <span className="font-mono text-charcoal font-medium">
                              {calculationsResult.zodiacInfo.birthstone} · {calculationsResult.zodiacInfo.season}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MILESTONES PATH TAB */}
                  {activeBoard === "timeline" && (
                    <div className="space-y-6">
                      <div className="editorial-surface rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-12">
                        <div className="sm:col-span-4 bg-[#FAF8F5]">
                          <SafeIllustration
                            src={cosmosIllustration}
                            alt="Milestones pathway and celestial horizon illustration"
                            fallbackLabel="Milestones Path"
                            className="w-full h-36 sm:h-full object-cover"
                          />
                        </div>
                        <div className="sm:col-span-8 p-5 flex flex-col justify-center gap-1.5">
                          <h3 className="text-base font-bold text-charcoal">
                            Chronological Checkpoints
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
                            Track major mathematical and calendar milestones reached since{" "}
                            <span className="font-mono text-charcoal font-semibold">
                              {activeCalculation?.dob}
                            </span>{" "}
                            alongside upcoming future markers.
                          </p>
                        </div>
                      </div>

                      {showTimelinePin && <MilestonesTimeline milestones={filteredMilestones} />}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onOpenAbout={() => setIsAboutOpen(true)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
