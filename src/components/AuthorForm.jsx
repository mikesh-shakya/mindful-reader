"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { addAuthor, updateAuthor } from "@/services/AuthorService";
import { DEFAULTS } from "@/config/defaults";

export default function AuthorForm({ mode = "add", author = null, onSuccess }) {
  const [form, setForm] = useState(() =>
    author
      ? {
          fullName: author.fullName || "",
          penName: author.penName || "",
          bio: author.bio || "",
          nationality: author.nationality || "",
          gender: author.gender || "",
          dateOfBirth: author.dateOfBirth
            ? author.dateOfBirth.slice(0, 10)
            : "",
          profilePictureUrl: author.profilePictureUrl || "",
        }
      : {
          fullName: "",
          penName: "",
          bio: "",
          nationality: "",
          gender: "",
          dateOfBirth: "",
          profilePictureUrl: "",
        }
  );

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [errors, setErrors] = useState({});

  // 🌿 Validate image URLs
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
      case "fullName":
        if (!value.trim()) message = "Full name is required.";
        else if (value.length < 2)
          message = "Name must be at least 2 characters long.";
        break;

      case "gender":
        if (!value) message = "Please select a gender.";
        break;

      case "profilePictureUrl":
        if (value && !isValidImageUrl(value))
          message = "Enter a valid image URL (jpg, png, gif, webp).";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };

  // 🌿 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
    if (name === "profilePictureUrl") setImageError(false);
  };

  // 🌿 Live validation
  useEffect(() => {
    const timeout = setTimeout(() => {
      Object.entries(form).forEach(([key, value]) => {
        if (value) validateField(key, value);
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [form]);

  // 🌿 Validate before submit
  const validateForm = () => {
    Object.keys(form).forEach((key) => validateField(key, form[key]));
    return Object.values(errors).every((e) => !e);
  };

  // 🌼 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      let res;

      if (mode === "edit") {
        res = await updateAuthor(author.authorId, form);
        toast.success(`Author "${form.fullName}" updated successfully!`);
      } else {
        res = await addAuthor(form);
        toast.success(`Author "${form.fullName}" added successfully!`);
      }

      if (mode === "add") {
        setForm({
          fullName: "",
          penName: "",
          bio: "",
          nationality: "",
          gender: "",
          dateOfBirth: "",
          profilePictureUrl: "",
        });
        setErrors({});
        setImageError(false);
      }

      if (onSuccess) onSuccess(res);
    } catch (err) {
      toast.error(err?.friendlyMessage || "Could not save author right now.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 If editing, populate when author changes
  useEffect(() => {
    if (author) {
      setForm({
        fullName: author.fullName || "",
        penName: author.penName || "",
        bio: author.bio || "",
        nationality: author.nationality || "",
        gender: author.gender || "",
        dateOfBirth: author.dateOfBirth ? author.dateOfBirth.slice(0, 10) : "",
        profilePictureUrl: author.profilePictureUrl || "",
      });
    }
  }, [author]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E7DCCB]/60 max-w-3xl mx-auto p-8 transition-all duration-300">
      <h2 className="font-['Playfair Display'] text-2xl font-semibold mb-6 text-[#3E5E4D]">
        {mode === "edit" ? "✏️ Edit Author" : "✍️ Add New Author"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Full Name <span className="text-[#A07B5A]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
              errors.fullName
                ? "border-[#D9A79C] bg-[#FFF9F8]"
                : form.fullName
                ? "border-[#B6CBB4] bg-[#F8FBF7]"
                : "border-[#E7DCCB] bg-[#FAF9F5]"
            } text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5]`}
            placeholder="Enter full name of author"
          />
          {errors.fullName && (
            <p className="text-[#A07B5A] text-xs mt-1 italic">
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Pen Name */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Pen Name
          </label>
          <input
            type="text"
            name="penName"
            value={form.penName}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] placeholder-[#A07B5A]/60 text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            placeholder="Name used by writer for their writings"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            value={form.bio}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            placeholder="A short bio of the author"
          />
        </div>

        {/* Nationality */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            value={form.nationality}
            onChange={handleChange}
            className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            placeholder="British, American, etc."
          />
        </div>

        {/* Gender + DOB */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Gender <span className="text-[#A07B5A]">*</span>
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
                errors.gender
                  ? "border-[#D9A79C] bg-[#FFF9F8]"
                  : form.gender
                  ? "border-[#B6CBB4] bg-[#F8FBF7]"
                  : "border-[#E7DCCB] bg-[#FAF9F5]"
              } text-[#3E5E4D] focus:ring-2 focus:ring-[#A8BDA5]`}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && (
              <p className="text-[#A07B5A] text-xs mt-1 italic">
                {errors.gender}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-xl px-4 py-3 border border-[#E7DCCB] bg-[#FAF9F5] text-[#3E5E4D] text-sm focus:ring-2 focus:ring-[#A8BDA5] outline-none"
            />
          </div>
        </div>

        {/* Profile Picture URL */}
        <div>
          <label className="block text-sm font-medium text-[#4A5B4D] mb-2">
            Profile Picture URL
          </label>
          <input
            type="url"
            name="profilePictureUrl"
            value={form.profilePictureUrl}
            onChange={handleChange}
            className={`w-full rounded-xl px-4 py-3 border text-sm outline-none transition ${
              imageError || errors.profilePictureUrl
                ? "border-[#D9A79C] bg-[#FFF9F8]"
                : form.profilePictureUrl
                ? "border-[#B6CBB4] bg-[#F8FBF7]"
                : "border-[#E7DCCB] bg-[#FAF9F5]"
            } text-[#3E5E4D] placeholder-[#A07B5A]/60 focus:ring-2 focus:ring-[#A8BDA5]`}
            placeholder="https://example.com/portrait.jpg"
          />
          {(imageError || errors.profilePictureUrl) && (
            <p className="text-[#A07B5A] text-xs mt-1 italic">
              {errors.profilePictureUrl ||
                "Could not load image. Please check the URL."}
            </p>
          )}
        </div>

        {/* Preview */}
        {form.profilePictureUrl &&
          isValidImageUrl(form.profilePictureUrl) &&
          !imageError && (
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-[#E7DCCB] bg-[#F5F3EE]">
                <Image
                  src={form.profilePictureUrl}
                  alt="Author preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  onError={() => {
                    setImageError(true);
                    toast.warn("Profile image could not be loaded.");
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
                fullName: "",
                penName: "",
                bio: "",
                nationality: "",
                gender: "",
                dateOfBirth: "",
                profilePictureUrl: "",
              });
              setErrors({});
              setImageError(false);
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
              ? "Update Author"
              : "Add Author"}
          </button>
        </div>
      </form>
    </div>
  );
}
