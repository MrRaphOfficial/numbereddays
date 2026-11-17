/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, AlertCircle } from "lucide-react";
import { ZodiacInfo } from "../types";
import SafeIllustration from "./SafeIllustration";
import dadPortrait from "../assets/images/dad_expectations_avatar_1794920321125.jpg";

interface Message {
  id: string;
  sender: "dad" | "user";
  text: string;
  timestamp: Date;
  isError?: boolean;
  retryText?: string;
}

interface ExpectationDadChatProps {
  userAgeYears: number;
  profileName: string;
  dob: string;
  zodiacInfo: ZodiacInfo;
}

export default function ExpectationDadChat({
  userAgeYears,
  profileName,
  dob,
  zodiacInfo,
}: ExpectationDadChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingText, setLoadingText] = useState("Dad is adjusting his spectacles...");

  const scrollRef = useRef<HTMLDivElement>(null);

  const westernSign = zodiacInfo?.westernSign || "";
  const westernSymbol = zodiacInfo?.westernSymbol || "";
  const dayOfWeek = zodiacInfo?.dayOfWeek || "";
  const season = zodiacInfo?.season || "";
  const chineseAnimal = zodiacInfo?.chineseAnimal || "";
  const chineseSymbol = zodiacInfo?.chineseSymbol || "";

  useEffect(() => {
    if (!zodiacInfo) return;

    const birthYear = dob ? dob.split("-")[0] : "";

    const introPhrases = [
      `So you are ${userAgeYears} years old, born in ${birthYear} under ${westernSign} (${westernSymbol}) on a ${dayOfWeek}. Back in my day, a child born in ${season} had already built a steam turbine before breakfast! What did you accomplish today?`,
      `${userAgeYears} years of age, born in the Year of the ${chineseAnimal} ${chineseSymbol}. The mighty ${chineseAnimal} climbs mountains, and yet the steepest thing you climbed today was getting out of bed! Care to explain?`,
      `You've spent ${userAgeYears} years on Earth, born on a ${dayOfWeek}. When I was your age, I had already started three farms in the middle of a desert! Tell me what you're working on today.`,
    ];

    const dobHash = dob.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const chosenIntro = introPhrases[dobHash % introPhrases.length];

    setMessages([
      {
        id: `age-shift-${Date.now()}`,
        sender: "dad",
        text: chosenIntro,
        timestamp: new Date(),
      },
    ]);
  }, [
    userAgeYears,
    dob,
    profileName,
    westernSign,
    westernSymbol,
    dayOfWeek,
    season,
    chineseAnimal,
    chineseSymbol,
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) return;
    const items = [
      "Dad is adjusting his spectacles...",
      "Dad is calling Cousin Timmy to compare notes...",
      "Dad is reviewing your life timeline...",
      "Dad is calculating your rice consumption...",
      "Dad is clearing his throat dramatically...",
    ];
    let i = 0;
    const idx = setInterval(() => {
      i = (i + 1) % items.length;
      setLoadingText(items[i]);
    }, 1800);
    return () => clearInterval(idx);
  }, [isTyping]);

  const sendToFreeAi = async (textToSend: string, historyForRequest: Message[]) => {
    setIsTyping(true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 18000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          age: userAgeYears,
          birthDate: dob,
          name: profileName,
          zodiacInfo,
          chatHistory: historyForRequest
            .filter((m) => !m.isError)
            .slice(-8)
            .map((m) => ({
              role: m.sender === "dad" ? "model" : "user",
              text: m.text,
            })),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.reply) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : "Dad's Free AI auditor is temporarily busy. Please try again."
        );
      }

      const dadMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "dad",
        text: String(data.reply),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, dadMsg]);
    } catch (err) {
      const safeError =
        err instanceof Error && err.name === "AbortError"
          ? "Request timed out while waiting for Dad. Please click Try Again."
          : err instanceof Error
            ? err.message
            : "Dad's Free AI auditor is temporarily busy. Please try again.";
      const errMsg: Message = {
        id: `msg-err-${Date.now() + 1}`,
        sender: "dad",
        text: safeError,
        timestamp: new Date(),
        isError: true,
        retryText: textToSend,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      window.clearTimeout(timeoutId);
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (rawText: string) => {
    const cleanText = rawText.trim().slice(0, 500);
    if (!cleanText || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: cleanText,
      timestamp: new Date(),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInputVal("");

    await sendToFreeAi(cleanText, nextHistory);
  };

  const handleRetry = async (failedMessageId: string, retryText: string) => {
    if (isTyping) return;
    const filtered = messages.filter((m) => m.id !== failedMessageId);
    setMessages(filtered);
    await sendToFreeAi(retryText, filtered);
  };

  const SUGGESTED_PROMPTS = [
    "I just built a web application!",
    "I am working hard on my studies.",
    "I got an A- on my project!",
    "I just got a promotion at work!",
  ];

  return (
    <div className="editorial-surface rounded-2xl p-6 flex flex-col h-[520px] justify-between">
      {/* Clean Header with Editorial Dad Portrait */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6] mb-4 shrink-0 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <SafeIllustration
            src={dadPortrait}
            alt="Dads Expectation editorial portrait"
            fallbackLabel="Dad"
            className="w-11 h-11 rounded-full object-cover border border-[#E6E0D6] shrink-0"
          />
          <div className="min-w-0">
            <h3 className="text-base font-bold text-charcoal truncate">
              Dads Expectation
            </h3>
            <p className="text-xs text-slate-muted truncate">
              High-Standards Auditor · Free AI · Zero setup
            </p>
          </div>
        </div>
      </div>

      {/* Messages layout */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-3.5 pr-1 text-[13.5px] leading-relaxed mb-4 scroll-smooth"
      >
        {messages.map((msg) => {
          const isDad = msg.sender === "dad";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isDad ? "justify-start" : "justify-end"
              }`}
            >
              {isDad &&
                (msg.isError ? (
                  <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertCircle className="w-3.5 h-3.5 text-[#D92D20]" />
                  </div>
                ) : (
                  <SafeIllustration
                    src={dadPortrait}
                    alt="Dad"
                    fallbackLabel="D"
                    className="w-7 h-7 rounded-full object-cover border border-[#E6E0D6] shrink-0 mt-0.5"
                  />
                ))}

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl break-words ${
                  msg.isError
                    ? "bg-rose-50 text-rose-800 font-medium rounded-tl-sm border border-rose-200 space-y-2"
                    : isDad
                      ? "bg-[#F4EFE6] text-charcoal font-normal rounded-tl-sm"
                      : "bg-[#181615] text-white rounded-tr-sm font-medium"
                }`}
              >
                <p>{msg.text}</p>
                {msg.isError && msg.retryText && (
                  <button
                    type="button"
                    onClick={() => handleRetry(msg.id, msg.retryText!)}
                    disabled={isTyping}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#D92D20] hover:underline cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start gap-2.5 justify-start">
            <SafeIllustration
              src={dadPortrait}
              alt="Dad thinking"
              fallbackLabel="D"
              className="w-7 h-7 rounded-full object-cover border border-[#E6E0D6] shrink-0 mt-0.5"
            />
            <div className="bg-[#F4EFE6] text-slate-muted italic px-4 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D92D20]" />
              <span>{loadingText}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick prompt buttons + input form */}
      <div className="space-y-2.5 shrink-0 pt-3 border-t border-[#E6E0D6]">
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(prompt)}
              disabled={isTyping}
              className="text-xs font-medium bg-[#FAF8F5] hover:bg-[#F4EFE6] py-1.5 px-3 rounded-lg text-charcoal border border-[#E6E0D6] cursor-pointer transition-colors disabled:opacity-40 whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            maxLength={500}
            disabled={isTyping}
            placeholder={
              isTyping
                ? "Dad is reviewing your response..."
                : "Tell Dad what you achieved today..."
            }
            className="flex-grow text-sm px-4 py-2.5 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] text-charcoal outline-none transition-colors focus:bg-white focus:border-[#D92D20] disabled:opacity-50"
            required
          />
          <button
            type="submit"
            disabled={isTyping || !inputVal.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#D92D20] hover:bg-[#B42318] text-white transition-colors cursor-pointer disabled:opacity-40 flex items-center gap-1.5 text-sm font-semibold shrink-0"
            aria-label="Send message to Dad"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
