# Peoples League Content Calendar — Developer Handoff

## What This Is

A collaborative content calendar for **Peoples League Golf** — a golf media/entertainment brand. The platform is used by their head of production, head of social media, and the founder (Clay) to plan, track, and manage all content across long-form video, short-form video, and static social posts.

**Live URL:** https://peoples-league-calendar.vercel.app

---

## Architecture Overview

This is a **single-file React application** (`standalone.html`, ~3,670 lines). Everything — components, hooks, styles, and logic — lives in one HTML file that loads React 18, ReactDOM, and Babel via CDN, plus Supabase JS client. There is no build step for the production app.

```
peoples-league-calendar/
├── standalone.html          ← THE app (all-in-one, ~181KB)
├── deploy/
│   ├── index.html           ← Exact copy of standalone.html (deployed to Vercel)
│   ├── vercel.json          ← Cache-busting headers
│   └── .vercel/             ← Vercel project link config
├── supabase/
│   └── functions/
│       └── send-notification/
│           └── index.ts     ← Supabase Edge Function for email notifications
├── src/                     ← LEGACY: Original Vite/component-based version (not used)
├── package.json             ← LEGACY: For the Vite version (not used)
├── vite.config.js           ← LEGACY: Not used
├── get-started-guide.html   ← Onboarding guide for team members
├── team-email.md            ← Invite email template
└── PL PRIMARY ICON.png      ← Brand logo
```

> **Important:** The `/src` directory is the original component-based version that was abandoned in favor of the standalone approach. It is outdated and not what's deployed. Everything runs from `standalone.html`.

### Why a single file?

The team needed something deployable without a build pipeline. The standalone HTML file loads all dependencies from CDNs and uses Babel to transpile JSX in-browser. Deployment is literally copying the file to `/deploy/index.html` and running `vercel --prod`.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Babel (in-browser transpilation) |
| Backend/DB | Supabase (Postgres + Auth + Realtime + Storage) |
| Hosting | Vercel (static file) |
| Email | Resend (via Supabase Edge Function) |
| Auth | Supabase Magic Link (email OTP) |

### CDN Dependencies (loaded in `<head>`)
- React 18.2.0 + ReactDOM
- Babel Standalone 7.23.6
- Supabase JS 2.49.1
- Inter font (Google Fonts)

---

## Supabase Configuration

**Project URL:** `https://ycqysghmfdwohjjvxgyv.supabase.co`
**Anon Key:** Hardcoded in `standalone.html` line 491

### Database Tables

#### `content` — Main pipeline content
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key, auto-generated |
| title | TEXT | Required |
| description | TEXT | Optional |
| type | TEXT | `'long-form'`, `'short-form'`, or `'social'` |
| stage | TEXT | Current pipeline stage (see Stage Definitions below) |
| position | INTEGER | Order within a pipeline column (for drag reordering) |
| shoot_date | DATE | Optional |
| release_date | DATE | Optional |
| assignee | TEXT | Email of assigned team member |
| tags | JSONB | Array of tag strings |
| notes | TEXT | Internal notes |
| platforms | JSONB | Array of platform IDs for social type (`['instagram', 'x', 'linkedin']`) |
| created_by | TEXT | Email of creator |
| created_at | TIMESTAMPTZ | Auto-set |
| updated_by | TEXT | Email of last editor |
| updated_at | TIMESTAMPTZ | Auto-updated |

#### `ideas` — Ideas bank (pre-pipeline brainstorming)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| title | TEXT | Required |
| description | TEXT | Optional |
| type | TEXT | `'long-form'`, `'short-form'`, or `'social'` |
| tags | JSONB | Array of tag strings |
| assignee | TEXT | **May not exist yet** — see SQL Migrations |
| notes | TEXT | **May not exist yet** |
| platforms | JSONB | **May not exist yet** |
| created_by | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_by | TEXT | **May not exist yet** |
| updated_at | TIMESTAMPTZ | **May not exist yet** |

#### `deleted_content` — Soft-delete trash bin
Same schema as `content` plus `deleted_at`. Auto-purged after 30 days.

#### `team_members` — Registered users
| Column | Type | Notes |
|--------|------|-------|
| email | TEXT | Primary key |
| display_name | TEXT | Shown in UI |
| last_seen | TIMESTAMPTZ | Updated on login |

#### `custom_tags` — User-created tags
| Column | Type |
|--------|------|
| id | UUID |
| name | TEXT |

#### `activity_log` — Audit trail
| Column | Type |
|--------|------|
| id | UUID |
| action | TEXT |
| details | TEXT |
| user_name | TEXT |
| created_at | TIMESTAMPTZ |

### Storage
- **Bucket:** `profile-pics` — Profile photos, keyed by sanitized email

### Realtime Subscriptions
The app subscribes to realtime changes on `content`, `ideas`, `deleted_content`, and `activity_log`. All INSERT/UPDATE/DELETE events sync across connected browsers.

---

## Pending SQL Migrations

The user may or may not have run these. The code is written to be resilient (falls back gracefully if columns don't exist), but for full functionality these should be applied:

```sql
-- Ideas table: extended fields for full editing
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS assignee TEXT DEFAULT '';
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]';
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS updated_by TEXT;
ALTER TABLE ideas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Ideas: allow 'social' type
ALTER TABLE ideas DROP CONSTRAINT IF EXISTS ideas_type_check;
ALTER TABLE ideas ADD CONSTRAINT ideas_type_check CHECK (type IN ('short-form', 'long-form', 'social'));

-- Content: position column for drag reordering
ALTER TABLE content ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE deleted_content ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Content: platforms column for social posts
ALTER TABLE content ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]';
ALTER TABLE deleted_content ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]';

-- Custom tags table
CREATE TABLE IF NOT EXISTS custom_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE custom_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for authenticated" ON custom_tags FOR ALL USING (auth.role() = 'authenticated');
```

---

## Content Types & Pipeline Stages

The app has three content types, each with its own pipeline:

### Long-form (YouTube videos, documentaries)
| Stage ID | Label | Color |
|----------|-------|-------|
| `scheduled-shoot` | Shoot Scheduled | Blue `#3b82f6` |
| `production` | In Production | Amber `#f59e0b` |
| `editing` | Editing | Pink `#ec4899` |
| `review` | Review | Cyan `#06b6d4` |
| `scheduled-release` | Scheduled | Green `#10b981` |
| `published` | Published | Lime `#D4FF00` |

### Short-form (TikTok, Reels, Shorts)
| Stage ID | Label | Color |
|----------|-------|-------|
| `planning` | Planning | Purple `#8b5cf6` |
| `shoot` | Shoot | Blue `#3b82f6` |
| `edit` | Edit | Pink `#ec4899` |
| `scheduled` | Scheduled | Green `#10b981` |
| `published` | Published | Lime `#D4FF00` |

### Static (social posts — displayed as "Static" in UI, stored as `social` internally)
| Stage ID | Label | Color |
|----------|-------|-------|
| `social-draft` | Draft | Purple `#8b5cf6` |
| `social-design` | Design | Amber `#f59e0b` |
| `social-review` | Review | Cyan `#06b6d4` |
| `social-scheduled` | Scheduled | Green `#10b981` |
| `social-published` | Published | Lime `#D4FF00` |

> **Naming note:** The third type is called "Static" in the UI everywhere but stored as `social` in the database and code. This was renamed because short-form content is also inherently "social," so the team wanted to distinguish static image/graphic posts.

### Platforms (for Static/Social type only)
- LinkedIn (`linkedin`)
- Instagram (`instagram`)
- X/Twitter (`x`)

---

## Application Views

### 1. Pipeline (default view)
Kanban board with columns per stage. Filterable by content type (Long-form / Short-form / Static tabs). Cards are:
- **Clickable** → opens edit modal (ContentForm)
- **Draggable** → between columns (stage change) and within columns (reorder)
- **Arrow buttons** → move forward/back one stage

### 2. Calendar
Month view showing all content across types. Color-coded dots:
- Blue `L:` = Long-form (by shoot date)
- Amber `S:` = Short-form (by release date)
- Purple `P:` = Static/Social posts (by release date)

This is the unified view — the "All Content" tab was intentionally removed from Pipeline because Calendar serves that purpose.

### 3. Ideas Bank
Pre-pipeline brainstorming space. Ideas are organized into Short-form, Long-form, and Static sections. Cards are:
- **Clickable** → opens IdeaForm modal for full editing (tags, assignee, notes, platforms)
- **"Start" button** → promotes idea into the Pipeline at its first stage
- **Inline "Add Idea"** → quick-add form at top

### 4. Archive
Shows published content and provides a trash bin for soft-deleted items. Trash auto-purges after 30 days.

### 5. Admin Portal
Only visible to admin users (defined by `ADMIN_EMAILS` array, line 742). Manages team members, profile pictures, and display names.

---

## Key Code Patterns

### Optimistic Updates
Every mutation follows this pattern:
1. Generate `crypto.randomUUID()` for optimistic ID
2. Immediately update React state with optimistic data
3. Send to Supabase
4. On success: replace optimistic item with real DB response
5. On error: revert state, log error

### Realtime Deduplication
Because of optimistic updates, the realtime INSERT handler checks `prev.some(item => item.id === payload.new.id)` before adding — prevents duplicates when the DB confirms an item the client already added optimistically.

### Date Parsing
All `YYYY-MM-DD` strings are parsed as local dates using `new Date(year, month - 1, day)` — **not** `new Date("2025-01-29")` which creates UTC midnight and shows the wrong day in US timezones. This applies to both `formatDate()` and `getDueDateWarning()`.

### Column Fallback for Ideas
The `addIdea` and `updateIdea` functions handle the case where the extended columns (`assignee`, `notes`, `platforms`, etc.) don't exist in the DB yet. They try the full insert first, and if it fails with a column error, retry with base fields only.

---

## Code Map (standalone.html)

| Lines | What |
|-------|------|
| 1–490 | `<style>` block — all CSS |
| 491–503 | Supabase client initialization |
| 504–650 | SVG icons, UI primitives (Button, Badge, Modal, Toast) |
| 652–740 | `useReadStatus` hook — tracks which content each user has seen |
| 742–841 | `AuthProvider` + `useAuth` — magic link auth, session management |
| 844–875 | Stage definitions, platform definitions, default tags |
| 940–1005 | `useActivityLog` hook — audit trail |
| 1008–1570 | `useContentStore` hook — **the core data layer** |
| 1575–1630 | Date utilities (`formatDate`, `getDueDateWarning`) |
| 1633–1800 | `getDisplayName`, content card components |
| 1802–1965 | `AdminPortal` component |
| 1968–2058 | `ArchiveView` component |
| 2060–2163 | `HelpGuide` component |
| 2164–2425 | `ActivityLog`, `LoginPage` components |
| 2426–2676 | `ContentForm` — Pipeline card edit modal |
| 2677–2830 | `IdeaForm` — Ideas card edit modal |
| 2831–2920 | `PipelineColumn` — draggable kanban column |
| 2920–3090 | `IdeaCard`, `IdeasBank` components |
| 3090–3230 | `Sidebar`, `Header` components |
| 3230–3380 | `CalendarView` component |
| 3380–3600 | `MainApp` — top-level app component, state management, routing |
| 3600–3669 | App mounting, root render |

### Key Functions in `useContentStore` (line 1008)

| Function | Line | Purpose |
|----------|------|---------|
| `addContent` | ~1160 | Create new pipeline content |
| `updateContent` | ~1210 | Edit pipeline content |
| `deleteContent` | ~1240 | Soft-delete to trash |
| `moveContent` | ~1280 | Change stage |
| `reorderContent` | ~1310 | Drag reorder within column |
| `restoreContent` | ~1340 | Restore from trash |
| `permanentlyDeleteContent` | ~1360 | Hard delete |
| `emptyTrash` | ~1370 | Clear all trash |
| `purgeOldDeletedContent` | ~1375 | Auto-purge >30 days |
| `addIdea` | ~1385 | Create idea (with column fallback) |
| `updateIdea` | ~1430 | Edit idea (with column fallback) |
| `deleteIdea` | ~1455 | Delete idea |
| `promoteIdea` | ~1460 | Idea → Pipeline (first stage) |
| `unpromoteContent` | ~1480 | Pipeline → Ideas (reverse) |
| `addCustomTag` | ~1525 | Create custom tag |
| `exportData` | ~1500 | JSON export |
| `importData` | ~1510 | JSON import |

---

## Authentication

- **Method:** Supabase Magic Link (email OTP, 6-digit code)
- **Session duration:** 7 days (tracked via `pl-login-timestamp` in localStorage)
- **Admin email:** `clay@thepeoplesleague.golf` (line 742)
- **Auto-registration:** New users are auto-added to `team_members` on first login
- **Profile pics:** Stored in Supabase Storage `profile-pics` bucket, uploaded via Admin Portal

---

## Email Notifications

Supabase Edge Function at `supabase/functions/send-notification/index.ts`. Uses **Resend** API.

- **From:** `notifications@peoplesleaguegolf.com`
- **Triggers:** Assignment notifications, deadline reminders
- **API key:** Set as `RESEND_API_KEY` env var in Supabase Edge Function config

The ContentForm has a "Send email notifications" checkbox (default on). When content is assigned to someone with notifications enabled, the Edge Function is called.

---

## Deployment

```bash
# 1. Copy the app file
cp standalone.html deploy/index.html

# 2. Deploy to Vercel
cd deploy && vercel --prod --yes
```

**Vercel project:** `peoples-league-calendar` under `clays-projects-42b0a4f2`
**Production URL:** https://peoples-league-calendar.vercel.app

The `.vercel` folder in `/deploy` links to the correct project. If it gets delinked, re-link with:
```bash
cd deploy && vercel link --yes --project peoples-league-calendar
```

---

## Tags System

Tags are a combination of hardcoded defaults and user-created custom tags.

**Default tags** (line 875):
- Tour events: `Tour Event 1 - Whirlwind`, `Tour Event 2 - Tahoe`, `Tour Event 3 - French Lick`, `Tour Event 4 - Lake of Isles`, `Peoples League Championship 2025`
- Teams: `Team Luke`, `Team Canada`, `Team Birdie Fever`, `Team Top Dawgs`, `Team King & Queens`, `Team Twisted`, `Team Cruz`, `Team PB&J`, `Team Stix`
- Sponsors: `DraftKings`, `The Grint`
- Other: `ETC`

**Custom tags** are stored in the `custom_tags` Supabase table. Users can create them inline via the "+ Add Tag" button in any form. Custom tags merge with defaults and are sorted alphabetically.

---

## Known Quirks & Gotchas

1. **`social` vs `Static`**: The internal type value is `'social'` everywhere in code and database. The UI displays "Static." Don't change the internal value — it would require a data migration.

2. **Column fallback in Ideas**: `addIdea` and `updateIdea` have try/retry logic for when the extended columns (`assignee`, `notes`, `platforms`, `updated_by`, `updated_at`) don't exist. Once the SQL migration above is run, this fallback is unnecessary but harmless.

3. **No build step**: The app uses Babel in-browser. This means JSX errors won't show until runtime. Check the browser console for transpilation errors.

4. **Realtime requires Supabase config**: Tables need realtime enabled in Supabase Dashboard (Database → Replication → enable for `content`, `ideas`, `deleted_content`, `activity_log`).

5. **Profile pics**: Stored with sanitized filenames (`@` → `_at_`, `.` → `_`). The `profile-pics` bucket needs public read access or appropriate RLS policies.

6. **Date display**: All date strings (`YYYY-MM-DD`) must be parsed as local dates, not passed to `new Date()` directly. This was a recurring bug — fixed in `formatDate()` and `getDueDateWarning()`.

7. **The `/src` directory is dead code**: The original Vite component-based version was abandoned. Everything runs from `standalone.html`. Ignore `/src` entirely.

---

## What Was Most Recently Built

The last batch of work (in rough chronological order):

1. Social/Static posts feature — full pipeline with platform selection
2. Duplicate card fix — realtime deduplication on INSERT
3. Renamed "Social" → "Static" in UI (internal type stays `social`)
4. Removed "All Content" pipeline tab — Calendar serves as unified view
5. Added "Planning" stage to Short-form pipeline
6. Custom tags with Supabase persistence and inline "+ Add Tag" UI
7. Drag-and-drop reordering within pipeline columns (position-based)
8. Date display fix (UTC → local parsing)
9. Ideas Bank full editing — click-to-edit modal, assignee, notes, platforms, creator display
10. Ideas realtime UPDATE handler
11. Date warning fix (same UTC bug in `getDueDateWarning`)
12. Add Idea resilience (column fallback for missing DB columns)
