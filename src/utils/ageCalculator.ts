/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgeBreakdown, TimeLivedStats, ZodiacInfo, NextBirthdayCountdown, LifeMilestone } from "../types";

export function parseBirthDateTime(dobString: string, tobString: string = "00:00"): Date {
  const [year, month, day] = dobString.split("-").map(Number);
  const [hour, min] = tobString.split(":").map(Number);
  return new Date(year, month - 1, day, hour, min, 0, 0);
}

export function calculateAgeBreakdown(birthDate: Date, targetDate: Date = new Date()): AgeBreakdown {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    // Day 0 of targetMonth gets the last day of the previous month
    const prevMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days)
  };
}

export function calculateTimeLivedStats(birthDate: Date, todayDate: Date = new Date()): TimeLivedStats {
  const diffMs = todayDate.getTime() - birthDate.getTime();
  
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const totalMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  const totalHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  const totalDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(0, Math.floor(totalDays / 7));
  
  // Months: calendar difference
  let totalMonths = (todayDate.getFullYear() - birthDate.getFullYear()) * 12;
  totalMonths += (todayDate.getMonth() - birthDate.getMonth());
  if (todayDate.getDate() < birthDate.getDate()) {
    totalMonths--;
  }

  const totalYears = todayDate.getFullYear() - birthDate.getFullYear() - (
    (todayDate.getMonth() < birthDate.getMonth() || 
     (todayDate.getMonth() === birthDate.getMonth() && todayDate.getDate() < birthDate.getDate())) ? 1 : 0
  );

  return {
    totalYears: Math.max(0, totalYears),
    totalMonths: Math.max(0, totalMonths),
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds
  };
}

export function getWesternZodiac(month: number, day: number): { sign: string; symbol: string } {
  // Month is 0-indexed in JS (Jan = 0)
  const m = month + 1;
  if ((m === 3 && day >= 21) || (m === 4 && day <= 19)) return { sign: "Aries", symbol: "♈" };
  if ((m === 4 && day >= 20) || (m === 5 && day <= 20)) return { sign: "Taurus", symbol: "♉" };
  if ((m === 5 && day >= 21) || (m === 6 && day <= 20)) return { sign: "Gemini", symbol: "♊" };
  if ((m === 6 && day >= 21) || (m === 7 && day <= 22)) return { sign: "Cancer", symbol: "♋" };
  if ((m === 7 && day >= 23) || (m === 8 && day <= 22)) return { sign: "Leo", symbol: "♌" };
  if ((m === 8 && day >= 23) || (m === 9 && day <= 22)) return { sign: "Virgo", symbol: "♍" };
  if ((m === 9 && day >= 23) || (m === 10 && day <= 22)) return { sign: "Libra", symbol: "♎" };
  if ((m === 10 && day >= 23) || (m === 11 && day <= 21)) return { sign: "Scorpio", symbol: "♏" };
  if ((m === 11 && day >= 22) || (m === 12 && day <= 21)) return { sign: "Sagittarius", symbol: "♐" };
  if ((m === 12 && day >= 22) || (m === 1 && day <= 19)) return { sign: "Capricorn", symbol: "♑" };
  if ((m === 1 && day >= 20) || (m === 2 && day <= 18)) return { sign: "Aquarius", symbol: "♒" };
  return { sign: "Pisces", symbol: "♓" };
}

export function getChineseZodiac(year: number): { animal: string; symbol: string } {
  const animals = [
    { animal: "Rat", symbol: "🐀" },
    { animal: "Ox", symbol: "🐂" },
    { animal: "Tiger", symbol: "🐅" },
    { animal: "Rabbit", symbol: "🐇" },
    { animal: "Dragon", symbol: "🐉" },
    { animal: "Snake", symbol: "🐍" },
    { animal: "Horse", symbol: "🐎" },
    { animal: "Goat", symbol: "🐐" },
    { animal: "Monkey", symbol: "🐒" },
    { animal: "Rooster", symbol: "🐓" },
    { animal: "Dog", symbol: "🐕" },
    { animal: "Pig", symbol: "🐖" }
  ];
  const index = (year - 1900) % 12;
  return animals[index >= 0 ? index : index + 12];
}

export function getBirthstone(month: number): string {
  const stones = [
    "Garnet", "Amethyst", "Aquamarine", "Diamond", 
    "Emerald", "Alexandrite", "Ruby", "Peridot", 
    "Sapphire", "Opal & Tourmaline", "Topaz & Citrine", "Blue Topaz & Tanzanite"
  ];
  return stones[month] || "N/A";
}

export function getDayOfWeekName(dayIndex: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex] || "";
}

export function getBornSeason(month: number): string {
  // Jan, Feb, Dec = Winter (Northern hemisphere relative)
  if (month === 11 || month <= 1) return "Winter";
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  return "Autumn";
}

export function getZodiacInfo(birthDate: Date): ZodiacInfo {
  const { sign, symbol } = getWesternZodiac(birthDate.getMonth(), birthDate.getDate());
  const chinese = getChineseZodiac(birthDate.getFullYear());
  
  return {
    westernSign: sign,
    westernSymbol: symbol,
    chineseAnimal: chinese.animal,
    chineseSymbol: chinese.symbol,
    birthstone: getBirthstone(birthDate.getMonth()),
    dayOfWeek: getDayOfWeekName(birthDate.getDay()),
    season: getBornSeason(birthDate.getMonth())
  };
}

export function getNextBirthdayDate(birthDate: Date, todayDate: Date = new Date()): Date {
  const nextY = todayDate.getFullYear();
  let nextBday = new Date(nextY, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), 0, 0);
  
  // Leap child handle: If born on Feb 29 and target year is not a leap year, celebrate on Feb 28
  if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
    const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    if (!isLeapYear(nextY)) {
      nextBday = new Date(nextY, 1, 28, birthDate.getHours(), birthDate.getMinutes(), 0, 0);
    }
  }

  if (nextBday.getTime() < todayDate.getTime()) {
    const targetYear = nextY + 1;
    nextBday = new Date(targetYear, birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), 0, 0);
    if (birthDate.getMonth() === 1 && birthDate.getDate() === 29) {
      const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (!isLeapYear(targetYear)) {
        nextBday = new Date(targetYear, 1, 28, birthDate.getHours(), birthDate.getMinutes(), 0, 0);
      }
    }
  }

  return nextBday;
}

export function calculateNextBirthday(birthDate: Date, todayDate: Date = new Date()): NextBirthdayCountdown {
  const nextBday = getNextBirthdayDate(birthDate, todayDate);
  const diffMs = nextBday.getTime() - todayDate.getTime();
  
  let totalDiffSeconds = Math.max(0, Math.floor(diffMs / 1000));
  let seconds = totalDiffSeconds % 60;
  let totalMinutes = Math.floor(totalDiffSeconds / 60);
  let minutes = totalMinutes % 60;
  let totalHours = Math.floor(totalMinutes / 60);
  let hours = totalHours % 24;
  let totalDaysLeft = Math.floor(totalHours / 24);

  // Accurate month/day breakdown of countdown
  let cdMonths = 0;
  let cdDays = 0;
  
  // Clone to advance safely
  let testDate = new Date(todayDate);
  testDate.setHours(0, 0, 0, 0);
  
  const targetMidnight = new Date(nextBday);
  targetMidnight.setHours(0, 0, 0, 0);

  while (true) {
    const nextMonthTest = new Date(testDate);
    nextMonthTest.setMonth(nextMonthTest.getMonth() + 1);
    if (nextMonthTest.getTime() <= targetMidnight.getTime()) {
      cdMonths++;
      testDate = nextMonthTest;
    } else {
      break;
    }
  }
  
  const remainingDiffMs = targetMidnight.getTime() - testDate.getTime();
  cdDays = Math.round(remainingDiffMs / (1000 * 60 * 60 * 24));

  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const totalDaysInBdayYear = isLeapYear(nextBday.getFullYear()) ? 366 : 365;
  const percentageRemaining = Math.min(100, Math.max(0, (totalDaysLeft / totalDaysInBdayYear) * 100));

  return {
    months: cdMonths,
    days: cdDays,
    hours,
    minutes,
    seconds,
    percentageRemaining,
    dayOfWeek: getDayOfWeekName(nextBday.getDay())
  };
}

export function getLifeMilestones(birthDate: Date, todayDate: Date = new Date()): LifeMilestone[] {
  // Let's create an exhaustive list of major life milestones
  const definitions: { name: string; value: number; unit: "days" | "weeks" | "months" | "seconds" | "years" }[] = [
    { name: "1,000 Days Lived", value: 1000, unit: "days" },
    { name: "5,000 Days Lived", value: 5000, unit: "days" },
    { name: "10,000 Days Lived (Genius Epoch)", value: 10000, unit: "days" },
    { name: "15,000 Days Lived (Midlife Jubilee)", value: 15000, unit: "days" },
    { name: "20,000 Days Lived (Golden Wisdom)", value: 20000, unit: "days" },
    { name: "25,000 Days Lived (Emerald Age)", value: 25000, unit: "days" },
    { name: "30,000 Days Lived (Octogenarian Era)", value: 30000, unit: "days" },
    
    { name: "500 Weeks Lived", value: 500, unit: "weeks" },
    { name: "1,000 Weeks Lived (Millennium)", value: 1000, unit: "weeks" },
    { name: "2,000 Weeks Lived (Bimillennium)", value: 2000, unit: "weeks" },
    { name: "3,000 Weeks Lived", value: 3000, unit: "weeks" },
    
    { name: "100 Months Lived", value: 100, unit: "months" },
    { name: "250 Months Lived", value: 250, unit: "months" },
    { name: "500 Months Lived", value: 500, unit: "months" },
    { name: "800 Months Lived", value: 800, unit: "months" },
    
    { name: "100 Million Seconds", value: 100000000, unit: "seconds" },
    { name: "500 Million Seconds", value: 500000000, unit: "seconds" },
    { name: "1 Billion Seconds (The Giga-Moment)", value: 1000000000, unit: "seconds" },
    { name: "2 Billion Seconds", value: 2000000000, unit: "seconds" },
    
    { name: "10th Birthday (Double Digits)", value: 10, unit: "years" },
    { name: "18th Birthday (Adulthood)", value: 18, unit: "years" },
    { name: "21st Birthday (Legal Milestone)", value: 21, unit: "years" },
    { name: "25th Birthday (Silver Anniversary)", value: 25, unit: "years" },
    { name: "30th Birthday (Thriving Thirties)", value: 30, unit: "years" },
    { name: "40th Birthday (Flourishing Forties)", value: 40, unit: "years" },
    { name: "50th Birthday (Golden Jubilee)", value: 50, unit: "years" },
    { name: "60th Birthday (Diamond Milestone)", value: 60, unit: "years" },
    { name: "75th Birthday (Platinum Celebration)", value: 75, unit: "years" },
    { name: "100th Birthday (Centenarian Title)", value: 100, unit: "years" },
  ];

  const todayMidnight = new Date(todayDate);
  todayMidnight.setHours(0,0,0,0);

  return definitions.map((def, idx) => {
    let tDate: Date;
    switch (def.unit) {
      case "days":
        tDate = new Date(birthDate.getTime() + def.value * 24 * 60 * 60 * 1000);
        break;
      case "weeks":
        tDate = new Date(birthDate.getTime() + def.value * 7 * 24 * 60 * 60 * 1000);
        break;
      case "seconds":
        tDate = new Date(birthDate.getTime() + def.value * 1000);
        break;
      case "months": {
        tDate = new Date(birthDate);
        tDate.setMonth(birthDate.getMonth() + def.value);
        break;
      }
      case "years": {
        tDate = new Date(birthDate);
        tDate.setFullYear(birthDate.getFullYear() + def.value);
        break;
      }
    }

    // Reset hours to align cleanly with day counts
    const tMidnight = new Date(tDate);
    tMidnight.setHours(0, 0, 0, 0);

    const reached = tMidnight.getTime() <= todayMidnight.getTime();
    const diffDaysVal = Math.round((tMidnight.getTime() - todayMidnight.getTime()) / (24 * 60 * 60 * 1000));
    
    let valueStr = "";
    if (def.unit === "days") valueStr = `${def.value.toLocaleString()} days`;
    else if (def.unit === "weeks") valueStr = `${def.value.toLocaleString()} weeks`;
    else if (def.unit === "months") valueStr = `${def.value.toLocaleString()} months`;
    else if (def.unit === "seconds") valueStr = `${(def.value / 1000000000).toFixed(2)}B seconds`;
    else if (def.unit === "years") valueStr = `${def.value} years`;

    return {
      id: `milestone-${idx}-${def.unit}-${def.value}`,
      name: def.name,
      value: def.value,
      unit: def.unit,
      targetDate: tDate.toISOString().split("T")[0],
      reached,
      valueStr,
      daysToOrAgo: diffDaysVal
    };
  });
}
