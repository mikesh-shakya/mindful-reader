"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAuthor } from "@/services/AuthorService";
import { getAllBooksByAuthor } from "@/services/BookService";
import { toast } from "react-toastify";
import { DEFAULTS, safeGet } from "@/config/defaults";
import { APIROUTE } from "@/config/constants";
import SafeImage from "@/utilities/SafeImage";

export default function AuthorDetailPage() {
  const { slug } = useParams();
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🪷 Fetch author details + books
  useEffect(() => {
    const fetchAuthorData = async () => {
      setLoading(true);
      try {
        const authorData = await getAuthor(slug);
        setAuthor(authorData);

        const bookData = await getAllBooksByAuthor(slug, { limit: 6 });
        setBooks(bookData?.items || []);
      } catch (err) {
        toast.error(err?.friendlyMessage || "Unable to load author details.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAuthorData();
  }, [slug]);

  // 🌸 Loading or missing state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B705C] italic">
        Fetching mindful words...
      </div>
    );

  if (!author)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center text-[#6B705C]">
        <Image
          src={DEFAULTS.illustrations.meditation}
          alt="Not found"
          width={160}
          height={160}
          className="mb-6"
        />
        <p className="text-lg font-medium">Author not found.</p>
        <Link
          href={APIROUTE.discoverAuthors}
          className="text-[#A8BDA5] font-semibold hover:underline mt-2"
        >
          Return to Discover Authors →
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌿 Hero Section */}
      <header className="max-w-5xl mx-auto text-center mb-12 animate-fadeIn">
        <div
          style={{ animation: "float 7s ease-in-out infinite" }}
          className="mx-auto mb-6 w-[180px]"
        >
          <SafeImage
            src={author?.profilePictureUrl}
            fallbackSrc={DEFAULTS.author.profilePictureUrl}
            alt={safeGet(author.fullName, DEFAULTS.author.fullName)}
            width={180}
            height={180}
            className="mx-auto rounded-full shadow-sm border border-[#E7DCCB] bg-white"
          />
        </div>

        <h1 className="font-['Playfair Display'] text-4xl md:text-5xl font-bold leading-tight mb-2">
          {safeGet(author.fullName, DEFAULTS.author.fullName)}
        </h1>

        {author.nationality && (
          <p className="text-sm text-[#6B705C]">{author.nationality}</p>
        )}

        <p className="mt-4 text-lg italic text-[#4A5B4D]">
          {safeGet(author.quote, DEFAULTS.author.quote)}
        </p>
      </header>

      {/* ✍️ Bio */}
      <section className="max-w-3xl mx-auto mb-16 text-center md:text-left">
        <p className="text-[#4A5B4D] leading-relaxed text-lg whitespace-pre-line">
          {safeGet(author.bio, DEFAULTS.author.bio)}
        </p>
      </section>

      {/* 📚 Books by this Author */}
      <section className="max-w-5xl mx-auto mb-16">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-center md:text-left">
          Books by {safeGet(author.fullName, DEFAULTS.author.fullName)}
        </h2>

        {books.length === 0 ? (
          <p className="text-[#6B705C] italic text-center">
            No books found for this author yet.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
            {books.map((book) => (
              <article
                key={book.bookId}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-32 shrink-0 rounded-md overflow-hidden bg-[#f1efe9] border border-[#e9e4db]">
                    <SafeImage
                      src={book?.coverImageUrl}
                      fallbackSrc={DEFAULTS.book.coverImageUrl}
                      alt={safeGet(book.title, DEFAULTS.book.title)}
                      width={120}
                      height={160}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-['Playfair Display'] text-lg font-semibold text-[#2b2b2b]">
                      {safeGet(book.title, DEFAULTS.book.title)}
                    </h3>
                    <p className="text-sm text-[#6b705c] mt-1">
                      {safeGet(book.description, DEFAULTS.book.description)}
                    </p>
                    <Link
                      href={`${APIROUTE.singleBook}${book.bookId}`}
                      className="text-sm text-[#A8BDA5] font-semibold hover:underline mt-3 inline-block"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 🌾 Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 1.6s ease-in forwards",
          animationDelay: "1s",
        }}
      >
        <p className="italic text-[#4A5B4D]">{DEFAULTS.quotes[2]}</p>
      </footer>

      {/* 🪶 Join CTA */}
      <div className="max-w-3xl mx-auto mt-16 text-center bg-[#A8BDA5]/10 border border-[#A8BDA5]/30 rounded-2xl py-10 px-6 shadow-sm">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-3">
          Join Mindful Reader
        </h2>
        <p className="text-[#4A5B4D] mb-6">
          Save your favorite authors and explore the stories that resonate with
          your inner world.
        </p>
        <Link
          href={APIROUTE.signup}
          className="bg-[#A8BDA5] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#8FA98B]"
        >
          Get Started
        </Link>
      </div>

      {/* 🌸 Animations */}
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
