# AwardFlightAlert (MVP)

Nuxt 4 + Vue 3 + TypeScript app for tracking (mock) business class award availability and sending email alerts.

## Tech

- **Frontend**: Nuxt 4, Vue 3, Tailwind CSS v4
- **Auth + DB**: Supabase Auth (magic links) + Postgres
- **ORM**: Prisma
- **Email**: Resend (API for alert emails; SMTP for Supabase Auth emails)
- **Tests**: Vitest (unit), Playwright (E2E)

## Setup

Install deps:

```bash
pnpm install
```

Create `.env` in project root:

```bash
# Database (Supabase Postgres)
DATABASE_URL=postgresql://...

# Supabase (Nuxt module expects these)
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_KEY=<anon/publishable key>
NUXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=<anon/publishable key>

# Resend (alerts)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@your-domain.com

# Optional
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Feature flags
USE_MOCK_PROVIDER=true
EMAILS_ENABLED=true
PUBLIC_BROWSE_ENABLED=true
BILLING_ENABLED=false
```

Prisma:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

## Run locally

```bash
pnpm dev
```

App runs on `http://localhost:3000`.

## Core flows (MVP)

### Auth

- Sign in via `/auth/login` (magic link).
- Callback at `/auth/confirm`.

Note: Supabase Auth email sending is configured in Supabase to use SMTP (e.g. Resend SMTP) to avoid low default email limits.

### Alerts

- Dashboard: `/dashboard`
- CRUD via `/api/alerts` and `/api/alerts/:id`

Plan logic:
- **Free**: max 3 active alerts, 1-seat alerts
- **Pro**: max 25 active alerts, 2-seat alerts (billing still feature-flagged)

### Mock provider → matching → notifications

Dev-only endpoints (require login; unavailable in production):

- **Ingest mock observations**:
  - `POST /api/admin/ingest-mock`
- **Run matching**:
  - `POST /api/admin/run-matching`
- **Enqueue email notifications from matches** (useful if matches existed already):
  - `POST /api/admin/enqueue-match-notifications`
- **Send pending notifications**:
  - `POST /api/admin/send-pending-notifications`

### Browse recent availability

- Page: `/browse`
- API: `GET /api/browse/observations` with filters and pagination

If `PUBLIC_BROWSE_ENABLED=false`, the browse API requires authentication.

## Tests

Unit:

```bash
pnpm test --run
```

E2E:

```bash
pnpm test:e2e
```

## Feature flags

All feature flags are env vars read in `lib/config/featureFlags.ts`:

- `USE_MOCK_PROVIDER`
- `EMAILS_ENABLED`
- `PUBLIC_BROWSE_ENABLED`
- `BILLING_ENABLED`

## UI theme (light/dark) + design tokens

The UI is **light mode by default**. Dark mode is enabled by adding the `dark` class to the root element:

- Light: `<html>`
- Dark: `<html class="dark">`

The header theme toggle persists the preference in `localStorage` under:

- Key: `afn-theme`
- Values: `light` | `dark`

### Token map (`--afn-*`)

All UI colors are centralized in `app/assets/css/main.css` as CSS variables.
Components should use semantic classes like `afn-text-subtle`, `afn-btn-primary`, `afn-badge`, etc. (no hardcoded color utilities).

#### Surfaces + borders

- `--afn-bg`: app background
- `--afn-surface`: primary card surface
- `--afn-surface-2`: secondary/inset surface (panels, muted containers)
- `--afn-border`: default border
- `--afn-border-2`: “stronger” border (controls/buttons)
- `--afn-shadow`: card shadow
- `--afn-border-hover`: hover border color for interactive surfaces

#### Text

- `--afn-text`: default body text
- `--afn-text-strong`: headings / primary emphasis
- `--afn-text-muted`: muted inline text
- `--afn-text-subtle`: secondary text (descriptions, metadata)
- `--afn-text-faint`: tertiary text (helper text, footnotes)

#### Accent (brand)

- `--afn-accent`: primary accent (buttons, key highlights)
- `--afn-accent-hover`: primary accent hover
- `--afn-accent-soft`: accent ring / soft emphasis
- `--afn-accent-text`: accent text (small headings)
- `--afn-kicker`: kicker label color (page kickers)
- `--afn-link`: link color
- `--afn-link-hover`: link hover color
- `--afn-btn-primary-text`: text color on primary buttons

#### Status (success / warning / danger)

- `--afn-status-success`
- `--afn-status-warn`
- `--afn-status-danger`

Semantic backgrounds/borders (used by callouts/dots/buttons):

- `--afn-success`, `--afn-success-bg`
- `--afn-warn`, `--afn-warn-bg`
- `--afn-danger`, `--afn-danger-bg`

#### Controls (inputs/selects)

- `--afn-control-bg`: input/select background
- `--afn-control-bg-hover`: hover background for inputs/selects
- `--afn-placeholder`: placeholder color
- `--afn-focus-border`: focus border color
- `--afn-focus-ring`: focus ring color
- `--afn-btn-focus-ring`: button focus ring color

#### Chips / badges

- `--afn-chip-bg`: badge/chip background
- `--afn-chip-border`: badge/chip border
- `--afn-badge-strong-border`
- `--afn-badge-strong-bg`
- `--afn-badge-strong-text`

#### Selection / table polish / loading

- `--afn-selection-bg`, `--afn-selection-text`
- `--afn-row-hover`: row hover background (tables/lists)
- `--afn-loading-track`: loading bar track
- `--afn-loading-bar`: loading bar fill

