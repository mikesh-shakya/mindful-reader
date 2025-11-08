"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { addBook, updateBook } from "@/services/BookService";
import AuthorPickerModal from "./AuthorPicker";

// 🌿 Reusable Input Field
const InputField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  type = "text",
  placeholder = "",
  ...rest
}) => (
  <div>
    <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
      {label} {required && <span className="text-[#A07B5A]">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
      className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
        error
          ? "border-[#D9A79C] bg-[#FFF9F8]"
          : value
          ? "border-[#B6CBB4] bg-[#F8FBF7]"
          : "border-[#E7DCCB] bg-[#FAF9F5]"
      } text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5]`}
    />
    {error && <p className="text-[#A07B5A] text-xs mt-1 italic">{error}</p>}
  </div>
);

export default function BookForm({ mode = "add", book = null, onSuccess }) {
  const [form, setForm] = useState(() =>
    book
      ? {
          title: book.title || "",
          authorId: book.authorId || "",
          genre: book.genre || "",
          language: book.language || "",
          pageCount: book.pageCount || "",
          publicationDate: book.publicationDate
            ? book.publicationDate.slice(0, 10)
            : "",
          coverImageUrl: book.coverImageUrl || "",
          quote: book.quote || "",
          description: book.description || "",
        }
      : {
          title: "",
          authorId: "",
          genre: "",
          language: "",
          pageCount: "",
          publicationDate: "",
          coverImageUrl: "",
          quote: "",
          description: "",
        }
  );

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(book?.author || null);
  const [imageError, setImageError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // 🌿 Validate image URLs safely
  const isValidImageUrl = useCallback((url) => {
    if (!url) return true;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  }, []);

  // 🌸 Full form validation (synchronous)
  const validateForm = useCallback(() => {
    const newErrors = {};
    const { title, authorId, genre, language, coverImageUrl } = form;

    if (!title.trim()) newErrors.title = "Title is required.";
    else if (title.length < 2)
      newErrors.title = "Title must be at least 2 characters long.";

    if (!authorId) newErrors.authorId = "Please select an author.";
    if (!genre.trim()) newErrors.genre = "Genre is required.";
    if (!language.trim()) newErrors.language = "Language is required.";
    if (coverImageUrl && !isValidImageUrl(coverImageUrl))
      newErrors.coverImageUrl =
        "Enter a valid image URL (jpg, png, gif, webp).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form, isValidImageUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "coverImageUrl") setImageError(false);
  };

  const handleSelectAuthor = (author) => {
    setSelectedAuthor(author);
    setForm((prev) => ({ ...prev, authorId: author.authorId }));
  };

  // 🌼 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warn("Please correct the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (mode === "edit") {
        res = await updateBook(book.bookId, form);
        toast.success(`Book "${form.title}" updated successfully!`);
      } else {
        res = await addBook(form);
        toast.success(`Book "${form.title}" added successfully!`);
        setForm({
          title: "",
          authorId: "",
          genre: "",
          language: "",
          pageCount: "",
          publicationDate: "",
          coverImageUrl: "",
          quote: "",
          description: "",
        });
        setSelectedAuthor(null);
      }
      onSuccess?.(res);
    } catch (err) {
      toast.error(err?.friendlyMessage || "Could not save book right now.");
    } finally {
      setLoading(false);
    }
  };

  // Escape key closes author picker
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && showPicker) setShowPicker(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showPicker]);

  // Prefill author when editing
  useEffect(() => {
    if (book?.author) {
      setSelectedAuthor(book.author);
      setForm((prev) => ({ ...prev, authorId: book.author.authorId }));
    }
  }, [book]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E7DCCB]/60 max-w-4xl mx-auto p-8 transition-all duration-300">
      <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-[#3E5E4D]">
        {mode === "edit" ? "✏️ Edit Book" : "📚 Add New Book"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          error={errors.title}
          placeholder="Enter book title"
        />

        {/* Author Picker */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Author <span className="text-[#A07B5A]">*</span>
          </label>
          {selectedAuthor ? (
            <div className="flex items-center justify-between border border-[#E7DCCB] bg-[#FAF9F5] p-3 rounded-xl">
              <div>
                <p className="font-medium text-[#3E5E4D]">
                  {selectedAuthor.fullName}
                </p>
                {selectedAuthor.penName && (
                  <p className="text-xs text-[#6B705C] italic">
                    {selectedAuthor.penName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="text-sm text-[#A8BDA5] hover:underline"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="w-full px-4 py-3 border border-[#E7DCCB] rounded-xl bg-[#FAF9F5] text-[#3E5E4D] hover:bg-[#A8BDA5]/10 transition"
            >
              Select Author
            </button>
          )}
          {errors.authorId && (
            <p className="text-[#A07B5A] text-xs mt-1 italic">
              {errors.authorId}
            </p>
          )}
        </div>

        {/* Genre & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            required
            error={errors.genre}
            placeholder="e.g., Fiction, Adventure"
          />
          <InputField
            label="Language"
            name="language"
            value={form.language}
            onChange={handleChange}
            required
            error={errors.language}
            placeholder="e.g., English"
          />
        </div>

        {/* Page Count & Publication Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Page Count"
            name="pageCount"
            value={form.pageCount}
            onChange={handleChange}
            type="number"
            placeholder="e.g., 350"
          />
          <InputField
            label="Publication Date"
            name="publicationDate"
            value={form.publicationDate}
            onChange={handleChange}
            type="date"
          />
        </div>

        <InputField
          label="Highlight Quote"
          name="quote"
          value={form.quote}
          onChange={handleChange}
          placeholder="e.g., 'It was the best of times, it was the worst of times.'"
        />

        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            placeholder="Write a short synopsis or summary..."
          />
        </div>

        <InputField
          label="Cover Image URL"
          name="coverImageUrl"
          value={form.coverImageUrl}
          onChange={handleChange}
          type="url"
          error={errors.coverImageUrl}
          placeholder="https://example.com/book-cover.jpg"
        />

        {/* Cover Preview */}
        {form.coverImageUrl &&
          isValidImageUrl(form.coverImageUrl) &&
          !imageError && (
            <div className="mt-4 flex justify-center">
              <div className="relative w-32 h-48 rounded-lg overflow-hidden border border-[#E7DCCB] bg-[#F5F3EE]">
                <Image
                  src={form.coverImageUrl}
                  alt="Book cover preview"
                  width={128}
                  height={192}
                  className="object-cover w-full h-full transition-opacity duration-300"
                  onError={() => {
                    setImageError(true);
                    toast.warn("Cover image could not be loaded.");
                  }}
                />
              </div>
            </div>
          )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              setForm({
                title: "",
                authorId: "",
                genre: "",
                language: "",
                pageCount: "",
                publicationDate: "",
                coverImageUrl: "",
                quote: "",
                description: "",
              });
              setErrors({});
              setImageError(false);
              setSelectedAuthor(null);
            }}
            className="px-4 py-2 text-sm rounded-full border border-[#E7DCCB] text-[#6B705C] hover:bg-[#F5F3EE] transition"
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 text-sm rounded-full font-semibold text-white transition ${
              loading
                ? "bg-[#A8BDA5]/60 cursor-not-allowed"
                : "bg-[#A8BDA5] hover:bg-[#8FA98B]"
            }`}
          >
            {loading
              ? "Saving..."
              : mode === "edit"
              ? "Update Book"
              : "Add Book"}
          </button>
        </div>
      </form>

      <AuthorPickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelectAuthor}
      />
    </div>
  );
}
