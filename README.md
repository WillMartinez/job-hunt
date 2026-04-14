# Job Hunt 🎯

Your personal job search command center. Built with Next.js 16, TypeScript, Tailwind v4, and AWS Cognito — mirroring the patterns from the MTG deck builder project.

## Features

- **Job Board Aggregator** — searches Remotive + The Muse in real-time via a Next.js API route
- **Application Tracker** — full pipeline tracking (saved → applied → phone screen → interview → offer)
- **LinkedIn Contacts** — import your connections CSV, view by company to find warm intros
- **Dashboard** — stats bar with response rate, pipeline counts, and recent activity

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Auth | AWS Cognito (amazon-cognito-identity-js) |
| State | React Context + localStorage |
| Testing | Jest + Testing Library |
| Icons | Lucide React |

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Fill in your Cognito User Pool ID + Client ID

# 3. Run dev server
npm run dev

# 4. Run tests
npm test
```

## Project structure

```
src/
├── app/
│   ├── (auth)/           # login, signup — no auth required
│   ├── (protected)/      # dashboard, jobs, applications, contacts
│   │   └── layout.tsx    # auth guard + Header + JobProvider
│   └── api/jobs/         # Next.js API route → job board aggregation
├── components/
│   ├── auth/             # LoginForm, SignUpForm
│   ├── jobs/             # JobCard, JobSearch
│   ├── applications/     # ApplicationCard
│   ├── contacts/         # ContactCard
│   ├── dashboard/        # StatsBar
│   └── layout/           # Header
├── lib/
│   ├── api/              # job-boards.ts — Remotive + The Muse
│   ├── auth/             # Cognito service + AuthContext
│   ├── applications/     # ApplicationService (localStorage)
│   ├── contacts/         # ContactService (localStorage + CSV import)
│   └── jobs/             # JobContext (search state)
└── types/
    ├── job.ts
    ├── application.ts
    └── contact.ts
```

## LinkedIn CSV import

Export your connections from LinkedIn:
1. Go to **LinkedIn Settings → Data privacy → Get a copy of your data**
2. Select **Connections** and request the export
3. Once emailed, go to **Contacts** in the app and click **Import LinkedIn CSV**

## Adding more job boards

Add a new fetch function to `src/lib/api/job-boards.ts` and include it in `searchAllBoards()`. Good free APIs to add:
- **Adzuna** — `api.adzuna.com` (free tier, needs API key)
- **JSearch (RapidAPI)** — aggregates LinkedIn, Indeed, Glassdoor
- **Greenhouse** — `api.greenhouse.io/v1/boards/{company}/jobs` (no auth, per-company)
