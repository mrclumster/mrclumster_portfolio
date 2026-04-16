"use client";

import { useState, useCallback } from "react";
import { Mail, Copy, Check } from "lucide-react";

interface CopyableEmailProps {
  email: string;
}

export function CopyableEmail({ email }: CopyableEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for non-HTTPS contexts (shouldn't happen on Vercel)
    }
  }, [email]);

  return (
    <button
      onClick={handleCopy}
      className="group mt-1 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 relative"
      aria-label={copied ? "Email copied!" : `Copy email: ${email}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500 transition-all duration-200" />
      ) : (
        <Mail className="h-3.5 w-3.5 transition-all duration-200" />
      )}
      <span>{email}</span>
      {/* Copy icon — appears on hover */}
      <Copy className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
      {/* Tooltip */}
      <span
        className={`pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[10px] text-background transition-all duration-200 ${
          copied ? "opacity-100 -translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        Copied!
      </span>
    </button>
  );
}
