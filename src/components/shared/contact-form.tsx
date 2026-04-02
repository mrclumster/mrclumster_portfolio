"use client";

import { useState, type FormEvent } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const inputClassName =
  "w-full rounded-lg bg-background/50 px-3 py-2 text-sm text-foreground ring-1 ring-foreground/10 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent-brand/50 transition-[ring-color] duration-200";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
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

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          className={inputClassName}
        />
        <input
          type="email"
          placeholder="Your email"
          required
          value={formData.email}
          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
          className={inputClassName}
        />
      </div>
      <textarea
        placeholder="Your message"
        required
        rows={4}
        value={formData.message}
        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
        className={cn(inputClassName, "resize-none")}
      />
      {status === "error" && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
      <button
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
