/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Plus, Trash2, Users, Check } from "lucide-react";
import { SavedProfile } from "../types";

interface HistorySystemProps {
  profiles: SavedProfile[];
  activeProfileId: string | null;
  onSelectProfile: (profile: SavedProfile) => void;
  onAddProfile: (profile: Omit<SavedProfile, "id">) => void;
  onDeleteProfile: (id: string) => void;
}

export default function HistorySystem({
  profiles,
  activeProfileId,
  onSelectProfile,
  onAddProfile,
  onDeleteProfile,
}: HistorySystemProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("00:00");
  const [relation, setRelation] = useState("Family");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.replace(/[<>]/g, "").trim();
    if (!cleanName) {
      setError("Please enter a name.");
      return;
    }
    if (!dob) {
      setError("Please choose a valid birth date.");
      return;
    }

    const inputDate = new Date(dob);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (Number.isNaN(inputDate.getTime()) || inputDate > today) {
      setError("Future dates are not allowed.");
      return;
    }

    onAddProfile({
      name: cleanName.slice(0, 25),
      dateOfBirth: dob,
      timeOfBirth: tob || "00:00",
      relation,
      avatarStyle: Math.floor(Math.random() * 6),
    });

    setName("");
    setDob("");
    setTob("00:00");
    setRelation("Family");
    setError("");
    setIsAdding(false);
  };

  return (
    <div className="editorial-surface rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6E0D6]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] text-charcoal flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-charcoal leading-tight">
              Quick Profiles
            </h3>
            <p className="text-[11px] text-slate-muted">
              Session-only · Not stored
            </p>
          </div>
        </div>
        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F4EFE6] text-charcoal hover:bg-[#EAE2D6] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            aria-label="Add a temporary session profile"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grandma, Emily, Me"
              className="w-full text-sm px-3 py-2 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal focus:bg-white focus:border-[#D92D20] focus:outline-none transition-colors"
              maxLength={25}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Birthdate
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full text-sm px-3 py-2 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal focus:bg-white focus:border-[#D92D20] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Birth Time
              </label>
              <input
                type="time"
                value={tob}
                onChange={(e) => setTob(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal focus:bg-white focus:border-[#D92D20] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Relation
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {["Self", "Family", "Friend", "Other"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRelation(r)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    relation === r
                      ? "bg-[#181615] text-white border-[#181615]"
                      : "bg-[#FAF8F5] hover:bg-[#F4EFE6] text-slate-muted border-[#E6E0D6]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

          <div className="flex gap-2 pt-2 border-t border-[#E6E0D6]">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setError("");
              }}
              className="flex-1 py-2 rounded-xl border border-[#E6E0D6] text-slate-muted hover:bg-[#FAF8F5] text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-[#D92D20] text-white hover:bg-[#B42318] text-xs font-semibold transition-colors cursor-pointer"
            >
              Use in Session
            </button>
          </div>
        </form>
      ) : (
        <div className="divide-y divide-[#EFEAE2] max-h-[280px] overflow-y-auto">
          {profiles.length === 0 ? (
            <div className="py-8 text-center text-slate-muted">
              <p className="text-xs font-medium">No session profiles active.</p>
              <p className="text-[11px] text-slate-muted/80 mt-1">
                Add a temporary profile for quick switching (cleared on refresh).
              </p>
            </div>
          ) : (
            profiles.map((profile) => {
              const isActive = activeProfileId === profile.id;
              return (
                <div
                  key={profile.id}
                  className={`group flex items-center justify-between py-2.5 px-2 -mx-2 rounded-xl transition-colors ${
                    isActive ? "bg-[#F4EFE6]" : "hover:bg-[#FAF8F5]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectProfile(profile)}
                    className="flex-grow flex items-center gap-3 text-left cursor-pointer focus:outline-none min-w-0"
                    aria-label={`Select profile ${profile.name}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive
                          ? "bg-[#D92D20] text-white"
                          : "bg-[#EFEAE2] text-charcoal"
                      }`}
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-charcoal truncate">
                          {profile.name}
                        </span>
                        <span aria-hidden="true" className="text-slate-muted">
                          ·
                        </span>
                        <span className="text-slate-muted font-medium">
                          {profile.relation}
                        </span>
                        {isActive && (
                          <Check className="w-3.5 h-3.5 text-[#D92D20] shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-muted font-mono tabular-nums block mt-0.5">
                        {profile.dateOfBirth}
                        {profile.timeOfBirth && profile.timeOfBirth !== "00:00"
                          ? ` · ${profile.timeOfBirth}`
                          : ""}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProfile(profile.id)}
                    className="p-2 rounded-lg text-slate-muted hover:text-rose-600 hover:bg-rose-50 opacity-70 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all cursor-pointer shrink-0"
                    title="Remove from session"
                    aria-label={`Remove profile ${profile.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
