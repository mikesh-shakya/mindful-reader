"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getUserByUserId, updateUser } from "@/services/Userservices";
import { getCurrentUserId } from "@/contexts/Auth";
import getAvatarForGender from "@/utilities/ProfileAvatarHelper";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  // 🧩 Helper to reset form from user object
  const resetFormFromUser = (data) => ({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    dateOfBirth: data.dateOfBirth || "",
    nationality: data.nationality || "",
    gender: data.gender || "",
  });

  // 🌿 Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userId = getCurrentUserId();
        const data = await getUserByUserId(userId);
        setUser(data);
        setForm(resetFormFromUser(data));
      } catch (err) {
        console.error("Error fetching user:", err);
        setError(
          err.friendlyMessage || err.message || "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ⚠️ Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (editing && !saving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [editing, saving]);

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  // ✨ Save user
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const userId = getCurrentUserId();
      const updated = await updateUser(userId, form);
      setUser(updated);
      setSavedAt(new Date());
      setEditing(false);
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err.friendlyMessage || err.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setForm(resetFormFromUser(user));
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B705C] italic bg-[#FAF9F5]">
        Loading your profile...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#FAF9F5] text-[#2F3E34] px-6 py-16 flex justify-center">
      <section className="relative bg-white border border-[#E9E5DC] rounded-3xl shadow-sm p-10 w-full max-w-3xl">
        {/* Overlay for saving/loading */}
        {(loading || saving) && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
            <span className="text-[#4A5B4D] italic">
              {saving ? "Saving changes..." : "Loading profile..."}
            </span>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-10">
          <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#A8BDA5]/50 shadow-sm bg-white transition-transform duration-300 ease-in-out hover:scale-[1.03]">
            <Image
              key={form.gender}
              src={getAvatarForGender(form.gender)}
              alt={`${form.gender || "Non-binary"} avatar`}
              width={112}
              height={112}
              className="object-contain w-full h-full transition-opacity duration-300"
            />
          </div>

          <h1 className="font-['Playfair Display'] text-3xl font-semibold">
            {form.firstName} {form.lastName}
          </h1>
        </header>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset disabled={!editing || saving} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={handleChange("firstName")}
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={handleChange("lastName")}
              />
            </div>

            {/* Email (non-editable) */}
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              readOnly
              disabled
              className="cursor-not-allowed bg-[#f3f2ee]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
              />
              <Input
                label="Nationality"
                value={form.nationality}
                onChange={handleChange("nationality")}
              />
            </div>

            {/* 🌸 Gender + Age Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gender */}
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-[#4A5B4D]">
                    Gender
                  </span>

                  <div className="relative">
                    <select
                      value={form.gender}
                      onChange={handleChange("gender")}
                      className={`mt-1 block w-full h-11 border border-[#E7DCCB] rounded-md px-3 text-base leading-normal bg-[#FAF9F5] focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] transition 
                        ${
                          editing ? "cursor-pointer" : "cursor-default"
                        } appearance-none`}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="NON_BINARY">Non-binary</option>
                    </select>

                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A5B4D] pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </label>
              </div>

              {/* Age */}
              <div>
                <label className="block">
                  <span className="text-sm font-medium text-[#4A5B4D]">
                    Age
                  </span>
                  <input
                    type="text"
                    value={user?.age ? `${user.age} years` : "Not available"}
                    readOnly
                    disabled
                    className="mt-1 block w-full h-11 border border-[#E7DCCB] rounded-md px-3 text-base leading-normal bg-[#FAF9F5] text-[#4A5B4D] cursor-not-allowed"
                  />
                </label>
              </div>
            </div>
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {savedAt && <p className="text-[#6B705C] text-sm">Saved ✓</p>}

            <div className="ml-auto flex items-center gap-3">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-full border border-[#E7DCCB] text-[#3E5E4D] hover:shadow-sm transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#A8BDA5] hover:bg-[#8FA98B] text-white font-semibold px-8 py-2 rounded-full transition disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="bg-[#A8BDA5] hover:bg-[#8FA98B] text-white font-semibold px-8 py-2 rounded-full transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

/* --- Reusable Input --- */
function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#4A5B4D]">{label}</span>
      <input
        {...props}
        className={`mt-1 block w-full border border-[#E7DCCB] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] bg-[#FAF9F5] transition ${
          props.className || ""
        }`}
      />
    </label>
  );
}
