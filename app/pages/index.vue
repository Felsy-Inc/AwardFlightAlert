<script setup lang="ts">
const heroAlerts = [
  {
    id: 'a1',
    origin: 'AMS',
    destRegion: 'Japan',
    destCode: 'HND',
    program: 'Flying Blue',
    cabin: 'Business',
    seats: '2 seats',
    points: '90,000 pts',
    taxes: '€165',
    departure: 'Departs Mar 18',
  },
  {
    id: 'a2',
    origin: 'LHR',
    destRegion: 'US East Coast',
    destCode: 'JFK',
    program: 'Miles & More',
    cabin: 'Business',
    seats: '1 seat',
    points: '82,000 pts',
    taxes: '€142',
    departure: 'Departs Mar 18',
  },
  {
    id: 'a3',
    origin: 'CDG',
    destRegion: 'US West Coast',
    destCode: 'SFO',
    program: 'Flying Blue',
    cabin: 'Business',
    seats: '1–2 seats',
    points: '98,000 pts',
    taxes: '€176',
    departure: 'Departs Mar 17',
  },
] as const

const recentAvailability = [
  {
    id: 'r1',
    origin: 'CDG',
    dest: 'NRT',
    regionLabel: 'Japan',
    program: 'Avios',
    cabin: 'Business',
    points: '105,000 pts',
    taxes: '€189',
    observed: 'Observed 45m ago',
    airlineFlight: 'AF • 34',
  },
  {
    id: 'r2',
    origin: 'FRA',
    dest: 'EWR',
    regionLabel: 'US East Coast',
    program: 'Flying Blue',
    cabin: 'Business',
    points: '95,000 pts',
    taxes: '€175',
    observed: 'Observed today',
    airlineFlight: 'LH • 407',
  },
  {
    id: 'r3',
    origin: 'LGW',
    dest: 'SFO',
    regionLabel: 'US West Coast',
    program: 'Miles & More',
    cabin: 'Business',
    points: '120,000 pts',
    taxes: '€210',
    observed: 'Observed 5h ago',
    airlineFlight: 'BA • 178',
  },
] as const

const coverageDeparture = ['AMS', 'BRU', 'CDG', 'FRA', 'LHR', 'LGW'] as const
const coveragePrograms = ['Flying Blue', 'Miles & More', 'Avios (BA / Iberia ecosystem)'] as const
const coverageRegionGroups = ['Japan', 'Europe', 'US East Coast', 'US West Coast'] as const

const routeExamples = [
  {
    origin: 'AMS',
    destCode: 'HND',
    destinationGroup: 'Japan',
    program: 'Flying Blue',
    cabin: 'Business',
  },
  {
    origin: 'BRU',
    destCode: 'JFK',
    destinationGroup: 'US East Coast',
    program: 'Miles & More',
    cabin: 'Business',
  },
  {
    origin: 'FRA',
    destCode: 'SFO',
    destinationGroup: 'US West Coast',
    program: 'Flying Blue',
    cabin: 'Business',
  },
  {
    origin: 'LHR',
    destCode: 'MAD',
    destinationGroup: 'Europe',
    program: 'Avios',
    cabin: 'Business',
  },
] as const

const coverageRegions = [
  'Japan (HND, NRT)',
  'US East Coast (JFK, EWR, BOS, IAD, MIA)',
  'US West Coast (LAX, SFO)',
  'Europe (MAD, BCN, FCO, LIS, ATH, VIE)',
] as const
</script>

<template>
  <section class="relative space-y-16">
    <!-- Background -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -top-28 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full blur-3xl opacity-60"
      style="background: radial-gradient(circle at center, color-mix(in srgb, var(--afn-accent) 18%, transparent), transparent 62%);"
    />

    <!-- Hero -->
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.1fr)] lg:items-center">
      <div class="space-y-7 pt-2">
        <div class="flex flex-wrap items-center gap-3">
          <p class="afn-kicker">
            Award alerts for frequent flyers
          </p>
          <span class="afn-badge hidden sm:inline-flex">
            Example routes
          </span>
        </div>

        <h1 class="text-balance text-4xl font-semibold tracking-tight afn-text-strong sm:text-5xl lg:text-6xl">
          Business-class award alerts, delivered with precision.
        </h1>

        <p class="max-w-xl text-sm leading-relaxed afn-text-subtle">
          Get alerted when Flying Blue, Miles &amp; More, or Avios seats appear on the routes you care about.
          Set an alert once; we monitor business-class availability and notify you when matches appear.
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/auth/login"
            class="afn-btn afn-btn-primary"
          >
            Get started with alerts
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12" />
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/browse"
            class="afn-btn afn-btn-secondary"
          >
            Browse recent availability
          </NuxtLink>
        </div>

        <div class="flex flex-wrap gap-x-5 gap-y-2 text-[12px] afn-text-faint">
          <p class="flex items-center gap-2">
            <span class="inline-flex h-1.5 w-1.5 rounded-full" style="background: var(--afn-accent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--afn-accent) 25%, transparent);" />
            Set up an alert in under a minute
          </p>
          <p class="flex items-center gap-2">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-2.8A9 9 0 0 0 3 14.2L1 17h5" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2z" />
            </svg>
            Email notifications when matches appear
          </p>
        </div>
      </div>

      <!-- Hero preview (product-derived) -->
      <div class="relative">
        <div class="afn-card afn-card-primary">
          <div class="afn-card-inner relative p-4 sm:p-5">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <p class="afn-label-title !mb-0 text-[11px]">
                  Alert preview
                </p>
                <p class="mt-1 text-[12px] afn-text-subtle">
                  Route + program match preview.
                </p>
              </div>
              <span class="afn-badge">
                Business class
              </span>
            </div>

            <div class="mt-4 grid gap-4 lg:grid-cols-1">
              <!-- Left: stacked alert cards -->
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-3">
                  <p class="afn-section-title !m-0">
                    Alert matches
                  </p>
                </div>
                <div
                  v-for="(a, idx) in heroAlerts"
                  :key="a.id"
                  class="relative rounded-xl border p-2 pl-4"
                  style="border-color: var(--afn-border); background: var(--afn-surface-2);"
                >
                  <div
                    aria-hidden="true"
                    class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                    :style="{
                      background:
                        idx % 2 === 0
                          ? 'linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 65%, transparent), transparent 75%)'
                          : 'linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 40%, transparent), transparent 70%)',
                    }"
                  />
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate text-[12px] font-semibold afn-text-strong">
                        <span class="afn-route">
                          <span class="afn-route-code">{{ a.origin }}</span>
                          <span class="afn-route-arrow">→</span>
                          <span class="afn-route-code">{{ a.destCode }}</span>
                        </span>
                      </p>
                      <p class="mt-1 text-[11px] afn-text-faint">
                        {{ a.departure }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-2 flex flex-wrap items-center gap-2">
                    <span class="afn-badge">
                      {{ a.destinationGroup ?? a.destRegion }}
                    </span>
                    <span class="afn-badge">
                      {{ a.program }}
                    </span>
                    <span class="afn-badge">
                      {{ a.cabin }} class
                    </span>
                    <span class="afn-badge">
                      {{ a.seats }}
                    </span>
                  </div>
                </div>

                <!-- intentionally no dev-only note here -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How it works -->
    <div class="space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="space-y-2">
          <p class="afn-kicker">
            How it works
          </p>
          <h2 class="text-balance text-2xl font-semibold tracking-tight afn-text-strong sm:text-3xl">
            A simple loop for premium award monitoring.
          </h2>
        </div>
        <p class="max-w-xl text-sm leading-relaxed afn-text-subtle">
          Create an alert once, and we notify you when business-class seats appear.
        </p>
      </div>

      <div class="grid gap-4 lg:gap-6 lg:grid-cols-3">
        <div class="afn-card relative h-full">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
            style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 55%, transparent), transparent 75%);"
          />
          <div class="afn-card-inner">
            <div class="flex items-start gap-3">
              <span class="afn-step">
                1
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold afn-text-strong">
                  Create your alert
                </p>
                <p class="mt-1 text-[13px] afn-text-subtle">
                  Choose origin, destination regions, dates, programs, and seats.
                </p>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap items-center gap-2">
              <span class="afn-route-code">AMS → Japan</span>
              <span class="afn-badge">Flying Blue</span>
              <span class="afn-badge">Business</span>
              <span class="afn-badge">1–2 seats</span>
            </div>
          </div>
        </div>

        <div class="afn-card afn-card-accent relative h-full">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
            style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 70%, transparent), transparent 70%);"
          />
          <div class="afn-card-inner">
            <div class="flex items-start gap-3">
              <span class="afn-step">
                2
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold afn-text-strong">
                  Monitor award space
                </p>
                <p class="mt-1 text-[13px] afn-text-subtle">
                  We keep a consistent match model for recent availability.
                </p>
              </div>
            </div>

            <div class="mt-4 rounded-xl border p-3" style="border-color: var(--afn-border); background: var(--afn-surface-2);">
              <div class="flex items-center justify-between gap-3">
                <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
                  Model status
                </p>
                <span class="afn-badge">
                  Match model ready
                </span>
              </div>
              <div class="mt-3 flex items-center gap-2 text-[12px] afn-text-subtle">
                <span class="afn-dot" />
                <span class="afn-dot" style="background: color-mix(in srgb, var(--afn-accent) 55%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--afn-accent) 35%, transparent);" />
                <span class="afn-dot" style="background: color-mix(in srgb, var(--afn-accent) 35%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--afn-accent) 25%, transparent);" />
                <span class="afn-mono">scanning</span>
              </div>
              <div class="mt-3 h-2 w-full overflow-hidden rounded-full" style="background: color-mix(in srgb, var(--afn-border) 65%, transparent);">
                <div class="h-full w-2/3 rounded-full" style="background: color-mix(in srgb, var(--afn-accent) 55%, transparent);" />
              </div>
            </div>
          </div>
        </div>

        <div class="afn-card relative">
          <div
            aria-hidden="true"
            class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
            style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 45%, transparent), transparent 75%);"
          />
          <div class="afn-card-inner">
            <div class="flex items-start gap-3">
              <span class="afn-step">
                3
              </span>
              <div class="min-w-0">
                <p class="text-sm font-semibold afn-text-strong">
                  Receive match alerts
                </p>
                <p class="mt-1 text-[13px] afn-text-subtle">
                  Get an email when matches appear (points + taxes included).
                </p>
              </div>
            </div>

            <div class="mt-4 flex items-start gap-3 rounded-xl border p-3" style="border-color: var(--afn-border); background: var(--afn-surface-2);">
              <svg viewBox="0 0 24 24" class="mt-0.5 h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" style="color: var(--afn-accent);">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16v16H4z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4l8 7 8-7" />
              </svg>
              <div class="min-w-0">
                <p class="text-[12px] font-semibold afn-text-strong">
                  Alert match
                </p>
                <p class="mt-1 text-[12px] afn-text-subtle">
                  Route, program, cabin, plus cost breakdown.
                </p>
                <p class="mt-2 text-[11px] afn-text-faint">
                  Low-noise notifications for better decision making.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Coverage (more visual / premium) -->
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="afn-card relative">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
          style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 55%, transparent), transparent 75%);"
        />
        <div class="afn-card-inner space-y-5">
          <div class="space-y-1">
            <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
              Coverage
            </p>
            <h3 class="text-base font-semibold afn-text-strong">
              Programs and routes we monitor for premium seats
            </h3>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <div>
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
                Supported programs
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="p in coveragePrograms"
                  :key="p"
                  class="afn-badge"
                >
                  {{ p }}
                </span>
              </div>
            </div>

            <div>
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
                Departure airports
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="a in coverageDeparture"
                  :key="a"
                  class="afn-route-code"
                >
                  {{ a }}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
              Destination regions (v1)
            </p>
            <div class="mt-3 space-y-2">
              <div
                v-for="r in coverageRegions"
                :key="r"
                class="relative rounded-lg border px-3 py-2"
                style="border-color: var(--afn-border); background: var(--afn-surface-2);"
              >
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                  style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 45%, transparent), transparent 75%);"
                />
                <p class="text-[12px] afn-text-subtle">
                  {{ r }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="afn-card afn-card-muted relative">
        <div class="afn-card-inner">
          <div class="flex items-center justify-between gap-3">
            <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
              Route examples
            </p>
            <span class="afn-badge">
              Business class
            </span>
          </div>

          <div class="mt-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
                Example corridors
              </p>
              <span class="afn-badge flex items-center gap-2">
                <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12l-18 9 6-12-6-6 18 9z" />
                </svg>
                Monitored
              </span>
            </div>

            <div class="space-y-2">
              <div
                v-for="(ex, idx) in routeExamples"
                :key="`${ex.origin}-${ex.destCode}`"
                class="relative rounded-xl border p-3"
                style="border-color: var(--afn-border); background: var(--afn-surface-2);"
              >
                <!-- left accent strip (subtle, premium) -->
                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                  :style="{
                    background:
                      idx % 2 === 0
                        ? 'linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 65%, transparent), transparent 75%)'
                        : 'linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 40%, transparent), transparent 70%)',
                  }"
                />

                <p class="truncate text-[13px] font-semibold afn-text-strong">
                  <span class="afn-route">
                    <span class="afn-route-code">{{ ex.origin }}</span>
                    <span class="afn-route-arrow">→</span>
                    <span class="afn-route-code">{{ ex.destCode }}</span>
                  </span>
                  <span class="ml-2 afn-badge">
                    {{ ex.destinationGroup }}
                  </span>
                </p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span class="afn-badge">{{ ex.program }}</span>
                  <span class="afn-badge">{{ ex.cabin }}</span>
                </div>
              </div>
            </div>

            <p class="text-[11px] afn-text-faint">
              A quick preview of premium routes we monitor for award seats.
            </p>
          </div>

          <div class="mt-3 space-y-2">
            <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
              Destination groups
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <span
                v-for="g in coverageRegionGroups"
                :key="g"
                class="afn-badge"
              >
                {{ g }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Product pillars & pricing teaser -->
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.35fr)]">
      <div class="space-y-4">
        <h2 class="text-balance text-sm font-semibold afn-text-strong">
          Built for frequent flyers, not casual searchers.
        </h2>

        <ul class="grid gap-3 text-sm afn-text-subtle sm:grid-cols-2">
          <li class="afn-card relative">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
              style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 60%, transparent), transparent 75%);"
            />
            <div class="afn-card-inner">
              <div class="flex items-start gap-3">
                <div class="afn-accent-text">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7h18" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 7v10" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 7v10" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 17h14" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold afn-accent-text">Business class first</p>
                  <p class="mt-1 text-[13px] afn-text-subtle">
                    Premium cabins only, with a model designed for expansion later.
                  </p>
                </div>
              </div>
            </div>
          </li>

          <li class="afn-card relative">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
              style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 45%, transparent), transparent 70%);"
            />
            <div class="afn-card-inner">
              <div class="flex items-start gap-3">
                <div class="afn-accent-text">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v6" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 23v-6" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.2 4.2l4.2 4.2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.8 19.8l-4.2-4.2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 12h6" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M23 12h-6" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.2 19.8l4.2-4.2" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.8 4.2l-4.2 4.2" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold afn-accent-text">Consistent award matching</p>
                  <p class="mt-1 text-[13px] afn-text-subtle">
                    Program + cabin signals are normalized for reliable alerts.
                  </p>
                </div>
              </div>
            </div>
          </li>

          <li class="afn-card relative">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
              style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 55%, transparent), transparent 75%);"
            />
            <div class="afn-card-inner">
              <div class="flex items-start gap-3">
                <div class="afn-accent-text">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 1v22" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold afn-accent-text">Free &amp; Pro plans</p>
                  <p class="mt-1 text-[13px] afn-text-subtle">
                    Free covers 1-seat alerts; Pro adds 2-seat alerts and higher limits.
                  </p>
                </div>
              </div>
            </div>
          </li>

          <li class="afn-card relative">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
              style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 35%, transparent), transparent 70%);"
            />
            <div class="afn-card-inner">
              <div class="flex items-start gap-3">
                <div class="afn-accent-text">
                  <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 5h8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 19h8" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 6h4" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 18h4" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 12h4" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-semibold afn-accent-text">Award coverage built for frequent flyers</p>
                  <p class="mt-1 text-[13px] afn-text-subtle">
                    Curated programs and route regions for premium cabins.
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="afn-card relative">
        <div
          aria-hidden="true"
          class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
          style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 55%, transparent), transparent 75%);"
        />
        <div class="afn-card-inner space-y-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-sm font-semibold afn-text-strong">
                Simple pricing for frequent flyers
              </h2>
              <p class="mt-1 text-[12px] afn-text-faint">
                Pick the alert volume that fits your travel rhythm.
              </p>
            </div>
            <span class="afn-badge">
              Pro adds 2-seat alerts
            </span>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="relative rounded-xl border p-4" style="border-color: var(--afn-border); background: var(--afn-surface-2);">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 50%, transparent), transparent 75%);"
              />
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold afn-text">Free</p>
                  <p class="mt-2 text-2xl font-semibold afn-text-strong">
                    €0
                    <span class="text-sm font-medium afn-text-faint">/ month</span>
                  </p>
                </div>
                <span class="afn-badge">
                  1-seat
                </span>
              </div>

              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <p class="text-[11px] font-medium afn-text-faint">
                    Active alerts
                  </p>
                  <p class="text-[11px] afn-text-subtle">
                    Up to 3
                  </p>
                </div>
                <div class="mt-2 h-2 w-full overflow-hidden rounded-full" style="background: color-mix(in srgb, var(--afn-border) 70%, transparent);">
                  <div class="h-full rounded-full" style="width: 12%; background: var(--afn-accent);" />
                </div>
              </div>

              <p class="mt-3 text-[12px] afn-text-subtle">
                Great for solo business-class routes.
              </p>
            </div>

            <div class="relative rounded-xl border p-4 afn-card-accent" style="background: var(--afn-surface);">
              <div
                aria-hidden="true"
                class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 70%, transparent), transparent 70%);"
              />
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-semibold afn-accent-text">Pro</p>
                  <p class="mt-2 text-2xl font-semibold afn-text-strong">
                    €9
                    <span class="text-sm font-medium afn-text-faint">/ month</span>
                  </p>
                </div>
                <span class="afn-badge afn-badge-strong px-3 py-1">
                  Best for 2 seats
                </span>
              </div>

              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <p class="text-[11px] font-medium afn-text-faint">
                    Active alerts
                  </p>
                  <p class="text-[11px] afn-text-subtle">
                    Up to 25
                  </p>
                </div>
                <div class="mt-2 h-2 w-full overflow-hidden rounded-full" style="background: color-mix(in srgb, var(--afn-border) 70%, transparent);">
                  <div class="h-full rounded-full" style="width: 100%; background: var(--afn-accent);" />
                </div>
              </div>

              <p class="mt-3 text-[12px] afn-text-subtle">
                Perfect when you need flexibility for two.
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="/pricing"
              class="afn-btn afn-btn-secondary flex-1"
            >
              See full pricing
            </NuxtLink>
            <NuxtLink
              to="/dashboard"
              class="afn-btn afn-btn-primary flex-1"
            >
              Dashboard preview
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA -->
    <div class="afn-card afn-card-primary">
      <div class="afn-card-inner">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-center">
          <div class="space-y-3">
            <p class="afn-kicker">
              Built for serious frequent flyers
            </p>
            <h2 class="text-balance text-2xl font-semibold tracking-tight afn-text-strong sm:text-3xl">
              Stop searching. Start getting matches.
            </h2>
            <p class="max-w-2xl text-sm leading-relaxed afn-text-subtle">
              Create an alert for your routes and receive match alerts when business-class availability appears.
            </p>

            <div class="flex flex-wrap items-center gap-3">
              <NuxtLink
                to="/auth/login"
                class="afn-btn afn-btn-primary"
              >
                Get started with alerts
              </NuxtLink>
              <NuxtLink
                to="/browse"
                class="afn-btn afn-btn-secondary"
              >
                Browse recent availability
              </NuxtLink>
            </div>
          </div>

          <div class="relative space-y-3 rounded-2xl border p-4" style="border-color: var(--afn-border); background: var(--afn-surface-2);">
            <div
              aria-hidden="true"
              class="pointer-events-none absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
              style="background: linear-gradient(to bottom, color-mix(in srgb, var(--afn-accent) 55%, transparent), transparent 75%);"
            />
            <div class="flex items-center gap-2">
              <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true" style="color: var(--afn-accent);">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p class="text-sm font-semibold afn-text-strong">
                Trust & transparency
              </p>
            </div>

            <p class="text-sm afn-text-subtle">
              Example routes on the homepage. Real alerts run through the same matching workflow.
            </p>

            <p class="text-[12px] afn-text-faint">
              Not affiliated with any airline or loyalty program.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

