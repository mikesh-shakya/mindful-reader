"use client";

import React from "react";
import Link from "next/link";
import { APIROUTE } from "@/config/constants";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] flex flex-col items-center px-6 py-20 animate-fadeIn">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mb-16">
        <h1 className="font-serif text-5xl font-bold mb-4">
          About <span className="text-[#A8BDA5]">Mindful Reader</span>
        </h1>
        <p className="text-[#4A5B4D] text-lg leading-relaxed">
          In a world that scrolls too fast, <strong>Mindful Reader</strong> is a
          gentle pause — a space where books meet presence. We believe reading
          isn’t about finishing pages, but about finding meaning between them.
        </p>
      </section>

      {/* Mission Quote */}
      <section className="bg-[#FFFDF9] border border-[#E7DCCB] shadow-sm rounded-2xl p-10 max-w-4xl text-center mb-20">
        <p className="font-serif text-2xl text-[#3E5E4D] leading-relaxed italic">
          “The more quietly you read, the more clearly the story speaks.”
        </p>
        <p className="mt-4 text-[#6B705C] text-sm">
          — The Mindful Reader Team 🌿
        </p>
      </section>

      {/* Core Values Grid */}
      <section className="grid gap-8 md:grid-cols-3 max-w-6xl mb-20">
        {[
          {
            icon: "🌿",
            title: "Presence",
            text: "We invite you to slow down. To breathe between paragraphs and notice how words make you feel — not just what they say.",
          },
          {
            icon: "📚",
            title: "Growth",
            text: "Books are companions on our inner journey. We believe every read can teach us something about who we are becoming.",
          },
          {
            icon: "💭",
            title: "Reflection",
            text: "Mindful Reader helps you capture your insights and moods — transforming reading into a habit of self-awareness.",
          },
        ].map((v) => (
          <div
            key={v.title}
            className="bg-white rounded-2xl shadow-lg border border-[#E7DCCB] p-8 hover:shadow-xl hover:translate-y-[-4px] transition transform"
          >
            <div className="text-4xl mb-4">{v.icon}</div>
            <h3 className="font-serif text-2xl font-semibold mb-3 text-[#3E5E4D]">
              {v.title}
            </h3>
            <p className="text-sm text-[#4A5B4D] leading-relaxed">{v.text}</p>
          </div>
        ))}
      </section>

      {/* Vision / Journey Section */}
      <section className="bg-[#F0EEE8] rounded-2xl border border-[#E2DACE] p-10 max-w-5xl text-center mb-16">
        <h2 className="font-serif text-3xl font-semibold mb-4">
          A Journey Back to Stillness
        </h2>
        <p className="text-[#4A5B4D] text-md leading-relaxed">
          Mindful Reader began as a simple idea — to rediscover joy in reading
          without hurry. We’re building a digital space that honors slowness,
          reflection, and genuine connection with words. Whether you’re reading
          for wisdom, comfort, or clarity, you belong here.
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center mt-10">
        <p className="text-sm text-[#4A5B4D] mb-4">
          Start your journey to mindful reading today.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="inline-block px-6 py-2.5 rounded-full bg-[#A8BDA5] text-white font-semibold hover:bg-[#8FA98B] transition"
        >
          Join Mindful Reader
        </Link>
        <p className="mt-3 text-xs text-[#6B705C] italic">
          It’s free to begin — just your curiosity and calm.
        </p>
      </section>
    </div>
  );
}
