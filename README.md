# FundingPortal

A real, working funding-application website: user accounts, a funding application form
with document uploads, a user dashboard with status tracking, and an admin dashboard for
reviewing applications, changing status, adding notes, and searching/filtering.

**Status: this is a functioning application once you complete the setup steps below.**
It is not automatically "production ready" out of the box — you must create your own
database, set real environment variables/secrets, create your first admin account, and
review the hardening notes near the end of this file before handling real applicants'
data.

---

## 1. What this actually is (and isn't)

- Real backend: Next.js API routes (`app/api/**`) backed by PostgreSQL via Prisma.
- Real authentication: NextAuth.js credentials login, passwords hashed with bcrypt
  (never stored in plain text), sessions signed with a secret you generate.
- Real file storage: uploaded documents go to a **private** Supabase Storage bucket;
  files are only ever served via short-lived signed URLs, generated after an ownership
  check.
- Real database persistence: every form submission is a row in PostgreSQL, not
  mock/in-memory data.
- No fake success states: if a database write or file upload fails, the UI shows an
  error, not a fake "saved!" message.

What it does **not** include (see "Before you go live" at the end): email
notifications, payment processing, password reset, 2FA, or bot/rate-limit protection.
These are realistic next steps, not silently-assumed features.

---

## 2. Tech stack

| Piece | Technology | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | One deployable project for frontend + backend |
| Database | PostgreSQL, hosted free on [Supabase](https://supabase.com) | Free tier, works with any serverless host |
| ORM | Prisma | Type-safe queries, easy migrations |
| Auth | NextAuth.js (Credentials provider) + bcryptjs | Full control over user table, no vendor lock-in |
| File storage | Supabase Storage (private bucket) | Same account as the DB, simple setup, signed URLs |
| Styling | Tailwind CSS | Fast to build a clean, mobile-friendly UI |
| Hosting | Vercel (free tier) | Zero-config Next.js hosting |

Only **one** third-party service is required: **Supabase** (used for both the database
and file storage, so you only need to create one account and one project).

---

## 3. Local setup

### 3.1 Prerequisites
- Node.js 18.18 or newer and npm
- A free [Supabase](https://supabase.com) account
- A free [Vercel](https://vercel.com) account (for deployment later)

### 3.2 Install dependencies
```bash
cd funding-app
npm install
```

### 3.3 Create your Supabase project
1. Go to [supabase.com](https://supabase.com) → **New project**. Choose a strong
   database password and save it.
2. Once the project is ready, go to **Project Settings → Database**. Under
   "Connection string", copy the **URI** shown under the "Transaction" pooling mode —
   this is your `DATABASE_URL`. Copy the **Session**/direct connection string too —
   this is your `DIRECT_URL` (used only for running migrations).
3. Go to **Project Settings → API**. Copy the **Project URL** (this is `SUPABASE_URL`)
   and the **`service_role` secret key** (this is `SUPABASE_SERVICE_ROLE_KEY`). The
   service role key is powerful — never put it in client-side code and never commit it.

### 3.4 Create the storage bucket
1. In the Supabase dashboard, go to **Storage → New bucket**.
2. Name it `documents` and leave it **Private** (do not make it public — application
   documents may be sensitive).
3. That's it. The app uses the service-role key server-side to read/write this bucket
   and issues short-lived signed URLs when a document needs to be viewed, so no public
   bucket policy is required.

### 3.5 Configure environment variables
```bash
cp .env.example .env.local
```
Fill in `.env.local` with the values from steps 3.3–3.4. Generate `NEXTAUTH_SECRET`
with:
```bash
openssl rand -base64 32
```
Keep `NEXTAUTH_URL=http://localhost:3000` for local development.

### 3.6 Set up the database schema
```bash
npx prisma migrate dev --name init
```
This creates the `users`, `applications`, `documents`, and `notes` tables in your
Supabase Postgres database.

### 3.7 Run the app
```bash
npm run dev
```
Visit `http://localhost:3000`.

### 3.8 Create your first admin account
1. Register a normal account at `/register`.
2. Promote it to admin from your terminal:
   ```bash
   npm run make-admin -- you@example.com
   ```
3. Log out and back in (or just log in again) so your session picks up the new role,
   then visit `/admin`.

There is intentionally no public "sign up as admin" option — admin access is granted
only via this script (or directly in the database), so a random visitor can never make
themselves an administrator.

---

## 4. How the pieces fit together

- **Applicants** register (`/register`), log in (`/login`), fill out `/apply`, upload
  documents, and see everything they've submitted at `/dashboard` and
  `/applications/[id]`, including live status (Pending / Under Review / Approved /
  Rejected).
- **Admins** (role `ADMIN` in the `users` table) see `/admin`: totals by status, a
  searchable/filterable table of every application, and a per-application review screen
  (`/admin/applications/[id]`) where they can change status and leave internal notes.
  Notes are never shown to the applicant — only fetched into API responses when the
  requester is an admin.
- **`middleware.ts`** blocks unauthenticated visitors from `/dashboard`, `/apply`,
  `/applications`, and `/admin`, and blocks non-admins from `/admin`. API routes also
  re-check the session and ownership/role server-side — the UI restrictions are a
  convenience, not the actual security boundary.
- **Documents** are never served from a public URL. `/api/documents/[id]` checks that
  the requester owns the application (or is an admin) before generating a 60-second
  signed URL from Supabase Storage.

---

## 5. Deploying to production (Vercel)

1. Push this project to a GitHub repository.
2. In Vercel, **Add New Project** → import the repo.
3. In **Environment Variables**, add everything from `.env.local`:
   - `DATABASE_URL`, `DIRECT_URL`
   - `NEXTAUTH_URL` → set this to your real production URL, e.g.
     `https://your-app.vercel.app`
   - `NEXTAUTH_SECRET` → generate a **new** one for production
     (`openssl rand -base64 32`), don't reuse your local one
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
4. Deploy. The build command (`npm run build`) already runs `prisma generate`
   automatically (see `package.json`).
5. Apply your schema to the production database (only needs to be done once, and
   again after future schema changes):
   ```bash
   DATABASE_URL="<production DATABASE_URL>" DIRECT_URL="<production DIRECT_URL>" npx prisma migrate deploy
   ```
6. Visit your production URL, register an account, and run the `make-admin` script
   locally pointed at the production database to create your production admin:
   ```bash
   DATABASE_URL="<production DATABASE_URL>" npm run make-admin -- you@example.com
   ```

Your Supabase project, database, and storage bucket are the same ones used in
production and locally by default — if you want fully separate dev/prod data, create a
second Supabase project and point production's environment variables at that one
instead.

---

## 6. Security notes (what's already handled)

- Passwords are hashed with bcrypt (10 salt rounds) — plain-text passwords are never
  stored or logged.
- Sessions are signed JWTs (`NEXTAUTH_SECRET`); nothing sensitive is stored client-side
  beyond the session token.
- Every API route re-validates the session server-side (`getServerSession`) — it does
  not trust the client.
- Ownership checks happen on every read of an application or document: a user can only
  see their own applications; only admins can see all applications and internal notes.
- All form input is validated with `zod` on the server (not just the client) in
  `lib/validations.ts`.
- File uploads are restricted by type (PDF/PNG/JPG/DOC/DOCX) and size (10MB), and the
  storage bucket is private — files are only reachable via short-lived signed URLs
  issued after an ownership check.
- HTTPS is enforced automatically by Vercel in production.

## 7. Before you go live: what to add next

This app is functionally complete for the workflow you described, but a few things are
deliberately left as follow-up work rather than silently assumed:

- **Password reset / forgot password** is not implemented. Add it via a
  time-limited token emailed to the user (e.g. using [Resend](https://resend.com) or
  [SendGrid](https://sendgrid.com) — either requires its own free API key).
- **Email notifications** (e.g. "your application status changed") are not sent. Same
  email provider as above would cover this.
- **Rate limiting / bot protection** on `/register`, `/login`, and `/apply` is not
  implemented. Consider Vercel's built-in firewall rules or adding a CAPTCHA
  (e.g. Cloudflare Turnstile) before accepting real public traffic.
- **Two-factor authentication** is not implemented.
- Have the Privacy Policy and Terms of Service (`app/privacy`, `app/terms`) reviewed by
  someone qualified for your jurisdiction before relying on them — the included text is
  a reasonable starting template, not legal advice.

Until you've addressed the items above that are relevant to your use case, treat this
as a working application in active development, not a hardened production system.
