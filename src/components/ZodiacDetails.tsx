/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass } from "lucide-react";
import { ZodiacInfo } from "../types";

interface ZodiacDetailsProps {
  zodiac: ZodiacInfo;
}

export default function ZodiacDetails({ zodiac }: ZodiacDetailsProps) {
  const getWesternSignDescription = (sign: string) => {
    switch (sign) {
      case "Aries":
        return "Passionate, motivated, and a confident leader who builds momentum with decisive energy.";
      case "Taurus":
        return "Practical, grounded, and steady, valuing lasting craft, reliability, and quiet beauty.";
      case "Gemini":
        return "Expressive, witty, and inquisitive, thriving across varied viewpoints and lively conversation.";
      case "Cancer":
        return "Intuitive, protective, and sentimental, centering close-knit bonds and thoughtful care.";
      case "Leo":
        return "Spirited, expressive, and warmhearted, bringing natural presence and generosity to any room.";
      case "Virgo":
        return "Methodical, observant, and constructive, refining complex systems block by block.";
      case "Libra":
        return "Harmonious, artistic, and fair-minded, seeking equilibrium in design and relationships.";
      case "Scorpio":
        return "Perceptive, magnetic, and resolute, combining deep focus with enduring willpower.";
      case "Sagittarius":
        return "Philosophical, curious, and candid, driven by exploration and big-picture discovery.";
      case "Capricorn":
        return "Disciplined, pragmatic, and patient, steadily scaling long-horizon ambitions.";
      case "Aquarius":
        return "Independent, inventive, and forward-looking, rethinking established patterns with clarity.";
      default:
        return "Imaginative, empathetic, and intuitive, navigating subtle currents with quiet wisdom.";
    }
  };

  const getChineseAnimalDescription = (animal: string) => {
    switch (animal) {
      case "Rat":
        return "Resourceful, charming, and quick-witted, spotting practical opportunities early.";
      case "Ox":
        return "Diligent, dependable, and composed, building lasting results through steady effort.";
      case "Tiger":
        return "Courageous, spirited, and magnetic, meeting bold challenges head-on.";
      case "Rabbit":
        return "Thoughtful, diplomatic, and perceptive, handling complex situations with grace.";
      case "Dragon":
        return "Energetic, ambitious, and charismatic, pursuing high goals with unmistakable drive.";
      case "Snake":
        return "Strategic, composed, and insightful, favoring depth and careful timing.";
      case "Horse":
        return "Independent, energetic, and candid, thriving on open horizons and momentum.";
      case "Goat":
        return "Creative, considerate, and gentle, bringing warmth and balance to shared spaces.";
      case "Monkey":
        return "Clever, adaptable, and inventive, untangling difficult puzzles with playful speed.";
      case "Rooster":
        return "Observant, conscientious, and articulate, valuing precision and follow-through.";
      case "Dog":
        return "Loyal, principled, and grounded, standing firmly behind people and commitments.";
      default:
        return "Generous, sincere, and steady, cultivating trust through warmth and honesty.";
    }
  };

  return (
    <div className="editorial-surface rounded-2xl p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-5 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#D92D20] shrink-0" />
          <h3 className="text-base font-bold text-charcoal">
            Zodiac &amp; Cosmos Alignment
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-muted">Celestial</span>
      </div>

      {/* Western & Chinese Signs */}
      <div className="grid grid-cols-1 gap-3.5">
        <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-4 flex gap-3.5 items-start">
          <div className="w-11 h-11 rounded-xl bg-[#F4EFE6] border border-[#E6E0D6] text-[#181615] shrink-0 flex items-center justify-center text-2xl font-mono select-none">
            {zodiac.westernSymbol}
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-bold text-charcoal">
              {zodiac.westernSign}{" "}
              <span className="text-xs font-normal text-slate-muted">
                · Western Sign
              </span>
            </h4>
            <p className="text-xs text-slate-muted leading-relaxed">
              {getWesternSignDescription(zodiac.westernSign)}
            </p>
          </div>
        </div>

        <div className="bg-[#FAF8F5] border border-[#E6E0D6] rounded-xl p-4 flex gap-3.5 items-start">
          <div className="w-11 h-11 rounded-xl bg-[#F4EFE6] border border-[#E6E0D6] text-[#181615] shrink-0 flex items-center justify-center text-2xl font-mono select-none">
            {zodiac.chineseSymbol}
          </div>
          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-bold text-charcoal">
              Year of the {zodiac.chineseAnimal}{" "}
              <span className="text-xs font-normal text-slate-muted">
                · Lunar Cycle
              </span>
            </h4>
            <p className="text-xs text-slate-muted leading-relaxed">
              {getChineseAnimalDescription(zodiac.chineseAnimal)}
            </p>
          </div>
        </div>
      </div>

      {/* Clean 3-column hairline footer */}
      <div className="grid grid-cols-3 divide-x divide-[#E6E0D6] pt-4 mt-5 border-t border-[#E6E0D6] text-center">
        <div className="px-2">
          <span className="block text-[11px] font-medium text-slate-muted">
            Born On
          </span>
          <span className="text-xs sm:text-sm font-bold text-charcoal mt-0.5 block truncate">
            {zodiac.dayOfWeek}
          </span>
        </div>

        <div className="px-2">
          <span className="block text-[11px] font-medium text-slate-muted">
            Birthstone
          </span>
          <span className="text-xs sm:text-sm font-bold text-[#D92D20] mt-0.5 block truncate">
            {zodiac.birthstone}
          </span>
        </div>

        <div className="px-2">
          <span className="block text-[11px] font-medium text-slate-muted">
            Season
          </span>
          <span className="text-xs sm:text-sm font-bold text-charcoal mt-0.5 block truncate">
            {zodiac.season}
          </span>
        </div>
      </div>
    </div>
  );
}
