"use client";
import React, { useEffect, useState } from "react";

const DEFAULT_TAGLINES = [
  "Read with intention, grow with every page.",
  "Where calm minds meet good books.",
  "Mindful stories for meaningful moments.",
  "Because your next read deserves reflection.",
  "Books that breathe — thoughts that stay.",
  "Pause. Read. Reflect.",
  "Stories that linger, lessons that last.",
  "Curated for balance, read with purpose.",
  "Gentle words, lasting wisdom.",
  "For readers who read to understand, not escape.",
];

/**
 * FooterRotating — Client-only rotating footer for Mindful Reader.
 *
 * Props:
 *  - taglines: array of strings (optional)
 *  - intervalMs: number (ms) | 0 to disable auto-rotate (default 5 min)
 *  - initial: 'random' | number (index) (default 'random')
 *  - siteName: string (default 'Mindful Reader')
 */
export default function FooterRotating({
  taglines = DEFAULT_TAGLINES,
  intervalMs = 1000 * 60 * 5,
  initial = "random",
  siteName = "Mindful Reader",
}) {
  const safeTaglines =
    Array.isArray(taglines) && taglines.length ? taglines : DEFAULT_TAGLINES;

  const serverIndex = 0;
  const [index, setIndex] = useState(serverIndex);

  useEffect(() => {
    let mountedInitialIndex = serverIndex;
    if (typeof initial === "number" && Number.isInteger(initial)) {
      mountedInitialIndex = Math.max(
        0,
        Math.min(initial, safeTaglines.length - 1)
      );
    } else {
      mountedInitialIndex = Math.floor(Math.random() * safeTaglines.length);
    }

    if (mountedInitialIndex !== serverIndex) setIndex(mountedInitialIndex);

    if (intervalMs && intervalMs > 0 && safeTaglines.length > 1) {
      const id = setInterval(() => {
        setIndex((i) => (i + 1) % safeTaglines.length);
      }, intervalMs);
      return () => clearInterval(id);
    }
  }, [intervalMs, initial, safeTaglines.length]);

  const tagline = safeTaglines[index];

  return (
    <footer className="bg-[#F5F3E7] border-t border-[#DAD7CD]">
      <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-[#3E5E4D] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Tagline Area */}
        <div className="flex items-center gap-3">
          <span className="text-[#A8BDA5] font-semibold">{siteName}</span>
          <span aria-hidden className="text-[#3E5E4D]">
            —
          </span>
          <span className="sr-only">Tagline:</span>

          {/* aria-live for rotation updates */}
          <span
            className="text-[#3E5E4D] italic"
            aria-live="polite"
            aria-atomic="true"
            title={tagline}
          >
            {tagline}
          </span>
        </div>

        {/* Copyright */}
        <div className="text-[#3E5E4D] text-xs opacity-80">
          © {new Date().getFullYear()} {siteName}
        </div>
      </div>
    </footer>
  );
}
