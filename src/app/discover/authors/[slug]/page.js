"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { APIROUTE } from "@/config/constants";

// Dummy data (will later be dynamic)
const AUTHOR_DATA = {
  id: "eckhart-tolle",
  name: "Eckhart Tolle",
  theme: "Mindfulness",
  tagline: "Author of 'The Power of Now' and 'A New Earth'",
  bio: `Eckhart Tolle is a spiritual teacher and author known for his profound work
  on presence and consciousness. His teachings invite us to awaken from mental
  patterns and live deeply rooted in the present moment. In 'The Power of Now'
  and 'A New Earth,' Tolle offers practical guidance to help people break free
  from identification with the mind and discover peace in the now.`,
  quote: "“Realize deeply that the present moment is all you ever have.”",
  avatar: "/illustrations/undraw_male_avatar.svg",
  books: [
    {
      id: "power-of-now",
      title: "The Power of Now",
      cover: "/illustrations/book-placeholder.svg",
      description: "A guide to spiritual enlightenment and presence.",
    },
    {
      id: "a-new-earth",
      title: "A New Earth",
      cover: "/illustrations/book-placeholder.svg",
      description: "Awakening to your life's true purpose.",
    },
  ],
  reflections: [
    {
      id: 1,
      quote:
        "Tolle’s writing feels like a gentle invitation to return home to myself.",
      reader: "Amira S.",
    },
    {
      id: 2,
      quote:
        "Every page reminds me that peace isn’t something to find — it’s something to allow.",
      reader: "David M.",
    },
  ],
};

export default function AuthorDetailPage({ params }) {
  const { slug } = useParams();
  console.log(slug);
  const author = AUTHOR_DATA;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* Hero Section */}
      <header className="max-w-5xl mx-auto text-center mb-12 animate-fadeIn">
        <div
          style={{ animation: "float 7s ease-in-out infinite" }}
          className="mx-auto mb-6 w-[180px]"
        >
          <Image
            src={author.avatar}
            alt={author.name}
            width={180}
            height={180}
            className="mx-auto rounded-full shadow-sm border border-[#E7DCCB] bg-white"
            priority
          />
        </div>

        <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold leading-tight mb-2">
          {author.name}
        </h1>
        <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-[#A8BDA5] text-white">
          {author.theme}
        </span>
        <p className="mt-4 text-lg italic text-[#4A5B4D]">{author.quote}</p>
      </header>

      {/* Bio */}
      <section className="max-w-3xl mx-auto mb-16 text-center md:text-left">
        <p className="text-[#4A5B4D] leading-relaxed text-lg whitespace-pre-line">
          {author.bio}
        </p>
      </section>

      {/* Books by this Author */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-center md:text-left">
          Books by {author.name}
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {author.books.map((book) => (
            <article
              key={book.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex gap-4">
                <div className="w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                  <Image
                    src={book.cover}
                    alt={book.title}
                    width={120}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-['Playfair Display'] text-lg font-semibold text-[#2b2b2b]">
                    {book.title}
                  </h3>
                  <p className="text-sm text-[#6b705c] mt-1">
                    {book.description}
                  </p>
                  <Link
                    href={`${APIROUTE.singleBook}${book.id}`}
                    className="text-sm text-[#A8BDA5] font-semibold hover:underline mt-3 inline-block"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reader Reflections */}
      <section className="max-w-4xl mx-auto mb-20 text-center">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6">
          What Readers Say
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {author.reflections.map((r) => (
            <blockquote
              key={r.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-[#E7DCCB]/60"
            >
              <p className="italic text-[#4A5B4D] mb-3">“{r.quote}”</p>
              <p className="text-sm text-[#6B705C]">— {r.reader}</p>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Reflective Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 1.6s ease-in forwards",
          animationDelay: "1s",
        }}
      >
        <p className="italic text-[#4A5B4D]">
          “To write is to make a bridge between silence and sound.”
        </p>
        <p className="mt-2 text-sm text-[#6B705C]">— Unknown</p>
      </footer>

      {/* Join CTA */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Join Mindful Reader
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Save your favorite authors and discover stories that resonate with
          your journey.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

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
