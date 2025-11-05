"use client";

import Link from "next/link";
import Image from "next/image";
import { APIROUTE } from "../config/constants";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#FAF9F5] text-[#3E5E4D] px-6 py-20 animate-fadeIn">
      {/* Illustration */}
      <div
        style={{
          animation: "float 6s ease-in-out infinite",
          transformOrigin: "center",
        }}
        className="mb-10"
      >
        <Image
          src="/illustrations/page-not-found.svg"
          alt="Page not found"
          width={280}
          height={280}
          className="w-full max-w-sm h-auto object-contain"
          priority
        />
      </div>

      {/* Title */}
      <h1 className="font-serif text-5xl font-bold mb-3 text-[#3E5E4D]">
        404 — Page Not Found
      </h1>

      {/* Message */}
      <p className="text-[#4A5B4D] text-lg max-w-xl leading-relaxed mb-8">
        It seems you’ve wandered off the page. Perhaps take a mindful pause, or
        head back home to rediscover your story.
      </p>

      {/* Actions */}
      <div className="flex gap-4">
        <Link
          href={`${APIROUTE.home}`}
          className="px-6 py-2.5 rounded-lg bg-[#A8BDA5] text-white font-semibold hover:bg-[#8FA98B] transition"
        >
          Go Home
        </Link>
        <Link
          href={`${APIROUTE.discover}`}
          className="px-6 py-2.5 rounded-lg border border-[#A8BDA5] text-[#3E5E4D] hover:bg-[#EFF2EC] transition"
        >
          Discover
        </Link>
      </div>

      {/* Quote (slower fade-in) */}
      <div
        className="mt-16 text-center text-sm text-[#6B705C] max-w-md italic"
        style={{
          opacity: 0,
          animation: "fadeInQuote 1.8s ease-in forwards",
          animationDelay: "1.2s", // Delays fade until main content settles
        }}
      >
        “Not all those who wander are lost.”
        <div className="mt-1 text-[#4A5B4D]">— J.R.R. Tolkien</div>
      </div>

      {/* Inline Animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes fadeInQuote {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
