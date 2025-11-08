"use client";

import React, { useEffect, useState, useRef } from "react";
import { getAuthorsLOV } from "@/services/AuthorService";
import { toast } from "react-toastify";
import AuthorForm from "./AuthorForm";

export default function AuthorPickerModal({ open, onClose, onSelect }) {
  const [authors, setAuthors] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddAuthor, setShowAddAuthor] = useState(false);
  const observerRef = useRef(null);

  // 🌿 Fetch authors with pagination and search
  const fetchAuthors = async (append = false, newOffset = 0, query = "") => {
    try {
      setLoading(true);
      const res = await getAuthorsLOV({
        offset: newOffset,
        limit: 10,
        name: query,
      });
      const newItems = res?.items || [];
      setAuthors((prev) => (append ? [...prev, ...newItems] : newItems));
      setHasMore(res?.hasMore ?? newItems.length === 10);
      setOffset(newOffset);
    } catch (err) {
      toast.error("Could not load authors. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  // 🌸 Author Create callback (from AuthorForm)
  const handleCreateAuthor = (author) => {
    // Immediately add to the list and select it
    setAuthors((prev) => [author, ...prev]);
    onSelect(author);
    setShowAddAuthor(false);
    onClose();
  };

  useEffect(() => {
    if (open) fetchAuthors(false, 0, search);
  }, [open, search]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = observerRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchAuthors(true, offset + 1, search);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset, hasMore, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-['Playfair Display'] text-xl text-[#3E5E4D]">
            Select an Author
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B705C] hover:text-[#3E5E4D] transition"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search authors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-[#E7DCCB] rounded-full bg-[#FAF9F5] text-sm text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5] outline-none"
        />

        {/* List */}
        <div className="max-h-80 overflow-y-auto pr-1 space-y-2">
          {authors.map((a) => (
            <div
              key={a.authorId}
              onClick={() => {
                onSelect(a);
                onClose();
              }}
              className="p-3 border border-[#E7DCCB] rounded-xl cursor-pointer bg-[#FAF9F5] hover:bg-[#A8BDA5]/10 transition"
            >
              <p className="font-medium text-[#3E5E4D]">{a.fullName}</p>
              {a.penName && (
                <p className="text-xs text-[#6B705C] italic">{a.penName}</p>
              )}
              {a.nationality && (
                <p className="text-xs text-[#A07B5A]">{a.nationality}</p>
              )}
            </div>
          ))}

          {hasMore && (
            <div
              ref={observerRef}
              className="text-center text-xs text-[#6B705C] py-2"
            >
              {loading ? "Loading more..." : "Scroll to load more"}
            </div>
          )}

          {!loading && authors.length === 0 && (
            <div className="text-center text-[#6B705C] italic py-6 space-y-3">
              <p>No authors found.</p>
              <button
                type="button"
                onClick={() => setShowAddAuthor(true)}
                className="w-full px-4 py-3 border border-[#E7DCCB] rounded-xl bg-[#FAF9F5] text-[#3E5E4D] hover:bg-[#A8BDA5]/10 transition"
              >
                ➕ Create New Author
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-full border border-[#E7DCCB] text-[#6B705C] hover:bg-[#F5F3EE]"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* 🌸 Nested AuthorForm Modal */}
      {showAddAuthor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-3xl relative animate-fadeIn">
            <button
              onClick={() => setShowAddAuthor(false)}
              className="absolute top-3 right-3 text-[#6B705C] hover:text-[#3E5E4D] transition"
            >
              ✕
            </button>
            <AuthorForm onSuccess={handleCreateAuthor} />
          </div>
        </div>
      )}
    </div>
  );
}
