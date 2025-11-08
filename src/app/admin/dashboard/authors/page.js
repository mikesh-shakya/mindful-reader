"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/utilities/SafeImage";
import { DEFAULTS, safeGet } from "@/config/defaults";
import { toast } from "react-toastify";
import { getAllAuthors } from "@/services/AuthorService";

export default function AuthorsDashboardPage() {
  const [recentAuthors, setRecentAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌿 Fetch recent authors
  useEffect(() => {
    const fetchRecentAuthors = async () => {
      try {
        const data = await getAllAuthors({
          limit: 10,
          offset: 0,
          orderBy: "createdAt:desc",
        });
        setRecentAuthors(data?.items || []);
      } catch (err) {
        toast.error(err?.friendlyMessage || "Unable to fetch recent authors.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecentAuthors();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#3E5E4D] px-6 py-12">
      {/* 🌸 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto mb-10 gap-4">
        <h1 className="font-['Playfair Display'] text-3xl font-semibold">
          ✍️ Authors Dashboard
        </h1>

        <Link
          href="/admin/dashboard/authors/add"
          className="bg-[#A8BDA5] text-white px-6 py-2.5 rounded-full font-medium shadow-sm hover:bg-[#8FA98B] transition"
        >
          + Add New Author
        </Link>
      </div>

      {/* ✍️ Recently Added Authors */}
      <section className="bg-white border border-[#E7DCCB]/60 rounded-2xl shadow-sm max-w-5xl mx-auto p-6">
        <h2 className="font-['Playfair Display'] text-2xl font-semibold text-[#3E5E4D] mb-4">
          Recently Added Authors
        </h2>

        {loading ? (
          <p className="text-[#6B705C] italic">Fetching recent authors...</p>
        ) : recentAuthors.length === 0 ? (
          <div className="text-center py-10">
            <Image
              src={DEFAULTS.illustrations.meditation}
              alt="No authors yet"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />
            <p className="text-[#6B705C] italic">
              No authors yet — your creative minds await!
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#E7DCCB]/40">
            {recentAuthors.map((a) => (
              <li
                key={a.authorId}
                className="py-3 flex items-center justify-between hover:bg-[#F5F3EE]/50 rounded-md transition"
              >
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={a.profilePictureUrl}
                    fallbackSrc={DEFAULTS.author.profilePictureUrl}
                    alt={safeGet(a.fullName, DEFAULTS.author.fullName)}
                    width={50}
                    height={50}
                    className="rounded-full object-cover border border-[#E7DCCB]/40"
                  />
                  <div>
                    <p className="font-medium text-[#3E5E4D]">
                      {safeGet(a.fullName, DEFAULTS.author.fullName)}
                    </p>
                    <p className="text-sm text-[#6B705C] italic">
                      {safeGet(a.penName, DEFAULTS.author.penName) ||
                        "No pen name"}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/dashboard/authors/${a.authorId}/edit`}
                  className="text-[#A8BDA5] text-sm font-semibold hover:underline"
                >
                  ✏️ Edit
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
          “Behind every great book, there’s an author’s spark.”
        </p>
      </footer>

      {/* 🎨 Animations */}
      <style jsx>{`
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
