"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { APIROUTE } from "@/config/constants";
import BookReflections from "@/components/BookReflections";

const BOOK_DATA = {
  id: "power-of-now",
  title: "The Power of Now",
  author: {
    id: "eckhart-tolle",
    name: "Eckhart Tolle",
  },
  cover: "/illustrations/book-placeholder.svg",
  quote: "“Realize deeply that the present moment is all you ever have.”",
  description: `This timeless guide to spiritual enlightenment teaches how to move beyond the mind and embrace presence. Eckhart Tolle invites readers to discover freedom through awareness, breaking free from identification with thoughts and stories.`,
  genre: "Mindfulness, Spirituality",
  published: "1997",
  pages: 236,
  language: "English",
  reflection: `This book is not one to be read once. It is a mirror — each time you open it, you find a different version of yourself staring back. It invites stillness, not as a practice, but as a homecoming.`,
  tags: ["presence", "spiritual growth", "consciousness"],
};

export default function BookDetailPage() {
  const { slug } = useParams();
  const book = BOOK_DATA;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* Hero Section */}
      <header className="max-w-5xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-10 mb-16 animate-fadeIn">
        <div
          style={{ animation: "float 6s ease-in-out infinite" }}
          className="w-[220px] md:w-[260px] flex-shrink-0"
        >
          <Image
            src={book.cover}
            alt={book.title}
            width={260}
            height={360}
            className="rounded-lg shadow-md border border-[#E7DCCB] bg-white object-cover"
            priority
          />
        </div>

        <div className="flex-1">
          <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold text-[#2b2b2b] mb-3">
            {book.title}
          </h1>
          <span className="text-[#A8BDA5] ps-3 font-semibold text-lg"> - </span>
          <Link
            href={`${APIROUTE.singleAuthor}${book.author.id}`}
            className="text-[#A8BDA5] font-semibold text-lg hover:underline"
          >
            {book.author.name}
          </Link>
          <p className="italic text-[#4A5B4D] mt-4 text-lg">{book.quote}</p>
        </div>
      </header>

      {/* Description */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-4">
          About the Book
        </h2>
        <p className="text-[#4A5B4D] leading-relaxed text-lg whitespace-pre-line">
          {book.description}
        </p>
      </section>

      {/* Details */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-4">
          Book Details
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-sm text-[#4A5B4D]">
          <div>
            <span className="block text-[#6B705C] font-medium">Genre</span>
            {book.genre}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Published</span>
            {book.published}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Pages</span>
            {book.pages}
          </div>
          <div>
            <span className="block text-[#6B705C] font-medium">Language</span>
            {book.language}
          </div>
        </div>
      </section>

      {/* Reflection */}
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

      {/* Reader Reflections */}
      <div className="max-w-5xl mx-auto mb-20">
        <BookReflections bookId={book.id} />
      </div>

      {/* Tags */}
      {book.tags && book.tags.length > 0 && (
        <section className="max-w-4xl mx-auto mb-16">
          <h3 className="font-['Playfair Display'] text-xl font-semibold mb-3">
            Themes
          </h3>
          <div className="flex flex-wrap gap-2">
            {book.tags.map((tag) => (
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

      {/* Author Highlight */}
      <section className="max-w-4xl mx-auto mb-16 bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5B4D] mb-3">Interested in more from</p>
        <Link
          href={`${APIROUTE.singleAuthor}${book.author.id}`}
          className="text-[#A8BDA5] font-semibold hover:underline text-lg"
        >
          {book.author.name}
        </Link>
        <p className="text-sm text-[#4A5B4D] mt-3">
          Explore other works and reflections.
        </p>
      </section>

      {/* CTA */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Continue Your Journey
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Join Mindful Reader and discover stories that nurture reflection and
          peace.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

      {/* Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 2.4s ease-in forwards",
          animationDelay: "1.2s",
        }}
      >
        <p className="italic text-[#4A5B4D]">
          “A book is a dream you hold in your hands.”
        </p>
        <p className="mt-2 text-sm text-[#6B705C]">— Neil Gaiman</p>
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
