"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, AlertCircle } from "lucide-react";
import { TerminalInput, TerminalTextarea, TerminalLabel } from "@/components/terminal/terminal-input";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { personalInfo } from "@/data/personal";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";

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
  const [emailRevealed, setEmailRevealed] = useState(false);
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
    <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-0 border border-[color:var(--ink)]" style={{ borderColor: "var(--ink)" }}>

      {/* ── LEFT: Operator dossier ── */}
      <div
        className="relative flex flex-col justify-between p-6 lg:p-8 border-b lg:border-b-0 lg:border-r"
        style={{ borderColor: "var(--ink)" }}
      >
        {/* Large decorative bracket */}
        <span
          aria-hidden
          className="absolute top-4 right-4 font-mono select-none pointer-events-none"
          style={{
            fontSize: "clamp(5rem, 8vw, 9rem)",
            lineHeight: 1,
            color: "var(--ink)",
            opacity: 0.04,
            fontWeight: 900,
          }}
        >
          {"{"}
        </span>

        <div className="space-y-6 relative z-10">
          {/* Status badge */}
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{
                background: "var(--ink)",
                animation: "pulse 2.4s ease-in-out infinite",
              }}
              aria-hidden
            />
            <span style={{ opacity: 0.5 }}>status</span>
            <span className="ml-1" style={{ opacity: 0.9 }}>{personalInfo.status.label}</span>
          </div>

          {/* Heading */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] mb-2" style={{ opacity: 0.4 }}>
              // open channel
            </p>
            <p
              className="font-mono leading-snug"
              style={{ fontSize: "clamp(1.25rem, 1rem + 1.2vw, 1.75rem)", color: "var(--ink)" }}
            >
              Let&apos;s build<br />
              something<br />
              <em style={{ fontStyle: "normal", opacity: 0.45 }}>together.</em>
            </p>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.4 }}>
              channel / email
            </p>
            <button
              type="button"
              onClick={() => setEmailRevealed((v) => !v)}
              className="font-mono text-[0.8125rem] text-left transition-opacity hover:opacity-100"
              style={{ color: "var(--ink)", opacity: emailRevealed ? 1 : 0.55 }}
              aria-label="Reveal email address"
            >
              {emailRevealed ? (
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:underline underline-offset-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {personalInfo.email}
                </a>
              ) : (
                <span>
                  <span style={{ opacity: 0.4 }}>[hover to reveal] </span>
                  {personalInfo.email.replace(/./g, "·")}
                </span>
              )}
            </button>
          </div>

          {/* Social links */}
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ opacity: 0.4 }}>
              networks
            </p>
            <div className="flex flex-wrap gap-2">
              {personalInfo.socialLinks.github && (
                <TerminalButton href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-3 w-3" /> github
                </TerminalButton>
              )}
              {personalInfo.socialLinks.linkedin && (
                <TerminalButton href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="h-3 w-3" /> linkedin
                </TerminalButton>
              )}
              {personalInfo.socialLinks.facebook && (
                <TerminalButton href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className="h-3 w-3" /> facebook
                </TerminalButton>
              )}
              {personalInfo.socialLinks.instagram && (
                <TerminalButton href={personalInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className="h-3 w-3" /> instagram
                </TerminalButton>
              )}
            </div>
          </div>
        </div>

        {/* Bottom coord line */}
        <p
          className="font-mono text-[10px] mt-8 lg:mt-0"
          style={{ opacity: 0.25, letterSpacing: "0.1em" }}
        >
          {personalInfo.location.toUpperCase()} · {new Date().getFullYear()}
        </p>
      </div>

      {/* ── RIGHT: Transmission composer ── */}
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6 font-mono text-[11px]" style={{ opacity: 0.4 }}>
          <span>&gt;_</span>
          <span className="uppercase tracking-widest">compose transmission</span>
        </div>

        {status === "success" ? (
          <div className="flex flex-col gap-4 py-8 font-mono">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 shrink-0" style={{ color: "var(--ink)" }} />
              <span className="text-[0.9375rem]" style={{ color: "var(--ink)" }}>
                transmission received.
              </span>
            </div>
            <p className="text-[0.8125rem]" style={{ opacity: 0.5 }}>
              I&apos;ll get back to you shortly. Stand by.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-2 self-start font-mono text-[0.8125rem] underline underline-offset-4"
              style={{ opacity: 0.5 }}
            >
              send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <TerminalLabel>FROM / NAME</TerminalLabel>
              <TerminalInput
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="your name"
                autoComplete="name"
              />
              {fieldErrors.name && (
                <p className="font-mono text-[11px] mt-1" style={{ color: "var(--alarm)" }}>
                  ! {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <TerminalLabel>CHANNEL / EMAIL</TerminalLabel>
              <TerminalInput
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="you@domain.com"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="font-mono text-[11px] mt-1" style={{ color: "var(--alarm)" }}>
                  ! {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <TerminalLabel>PAYLOAD / MESSAGE</TerminalLabel>
              <TerminalTextarea
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onBlur={() => handleBlur("message")}
                placeholder="say something nice"
              />
              {fieldErrors.message && (
                <p className="font-mono text-[11px] mt-1" style={{ color: "var(--alarm)" }}>
                  ! {fieldErrors.message}
                </p>
              )}
            </div>

            <div className="pt-1 space-y-3">
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={status === "loading"}
                className="w-full font-mono text-[0.875rem] py-3 tracking-wider transition-opacity disabled:opacity-40 hover:opacity-80"
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  letterSpacing: "0.08em",
                }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full animate-ping"
                      style={{ background: "var(--paper)", opacity: 0.7 }}
                    />
                    transmitting…
                  </span>
                ) : (
                  ">_ send_message"
                )}
              </button>

              {status === "error" && (
                <div className="flex items-center gap-2 font-mono text-[12px]" style={{ color: "var(--alarm)" }}>
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>! TRANSMISSION FAILED — {serverError || "unknown error"}</span>
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
