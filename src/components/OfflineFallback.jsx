"use client";
import { DEFAULTS } from "@/config/defaults";
import Image from "next/image";

export default function OfflineFallback({
  title = "Mindful Reader is taking a pause.",
  message = `We’re having trouble connecting right now.`,
  onRetry,
}) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center text-[#3E5E4D] px-4 bg-[#FAF9F5] animate-fadeIn">
      <Image
        src={DEFAULTS.illustrations.connectionLost}
        alt="Connection Lost"
        width={240}
        height={200}
        className="mb-6"
      />
      <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-2">
        {title}
      </h2>
      <p className="text-[#4A5B4D] text-sm max-w-md mb-6">
        {message || "Take a breath, check your connection, and try again soon."}
      </p>
      <button
        onClick={onRetry || (() => window.location.reload())}
        className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
      >
        Try Again
      </button>
    </div>
  );
}
