"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import {
  getAllReviewsByBook,
  addOrUpdateReview,
} from "@/services/ReviewService";
import { isLoggedIn, getCurrentUser } from "@/contexts/Auth";
import { APIROUTE } from "@/config/constants";
import { DEFAULTS, safeGet } from "@/config/defaults";

export default function BookReflections({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  // 🌸 Load reflections
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviewsByBook(bookId);
        setReviews(data.items || []); // supports paginated API
      } catch (err) {
        toast.error(err?.friendlyMessage || "Could not load reflections.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [bookId]);

  // 🪶 Add reflection
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmitting(true);
    try {
      const user = getCurrentUser();
      const newReview = {
        bookId,
        userId: user?.userId,
        review: reviewText.trim(),
      };

      const saved = await addOrUpdateReview(newReview);
      setReviews((prev) => [
        saved,
        ...prev.filter((r) => r.ratingId !== saved.ratingId),
      ]);
      setReviewText("");
      toast.success("Reflection shared ✨");
    } catch (err) {
      toast.error(err?.friendlyMessage || "Could not share your reflection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-20 relative">
      <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-center text-[#2b2b2b]">
        Reflections from Readers
      </h2>

      {/* Subtle background aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="quote-ripple" />
      </div>

      {/* Input form (if logged in) */}
      {loggedIn ? (
        <form
          onSubmit={handleAddReview}
          className="bg-white rounded-2xl shadow-sm border border-[#E7DCCB]/50 p-6 mb-8 relative z-10"
        >
          <label
            htmlFor="reflection"
            className="block text-[#4A5B4D] font-medium mb-2"
          >
            What did this book whisper to you?
          </label>
          <textarea
            id="reflection"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder={DEFAULTS.reflection.reviewPlaceholder}
            className="w-full rounded-lg border border-[#DAD7CD] p-3 text-sm bg-[#FAFAFA] focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={submitting}
            className={`mt-3 px-5 py-2 rounded-full text-sm font-semibold text-white transition ${
              submitting
                ? "bg-[#B4CBB3] cursor-not-allowed"
                : "bg-[#A8BDA5] hover:bg-[#8FA98B]"
            }`}
          >
            {submitting ? "Sharing..." : "Share Reflection"}
          </button>
        </form>
      ) : (
        <p className="text-center text-[#6B705C] bg-[#A8BDA5]/10 py-4 rounded-xl mb-8 relative z-10">
          <Link
            href={APIROUTE.login}
            className="text-[#A8BDA5] font-semibold text-lg hover:underline"
          >
            Sign in
          </Link>{" "}
          to share your reflections 🌿
        </p>
      )}

      {/* Reflections List */}
      <div className="space-y-6 relative z-10">
        {loading ? (
          <p className="text-[#6B705C] italic text-center">
            Loading reflections...
          </p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <Image
              src={DEFAULTS.illustrations.meditation}
              alt="No reflections yet"
              width={100}
              height={100}
              className="mx-auto mb-4 opacity-80"
            />
            <p className="text-[#6B705C] italic">
              {DEFAULTS.reflection.noReviewsMessage}
            </p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div
              key={r.ratingId || i}
              className="bg-white border border-[#E7DCCB]/50 rounded-xl p-5 shadow-sm animate-fadeInReflection"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <p className="text-[#4A5B4D] italic mb-2 leading-relaxed">
                “{safeGet(r.review, DEFAULTS.book.quote)}”
              </p>
              <p className="text-sm text-[#6B705C]">
                — {safeGet(r.userName, DEFAULTS.user.displayName)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Animations */}
      <style jsx>{`
        .quote-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          background: radial-gradient(
            circle,
            rgba(168, 189, 165, 0.12) 0%,
            rgba(168, 189, 165, 0.05) 40%,
            transparent 80%
          );
          transform: translate(-50%, -50%);
          animation: rippleFade 12s ease-in-out infinite;
          opacity: 0.5;
        }

        @keyframes rippleFade {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
        }

        @keyframes fadeInReflection {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInReflection {
          animation: fadeInReflection 0.8s ease-in-out both;
        }
      `}</style>
    </section>
  );
}
