"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { getAllAuthors } from "@/services/AuthorService";
import { APIROUTE } from "@/config/constants";
import { DEFAULTS, safeGet } from "@/config/defaults";
import SafeImage from "@/utilities/SafeImage";

const THEMES = [
  "All",
  "Mindfulness",
  "Reflection",
  "Poetry",
  "Philosophy",
  "Fiction",
];

export default function DiscoverAuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [activeTheme, setActiveTheme] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);

  // 🌿 Fetch authors from backend
  const fetchAuthors = async (newOffset = 0, append = false) => {
    if (!hasMore && append) return;
    const isInitial = newOffset === 0 && !append;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getAllAuthors({ offset: newOffset, limit: 20 });
      const newItems = data?.items || [];
      setAuthors((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(data?.hasMore ?? false);
      setOffset(newOffset);
    } catch (err) {
      toast.error(err?.friendlyMessage || "Unable to fetch authors right now.");
    } finally {
      if (isInitial) setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAuthors(0, false);
  }, []);

  // 👀 Infinite Scroll Observer
  useEffect(() => {
    if (loading || loadingMore) return;
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchAuthors(offset + 1, true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset, hasMore, loadingMore, loading]);

  // 🪶 Filter authors by theme and search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return authors.filter((a) => {
      const themeOk = activeTheme === "All" ? true : a.theme === activeTheme;
      const text = (a.fullName + " " + a.bio).toLowerCase();
      const searchOk = q ? text.includes(q) : true;
      return themeOk && searchOk;
    });
  }, [authors, activeTheme, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const toggleTheme = (t) => {
    setActiveTheme(activeTheme === t || t === "All" ? "All" : t);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌸 Header */}
      <header className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div
          style={{ animation: "float 7s ease-in-out infinite" }}
          className="mx-auto mb-6 w-[220px]"
        >
          <Image
            src={DEFAULTS.illustrations.writer}
            alt="Authors illustration"
            width={220}
            height={160}
            className="mx-auto object-contain"
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

      {/* 🎨 Filters + Search */}
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-[#A8BDA5] text-white shadow-sm"
                      : "bg-white border border-[#E7DCCB] text-[#3E5E4D] hover:shadow-sm"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* 🔍 Search */}
          <form
            onSubmit={handleSearch}
            className="ml-auto flex items-center gap-3 w-full md:max-w-sm"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Find an author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-white border border-[#E7DCCB] text-sm placeholder-[#a07b5a] focus:ring-2 focus:ring-[#A8BDA5] outline-none shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1 top-1.5 px-3 py-1 rounded-full bg-[#A8BDA5] text-white text-sm hover:bg-[#8FA98B] transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <hr className="max-w-5xl mx-auto border-t border-[#E7DCCB]/50 my-12" />

      {/* 🪶 Author Grid */}
      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-[#6B705C] italic py-10">
            Fetching mindful voices...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-[#6B705C] italic py-10">
            No authors found for this theme.
          </p>
        ) : (
          <>
            <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a) => (
                <Link
                  key={a.authorId}
                  href={`${APIROUTE.singleAuthor}${a.authorId}`}
                  className="block bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                      <SafeImage
                        src={a?.profilePictureUrl}
                        fallbackSrc={DEFAULTS.author.profilePictureUrl}
                        alt={safeGet(a.fullName, DEFAULTS.author.fullName)}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <h3 className="font-['Playfair Display'] text-xl font-semibold text-[#2b2b2b]">
                      {safeGet(a.fullName, DEFAULTS.author.fullName)}
                    </h3>
                    <p className="text-sm text-[#6b705c] mt-1 mb-2 italic line-clamp-2">
                      {safeGet(a.bio, DEFAULTS.author.bio)}
                    </p>
                    <p className="text-sm text-[#4A5B4D] italic mb-4">
                      “{safeGet(a.quote, DEFAULTS.author.quote)}”
                    </p>

                    <span className="text-sm text-[#A8BDA5] font-semibold hover:underline">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </section>

            {/* 👇 Sentinel for Infinite Scroll */}
            {hasMore && (
              <div
                ref={observerRef}
                className="h-16 flex justify-center items-center"
              >
                {loadingMore && (
                  <p className="text-[#6B705C] italic">
                    Loading more authors...
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>

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
      `}</style>
    </div>
  );
}
