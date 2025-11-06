"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getUserByUserId, updateUser } from "@/services/Userservices";
import { getCurrentUserId } from "@/contexts/Auth";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    nationality: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState("");

  // 🌿 Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userId = getCurrentUserId();
        const data = await getUserByUserId(userId);
        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          dateOfBirth: data.dateOfBirth || "",
          nationality: data.nationality || "",
        });
      } catch (err) {
        console.error(err);
        setError(err.friendlyMessage || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  // ✨ Save user (exclude transient fields)
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const userId = getCurrentUserId();
      const updated = await updateUser(userId, form);
      setUser(updated);
      setSavedAt(new Date());
      setTimeout(() => setSavedAt(null), 3000);
    } catch (err) {
      console.error(err);
      setError(err.friendlyMessage || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6B705C] italic bg-[#FAF9F5]">
        Loading your profile...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#2F3E34] px-6 py-16 flex justify-center">
      <section className="bg-white border border-[#E9E5DC] rounded-3xl shadow-sm p-10 w-full max-w-3xl">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#A8BDA5]/50 shadow-sm">
            <Image
              src={"/illustrations/guy-avatar.svg"}
              alt="User avatar"
              width={112}
              height={112}
              className="object-cover w-full h-full bg-white"
            />
          </div>

          <h1 className="font-['Playfair Display'] text-3xl font-semibold">
            {form.firstName} {form.lastName}
          </h1>
        </header>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <fieldset disabled={saving} className="space-y-6">
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

            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
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

            {/* 🌿 Age display only */}
            <div className="bg-[#FAF9F5] border border-[#E7DCCB] rounded-md p-4">
              <p className="text-sm text-[#4A5B4D]">
                <strong>Age:</strong>{" "}
                {user?.age ? `${user.age} years` : "Not available"}
              </p>
            </div>
          </fieldset>

          <div className="flex justify-between items-center pt-4">
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {savedAt && <p className="text-[#6B705C] text-sm">Saved ✓</p>}
            <button
              type="submit"
              disabled={saving}
              className="ml-auto bg-[#A8BDA5] hover:bg-[#8FA98B] text-white font-semibold px-8 py-2 rounded-full transition disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
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
        className="mt-1 block w-full border border-[#E7DCCB] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] bg-[#FAF9F5] transition"
      />
    </label>
  );
}