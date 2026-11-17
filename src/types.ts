/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SavedProfile {
  id: string;
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth?: string; // HH:MM (24h)
  relation: string; // "Self", "Family", "Friend", "Other"
  avatarStyle: number; // For selecting color backgrounds
}

export interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
}

export interface TimeLivedStats {
  totalYears: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface ZodiacInfo {
  westernSign: string;
  westernSymbol: string;
  chineseAnimal: string;
  chineseSymbol: string;
  birthstone: string;
  dayOfWeek: string;
  season: string;
}

export interface NextBirthdayCountdown {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  percentageRemaining: number;
  dayOfWeek: string;
}

export interface LifeMilestone {
  id: string;
  name: string;
  value: number;
  unit: "days" | "weeks" | "months" | "seconds" | "years";
  targetDate: string; // YYYY-MM-DD
  reached: boolean;
  valueStr: string;
  daysToOrAgo: number;
}
