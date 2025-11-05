"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { APIROUTE } from "@/config/constants";

/* Dummy book data (replace with API later) */
const DUMMY_BOOKS = [
  {
    id: "stillness-speaks",
    title: "Stillness Speaks",
    author: "Eckhart Tolle",
    mood: "Stillness",
    quote: "A quiet invitation into the present.",
    cover: "/illustrations/book-placeholder.svg",
  },
  {
    id: "book-of-joy",
    title: "The Book of Joy",
    author: "Dalai Lama & Desmond Tutu",
    mood: "Joy",
    quote: "Gentle practices for a softer heart.",
    cover: "/illustrations/book-placeholder.svg",
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    mood: "Growth",
    quote: "Small changes, lasting transformation.",
    cover: "/illustrations/book-placeholder.svg",
  },
  {
    id: "the-alchemist",
    title: "The Alchemist",
    author: "Paulo Coelho",
    mood: "Adventure",
    quote: "A tender journey to the heart of desire.",
    cover: "/illustrations/book-placeholder.svg",
  },
  {
    id: "the-art-of-dying",
    title: "The Art of Dying",
    author: "Peter Fenwick",
    mood: "Reflection",
    quote: "A thoughtful look at endings and meaning.",
    cover: "/illustrations/book-placeholder.svg",
  },
  {
    id: "radical-compassion",
    title: "Radical Compassion",
    author: "Tenzin Palmo",
    mood: "Healing",
    quote: "Soft practices for an open heart.",
    cover: "/illustrations/book-placeholder.svg",
  },
];

const MOODS = [
  "All",
  "Stillness",
  "Growth",
  "Joy",
  "Reflection",
  "Healing",
  "Adventure",
  "Trauma",
];

export default function DiscoverBooksPage() {
  const [activeMood, setActiveMood] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Filtered books based on mood + search (title or author)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DUMMY_BOOKS.filter((b) => {
      const moodOk = activeMood === "All" ? true : b.mood === activeMood;
      const text = (b.title + " " + b.author).toLowerCase();
      const searchOk = q ? text.includes(q) : true;
      return moodOk && searchOk;
    });
  }, [activeMood, search]);

  // handle search submit (Enter or button)
  const handleSearchSubmit = (e) => {
    e?.preventDefault?.();
    setSearch(searchInput);
  };

  // toggle mood (click again to clear)
  const toggleMood = (m) => {
    if (activeMood === m || m === "All") {
      setActiveMood("All");
    } else {
      setActiveMood(m);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* Header / Hero */}
      <header className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div
          style={{
            animation: "float 7s ease-in-out infinite",
            transformOrigin: "center",
          }}
          className="mx-auto mb-6 w-[220px]"
        >
          {/* gentle bookshelf/book SVG — optional, replace with your SVG */}
          <Image
            src="/illustrations/bookshelves.svg"
            alt="Bookshelf illustration"
            width={220}
            height={160}
            className="mx-auto w-full h-auto object-contain"
            priority
          />
        </div>

        <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold leading-tight mb-3">
          Discover Books for Every Mood
        </h1>
        <p className="text-[#4A5B4D] max-w-2xl mx-auto text-lg leading-relaxed">
          Take a breath. Choose how you’d like to feel — or softly search for a
          title or author.
        </p>
      </header>

      {/* Controls: Mood filters + soft search */}
      <section className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Mood pills */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {MOODS.map((m) => {
              const active =
                activeMood === m || (m === "All" && activeMood === "All");
              return (
                <button
                  key={m}
                  onClick={() => toggleMood(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-shadow ${
                    active
                      ? "bg-[#A8BDA5] text-white shadow-md"
                      : "bg-white border border-[#E7DCCB] text-[#3E5E4D] hover:shadow-sm"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Soft search — blends in visually */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex items-center gap-3 w-full md:max-w-sm"
          >
            <div className="relative w-full">
              <input
                type="search"
                aria-label="Find a title or author"
                placeholder="Find a title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-white border border-[#E7DCCB] placeholder-[#a07b5a] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none shadow-sm"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1.5 px-3 py-1 rounded-full bg-[#A8BDA5] text-white text-sm hover:bg-[#8FA98B] transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <hr className="max-w-5xl mx-auto border-t border-[#E7DCCB]/50 my-12" />

      {/* Book Grid */}
      <main className="max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          // Empty state
          <div className="text-center py-20 animate-fadeIn">
            <div
              style={{
                animation: "float 6s ease-in-out infinite",
                transformOrigin: "center",
              }}
              className="mx-auto mb-6 w-40"
            >
              <Image
                src="/illustrations/meditation.svg"
                alt="Reading illustration"
                width={160}
                height={160}
                className="mx-auto"
              />
            </div>
            <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
              Take a breath.
            </h2>
            <p className="text-[#6B705C] max-w-xl mx-auto">
              What kind of story do you need today? Try a different mood or
              search for a title or author.
            </p>
          </div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((b) => (
              <Link key={b.id} href={`${APIROUTE.singleBook}${b.id}`}>
                <article className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition transform hover:-translate-y-2 cursor-pointer">
                  <div className="flex items-start gap-4">
                    {/* cover */}
                    <div className="w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                      <Image
                        src={b.cover}
                        alt={`${b.title} cover`}
                        width={160}
                        height={220}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* body */}
                    <div className="flex-1">
                      <h3 className="font-['Playfair Display'] text-lg leading-tight font-semibold text-[#2b2b2b]">
                        {b.title}
                      </h3>
                      <p className="text-sm text-[#6b705c] mt-1 mb-3">
                        {b.author}
                      </p>

                      <p className="text-sm text-[#4A5B4D] leading-relaxed mb-4">
                        {b.quote}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#f3f2ee] border border-[#e7e3d9] text-[#6b705c]">
                          {b.mood}
                        </span>

                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-sm text-[#A8BDA5] font-semibold hover:underline">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        )}
      </main>

      {/* Reflective footer quote with delayed fade-in */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 1.6s ease-in forwards",
          animationDelay: "1s",
        }}
      >
        <p className="italic text-[#4A5B4D]">
          “A book is a dream you hold in your hands.”
        </p>
        <p className="mt-2 text-sm text-[#6B705C]">— Neil Gaiman</p>
      </footer>

      {/* Soft Join CTA */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Create your mindful bookshelf
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Curate your peaceful reading space and save stories that speak to your
          soul.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

      {/* Local keyframes for float + quote fade (isolated to this page) */}
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
