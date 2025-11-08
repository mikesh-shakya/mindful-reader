"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { addBook } from "@/services/BookService";
import { DEFAULTS } from "@/config/defaults";
import AuthorPickerModal from "./AuthorPicker";

export default function AddBookForm({ onSuccess }) {
  const [form, setForm] = useState({
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

  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  // 🌿 Validate image URLs safely
  const isValidImageUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
  };

  // 🌸 Field validation
  const validateField = (name, value) => {
    let message = "";

    switch (name) {
      case "title":
        if (!value.trim()) message = "Title is required.";
        else if (value.length < 2)
          message = "Title must be at least 2 characters long.";
        break;
      case "authorId":
        if (!value) message = "Please select an author.";
        break;
      case "genre":
        if (!value.trim()) message = "Genre is required.";
        break;
      case "language":
        if (!value.trim()) message = "Language is required.";
        break;
      case "coverImageUrl":
        if (value && !isValidImageUrl(value))
          message = "Enter a valid image URL (jpg, png, gif, webp).";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // 🌿 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === "coverImageUrl") setImageError(false);
  };

  // 🌿 Validate before submit
  const validateForm = () => {
    Object.keys(form).forEach((key) => validateField(key, form[key]));
    return Object.values(errors).every((e) => !e);
  };

  // 🌸 Author select callback
  const handleSelectAuthor = (author) => {
    setSelectedAuthor(author);
    setForm((prev) => ({ ...prev, authorId: author.authorId }));
  };

  // 🌼 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await addBook(form);
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
      setErrors({});
      setSelectedAuthor(null);
      setImageError(false);

      if (onSuccess) onSuccess(res);
    } catch (err) {
      toast.error(err?.friendlyMessage || "Could not add book right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E7DCCB]/60 max-w-4xl mx-auto p-8 transition-all duration-300">
      <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-[#3E5E4D]">
        📚 Add New Book
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Title <span className="text-[#A07B5A]">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
              errors.title
                ? "border-[#D9A79C] bg-[#FFF9F8]"
                : form.title
                ? "border-[#B6CBB4] bg-[#F8FBF7]"
                : "border-[#E7DCCB] bg-[#FAF9F5]"
            } text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5]`}
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="text-[#A07B5A] text-xs mt-1 italic">{errors.title}</p>
          )}
        </div>

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

        {/* Genre + Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Genre <span className="text-[#A07B5A]">*</span>
            </label>
            <input
              type="text"
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5] outline-none"
              placeholder="e.g., Fiction, Adventure"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Language <span className="text-[#A07B5A]">*</span>
            </label>
            <input
              type="text"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5] outline-none"
              placeholder="e.g., English"
            />
          </div>
        </div>

        {/* Page Count + Publication Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Page Count
            </label>
            <input
              type="number"
              name="pageCount"
              value={form.pageCount}
              onChange={handleChange}
              min="1"
              className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
              placeholder="e.g., 350"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Publication Date
            </label>
            <input
              type="date"
              name="publicationDate"
              value={form.publicationDate}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            />
          </div>
        </div>

        {/* Quote */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Highlight Quote
          </label>
          <input
            type="text"
            name="quote"
            value={form.quote}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] placeholder-[#A07B5A]/60 text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            placeholder="e.g., 'It was the best of times, it was the worst of times.'"
          />
        </div>

        {/* Description */}
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

        {/* Cover Image URL */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImageUrl"
            value={form.coverImageUrl}
            onChange={handleChange}
            className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
              imageError || errors.coverImageUrl
                ? "border-[#D9A79C] bg-[#FFF9F8]"
                : form.coverImageUrl
                ? "border-[#B6CBB4] bg-[#F8FBF7]"
                : "border-[#E7DCCB] bg-[#FAF9F5]"
            } text-[#3E5E4D] placeholder-[#A07B5A]/60 focus:ring-2 focus:ring-[#A8BDA5]`}
            placeholder="https://example.com/book-cover.jpg"
          />
          {(imageError || errors.coverImageUrl) && (
            <p className="text-[#A07B5A] text-xs mt-1 italic">
              {errors.coverImageUrl ||
                "Could not load image. Please check the URL."}
            </p>
          )}
        </div>

        {/* Cover Preview */}
        {form.coverImageUrl &&
          isValidImageUrl(form.coverImageUrl) &&
          !imageError && (
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-48 rounded-lg overflow-hidden border border-[#E7DCCB] bg-[#F5F3EE]">
                <Image
                  src={form.coverImageUrl}
                  alt="Book cover preview"
                  width={128}
                  height={192}
                  className="object-cover w-full h-full"
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
            {loading ? "Saving..." : "Add Book"}
          </button>
        </div>
      </form>

      {/* Modal */}
      <AuthorPickerModal
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handleSelectAuthor}
      />
    </div>
  );
}
