# Friendly Modern-Vintage Header & Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the global Header and Footer to be more inclusive and approachable for both technical and non-technical audiences using the `@aziztebbeng` branding. **Note: Do not commit changes; the user will handle commits personally.**

**Architecture:**
- Update `src/components/terminal/terminal-frame.tsx` to replace technical terminal elements with human-centric content.
- Implement a two-column grid layout for the footer.
- Add decorative ASCII texture elements for visual personality.

**Tech Stack:**
- React (Next.js)
- Tailwind CSS

---

### Task 1: Update Global Header Branding and Navigation

**Files:**
- Modify: `src/components/terminal/terminal-frame.tsx`

- [ ] **Step 1: Replace terminal prompt with @aziztebbeng and update navigation styling**

Update the `<header>` and its internal navigation.

```tsx
// Inside src/components/terminal/terminal-frame.tsx

export function TerminalFrame({ prompt = "cat index.md", children }: TerminalFrameProps) {
  // ... existing hooks ...

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between gap-6 border-b border-[color:var(--ink)] bg-[color:var(--paper)] px-4 py-3 text-[13px] sm:px-6 lg:px-8">
        <div className="font-bold tracking-tight">
          @aziztebbeng
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:underline underline-offset-4 font-bold uppercase tracking-wider text-[11px]">
              {n.label}
            </Link>
          ))}
          <button 
            type="button" 
            onClick={() => setTheme(next)} 
            className="hover:bg-[color:var(--ink)] hover:text-[color:var(--paper)] px-1.5 py-0.5 border border-[color:var(--ink)] transition-colors text-[10px] uppercase font-bold" 
            aria-label="Toggle color theme"
          >
            {mounted ? current : "…"}
          </button>
        </nav>
      </header>
      
      {/* Texture line */}
      <div className="w-full overflow-hidden whitespace-nowrap text-[10px] opacity-20 select-none py-1 border-b border-[color:var(--ink)] border-dashed pointer-events-none">
        {":".repeat(200)}
      </div>

      {children}
      
      {/* ... footer will be updated in next task ... */}
    </div>
  );
}
```

- [ ] **Step 2: Verify header layout**
Run the dev server and ensure the header is cleanly aligned and the `@aziztebbeng` branding is visible.

---

### Task 2: Redesign Global Footer

**Files:**
- Modify: `src/components/terminal/terminal-frame.tsx`

- [ ] **Step 1: Replace terminal footer with two-column human-centric layout**

Replace the current footer with the redesigned version.

```tsx
// Inside src/components/terminal/terminal-frame.tsx

<footer className="mt-24 border-t border-[color:var(--ink)] px-4 py-8 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <div className="space-y-2">
      <div className="text-[13px] font-bold">@aziztebbeng</div>
      <div className="text-[11px] opacity-70 leading-relaxed">
        Hand-crafted with code. <br />
        Based in Algeria.
      </div>
    </div>
    <div className="md:text-right space-y-4">
      <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-widest">
        <a href="https://github.com/aziztebbeng" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Github</a>
        <a href="https://linkedin.com/in/aziztebbeng" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">Linkedin</a>
      </div>
      <div className="inline-flex items-center gap-2 px-3 py-1 border border-[color:var(--ink)] text-[10px] font-bold uppercase tracking-tighter">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Available for new projects
      </div>
    </div>
  </div>
</footer>
```

---

### Task 3: Final Verification

- [ ] **Step 1: Check responsiveness**
- Verify header navigation wraps correctly on small screens.
- Verify footer columns stack on mobile and align side-by-side on desktop.
- Verify theme toggle maintains its functionality and new styling.

- [ ] **Step 2: Final visual check**
Ensure the "Friendly Modern-Vintage" look is consistent across the page.
