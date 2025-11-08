"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookForm from "@/components/BookForm";
import { getBook } from "@/services/BookService";
import { toast } from "react-toastify";

export default function EditBookPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌿 Fetch the book by ID when page loads
  useEffect(() => {
    const fetchBook = async () => {
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

  // 🧘 Render states
  if (loading) {
    return (
      <div className="p-6 text-[#6B705C] italic">Loading book details...</div>
    );
  }

  if (!book) {
    return (
      <div className="p-6 text-[#A07B5A]">
        Book not found or unable to fetch data.
      </div>
    );
  }

  // 📝 Render Book Form
  return (
    <div className="p-6">
      <BookForm
        mode="edit"
        book={book}
        onSuccess={() => {
          toast.success("Book updated successfully!");
          router.push("/admin/dashboard/books");
        }}
      />
    </div>
  );
}
