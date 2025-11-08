"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAuthor } from "@/services/AuthorService";
import { toast } from "react-toastify";
import AuthorForm from "@/components/AuthorForm";

export default function EditAuthorPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌿 Fetch the author by ID when page loads
  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchAuthor = async () => {
      try {
        const data = await getAuthor(slug);
        console.log("Fetched author:", data);

        // Support different API response formats
        const authorData = data?.author || data?.items?.[0] || data;
        setAuthor(authorData);
      } catch (err) {
        console.error("Error fetching author:", err);
        toast.error(err?.friendlyMessage || "Unable to load author details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [slug]);

  // 🧘 Render loading and error states
  if (loading) {
    return (
      <div className="p-6 text-[#6B705C] italic">Loading author details...</div>
    );
  }

  if (!author) {
    return (
      <div className="p-6 text-[#A07B5A]">
        Author not found or unable to fetch data.
      </div>
    );
  }

  // 📝 Render Author Form
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="font-['Playfair Display'] text-2xl font-semibold text-[#3E5E4D] mb-4">
        ✏️ Edit Author
      </h1>

      <AuthorForm
        mode="edit"
        author={author}
        onSuccess={() => {
          toast.success("Author updated successfully!");
          router.push("/admin/dashboard/authors");
        }}
      />
    </div>
  );
}
