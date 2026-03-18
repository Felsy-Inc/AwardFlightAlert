<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

import type { AlertCreateInput } from '~lib/domain/alerts'
import { useAlerts } from '../../../composables/useAlerts'
import AlertForm from '../../../components/alerts/AlertForm.vue'

type SessionResponse = {
  user: { id: string; email: string | null } | null
  profile: { id: string; email: string | null } | null
  subscription: { plan: string | null } | null
}

const { data: session, status, error } = await useAsyncData<SessionResponse>(
  'session',
  () => $fetch('/api/auth/session'),
)

if (import.meta.client) {
  watchEffect(() => {
    const hasUser = !!session.value?.user
    const hasError = !!error.value

    if (!hasUser && (status.value === 'success' || hasError)) {
      navigateTo('/auth/login')
    }
  })
}

const isDev = import.meta.dev

const {
  alerts,
  planLimits,
  isLoading: alertsPending,
  error: alertsError,
  createAlert,
  deleteAlert,
} = useAlerts()

const showCreateForm = ref(false)
const createLoading = ref(false)
const apiError = ref<string | null>(null)

type DevToolsResult = { ok: true; data: unknown } | { ok: false; error: string }
const devToolsLoading = ref(false)
const devToolsResult = ref<DevToolsResult | null>(null)
const mockSeed = ref<number | null>(null)

const planLabel = computed(() => {
  const plan = session.value?.subscription?.plan ?? 'FREE'
  return plan === 'PRO' ? 'Pro' : 'Free'
})

const activeAlertsCount = computed(
  () => alerts.value.filter((a) => a.status === 'ACTIVE').length,
)

const maxActiveAlerts = computed(() => planLimits.value?.maxActiveAlerts ?? 0)
const canCreateMoreAlerts = computed(
  () => activeAlertsCount.value < maxActiveAlerts.value,
)
const remainingAlerts = computed(() =>
  Math.max(0, maxActiveAlerts.value - activeAlertsCount.value),
)

const handleCreate = async (payload: AlertCreateInput) => {
  apiError.value = null
  createLoading.value = true

  try {
    await createAlert(payload)
    showCreateForm.value = false
  } catch (e: any) {
    apiError.value = e?.data?.statusMessage ?? e?.message ?? String(e)
  } finally {
    createLoading.value = false
  }
}

const handleDelete = async (id: string) => {
  apiError.value = null

  try {
    await deleteAlert(id)
  } catch (e: any) {
    apiError.value = e?.data?.statusMessage ?? e?.message ?? String(e)
  }
}

type RecentMatchesResponse = {
  matches: Array<{
    id: string
    matchedAt: string
    alert: {
      id: string
      originAirport: string
      destinationRegion: string
      program: string
      seatsNeeded: number
    }
    observation: {
      id: string
      program: string
      airline: string
      flightNumber: string
      originAirport: string
      destinationAirport: string
      destinationRegion: string
      departureDatetime: string
      pointsCost: number
      taxesAmount: number
      currency: string
      seatsAvailable: number
    }
  }>
}

const {
  data: matchesData,
  pending: matchesPending,
  error: matchesError,
  refresh: refreshMatches,
} = await useAsyncData<RecentMatchesResponse>('recent-matches', () =>
  $fetch('/api/matches/recent?limit=10'),
)

const runDevTool = async (fn: () => Promise<unknown>) => {
  devToolsLoading.value = true
  devToolsResult.value = null
  try {
    const data = await fn()
    devToolsResult.value = { ok: true, data }
  } catch (e: any) {
    devToolsResult.value = {
      ok: false,
      error: e?.data?.statusMessage ?? e?.message ?? String(e),
    }
  } finally {
    devToolsLoading.value = false
  }
}

const runMockIngest = async () =>
  runDevTool(async () => {
    const body: Record<string, unknown> = {}
    if (mockSeed.value !== null) body.seed = mockSeed.value
    return await $fetch('/api/admin/ingest-mock', { method: 'POST', body })
  })

const runMatching = async () =>
  runDevTool(async () => {
    const res = await $fetch('/api/admin/run-matching', { method: 'POST' })
    await refreshMatches()
    return res
  })

const enqueueMatchNotifications = async () =>
  runDevTool(async () =>
    $fetch('/api/admin/enqueue-match-notifications', { method: 'POST' }),
  )

const sendPendingNotifications = async () =>
  runDevTool(async () =>
    $fetch('/api/admin/send-pending-notifications', { method: 'POST' }),
  )
</script>

<template>
  <section class="space-y-8">
    <header class="afn-page-header">
      <div>
        <p class="afn-kicker">
          Dashboard
        </p>
        <h1 class="afn-title">
          Your award alerts
        </h1>
        <p class="afn-subtitle">
          Manage the routes you care about and see recent business class matches.
        </p>
      </div>
      <div
        class="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
        style="border-color: var(--afn-border-2); background: var(--afn-surface-2); color: var(--afn-text-muted);"
      >
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold" style="background: var(--afn-accent); color: var(--afn-btn-primary-text);">
          {{ planLabel }}
        </span>
        <span v-if="session?.user?.email">
          {{ session.user.email }}
        </span>
      </div>
    </header>

    <div class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
      <div class="afn-card afn-card-primary">
        <div class="afn-card-inner space-y-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="afn-section-title">
                Alerts
              </h2>
              <p class="afn-section-desc">
                {{ activeAlertsCount }} active •
                <span v-if="remainingAlerts > 0">
                  {{ remainingAlerts }} remaining on {{ planLabel }}
                </span>
                <span v-else>
                  Limit reached on {{ planLabel }}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink
                v-if="!canCreateMoreAlerts"
                to="/pricing"
                class="afn-btn afn-btn-sm afn-btn-secondary"
              >
                View plans
              </NuxtLink>
              <button
                type="button"
                class="afn-btn afn-btn-sm afn-btn-primary"
                :disabled="!canCreateMoreAlerts"
                @click="showCreateForm = !showCreateForm"
              >
                {{ showCreateForm ? 'Close' : 'New alert' }}
              </button>
            </div>
          </div>

          <div class="afn-accent-rule" />

          <div
            v-if="apiError || alertsError"
            class="afn-callout afn-callout-danger"
          >
            {{ apiError ?? String(alertsError) }}
          </div>

          <div
            v-if="showCreateForm && planLimits"
            class="afn-panel"
          >
            <div class="afn-panel-inner text-sm afn-text-subtle">
              <p class="afn-label-title mb-3">
                New alert
              </p>
              <p class="mb-3 text-[13px] afn-text-subtle">
                Pick an origin, a destination region, and a date range. We’ll email you when availability matches.
              </p>
              <AlertForm
                :allow-two-seat-alerts="planLimits.allowTwoSeatAlerts"
                :loading="createLoading"
                @submit="handleCreate"
                @cancel="showCreateForm = false"
              />
            </div>
          </div>

          <div class="text-sm afn-text-subtle">
            <div class="flex items-center justify-between">
              <p class="font-medium afn-text-strong">
                Your alerts
              </p>
              <p class="text-[11px] afn-text-subtle">
                {{ activeAlertsCount }} / {{ maxActiveAlerts }} active
              </p>
            </div>

            <div v-if="alertsPending" class="mt-3 afn-panel">
              <div class="afn-panel-inner">
                <p class="afn-loading-title">Loading alerts</p>
                <div class="afn-loading-bar" />
              </div>
            </div>

            <div
              v-else-if="alerts.length === 0"
              class="mt-3 afn-panel"
            >
              <div class="afn-panel-inner">
                <p class="afn-empty-title">You don’t have any alerts yet</p>
                <p class="afn-empty-desc">
                  Start with one route and a date window. You can refine later.
                </p>
              </div>
            </div>

            <ul
              v-else
              class="mt-3 divide-y text-[13px]"
              style="border-color: var(--afn-border);"
            >
              <li
                v-for="alert in alerts"
                :key="alert.id"
                class="flex items-center justify-between py-2"
              >
                <div class="space-y-0.5">
                  <p class="font-medium afn-text-strong">
                    <span class="afn-mono">{{ alert.originAirport }}</span> → {{ alert.destinationRegion }}
                  </p>
                  <p class="text-[11px] afn-text-subtle">
                    <span class="afn-badge">{{ alert.program }}</span>
                    <span class="afn-badge">{{ alert.cabin }}</span>
                    <span class="afn-badge">{{ alert.seatsNeeded }} seat<span v-if="alert.seatsNeeded > 1">s</span></span>
                  </p>
                  <p class="text-[11px] afn-text-faint">
                    {{ new Date(alert.startDate).toLocaleDateString() }} –
                    {{ new Date(alert.endDate).toLocaleDateString() }}
                  </p>
                </div>
                <button
                  type="button"
                  class="afn-btn afn-btn-sm afn-btn-danger"
                  @click="handleDelete(alert.id)"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <aside class="space-y-4">
        <div class="afn-card afn-card-muted">
          <div class="afn-card-inner">
          <h2 class="afn-section-title">
            Recent matches
          </h2>
          <div v-if="matchesError" class="mt-2 text-xs afn-status-danger">
            {{ String(matchesError) }}
          </div>
          <div v-else-if="matchesPending" class="mt-3 afn-panel">
            <div class="afn-panel-inner">
              <p class="afn-loading-title">Loading matches</p>
              <div class="afn-loading-bar" />
            </div>
          </div>
          <div
            v-else-if="!matchesData || matchesData.matches.length === 0"
            class="mt-3 afn-panel"
          >
            <div class="afn-panel-inner">
              <p class="afn-empty-title">No matches yet</p>
              <p class="afn-empty-desc">
                When availability is observed that matches your alerts, it will show up here.
                <span v-if="isDev">In dev, run mock ingest + matching to generate sample results.</span>
              </p>
            </div>
          </div>
          <ul v-else class="mt-3 space-y-3 text-[13px]">
            <li
              v-for="m in matchesData.matches"
              :key="m.id"
              class="rounded-xl border p-3"
              style="border-color: var(--afn-border); background: var(--afn-surface-2);"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <p class="font-medium afn-text-strong">
                    <span class="afn-route">
                      <span class="afn-route-code">{{ m.observation.originAirport }}</span>
                      <span class="afn-route-arrow">→</span>
                      <span class="afn-route-code">{{ m.observation.destinationAirport }}</span>
                    </span>
                    <span class="ml-2 afn-text-faint">({{ m.observation.destinationRegion }})</span>
                  </p>
                  <p class="mt-1 text-[11px] afn-text-subtle">
                    {{ m.observation.airline }}{{ m.observation.flightNumber.replace(m.observation.airline, '') }}
                    • {{ new Date(m.observation.departureDatetime).toLocaleDateString() }}
                  </p>
                </div>
                <div class="text-right text-[11px]">
                  <div class="afn-metric justify-end">
                    <span class="afn-metric-key">Pts</span>
                    <span class="afn-metric-val">{{ m.observation.pointsCost.toLocaleString() }}</span>
                  </div>
                  <div class="afn-metric justify-end">
                    <span class="afn-metric-key">Tax</span>
                    <span class="afn-metric-sub">{{ m.observation.taxesAmount }} {{ m.observation.currency }}</span>
                  </div>
                </div>
              </div>
              <div class="mt-2 flex flex-wrap items-center gap-2 text-[11px] afn-text-subtle">
                <span class="afn-badge">{{ m.observation.program }}</span>
                <span class="afn-badge">{{ m.observation.seatsAvailable }} seats</span>
              </div>
            </li>
          </ul>

          <button
            type="button"
            class="afn-btn afn-btn-sm afn-btn-secondary w-full mt-3"
            @click="refreshMatches()"
          >
            Refresh
          </button>
          </div>
        </div>

        <div
          v-if="isDev"
          class="afn-card"
        >
          <div class="afn-card-inner">
            <div class="flex items-center justify-between gap-3">
              <h2 class="afn-section-title">
                Dev tools
              </h2>
            <p class="text-[11px] afn-text-faint">
                Local only
              </p>
            </div>

          <div class="mt-3 flex items-center gap-2">
              <label class="text-[11px] afn-text-subtle">
              Seed (optional)
            </label>
            <input
              v-model.number="mockSeed"
              type="number"
              inputmode="numeric"
              class="afn-control afn-control-compact w-32"
              placeholder="e.g. 42"
            >
          </div>

          <div class="mt-3 grid gap-2">
            <button
              type="button"
              class="afn-btn afn-btn-sm afn-btn-secondary w-full"
              :disabled="devToolsLoading"
              @click="runMockIngest()"
            >
              Run mock ingest
            </button>
            <button
              type="button"
              class="afn-btn afn-btn-sm afn-btn-secondary w-full"
              :disabled="devToolsLoading"
              @click="runMatching()"
            >
              Run matching
            </button>
            <button
              type="button"
              class="afn-btn afn-btn-sm afn-btn-secondary w-full"
              :disabled="devToolsLoading"
              @click="enqueueMatchNotifications()"
            >
              Enqueue match notifications
            </button>
            <button
              type="button"
              class="afn-btn afn-btn-sm afn-btn-secondary w-full"
              :disabled="devToolsLoading"
              @click="sendPendingNotifications()"
            >
              Send pending notifications
            </button>
          </div>

          <div
            v-if="devToolsResult"
            class="afn-callout mt-3"
            :class="devToolsResult.ok ? 'afn-callout-success' : 'afn-callout-danger'"
          >
            <p class="font-semibold">
              {{ devToolsResult.ok ? 'OK' : 'Error' }}
            </p>
            <pre class="mt-2 overflow-auto whitespace-pre-wrap leading-relaxed">{{
              devToolsResult.ok ? devToolsResult.data : devToolsResult.error
            }}</pre>
          </div>
          </div>
        </div>

        <div class="afn-card">
          <div class="afn-card-inner text-[13px] afn-text-subtle">
            <p class="font-semibold afn-text-strong">
              Status
            </p>
            <p class="mt-1">
              Session:
              <span class="font-medium" :class="status === 'success' ? 'afn-status-success' : 'afn-status-warn'">
                {{ status }}
              </span>
            </p>
            <p v-if="error" class="mt-1 text-xs afn-status-danger">
              {{ String(error) }}
            </p>
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>

