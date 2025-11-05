"use client";

import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { doLogin, getCurrentUser } from "@/contexts/Auth";
import { loginUser } from "@/services/Userservices";
import UserContext from "@/contexts/UserContext";
import { APIROUTE } from "@/config/constants";
import OfflineFallback from "@/components/OfflineFallback";

export default function LoginPage() {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  // 🔍 Validation Helpers
  const getFieldError = (name, value) => {
    if (name === "email") {
      if (!value) return "Email is required.";
      if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email.";
    }
    if (name === "password" && !value) return "Password is required.";
    return "";
  };

  const validate = () => {
    const newErrors = {};
    for (const key of Object.keys(form)) {
      newErrors[key] = getFieldError(key, form[key]);
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  // 🧠 Change Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setOffline(false);

    try {
      const data = await loginUser(form); // uses normalized error handling
      doLogin(data, () => {
        setUser({
          data: getCurrentUser(),
          login: true,
        });
        router.replace(redirectTo);
      });
    } catch (err) {
      console.warn("Login error:", err);
      // if the backend handler sets friendlyMessage:
      const message = err?.friendlyMessage || "Something went wrong.";
      // Detect offline case explicitly
      if (message.includes("reach the server") || err.code === "ERR_NETWORK") {
        setOffline(true);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    Object.values(form).every((val) => val.trim() !== "") &&
    Object.values(errors).every((err) => !err);

  /* -----------------------------
     🪷 Offline Fallback UI
  ----------------------------- */
  if (offline) {
    return (
      <OfflineFallback
        title={"We couldn’t reach Mindful Reader right now."}
        message={
          "It seems you’re offline, or our servers are taking a mindful pause. Take a breath, and try again shortly."
        }
      />
    );
  }

  /* -----------------------------
     🌿 Main Login UI
  ----------------------------- */
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FAF9F5]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#DAD7CD] animate-fadeIn">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl text-[#3E5E4D] font-bold">
            Welcome back
          </h1>
          <p className="text-[#4A5B4D] text-sm mt-1">
            Sign in to continue your mindful reading journey.
          </p>
          <p className="mt-2 font-serif text-2xl text-[#A8BDA5] font-semibold">
            Mindful Reader
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} noValidate className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#3E5E4D] mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  email: getFieldError("email", e.target.value),
                }))
              }
              className={`block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] ${
                errors.email ? "border-red-400" : "border-[#DAD7CD]"
              } bg-[#FAFAFA]`}
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#3E5E4D] mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                onBlur={(e) =>
                  setErrors((prev) => ({
                    ...prev,
                    password: getFieldError("password", e.target.value),
                  }))
                }
                className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] ${
                  errors.password ? "border-red-400" : "border-[#DAD7CD]"
                } bg-[#FAFAFA]`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-[#3E5E4D]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#3E5E4D"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3-11-7 1.17-2.4 3.06-4.33 5.29-5.55M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#3E5E4D"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v3l2 2"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              href="#"
              className="text-sm text-[#A8BDA5] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold text-white ${
              !isFormValid || loading
                ? "bg-[#B4CBB3] cursor-not-allowed"
                : "bg-[#A8BDA5] hover:bg-[#8FA98B]"
            }`}
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l-3 3-5 1z"
                ></path>
              </svg>
            )}
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center text-sm text-[#4A5B4D]">
          Don’t have an account?{" "}
          <Link
            href={APIROUTE.signup}
            className="text-[#A8BDA5] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
