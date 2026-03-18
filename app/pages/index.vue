<template>
  <section class="space-y-12">
    <!-- Hero -->
    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
      <div class="space-y-6">
        <p class="afn-kicker">
          Award alerts for frequent flyers
        </p>
        <h1 class="text-balance text-4xl font-semibold tracking-tight afn-text-strong sm:text-5xl lg:text-6xl">
          Business class award alerts from Europe.
        </h1>
        <p class="max-w-xl text-sm leading-relaxed afn-text-subtle">
          Get alerted when Flying Blue, Miles &amp; More, or Avios seats appear on the routes you care about.
          Built for frequent flyers who value time and comfort over endless award searches.
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            to="/auth/login"
            class="afn-btn afn-btn-primary"
          >
            Get started with alerts
          </NuxtLink>
          <NuxtLink
            to="/pricing"
            class="afn-btn afn-btn-secondary"
          >
            View plans
          </NuxtLink>
        </div>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-[12px] afn-text-faint">
          <p>Set up an alert in under a minute.</p>
          <p>Email notifications when matches appear.</p>
          <p class="afn-text-faint">Mock data in MVP.</p>
        </div>
      </div>

      <div class="afn-card">
        <div class="afn-card-inner space-y-4">
        <h2 class="afn-label-title">
          How it works
        </h2>
        <ol class="space-y-3 text-sm afn-text-subtle">
          <li class="flex gap-3">
            <span class="mt-[2px] afn-step">
              1
            </span>
            <span>
              Create alerts for specific origin airports, destination regions, dates, programs, and seats.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-[2px] afn-step">
              2
            </span>
            <span>
              We ingest recent business class availability into a normalized model.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-[2px] afn-step">
              3
            </span>
            <span>
              When a new observation matches your alert, you receive a deduped email with booking details.
            </span>
          </li>
        </ol>
        <p class="text-[12px] afn-text-faint">
          Note: this MVP uses mock observations while live sources are being integrated.
        </p>
        </div>
      </div>
    </div>

    <!-- Supported programs / origins / regions -->
    <div class="grid gap-6 border-y py-8 text-sm afn-text-subtle sm:grid-cols-3 afn-rule">
      <div class="space-y-2">
        <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
          Supported programs
        </p>
        <ul class="space-y-1 text-sm">
          <li>Flying Blue</li>
          <li>Miles &amp; More</li>
          <li>Avios (BA / Iberia ecosystem)</li>
        </ul>
      </div>
      <div class="space-y-2">
        <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
          Departure airports (v1)
        </p>
        <p>AMS, BRU, CDG, FRA, LHR, LGW</p>
      </div>
      <div class="space-y-2">
        <p class="text-[11px] font-medium uppercase tracking-[0.18em] afn-text-faint">
          Destination regions
        </p>
        <ul class="space-y-1 text-sm">
          <li>Japan (HND, NRT)</li>
          <li>US East Coast (JFK, EWR, BOS, IAD, MIA)</li>
          <li>US West Coast (LAX, SFO)</li>
          <li>Europe (MAD, BCN, FCO, LIS, ATH, VIE)</li>
        </ul>
      </div>
    </div>

    <!-- Feature summary & pricing teaser -->
    <div class="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div class="space-y-4">
        <h2 class="text-sm font-semibold afn-text-strong">
          Built for frequent flyers, not casual searchers.
        </h2>
        <ul class="grid gap-3 text-sm afn-text-subtle sm:grid-cols-2">
          <li class="afn-card">
            <div class="afn-card-inner">
            <p class="text-xs font-semibold afn-accent-text">Business class first</p>
            <p class="mt-1 text-[13px] afn-text-subtle">
              Focused on premium cabins only, with an internal model that is ready for more cabins later.
            </p>
            </div>
          </li>
          <li class="afn-card">
            <div class="afn-card-inner">
            <p class="text-xs font-semibold afn-accent-text">Mock data, real flows</p>
            <p class="mt-1 text-[13px] afn-text-subtle">
              End-to-end alert flows with a mock award provider so you can validate the product before going live.
            </p>
            </div>
          </li>
          <li class="afn-card">
            <div class="afn-card-inner">
            <p class="text-xs font-semibold afn-accent-text">Free &amp; Pro plans</p>
            <p class="mt-1 text-[13px] afn-text-subtle">
              Free users can run a small number of alerts; Pro unlocks more alerts and two-seat availability.
            </p>
            </div>
          </li>
          <li class="afn-card">
            <div class="afn-card-inner">
            <p class="text-xs font-semibold afn-accent-text">i18n‑ready</p>
            <p class="mt-1 text-[13px] afn-text-subtle">
              English-first, but the architecture is prepared for German, French, and Dutch.
            </p>
            </div>
          </li>
        </ul>
      </div>

      <div class="afn-card">
        <div class="afn-card-inner space-y-4">
        <h2 class="text-sm font-semibold afn-text-strong">
          Simple pricing for v1
        </h2>
        <div class="space-y-3 text-sm">
          <div class="flex items-baseline justify-between">
            <div>
              <p class="text-xs font-semibold afn-text">Free</p>
              <p class="text-[12px] afn-text-faint">Up to 3 active alerts</p>
            </div>
            <p class="text-xs afn-text-subtle">Live in MVP</p>
          </div>
          <div class="flex items-baseline justify-between border-t pt-3 afn-rule">
            <div>
              <p class="text-xs font-semibold afn-text">Pro</p>
              <p class="text-[12px] afn-text-faint">Up to 25 alerts, 2-seat alerts</p>
            </div>
            <p class="text-xs afn-text-faint">
              Billing feature‑flagged until real data sources are integrated.
            </p>
          </div>
          <NuxtLink
            to="/pricing"
            class="afn-btn afn-btn-secondary w-full"
          >
            See full pricing
          </NuxtLink>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>

