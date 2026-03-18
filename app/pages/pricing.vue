<script setup lang="ts">
const billingEnabled = computed(() => {
  return useRuntimeConfig().public?.billingEnabled === true
})
</script>

<template>
  <section class="space-y-10">
    <header class="space-y-2">
      <p class="afn-kicker">
        Pricing
      </p>
      <h1 class="afn-title">
        Simple plans for frequent flyers
      </h1>
      <p class="afn-subtitle">
        Start free. Upgrade when you need two-seat alerts and higher limits.
      </p>
    </header>

    <div
      class="afn-card"
    >
      <div class="afn-card-inner text-sm afn-text-subtle">
        <p class="font-medium afn-text-strong">
          Billing status
        </p>
        <p class="mt-1 text-[13px] afn-text-subtle">
          Checkout is
          <span
            class="font-medium"
            :class="billingEnabled ? 'afn-status-success' : 'afn-status-warn'"
          >
            {{ billingEnabled ? 'enabled' : 'disabled' }}
          </span>
          in this MVP.
        </p>
        <p class="mt-2 text-[12px] afn-text-faint">
          Pro is visible so you can understand the planned limits, but upgrades stay gated until live award sources are integrated.
          (Controlled by <code class="afn-inline-code">BILLING_ENABLED</code>.)
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="afn-card">
        <div class="afn-card-inner">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] afn-text-faint">
              Free
            </p>
            <p class="mt-2 text-2xl font-semibold afn-text-strong">
              €0
              <span class="text-sm font-medium afn-text-faint">/ month</span>
            </p>
          </div>
          <span class="afn-badge">
            Live in MVP
          </span>
        </div>

        <ul class="mt-5 space-y-2 text-sm afn-text-subtle">
          <li class="flex gap-2">
            <span class="afn-dot" />
            Up to 3 active alerts
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            1-seat alerts
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            Email notifications
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            Browse recent availability
          </li>
        </ul>

        <NuxtLink
          to="/auth/login"
          class="afn-btn afn-btn-secondary w-full mt-6"
        >
          Continue on Free
        </NuxtLink>
        </div>
      </div>

      <div class="afn-card afn-card-accent">
        <div class="afn-card-inner">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] afn-accent-text">
              Pro
            </p>
            <p class="mt-2 text-2xl font-semibold afn-text-strong">
              €9
              <span class="text-sm font-medium afn-text-faint">/ month</span>
            </p>
          </div>
          <span class="afn-badge afn-badge-strong px-3 py-1">
            Best for 2 seats
          </span>
        </div>

        <ul class="mt-5 space-y-2 text-sm afn-text-subtle">
          <li class="flex gap-2">
            <span class="afn-dot" />
            Up to 25 active alerts
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            2-seat alerts
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            Priority provider runs (later)
          </li>
          <li class="flex gap-2">
            <span class="afn-dot" />
            Billing feature-flagged until live data sources are integrated
          </li>
        </ul>

        <button
          type="button"
          class="afn-btn afn-btn-primary w-full mt-6"
          :disabled="!billingEnabled"
        >
          {{ billingEnabled ? 'Upgrade to Pro' : 'Pro upgrades (coming soon)' }}
        </button>

        <p class="mt-2 text-[11px] afn-text-faint">
          <span v-if="billingEnabled">
            Checkout is enabled in this environment.
          </span>
          <span v-else>
            Checkout is disabled in this MVP environment. Enable it with
            <code>BILLING_ENABLED=true</code> once Stripe is wired.
          </span>
        </p>
        </div>
      </div>
    </div>

    <div class="afn-card">
      <div class="afn-card-inner">
      <h2 class="afn-section-title">
        FAQ
      </h2>
      <div class="mt-3 grid gap-4 md:grid-cols-2">
        <div class="space-y-1">
          <p class="text-xs font-semibold afn-text">
            Is billing live?
          </p>
          <p class="text-[13px] afn-text-subtle">
            Not yet. Billing is scaffolded and feature-flagged until real award
            sources are integrated.
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-semibold afn-text">
            Can I cancel any time?
          </p>
          <p class="text-[13px] afn-text-subtle">
            Yes. Once Stripe is enabled, you will be able to manage your
            subscription in the customer portal.
          </p>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

