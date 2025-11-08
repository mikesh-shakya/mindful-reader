"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/utilities/SafeImage";

import { DEFAULTS, safeGet } from "@/config/defaults";
import { toast } from "react-toastify";
import { getAllBooks } from "@/services/BookService";
import { APIROUTE } from "@/config/constants";

export default function AdminHomePage() {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌿 Fetch recent books (limit 5)
  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const data = await getAllBooks({
          limit: 5,
          offset: 0,
          orderBy: "createdAt:desc",
        });
        setRecentBooks(data?.items || []);
      } catch (err) {
        toast.error(err?.friendlyMessage || "Unable to fetch recent books.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌸 Welcome Section */}
      <section className="bg-[#A8BDA5]/10 border border-[#E7DCCB] rounded-2xl p-8 text-center max-w-5xl mx-auto mb-12 animate-fadeIn">
        <div
          style={{ animation: "float 6s ease-in-out infinite" }}
          className="w-[140px] mx-auto mb-4"
        >
          <Image
            src={DEFAULTS.illustrations.bookshelf}
            alt="Welcome Illustration"
            width={140}
            height={120}
            className="mx-auto"
          />
        </div>
        <h1 className="font-['Playfair Display'] text-3xl font-semibold mb-2">
          Welcome to Mindful Admin 🌿
        </h1>
        <p className="text-[#4A5B4D] text-base max-w-2xl mx-auto">
          Manage your collection with calm intention — add books, update
          authors, and keep your literary garden thriving.
        </p>
      </section>

      {/* ⚡ Quick Actions */}
      <section className="flex flex-wrap justify-center gap-4 mb-12">
        <Link
          href={`${APIROUTE.addBook}`}
          className="bg-[#A8BDA5] text-white px-6 py-3 rounded-full shadow-sm hover:bg-[#8FA98B] transition"
        >
          + Add New Book
        </Link>
        <Link
          href={`${APIROUTE.addAuthor}`}
          className="bg-white border border-[#E7DCCB] text-[#3E5E4D] px-6 py-3 rounded-full hover:shadow-sm transition"
        >
          + Add Author
        </Link>
        <Link
          href={`${APIROUTE.addBook}`}
          className="bg-white border border-[#E7DCCB] text-[#3E5E4D] px-6 py-3 rounded-full hover:shadow-sm transition"
        >
          📚 Manage Books
        </Link>
        <Link
          href={`${APIROUTE.addAuthor}`}
          className="bg-white border border-[#E7DCCB] text-[#3E5E4D] px-6 py-3 rounded-full hover:shadow-sm transition"
        >
          ✍️ Manage Authors
        </Link>
      </section>

      {/* 📚 Recently Added Books */}
      <section className="bg-white border border-[#E7DCCB]/60 rounded-2xl shadow-sm max-w-5xl mx-auto p-6">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold text-[#3E5E4D] mb-4">
          Recently Added Books
        </h2>

        {loading ? (
          <p className="text-[#6B705C] italic">Fetching recent books...</p>
        ) : recentBooks.length === 0 ? (
          <div className="text-center py-10">
            <Image
              src={DEFAULTS.illustrations.meditation}
              alt="No books yet"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <p className="text-[#6B705C] italic">
              No books yet — your shelf is waiting.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E7DCCB]/40">
            {recentBooks.map((b) => (
              <li
                key={b.bookId}
                className="py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={b.coverImageUrl}
                    fallbackSrc={DEFAULTS.book.coverImageUrl}
                    alt={safeGet(b.title, DEFAULTS.book.title)}
                    width={40}
                    height={60}
                    className="rounded-md object-cover border border-[#E7DCCB]/40"
                  />
                  <div>
                    <p className="font-medium text-[#3E5E4D]">
                      {safeGet(b.title, DEFAULTS.book.title)}
                    </p>
                    <p className="text-sm text-[#6B705C]">
                      {safeGet(b.author?.fullName, DEFAULTS.book.authorName)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/books/${b.bookId}/edit`}
                  className="text-[#A8BDA5] text-sm font-semibold hover:underline"
                >
                  Edit →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 🌿 Footer Quote */}
      <footer
        className="max-w-3xl mx-auto text-center mt-16"
        style={{
          opacity: 0,
          animation: "fadeInQuote 2.4s ease-in forwards",
          animationDelay: "1s",
        }}
      >
        <p className="italic text-[#6B705C]">
          “Every story begins with a page — thank you for tending the library.”
        </p>
      </footer>

      {/* 🎨 Animations */}
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
