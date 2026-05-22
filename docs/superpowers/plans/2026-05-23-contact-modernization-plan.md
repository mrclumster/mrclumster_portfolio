# Contact Modernization & Sanitization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the Contact section with a card-based layout, spotlight effects, and robust Zod-based sanitization.

**Architecture:** We will update the API route to use Zod for server-side validation and sanitization. Then, we will refactor the `ContactTerminal` component into two specialized cards ("Dossier" and "Composer") using the "Dev Directory" visual language and local mouse tracking for the spotlight effect.

**Tech Stack:** Next.js, React, Zod, Framer Motion, Lucide React.

**STRICT RULE:** NO GIT COMMANDS.

---

### Task 1: Robust Server-Side Sanitization

**Files:**
- Modify: `src/app/api/contact/route.ts`

- [ ] **Step 1: Implement Zod schema and sanitization**
Update the POST handler to use Zod and strip HTML from name and message.

```typescript
import { Resend } from "resend";
import { NextResponse } from "next/server";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

// Sanitization helper
const stripHtml = (str: string) => str.replace(/<[^>]*>?/gm, '');

const contactSchema = z.object({
  name: z.string().min(2).max(80).transform(stripHtml),
  email: z.string().email().toLowerCase(),
  message: z.string().min(10).max(500).transform(stripHtml),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid input data." }, { status: 400 });
    }

    const { name, email, message } = result.data;

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["aziztebbeng@gmail.com"],
      replyTo: email,
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
```

---

### Task 2: Refactor Contact Component into Modern Cards

**Files:**
- Modify: `src/components/sections/contact-terminal.tsx`

- [ ] **Step 1: Rewrite Component with Card Design and Spotlight**
Refactor the UI into two cards using local mouse tracking for the spotlight effect.

```tsx
"use client";

import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, AlertCircle, User, Mail, MessageSquare, Send, Github, Linkedin, Facebook, Instagram } from "lucide-react";
import { TerminalInput, TerminalTextarea, TerminalLabel } from "@/components/terminal/terminal-input";
import { TerminalButton } from "@/components/terminal/terminal-button";
import { personalInfo } from "@/data/personal";
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from "@/components/shared/icons";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";

function ContactCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(400px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.1), transparent 80%)`;
  const border = useMotionTemplate`radial-gradient(250px circle at ${springX}px ${springY}px, rgba(var(--ink-rgb), 0.35), transparent 80%)`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={`group relative bg-[var(--paper)] overflow-hidden transition-all duration-300 ${className}`}
    >
      <motion.div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100" style={{ background }} />
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100 z-30"
        style={{ 
          border: '1px solid transparent',
          backgroundImage: border,
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      <div className="absolute inset-0 pointer-events-none z-10 border border-[var(--ink)] opacity-10" />
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
}

export function ContactTerminal() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailRevealed, setEmailRevealed] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
      {/* Dossier Card */}
      <ContactCard className="p-8 flex flex-col justify-between min-h-[350px]">
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4 font-mono text-[10px] uppercase tracking-widest opacity-40">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] animate-pulse" />
              dossier_05
            </div>
            <h2 className="font-mono text-2xl font-bold uppercase tracking-tighter mb-2">Let&apos;s build something together.</h2>
            <p className="font-mono text-sm opacity-50 italic">Available for select projects and collaborations.</p>
          </div>

          <div className="space-y-4">
             <div className="space-y-1">
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">channel / email</p>
                <button onClick={() => setEmailRevealed(!emailRevealed)} className="font-mono text-sm hover:opacity-100 transition-opacity opacity-70">
                   {emailRevealed ? personalInfo.email : "[click to reveal] " + personalInfo.email.replace(/./g, "·")}
                </button>
             </div>
             <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-widest opacity-40">networks</p>
                <div className="flex flex-wrap gap-3">
                   {personalInfo.socialLinks.github && <a href={personalInfo.socialLinks.github} target="_blank" className="opacity-60 hover:opacity-100 transition-opacity"><Github className="w-5 h-5" /></a>}
                   {personalInfo.socialLinks.linkedin && <a href={personalInfo.socialLinks.linkedin} target="_blank" className="opacity-60 hover:opacity-100 transition-opacity"><Linkedin className="w-5 h-5" /></a>}
                </div>
             </div>
          </div>
        </div>
        <p className="font-mono text-[10px] opacity-20 tracking-widest uppercase">{personalInfo.location} // {new Date().getFullYear()}</p>
      </ContactCard>

      {/* Composer Card */}
      <ContactCard className="p-8">
        <div className="flex items-center gap-2 mb-8 font-mono text-[10px] uppercase tracking-widest opacity-40">
          <Send className="w-3 h-3" />
          compose_transmission
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center justify-center h-full py-12 space-y-4">
             <CheckCircle className="w-12 h-12 opacity-80" />
             <p className="font-mono text-lg font-bold uppercase tracking-tight">Transmission Received</p>
             <button onClick={() => setStatus("idle")} className="font-mono text-xs underline opacity-50">send another</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <TerminalLabel className="text-[10px]">FROM / NAME</TerminalLabel>
                <span className="font-mono text-[9px] opacity-30">{formData.name.length}/80</span>
              </div>
              <TerminalInput 
                value={formData.name} 
                onChange={(e) => handleChange("name", e.target.value)} 
                maxLength={80}
                placeholder="your name" 
              />
            </div>

            <div className="space-y-2">
              <TerminalLabel className="text-[10px]">CHANNEL / EMAIL</TerminalLabel>
              <TerminalInput 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                placeholder="you@domain.com" 
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <TerminalLabel className="text-[10px]">PAYLOAD / MESSAGE</TerminalLabel>
                <span className="font-mono text-[9px] opacity-30">{formData.message.length}/500</span>
              </div>
              <TerminalTextarea 
                value={formData.message} 
                onChange={(e) => handleChange("message", e.target.value)} 
                maxLength={500}
                placeholder="say something nice" 
              />
            </div>

            <button 
              ref={submitBtnRef}
              disabled={status === "loading"}
              className="w-full bg-[var(--ink)] text-[var(--paper)] font-mono py-4 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === "loading" ? "transmitting..." : ">_ send_message"}
            </button>
            {status === "error" && (
              <div className="flex items-center gap-2 font-mono text-[10px] text-red-500">
                <AlertCircle className="w-3 h-3" /> transmission_failed
              </div>
            )}
          </form>
        )}
      </ContactCard>
    </div>
  );
}
```

---

### Task 3: Verification

- [ ] **Step 1: Check Linting**
Run: `npx eslint src/app/api/contact/route.ts src/components/sections/contact-terminal.tsx`
Expected: No errors.

- [ ] **Step 2: Functional Check (Mental)**
Verify that Zod schema correctly transforms strings by stripping HTML tags before they reach the Resend call.
