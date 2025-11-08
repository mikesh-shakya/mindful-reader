"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { getBook } from "@/services/BookService";
import { DEFAULTS, safeGet } from "@/config/defaults";
import { APIROUTE } from "@/config/constants";
import BookReflections from "@/components/BookReflections";
import SafeImage from "@/utilities/SafeImage";
import { formatDate } from "@/utilities/DateFormatter";

export default function BookDetailPage() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌿 Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await getBook(slug);
        setBook(data);
      } catch (err) {
        toast.error(err?.friendlyMessage || "Unable to load book details.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBook();
  }, [slug]);

  // 🪷 Loading and Empty States
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B705C] italic">
        Fetching your mindful read...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-[#6B705C]">
        <Image
          src={DEFAULTS.illustrations.meditation}
          alt="Book not found"
          width={160}
          height={160}
          className="mb-6"
        />
        <p className="text-lg font-medium">This book could not be found.</p>
        <Link
          href={APIROUTE.discoverBooks}
          className="text-[#A8BDA5] font-semibold hover:underline mt-2"
        >
          Back to Discover Books →
        </Link>
      </div>
    );

  // 🧩 Destructure with fallbacks
  const author = book.author || {};
  const tags = book.tags || [];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌸 Hero Section */}
      <header className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-10 mb-16 animate-fadeIn">
        <div
          style={{ animation: "float 6s ease-in-out infinite" }}
          className="w-[220px] md:w-[260px] shrink-0"
        >
          <SafeImage
            src={book?.coverImageUrl}
            fallbackSrc={DEFAULTS.book.coverImageUrl}
            alt={safeGet(book.title, DEFAULTS.book.title)}
            width={260}
            height={360}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1">
          <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold text-[#2b2b2b] mb-3">
            {safeGet(book.title, DEFAULTS.book.title)}
          </h1>
          <span className="text-[#A8BDA5] ps-3 font-semibold text-lg"> - </span>
          <Link
            href={`${APIROUTE.singleAuthor}${safeGet(author.authorId, "")}`}
            className="text-[#A8BDA5] font-semibold text-lg hover:underline"
          >
            {safeGet(author.fullName, DEFAULTS.book.authorName)}
          </Link>
          <p className="italic text-[#4A5B4D] mt-4 text-lg">
            {safeGet(book.quote, DEFAULTS.book.quote)}
          </p>
        </div>
      </header>

      {/* 📖 Description */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-4">
          About the Book
        </h2>
        <p className="text-[#4A5B4D] leading-relaxed text-lg whitespace-pre-line">
          {safeGet(book.description, DEFAULTS.book.description)}
        </p>
      </section>

      {/* 🪶 Details */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-4">
          Book Details
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm text-[#4A5B4D]">
          <div>
            <span className="block text-[#6B705C] font-medium">Genre</span>
            {safeGet(book.genre, DEFAULTS.book.genre)}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Language</span>
            {safeGet(book.language, DEFAULTS.book.language)}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Pages</span>
            {book.pageCount || "-"}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Published</span>
            {formatDate(book.publicationDate)}
          </div>
        </div>
      </section>

      {/* 🌼 Reflection */}
      {book.reflection && (
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-4">
            Why This Book Matters
          </h2>
          <blockquote className="bg-white p-6 rounded-2xl shadow-sm border border-[#E7DCCB]/60">
            <p className="italic text-[#4A5B4D] leading-relaxed text-lg">
              {book.reflection}
            </p>
          </blockquote>
        </section>
      )}

      {/* 💬 Reader Reflections */}
      <div className="max-w-5xl mx-auto mb-20">
        <BookReflections bookId={book.bookId} />
      </div>

      {/* 🏷️ Tags */}
      {tags.length > 0 && (
        <section className="max-w-4xl mx-auto mb-16">
          <h3 className="font-['Playfair Display'] text-xl font-semibold mb-3">
            Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#A8BDA5]/20 text-[#3E5E4D] px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ✍️ Author Highlight */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5B4D] mb-3">Interested in more from</p>
        <Link
          href={`${APIROUTE.singleAuthor}${safeGet(author.authorId, "")}`}
          className="text-[#A8BDA5] font-semibold hover:underline text-lg"
        >
          {safeGet(author.fullName, DEFAULTS.book.authorName)}
        </Link>
        <p className="text-sm text-[#4A5B4D] mt-3">
          Explore other works and reflections.
        </p>
      </section>

      {/* 🪷 CTA */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Continue Your Journey
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Join Mindful Reader and discover stories that nurture reflection and
          peace.
        </p>
        <Link
          href={APIROUTE.signup}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

      {/* 🌿 Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 2.4s ease-in forwards",
          animationDelay: "1.2s",
        }}
      >
        <p className="italic text-[#4A5B4D]">{DEFAULTS.quotes[0]}</p>
      </footer>

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
