# Project Handoff — PL Content Cal

## What This Is
Content production pipeline for Peoples League video team. Kanban-style board to track content from idea → shoot → edit → publish, plus calendar views for scheduling. Built for a small team managing YouTube long-form, Shorts, TikToks, and Reels.

## Current State
- Working: Pipeline board, calendar views (month/week), ideas bank, content CRUD, import/export (JSON), branded UI
- Half-built: Email notifications (Supabase edge function exists, not wired to UI)
- Missing: Authentication, multi-user support, drag-and-drop between columns, recurring templates

## Tech Stack
- Framework: React 18 + Vite
- Styling: CSS custom properties (no Tailwind)
- Storage: localStorage (browser-only, no backend)
- Notifications: Supabase Edge Functions + Resend (email API)
- Deployment: Vercel

## Architecture

```
src/
├── App.jsx                    # Root component, view routing, global state
├── hooks/
│   ├── useContentStore.js     # All business logic (CRUD, filters, import/export)
│   └── useLocalStorage.js     # Persistence wrapper
├── data/
│   └── initialData.js         # Stage definitions, tags, seed data
├── components/
│   ├── Pipeline/
│   │   ├── PipelineBoard.jsx
│   │   └── PipelineColumn.jsx
│   ├── Calendar/
│   │   ├── MonthView.jsx
│   │   └── WeekView.jsx
│   ├── Ideas/
│   │   └── IdeasBank.jsx
│   ├── Content/
│   │   ├── ContentCard.jsx
│   │   ├── ContentForm.jsx
│   │   └── ContentModal.jsx
│   └── Layout/
│       ├── Header.jsx
│       └── Sidebar.jsx

supabase/
└── functions/
    └── send-notification/index.ts
```

State lives in `useContentStore.js`. Components are presentational. localStorage syncs automatically via the hook.

Content data model:
```json
{
  id: string,
  title: string,
  description: string,
  type: 'long-form' | 'short-form',
  stage: string,
  shootDate: 'YYYY-MM-DD',
  releaseDate: 'YYYY-MM-DD',
  assignee: string,
  tags: string[],
  notes: string,
  createdAt: ISO,
  updatedAt: ISO
}
```

Stages:
- Long-form: idea → scheduled-shoot → production → editing → review → scheduled-release → published
- Short-form: idea → shoot → edit → scheduled → published

## Vision / End State
A lightweight tool where the PL content team can:
- Plan and track all video content in one place
- See shoot days and release dates on a calendar
- Get email reminders for assignments and deadlines
- Collaborate with clear ownership (assignees)
- Eventually: templates for recurring series, analytics integration

## Immediate Priorities
1. Wire up email notifications — edge function exists at `supabase/functions/send-notification/`, needs triggers in UI when content is assigned or deadline approaches
2. Add authentication (Supabase magic link)
3. Move data to Supabase (replace localStorage) for multi-device sync
4. Add drag-and-drop between pipeline columns
5. Recurring content templates

## Known Issues / Tech Debt
- Data is localStorage only — no sync between devices/browsers
- `team` array is just strings — no user IDs or auth linkage yet
- No drag-and-drop — columns use button clicks to move cards
- Notification function not deployed — needs `supabase functions deploy send-notification`

## Environment Variables / Secrets
For the notification function (Supabase):
```
RESEND_API_KEY=
```

For Supabase client (if/when auth is added):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Deployment
Vercel. Auto-deploys from GitHub on push to main.
Live at: https://peoples-league-calendar.vercel.app

Supabase edge functions deploy separately via CLI:
```
supabase functions deploy send-notification
```
