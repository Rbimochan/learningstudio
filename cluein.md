Here is a **clean, authoritative Codex prompt** you can copy-paste.
It is written so Codex immediately understands **where the project is, why DB/RLS work happened, and what state the system is in now** — without re-doing or breaking anything.

---

# Codex Prompt — Project State Alignment (StudyStudio)

You are Codex operating inside the **StudyStudio (Learning Studio)** codebase.

Your task is **NOT to implement features**.
Your task is to **understand the current project state**, confirm correctness, and identify the **next safe engineering steps**.

---

## Project Summary (Read Carefully)

StudyStudio is a Coursera-style learning platform.

We have completed:

* Core frontend routes and UI
* Supabase authentication
* Database schema
* Row Level Security (RLS)
* Policies enforcing per-user data isolation
* Data layer extraction (`lib/db/*`)
* Studio navigation context fix (lesson → course → path)

The project recently moved from **frontend-first** to **secure backend-backed**, which is why database and RLS work occurred.

---

## Current Architecture (Authoritative)

### Frontend

* Next.js App Router
* Routes:

  * `/login`, `/signup`
  * `/paths`
  * `/paths/new`
  * `/paths/[pathId]`
  * `/paths/[pathId]/courses/[courseId]`
  * `/studio/[lessonId]`
* UI components **DO NOT call Supabase directly**

### Data Layer

* All database access lives in:

  * `lib/db/paths.ts`
  * `lib/db/courses.ts`
  * `lib/db/lessons.ts`
  * `lib/db/progress.ts`
  * `lib/db/notes.ts`
  * `lib/db/context.ts`
* Uses server-only Supabase clients
* Client components call **Server Actions**, not Supabase

### Database (Supabase)

Tables:

* `learning_paths`
* `path_courses`
* `courses`
* `lessons`
* `progress`
* `notes`

Relationships:

* Path → Courses (via `path_courses`)
* Course → Lessons
* Lesson → Progress / Notes (per user)

Security:

* RLS enabled on **all tables**
* Policies restrict access via `auth.uid()`
* No service role key in client
* No mock data

Migrations:

* Versioned migration files exist and have been run
* RLS enabled and verified manually in Supabase dashboard

---

## What JUST Happened (Context)

The human:

* Enabled RLS on all tables
* Verified policies in Supabase UI
* Removed unsafe direct Supabase usage from UI
* Reached a moment of confusion due to backend/security work

This is **expected** at the transition from prototype → production-safe app.

---

## Your Mission

### Step 1 — Verify project state (read-only)

Inspect the repo and confirm:

* No direct Supabase usage in UI/components
* Data access only via `lib/db/*`
* Studio back-link uses DB context (no `"temp"` IDs)
* Auth guard works for `(workspace)` routes

### Step 2 — Identify current risks (do NOT fix yet)

List:

* Anything fragile
* Anything duplicated
* Anything unsafe
* Anything incomplete but required for MVP

### Step 3 — Define NEXT engineering steps

Produce a **short, ordered list** of:

1. What to test manually now
2. What feature to build next
3. What database change (if any) is needed later (not now)

---

## Hard Rules

* ❌ Do NOT rewrite DB schema
* ❌ Do NOT change RLS or policies
* ❌ Do NOT add new tables
* ❌ Do NOT touch UI design
* ❌ Do NOT introduce new architecture

You are aligning, not refactoring.

---

## Output Format (Strict)

Return:

1. **Current State: PASS / WARN / FAIL**
2. **Why the DB/RLS step was necessary**
3. **What is safe to build next**
4. **What NOT to touch right now**
5. **One sentence reassurance** (human is not lost — system is correct)

---

## Mental Model (Important)

Frontend led us here.
Database made it safe.
Now we continue building features calmly.

Proceed.

---
