# Design Spec: Contact Section Modernization & Sanitization

**Date:** 2026-05-23  
**Status:** Approved  
**Topic:** Revamping the Contact section into modern cards with robust data sanitization.

## 1. Overview
The goal is to modernize the "05 / Contact" section by moving away from the terminal-split design to a "Modern Card" aesthetic that matches the new Projects directory. Simultaneously, we will implement a multi-layer sanitization and validation strategy for name, email, and message inputs.

## 2. Visual Design ("The Communication Node")

### 2.1. Layout
- **Structure:** Two primary cards instead of one large border.
  - **Dossier Card (Left/Top):** Contains status, email (with reveal), and social networks.
  - **Composer Card (Right/Bottom):** Contains the actual contact form.
- **Styling:** Consistent with the "Dev Directory" benchmark.
  - Subtle borders (`var(--ink)` at 0.1 opacity).
  - Spotlight Grid effect enabled on both cards.
  - High-quality Lucide icons (`User`, `Mail`, `MessageSquare`).

### 2.2. Interactivity
- **Character Counters:** Real-time "N / Max" display for name and message fields.
- **Loading State:** A "transmitting..." animation with a progress bar or pulsing indicator.
- **Success State:** A "transmission received" card with a clear, professional confirmation message.

## 3. Sanitization & Validation Logic

### 3.1. Layer 1: Frontend (Client-side)
- **Library:** `zod` (already present in project via dependencies).
- **Rules:**
  - Name: Min 2 chars, Max 80 chars, trim whitespace.
  - Email: Valid email format, trim, lowercase.
  - Message: Min 10 chars, Max 500 chars, trim whitespace.

### 3.2. Layer 2: API (Server-side)
- **Library:** `zod` for schema enforcement.
- **Sanitization:**
  - Manual stripping of HTML tags using regex (or `validator` if added).
  - Escaping special characters before sending via Resend.
  - Re-validation of all constraints before calling Resend API.

## 4. Technical Implementation

### 4.1. Files Modified
- `src/components/sections/contact-terminal.tsx`: Complete refactor to new card design.
- `src/app/api/contact/route.ts`: Update to include Zod validation and sanitization logic.

### 4.2. Icons (Lucide)
- **Name:** `User`
- **Email:** `Mail`
- **Message:** `MessageSquare`
- **Send:** `Send`

## 5. Success Criteria
- [ ] Contact section matches the "Dev Directory" visual style.
- [ ] Spotlight effect works on contact cards.
- [ ] All inputs are strictly validated and sanitized (no HTML allowed).
- [ ] Real-time character counters are present.
- [ ] No git commands are used.

## 6. Next Steps
1. User reviews and approves this spec.
2. Create implementation plan for the refactor and sanitization.
3. Execute (without git).
