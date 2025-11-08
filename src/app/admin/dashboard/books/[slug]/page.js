"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBook, updateBook } from "@/services/BooksService";
import { toast } from "react-toastify";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState(null);

  useEffect(() => {
    getBook(id).then(setBook);
  }, [id]);

  const handleSave = async () => {
    await updateBook(id, book);
    toast.success("Book updated!");
    router.push("/admin/books");
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-semibold text-[#3E5E4D] mb-6">Edit Book</h1>
      <input
        value={book.title}
        onChange={(e) => setBook({ ...book, title: e.target.value })}
        className="w-full mb-4 border border-[#E7DCCB] rounded-md px-3 py-2"
      />
      <textarea
        value={book.description}
        onChange={(e) => setBook({ ...book, description: e.target.value })}
        className="w-full mb-4 border border-[#E7DCCB] rounded-md px-3 py-2"
      />
      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.push("/admin/books")}
          className="text-[#6B705C] hover:underline"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-[#A8BDA5] text-white px-4 py-2 rounded-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
