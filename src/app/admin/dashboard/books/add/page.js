"use client";

import BookForm from "@/components/BookForm";

export default function AddBook() {
  return (
    <div className="p-6">
      <BookForm mode="add" onSuccess />
    </div>
  );
}
