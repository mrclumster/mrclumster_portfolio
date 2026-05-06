"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { TerminalInput, TerminalTextarea, TerminalLabel } from "@/components/terminal/terminal-input";
import { TerminalButton } from "@/components/terminal/terminal-button";

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

export function ContactTerminal() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  function handleChange(field: keyof typeof formData, value: string) {
    if (value.length > LIMITS[field]) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleBlur(field: keyof typeof formData) {
    const errs: FieldErrors = {};
    if (field === "name" && !formData.name.trim()) errs.name = "Name is required";
    if (field === "email") {
      if (!formData.email.trim()) errs.email = "Email is required";
      else if (!validateEmail(formData.email)) errs.email = "Email looks invalid";
    }
    if (field === "message") {
      if (!formData.message.trim()) errs.message = "Message is required";
      else if (formData.message.trim().length < MIN_MESSAGE) errs.message = `At least ${MIN_MESSAGE} characters`;
    }
    setFieldErrors((prev) => ({ ...prev, ...errs }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs: FieldErrors = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!validateEmail(formData.email)) errs.email = "Email looks invalid";
    if (!formData.message.trim()) errs.message = "Message is required";
    else if (formData.message.trim().length < MIN_MESSAGE) errs.message = `At least ${MIN_MESSAGE} characters`;
    setFieldErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setServerError((data as { error?: string })?.error ?? "Something went wrong");
        setStatus("error");
        return;
      }
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      const rect = submitBtnRef.current?.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 60,
        origin: rect
          ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
          : undefined,
        colors: ["#1a1a1a", "#c0392b", "#f4f2ed"],
      });
    } catch {
      setServerError("Network error");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl text-[14px]">
      <p className="opacity-60 text-[12px]">$ contact --send</p>

      <div>
        <TerminalLabel>from / name</TerminalLabel>
        <TerminalInput
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          placeholder="your name"
        />
        {fieldErrors.name && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.name}</p>}
      </div>

      <div>
        <TerminalLabel>email</TerminalLabel>
        <TerminalInput
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          placeholder="you@domain.com"
        />
        {fieldErrors.email && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.email}</p>}
      </div>

      <div>
        <TerminalLabel>message</TerminalLabel>
        <TerminalTextarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          placeholder="say something nice"
        />
        {fieldErrors.message && <p className="text-[12px] mt-1 text-[color:var(--alarm)]">{fieldErrors.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button ref={submitBtnRef} type="submit" disabled={status === "loading"} className="contents">
          <TerminalButton>{status === "loading" ? "submitting…" : "submit"}</TerminalButton>
        </button>
        {status === "success" && (
          <span className="inline-flex items-center gap-1 text-[12px]"><CheckCircle className="h-3.5 w-3.5" /> sent</span>
        )}
        {status === "error" && (
          <span className="inline-flex items-center gap-1 text-[12px] text-[color:var(--alarm)]">
            <AlertCircle className="h-3.5 w-3.5" /> {serverError || "failed"}
          </span>
        )}
        {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      </div>
    </form>
  );
}
