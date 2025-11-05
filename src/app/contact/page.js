"use client";

import React, { useState } from "react";
import Image from "next/image";
import { APIROUTE } from "@/config/constants";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col items-center justify-start px-6 py-20 text-[#3E5E4D] animate-fadeIn relative overflow-hidden">
      {/* Floating Illustration */}
      <div
        style={{
          animation: "float 6s ease-in-out infinite",
          transformOrigin: "center",
        }}
        className="flex justify-center mb-10"
      >
        <Image
          src="/illustrations/contact-us.svg"
          alt="Contact Mindful Reader"
          width={300}
          height={300}
          className="w-full max-w-sm h-auto object-contain"
          priority
        />
      </div>

      {/* Header */}
      <h1 className="font-serif text-4xl font-bold mb-4 text-center">
        Contact <span className="text-[#A8BDA5]">Mindful Reader</span>
      </h1>
      <p className="text-center text-[#4A5B4D] text-lg mb-10 max-w-xl leading-relaxed">
        Whether you’d like to share feedback, collaborate, or simply say hello —
        we’d love to hear from you. Take a mindful moment and drop us a note
        below.
      </p>

      {/* Form */}
      {!sent ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg border border-[#E7DCCB] rounded-2xl p-8 w-full max-w-md space-y-5"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#3E5E4D] mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-[#DAD7CD] rounded-lg px-3 py-2 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#A8BDA5]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#3E5E4D] mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-[#DAD7CD] rounded-lg px-3 py-2 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#A8BDA5]"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-[#3E5E4D] mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Write your message here..."
              className="w-full border border-[#DAD7CD] rounded-lg px-3 py-2 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-[#A8BDA5]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#A8BDA5] text-white font-semibold hover:bg-[#8FA98B] transition"
          >
            Send Message
          </button>
        </form>
      ) : (
        <div className="bg-white shadow-lg border border-[#E7DCCB] rounded-2xl p-10 text-center max-w-md animate-fadeIn">
          <div
            style={{
              animation: "float 10s ease-in-out infinite",
              transformOrigin: "center",
            }}
            className="flex justify-center mb-5"
          >
            <Image
              src="/illustrations/thank-you.svg"
              alt="Thank You Illustration"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
          <h2 className="font-serif text-2xl font-semibold mb-3 text-[#3E5E4D]">
            Thank you 🌿
          </h2>
          <p className="text-[#4A5B4D] text-sm leading-relaxed">
            Your message has been received. We’ll reach out soon — until then,
            keep reading slowly and intentionally.
          </p>
        </div>
      )}

      {/* Extra CTA */}
      <div className="mt-16 text-center text-sm text-[#6B705C]">
        <p>
          Prefer to connect directly?{" "}
          <a
            href={`${APIROUTE.email}`}
            className="text-[#A8BDA5] underline hover:text-[#8FA98B]"
          >
            {`${APIROUTE.contactMail}`}
          </a>
        </p>
      </div>

      {/* Inline floating animation */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
