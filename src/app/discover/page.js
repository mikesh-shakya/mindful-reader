"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { APIROUTE } from "@/config/constants";
import { DEFAULTS } from "@/config/defaults";

export default function DiscoverPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5] text-[#3E5E4D] px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="font-serif text-4xl font-bold mb-3">
          Discover Mindful Reading
        </h1>
        <p className="text-[#4A5B4D] text-lg max-w-2xl mx-auto leading-relaxed">
          Take a pause, breathe, and choose your path. Would you like to explore{" "}
          <em>stories</em> or the <em>voices</em> behind them?
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Books Card */}
        <Link
          href={`${APIROUTE.allBook}`}
          className="group bg-white border border-[#E7DCCB] rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
        >
          <div
            style={{
              animation: "float 8s ease-in-out infinite",
              transformOrigin: "center",
            }}
            className="mb-6"
          >
            <Image
              src={DEFAULTS.illustrations.readingBook}
              alt="Discover Books"
              width={220}
              height={220}
              className="w-auto h-auto mx-auto"
              priority
            />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#3E5E4D] mb-2">
            Discover Books
          </h2>
          <p className="text-sm text-[#4A5B4D] max-w-xs leading-relaxed">
            Explore stories that resonate with your present moment. From
            peaceful reflections to bold adventures.
          </p>
          <div className="mt-4 text-[#A8BDA5] font-semibold group-hover:underline">
            Explore →
          </div>
        </Link>

        {/* Authors Card */}
        <Link
          href={`${APIROUTE.allAuthors}`}
          className="group bg-white border border-[#E7DCCB] rounded-2xl p-8 flex flex-col items-center text-center shadow-md hover:shadow-xl transition transform hover:-translate-y-2"
        >
          <div
            style={{
              animation: "float 8s ease-in-out infinite",
              transformOrigin: "center",
            }}
            className="mb-6"
          >
            <Image
              src={DEFAULTS.illustrations.writer}
              alt="Discover Authors"
              width={220}
              height={220}
              className="w-auto h-auto mx-auto"
              priority
            />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-[#3E5E4D] mb-2">
            Discover Authors
          </h2>
          <p className="text-sm text-[#4A5B4D] max-w-xs leading-relaxed">
            Meet the voices behind your favorite books. Discover their wisdom,
            style, and perspective.
          </p>
          <div className="mt-4 text-[#A8BDA5] font-semibold group-hover:underline">
            Explore →
          </div>
        </Link>
      </div>

      {/* Reflective Quote */}
      <div className="mt-20 text-center animate-fadeIn max-w-2xl">
        <p className="italic text-[#4A5B4D]">
          “The act of discovery is not in finding new lands, but in seeing with
          new eyes.”
        </p>
        <p className="mt-2 text-sm text-[#6B705C]">— Marcel Proust</p>
      </div>

      {/* Inline Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
