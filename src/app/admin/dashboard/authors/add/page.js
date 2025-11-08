"use client";

import AuthorForm from "@/components/AuthorForm";

export default function AddBook() {
  return (
    <div className="p-6">
      <AuthorForm mode="add" onSuccess />
    </div>
  );
}
