/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface SafeIllustrationProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export default function SafeIllustration({
  src,
  alt,
  className = "",
  fallbackLabel = "Editorial Illustration",
}: SafeIllustrationProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F3EC] to-[#EFE9DF] text-[#7A7167] p-4 ${className}`}
      >
        <Sparkles className="w-6 h-6 text-[#D92D20]/70 mb-1.5" />
        <span className="text-[11px] font-medium text-center">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
