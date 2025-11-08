"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { APIROUTE } from "@/config/constants";
import { DEFAULTS, safeGet } from "@/config/defaults";
import { toast } from "react-toastify";
import { getAllBooks } from "@/services/BookService";
import SafeImage from "@/utilities/SafeImage";

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
  const [books, setBooks] = useState([]);
  const [activeMood, setActiveMood] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const observerRef = useRef(null);

  // 🌿 Fetch books
  const fetchBooks = async (newOffset = 0, append = false) => {
    if (!hasMore && append) return;

    const isInitial = newOffset === 0 && !append;
    if (isInitial) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getAllBooks({ offset: newOffset, limit: 20 });
      const newItems = data?.items || [];

      setBooks((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(data?.hasMore ?? false);
      setOffset(newOffset);
    } catch (err) {
      toast.error(err?.friendlyMessage || "Could not load books right now.");
    } finally {
      if (isInitial) setLoading(false);
      setLoadingMore(false);
    }
  };

  // 🔄 Initial fetch
  useEffect(() => {
    fetchBooks(0, false);
  }, []);

  // 🔍 Filter books
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return books.filter((b) => {
      const moodOk = activeMood === "All" ? true : b.mood === activeMood;
      const text = (
        b.title +
        " " +
        safeGet(b.author?.fullName, "")
      ).toLowerCase();
      const searchOk = q ? text.includes(q) : true;
      return moodOk && searchOk;
    });
  }, [books, activeMood, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const toggleMood = (m) => {
    setActiveMood(activeMood === m || m === "All" ? "All" : m);
  };

  // 👀 Infinite scroll observer
  useEffect(() => {
    if (loading || loadingMore) return;
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loadingMore) {
          fetchBooks(offset + 1, true);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset, hasMore, loadingMore, loading]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌸 Header */}
      <header className="max-w-4xl mx-auto text-center mb-10 animate-fadeIn">
        <div
          style={{ animation: "float 7s ease-in-out infinite" }}
          className="mx-auto mb-6 w-[220px]"
        >
          <Image
            src={DEFAULTS.illustrations.bookshelf}
            alt="Bookshelf illustration"
            width={220}
            height={160}
            className="mx-auto object-contain"
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

      {/* 🎨 Filters + Search */}
      <section className="max-w-5xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          {/* Mood filter */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {MOODS.map((m) => {
              const active =
                activeMood === m || (m === "All" && activeMood === "All");
              return (
                <button
                  key={m}
                  onClick={() => toggleMood(m)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-[#A8BDA5] text-white shadow-sm"
                      : "bg-white border border-[#E7DCCB] text-[#3E5E4D] hover:shadow-sm"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="ml-auto flex items-center gap-3 w-full md:max-w-sm"
          >
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Find a title or author..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-full px-4 py-3 bg-white border border-[#E7DCCB] placeholder-[#a07b5a] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none shadow-sm"
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

      {/* 🪶 Book Grid */}
      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-[#6B705C] italic py-10">
            Fetching your mindful reads...
          </p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div
              style={{ animation: "float 6s ease-in-out infinite" }}
              className="mx-auto mb-6 w-40"
            >
              <Image
                src={DEFAULTS.illustrations.meditation}
                alt="Empty state"
                width={160}
                height={160}
                className="mx-auto"
              />
            </div>
            <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
              Take a breath.
            </h2>
            <p className="text-[#6B705C] max-w-xl mx-auto">
              What kind of story do you need today? Try another mood or search
              for a title or author.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((b) => (
                <Link key={b.bookId} href={`${APIROUTE.singleBook}${b.bookId}`}>
                  <article className="bg-white rounded-2xl p-5 shadow hover:shadow-lg transition transform hover:-translate-y-2 cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-24 h-32 shrink-0 rounded-md overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                        <SafeImage
                          src={b?.coverImageUrl}
                          fallbackSrc={DEFAULTS.book.coverImageUrl}
                          alt={safeGet(b.title, DEFAULTS.book.title)}
                          width={120}
                          height={220}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-['Playfair Display'] text-lg font-semibold text-[#2b2b2b]">
                          {safeGet(b.title, DEFAULTS.book.title)}
                        </h3>
                        <p className="text-sm text-[#6b705c] mt-1 mb-3">
                          {safeGet(
                            b.author?.fullName,
                            DEFAULTS.book.authorName
                          )}
                        </p>
                        <p className="text-sm text-[#4A5B4D] leading-relaxed mb-4">
                          {DEFAULTS.book.quote}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-[#f3f2ee] border border-[#e7e3d9] text-[#6b705c]">
                            {safeGet(b.genre, DEFAULTS.book.genre)}
                          </span>
                          <span className="text-sm text-[#A8BDA5] font-semibold hover:underline">
                            Read more →
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
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
                  <p className="text-[#6B705C] italic">Loading more...</p>
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
