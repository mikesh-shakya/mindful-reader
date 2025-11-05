"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIROUTE } from "@/config/constants";
import { signUp } from "@/services/Userservices";
import OfflineFallback from "@/components/OfflineFallback";

const formFields = [
  { name: "firstName", label: "First Name", type: "text", required: true },
  { name: "middleName", label: "Middle Name", type: "text", required: false },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "username", label: "Username", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password", label: "Password", type: "password", required: true },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    required: true,
  },
];

export default function SignupPage() {
  const router = useRouter();

  const initialFormState = Object.fromEntries(
    formFields.map((f) => [f.name, ""])
  );
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  /* -----------------------------
     🧩 Validation
  ----------------------------- */
  const getFieldError = (name, value, compareTo = null) => {
    switch (name) {
      case "firstName":
      case "lastName":
      case "username":
        if (!String(value).trim())
          return `${name.replace(/^\w/, (c) => c.toUpperCase())} is required`;
        break;
      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
        break;
      case "password":
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value))
          return "Password must include uppercase, lowercase, and a number";
        break;
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== compareTo) return "Passwords do not match";
        break;
      default:
        return "";
    }
    return "";
  };

  const validate = () => {
    const newErrors = {};
    for (const field of formFields) {
      newErrors[field.name] = getFieldError(
        field.name,
        form[field.name],
        form.password
      );
    }
    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const validateField = (name, value) => {
    const error = getFieldError(name, value, form.password);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formIsValid =
    formFields
      .filter((f) => f.required)
      .every(({ name }) => String(form[name] || "").trim() !== "") &&
    Object.values(errors).every((err) => !err) &&
    acceptedTerms;

  /* -----------------------------
     🌐 Signup Handler
  ----------------------------- */
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    setOffline(false);

    try {
      await signUp(form);
      alert("Account created successfully! You can now log in.");
      setForm(initialFormState);
      router.push("/login");
    } catch (err) {
      console.warn("Signup error:", err);

      if (err.code === "ERR_NETWORK" || !navigator.onLine) {
        setOffline(true);
        return;
      }

      const message =
        err?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again later.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------
     🪷 Offline Fallback
  ----------------------------- */
  if (offline) {
    return (
      <OfflineFallback
        title={"We couldn’t reach Mindful Reader right now."}
        message={
          "The registration service seems unavailable right now. Please take a short break and try again in a moment."
        }
      />
    );
  }

  /* -----------------------------
     ✨ Main Signup Form
  ----------------------------- */
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FAF9F5] my-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 border border-[#DAD7CD] animate-fadeIn">
        <div className="mb-6 text-center">
          <h2 className="font-serif text-3xl text-[#3E5E4D] font-bold">
            Create your account
          </h2>
          <p className="text-sm text-[#4A5B4D] mt-2">
            Join{" "}
            <span className="text-[#A8BDA5] font-semibold">Mindful Reader</span>{" "}
            and start your reading journey.
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          noValidate
          className="grid grid-cols-1 gap-4"
        >
          {formFields.map((field) => {
            const isPassword = field.type === "password";
            const show =
              field.name === "password"
                ? showPassword
                : field.name === "confirmPassword"
                ? showConfirm
                : false;

            return (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-[#3E5E4D] mb-1"
                >
                  {field.label}
                  {field.required && <span className="text-red-500"> *</span>}
                </label>

                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={
                      isPassword ? (show ? "text" : "password") : field.type
                    }
                    required={field.required}
                    value={form[field.name]}
                    onChange={handleChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className={`block w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8BDA5] bg-[#FAFAFA] ${
                      errors[field.name] ? "border-red-400" : "border-[#DAD7CD]"
                    }`}
                    aria-invalid={Boolean(errors[field.name])}
                  />

                  {isPassword && (
                    <button
                      type="button"
                      onClick={() =>
                        field.name === "password"
                          ? setShowPassword((s) => !s)
                          : setShowConfirm((s) => !s)
                      }
                      className="absolute inset-y-0 right-2 flex items-center px-2 text-[#3E5E4D]"
                      aria-label={
                        show ? `Hide ${field.label}` : `Show ${field.label}`
                      }
                    >
                      {show ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#3E5E4D"
                        >
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3l2 2"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {errors[field.name] && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}

          <div className="flex items-start gap-3 mt-2">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 rounded border-[#DAD7CD] text-[#A8BDA5] focus:ring-[#A8BDA5]"
            />
            <label htmlFor="terms" className="text-sm text-[#4A5B4D]">
              I agree to the{" "}
              <a className="text-[#A8BDA5] underline cursor-pointer">
                terms and conditions
              </a>
              <span className="text-red-500"> *</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!formIsValid || loading}
            className={`w-full mt-4 rounded-lg py-3 text-sm font-semibold text-white ${
              !formIsValid || loading
                ? "bg-[#B4CBB3] cursor-not-allowed"
                : "bg-[#A8BDA5] hover:bg-[#8FA98B]"
            }`}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#4A5B4D]">
          Already have an account?{" "}
          <Link
            href={APIROUTE.login}
            className="text-[#A8BDA5] font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
