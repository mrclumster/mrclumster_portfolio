"use client";

import { useState, useRef, type ChangeEvent } from "react";
import confetti from "canvas-confetti";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const inputClassName =
  "w-full rounded-lg bg-background/50 px-3 py-2 text-sm text-foreground ring-1 ring-foreground/10 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent-brand/50 transition-[ring-color] duration-200";

const LIMITS = { name: 80, email: 120, message: 500 };
const MIN_MESSAGE = 10;

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  function handleChange(field: keyof typeof formData, value: string) {
    // Hard-cap at limit — no more characters accepted
    if (value.length > LIMITS[field]) return;
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field as user types
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleBlur(field: keyof typeof formData) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  }

  function validateField(field: keyof typeof formData, value: string) {
    let error: string | undefined;
    const v = value.trim();

    if (field === "name") {
      if (!v) error = "Name is required.";
      else if (v.length < 2) error = "At least 2 characters.";
    }
    if (field === "email") {
      if (!v) error = "Email is required.";
      else if (!validateEmail(v)) error = "Enter a valid email address.";
    }
    if (field === "message") {
      if (!v) error = "Message is required.";
      else if (v.length < MIN_MESSAGE) error = `At least ${MIN_MESSAGE} characters.`;
    }

    setFieldErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  }

  function validateAll() {
    const fields = ["name", "email", "message"] as const;
    setTouched({ name: true, email: true, message: true });
    return fields.every((f) => validateField(f, formData[f]));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!validateAll()) return;

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerError(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTouched({});
      setFieldErrors({});

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const btn = submitBtnRef.current;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          confetti({
            origin: {
              x: (rect.left + rect.width / 2) / window.innerWidth,
              y: (rect.top + rect.height / 2) / window.innerHeight,
            },
            particleCount: 80,
            spread: 70,
            startVelocity: 30,
            colors: ["#6366f1", "#818cf8", "#a5b4fc", "#f59e0b", "#34d399"],
          });
        }
      }
    } catch {
      setStatus("error");
      setServerError("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle className="h-8 w-8 text-accent-brand" />
        <p className="text-sm font-semibold">Message sent!</p>
        <p className="text-xs text-muted-foreground">I&apos;ll get back to you soon.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs text-accent-brand hover:underline cursor-pointer"
        >
          Send another message
        </button>
      </div>
    );
  }

  const msgLen = formData.message.length;
  const msgNearLimit = msgLen >= LIMITS.message * 0.85;

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 flex w-full max-w-md flex-col gap-3">
      {/* Name + Email row */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            className={cn(inputClassName, touched.name && fieldErrors.name && "ring-destructive/60 focus:ring-destructive/60")}
          />
          {touched.name && fieldErrors.name && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
              <AlertCircle className="h-3 w-3" />{fieldErrors.name}
            </p>
          )}
        </div>
        <div className="flex-1">
          <input
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={cn(inputClassName, touched.email && fieldErrors.email && "ring-destructive/60 focus:ring-destructive/60")}
          />
          {touched.email && fieldErrors.email && (
            <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
              <AlertCircle className="h-3 w-3" />{fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <textarea
          placeholder="Your message"
          rows={4}
          value={formData.message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          className={cn(inputClassName, "resize-none", touched.message && fieldErrors.message && "ring-destructive/60 focus:ring-destructive/60")}
        />
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[11px] text-destructive">
            {touched.message && fieldErrors.message && (
              <span className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />{fieldErrors.message}
              </span>
            )}
          </span>
          <span className={cn("text-[11px] tabular-nums", msgNearLimit ? "text-accent-warm" : "text-muted-foreground/50")}>
            {msgLen}/{LIMITS.message}
          </span>
        </div>
      </div>

      {serverError && (
        <p className="text-xs text-destructive">{serverError}</p>
      )}

      <button
        ref={submitBtnRef}
        type="submit"
        disabled={status === "loading"}
        className={cn(
          buttonVariants({ size: "default" }),
          "w-full sm:w-auto sm:self-center cursor-pointer"
        )}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
