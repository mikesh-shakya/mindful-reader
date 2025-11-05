"use client";

import React from "react";

export default function LoadingPage() {
  const quotes = [
    "Breathing in… good reads ahead.",
    "Turning pages mindfully.",
    "Every story begins with a pause.",
    "A quiet moment before your next chapter.",
    "Loading peace and prose...",
    "Your next page is almost here.",
    "Good stories take a breath too.",
    "Unfolding wisdom, one line at a time.",
    "A mindful pause before the magic begins.",
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5] text-[#3E5E4D] overflow-hidden">
      {/* Animated loader */}
      <div className="flex flex-col items-center gap-5 animate-fadeIn">
        <div className="w-12 h-12 border-4 border-[#A8BDA5] border-t-transparent rounded-full animate-spin" />

        <div className="text-center">
          <h1 className="font-serif text-xl font-semibold tracking-wide">
            Loading your mindful space...
          </h1>
          <p className="text-sm text-[#6B705C] italic mt-2">{quote}</p>
        </div>
      </div>
    </div>
  );
}
