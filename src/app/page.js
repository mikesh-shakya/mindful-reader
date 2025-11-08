"use client";

import Image from "next/image";
import Link from "next/link";
import { APIROUTE } from "../config/constants";
import { DEFAULTS } from "@/config/defaults";

export default function Home() {
  return (
    <main className="bg-[#FAF9F5] text-[#2F3E34] font-sans">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6">
            Read with intention.
          </h1>
          <p className="text-lg md:text-xl text-[#4A5B4D] mb-10 max-w-lg mx-auto md:mx-0">
            Discover books that spark insight and
            <br />
            fuel your growth — picked just for you.
          </p>
          <Link
            href={`${APIROUTE.allBook}`}
            className="inline-block bg-[#7E9E83] hover:bg-[#6D8E73] text-white text-base font-semibold px-6 py-3 rounded-md transition"
          >
            Find Your Next Book
          </Link>
        </div>

        {/* Hero Illustration */}
        <div className="flex-1 flex justify-center">
          <Image
            src={DEFAULTS.illustrations.bookLover}
            alt="Person reading a book calmly"
            width={400}
            height={300}
            className="w-full max-w-sm h-auto"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#F9F8F3] py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
          How it works
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <Step
            image={DEFAULTS.illustrations.chatting}
            title="Share your interests"
            desc="Tell us about themes and topics that matter to you."
          />
          <Step
            image={DEFAULTS.illustrations.bookshelf}
            title="Get book suggestions"
            desc="Receive a personalized list of meaningful reads."
          />
          <Step
            image={DEFAULTS.illustrations.checklist}
            title="Keep track of your journey"
            desc="Log reads, set goals, and capture your reflections."
          />
        </div>
      </section>

      {/* Tools for Mindful Reading */}
      <section className="py-20 px-6 bg-[#FAF9F5]">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
          Tools for mindful reading
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <Feature
            image={DEFAULTS.illustrations.books}
            title="Curated picks"
            desc="Handpicked recommendations for personal growth."
          />
          <Feature
            image={DEFAULTS.illustrations.goals}
            title="Reading goals"
            desc="Set your intentions and explore with purpose."
          />
          <Feature
            image={DEFAULTS.illustrations.writing}
            title="Reflective notes"
            desc="Jot down thoughts and deepen your understanding."
          />
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-[#F9F8F3] py-24 text-center px-6">
        <blockquote className="text-2xl md:text-3xl italic font-serif text-[#2F3E34] mb-4">
          “Books are the mirrors of the soul.”
        </blockquote>
        <p className="text-[#4A5B4D] text-lg mb-8">
          Start your reading journey today.
        </p>
        <Link
          href={`${APIROUTE.signup}`}
          className="inline-block bg-[#7E9E83] hover:bg-[#6D8E73] text-white text-base font-semibold px-6 py-3 rounded-md transition"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
}

/* --- Step Component --- */
function Step({ image, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={image}
        alt={title}
        width={120}
        height={120}
        className="mb-4"
      />
      <h3 className="text-lg font-semibold mb-2 text-[#2F3E34]">{title}</h3>
      <p className="text-[#4A5B4D] max-w-xs">{desc}</p>
    </div>
  );
}

/* --- Feature Component --- */
function Feature({ image, title, desc }) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={image}
        alt={title}
        width={120}
        height={120}
        className="mb-4"
      />
      <h3 className="text-lg font-semibold mb-2 text-[#2F3E34]">{title}</h3>
      <p className="text-[#4A5B4D] max-w-xs">{desc}</p>
    </div>
  );
}
