"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { APIROUTE } from "@/config/constants";

const DUMMY_AUTHORS = [
  {
    id: "eckhart-tolle",
    name: "Eckhart Tolle",
    theme: "Mindfulness",
    tagline: "Author of 'The Power of Now' and 'Stillness Speaks'",
    bio: "Writes about presence, awareness, and finding peace within.",
    quote: "Realize deeply that the present moment is all you ever have.",
    avatar: "/illustrations/undraw_male_avatar.svg",
  },
  {
    id: "tara-brach",
    name: "Tara Brach",
    theme: "Reflection",
    tagline: "Author of 'Radical Acceptance' and 'Radical Compassion'",
    bio: "Brings mindfulness and compassion together for healing.",
    quote: "The boundary to what we can accept is the boundary to our freedom.",
    avatar: "/illustrations/undraw_female_avatar.svg",
  },
  {
    id: "paulo-coelho",
    name: "Paulo Coelho",
    theme: "Philosophy",
    tagline: "Author of 'The Alchemist'",
    bio: "Weaves stories of destiny, courage, and purpose.",
    quote:
      "When you want something, all the universe conspires in helping you to achieve it.",
    avatar: "/illustrations/undraw_male_avatar.svg",
  },
  {
    id: "mary-oliver",
    name: "Mary Oliver",
    theme: "Poetry",
    tagline: "Poet of nature and reflection",
    bio: "Finds the divine in stillness, simplicity, and the natural world.",
    quote:
      "Tell me, what is it you plan to do with your one wild and precious life?",
    avatar: "/illustrations/undraw_female_avatar.svg",
  },
  {
    id: "thich-nhat-hanh",
    name: "Thich Nhat Hanh",
    theme: "Mindfulness",
    tagline: "Zen master and peace activist",
    bio: "Wrote about the art of mindful living and interbeing.",
    quote: "Smile, breathe, and go slowly.",
    avatar: "/illustrations/undraw_male_avatar.svg",
  },
];

const THEMES = [
  "All",
  "Mindfulness",
  "Reflection",
  "Poetry",
  "Philosophy",
  "Fiction",
];

export default function DiscoverAuthorsPage() {
  const [activeTheme, setActiveTheme] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DUMMY_AUTHORS.filter((a) => {
      const themeOk = activeTheme === "All" ? true : a.theme === activeTheme;
      const text = (a.name + " " + a.bio).toLowerCase();
      const searchOk = q ? text.includes(q) : true;
      return themeOk && searchOk;
    });
  }, [activeTheme, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const toggleTheme = (t) => {
    if (activeTheme === t || t === "All") setActiveTheme("All");
    else setActiveTheme(t);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* Hero */}
      <header className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div
          style={{ animation: "float 7s ease-in-out infinite" }}
          className="mx-auto mb-6 w-[220px]"
        >
          <Image
            src="/illustrations/writer.svg"
            alt="Writers illustration"
            width={220}
            height={160}
            className="mx-auto w-full h-auto object-contain"
            priority
          />
        </div>

        <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold leading-tight mb-3">
          Discover Authors Who Write from the Heart
        </h1>
        <p className="text-[#4A5B4D] max-w-2xl mx-auto text-lg leading-relaxed">
          Each story begins with a voice — explore the people behind the words.
        </p>
      </header>

      {/* Theme Filter + Search */}
      <section className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {THEMES.map((t) => {
              const active =
                activeTheme === t || (t === "All" && activeTheme === "All");
              return (
                <button
                  key={t}
                  onClick={() => toggleTheme(t)}
                  aria-label={`Filter by ${t}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-[#A8BDA5] text-white shadow-sm"
                      : "bg-white border border-[#E7DCCB] text-[#3E5E4D] hover:shadow"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Soft Search */}
          <form
            onSubmit={handleSearch}
            className="ml-auto flex items-center gap-3 w-full md:max-w-sm"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Find an author or keyword..."
                aria-label="Search authors"
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

      {/* Author Grid */}
      <main className="max-w-6xl mx-auto transition-opacity duration-300">
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div
              style={{ animation: "float 6s ease-in-out infinite" }}
              className="mx-auto mb-6 w-40"
            >
              <Image
                src="/illustrations/meditation.svg"
                alt="Empty state illustration"
                width={160}
                height={160}
                className="mx-auto"
              />
            </div>
            <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
              No voices found for this theme yet.
            </h2>
            <p className="text-[#6B705C] max-w-xl mx-auto">
              Try another theme or search for an author you love.
            </p>
          </div>
        ) : (
          <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link
                key={a.id}
                href={`${APIROUTE.singleAuthor}${a.id}`}
                className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#A8BDA5]"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                    <Image
                      src={a.avatar}
                      alt={`${a.name} portrait`}
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <h3 className="font-['Playfair Display'] text-xl font-semibold text-[#2b2b2b]">
                    {a.name}
                  </h3>
                  <p className="text-sm text-[#6b705c] mt-1 mb-2">
                    {a.tagline}
                  </p>
                  <p className="text-sm text-[#4A5B4D] leading-relaxed italic mb-4">
                    “{a.quote}”
                  </p>

                  <span className="text-sm text-[#A8BDA5] font-semibold hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      {/* Reflective Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 2.4s ease-in forwards",
          animationDelay: "1.2s",
        }}
      >
        <p className="italic text-[#4A5B4D]">
          “A writer only begins a book. A reader finishes it.”
        </p>
        <p className="mt-2 text-sm text-[#6B705C]">— Samuel Johnson</p>
      </footer>

      {/* Soft Join CTA */}
      <div className="max-w-3xl mx-auto mt-20 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Join Mindful Reader
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Connect with thoughtful voices and discover the stories that move you.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

      {/* Animations */}
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
