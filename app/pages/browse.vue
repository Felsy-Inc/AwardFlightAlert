<script setup lang="ts">
import { ref } from 'vue'
import { ORIGIN_AIRPORTS, DESTINATION_REGIONS } from '~lib/constants/airports'
import { PROGRAMS, PROGRAM_LABELS } from '~lib/constants/programs'
import { CABINS } from '~lib/constants/cabins'
import {
  useBrowseObservations,
  type BrowseObservationDto,
} from '../../composables/useBrowseObservations'

const {
  filters,
  observations,
  total,
  pageStart,
  pageEnd,
  hasPrev,
  hasNext,
  pending,
  error,
  refresh,
  goPrev,
  goNext,
} = useBrowseObservations()

type SessionResponse = {
  user: { id: string; email: string | null } | null
}

const { data: session } = await useAsyncData<SessionResponse>(
  'session-light',
  () => $fetch('/api/auth/session'),
)

const createStatusById = ref<Record<string, 'idle' | 'saving' | 'success' | 'error'>>({})
const createError = ref<string | null>(null)

const createAlertFromObservation = async (o: BrowseObservationDto) => {
  createStatusById.value[o.id] = 'saving'
  createError.value = null

  try {
    await $fetch('/api/alerts', {
      method: 'POST',
      body: {
        originAirport: o.originAirport,
        destinationRegion: o.destinationRegion,
        startDate: o.departureDate,
        endDate: o.departureDate,
        program: o.program,
        cabin: o.cabin,
        seatsNeeded: 1,
        maxPoints: null,
        maxTaxes: null,
      },
    })
    createStatusById.value[o.id] = 'success'
    setTimeout(() => {
      if (createStatusById.value[o.id] === 'success') {
        createStatusById.value[o.id] = 'idle'
      }
    }, 1500)
  } catch (e: any) {
    createStatusById.value[o.id] = 'error'
    createError.value = e?.data?.statusMessage ?? e?.message ?? String(e)
  }
}
</script>

<template>
  <section class="space-y-8">
    <header class="space-y-2">
      <p class="afn-kicker">
        Browse
      </p>
      <h1 class="afn-title">
        Recent availability
      </h1>
      <p class="afn-subtitle">
        Explore recent (mock) award observations in a normalized format.
      </p>
    </header>

    <div class="afn-card">
      <div class="afn-card-inner">
      <div class="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <label class="afn-label">
          <span class="afn-label-title">
            Origin
          </span>
          <select v-model="filters.originAirport" class="afn-control afn-control-compact">
            <option value="">
              Any
            </option>
            <option v-for="o in ORIGIN_AIRPORTS" :key="o" :value="o">
              {{ o }}
            </option>
          </select>
        </label>

        <label class="afn-label">
          <span class="afn-label-title">
            Region
          </span>
          <select v-model="filters.destinationRegion" class="afn-control afn-control-compact">
            <option value="">
              Any
            </option>
            <option v-for="r in DESTINATION_REGIONS" :key="r" :value="r">
              {{ r }}
            </option>
          </select>
        </label>

        <label class="afn-label">
          <span class="afn-label-title">
            Program
          </span>
          <select v-model="filters.program" class="afn-control afn-control-compact">
            <option value="">
              Any
            </option>
            <option v-for="p in PROGRAMS" :key="p" :value="p">
              {{ PROGRAM_LABELS[p] }}
            </option>
          </select>
        </label>

        <label class="afn-label">
          <span class="afn-label-title">
            Cabin
          </span>
          <select v-model="filters.cabin" class="afn-control afn-control-compact">
            <option value="">
              Any
            </option>
            <option v-for="c in CABINS" :key="c" :value="c">
              {{ c }}
            </option>
          </select>
        </label>

        <label class="afn-label">
          <span class="afn-label-title">
            Seats
          </span>
          <select v-model="filters.seatsMin" class="afn-control afn-control-compact">
            <option value="1">
              1+
            </option>
            <option value="2">
              2+
            </option>
          </select>
        </label>

        <div class="flex items-end justify-end sm:col-span-2 md:col-span-1">
          <button
            type="button"
            class="afn-btn afn-btn-sm afn-btn-secondary w-full"
            @click="refresh()"
          >
            Refresh
          </button>
        </div>
      </div>

      <div class="mt-3 grid gap-3 md:grid-cols-2">
        <label class="afn-label">
          <span class="afn-label-title">
            Date from
          </span>
          <input v-model="filters.dateFrom" type="date" class="afn-control afn-control-compact" />
        </label>
        <label class="afn-label">
          <span class="afn-label-title">
            Date to
          </span>
          <input v-model="filters.dateTo" type="date" class="afn-control afn-control-compact" />
        </label>
      </div>

      <p v-if="error" class="mt-3 text-xs afn-status-danger">
        {{ String(error) }}
      </p>
      </div>
    </div>

    <div class="afn-card">
      <div class="afn-card-inner">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="afn-section-title">
            Observations
          </p>
          <p class="afn-section-desc">
            Normalized award availability (mock data in MVP).
          </p>
        </div>
        <p class="text-[11px] afn-text-faint">
          <span v-if="total > 0">{{ pageStart }}–{{ pageEnd }} of {{ total }}</span>
          <span v-else>{{ observations.length }} shown</span>
        </p>
      </div>

      <p v-if="createError" class="mt-3 text-xs afn-status-danger">
        {{ createError }}
      </p>

      <div v-if="pending" class="mt-3 afn-panel">
        <div class="afn-panel-inner">
          <p class="afn-loading-title">Loading observations</p>
          <div class="afn-loading-bar" />
        </div>
      </div>
      <div v-else-if="observations.length === 0" class="mt-3 afn-panel">
        <div class="afn-panel-inner">
          <p class="afn-empty-title">No observations found</p>
          <p class="afn-empty-desc">
            Try widening the date range or clearing filters. In dev, run mock ingest to generate data.
          </p>
        </div>
      </div>

      <div v-else class="mt-3">
        <!-- Mobile cards -->
        <ul class="grid gap-3 md:hidden">
          <li
            v-for="o in observations"
            :key="o.id"
            class="afn-card"
          >
            <div class="afn-card-inner">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-[13px] font-semibold afn-text-strong">
                  <span class="afn-route">
                    <span class="afn-route-code">{{ o.originAirport }}</span>
                    <span class="afn-route-arrow">→</span>
                    <span class="afn-route-code">{{ o.destinationAirport }}</span>
                  </span>
                  <span class="ml-2 font-normal afn-text-faint">({{ o.destinationRegion }})</span>
                </p>
                <p class="mt-1 text-[12px] afn-text-subtle">
                  {{ o.airline }}{{ o.flightNumber.replace(o.airline, '') }} •
                  {{ new Date(o.departureDatetime).toLocaleString() }}
                </p>
              </div>
              <div class="text-right text-[12px] afn-text-subtle">
                <div class="afn-metrics justify-end">
                  <span class="afn-metric">
                    <span class="afn-metric-key">Pts</span>
                    <span class="afn-metric-val">{{ o.pointsCost.toLocaleString() }}</span>
                  </span>
                  <span class="afn-metric">
                    <span class="afn-metric-key">Tax</span>
                    <span class="afn-metric-sub">{{ o.taxesAmount }} {{ o.currency }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px] afn-text-subtle">
              <span class="afn-badge">{{ o.program }}</span>
              <span class="afn-badge">{{ o.cabin }}</span>
              <span class="afn-badge">{{ o.seatsAvailable }} seats</span>
              <span class="afn-text-faint">
                Observed {{ new Date(o.observedAt).toLocaleString() }}
              </span>
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <NuxtLink
                v-if="!session?.user"
                to="/auth/login"
                class="afn-link text-[12px]"
              >
                Sign in to create an alert
              </NuxtLink>
              <button
                v-else
                type="button"
                class="afn-btn afn-btn-sm afn-btn-secondary ml-auto"
                :disabled="createStatusById[o.id] === 'saving'"
                @click="createAlertFromObservation(o)"
              >
                <span v-if="createStatusById[o.id] === 'saving'">Saving…</span>
                <span v-else-if="createStatusById[o.id] === 'success'">Saved</span>
                <span v-else>Create alert</span>
              </button>
            </div>
            </div>
          </li>
        </ul>

        <!-- Desktop table -->
        <div class="hidden overflow-x-auto md:block afn-tabular">
          <table class="w-full min-w-[980px] text-left text-[12px]">
          <thead class="text-[11px] uppercase tracking-[0.18em] afn-text-faint">
            <tr class="border-b afn-divider">
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Route
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Flight
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Depart
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Program
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Cabin
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Seats
              </th>
              <th class="py-2.5 pr-3 sticky top-0 afn-sticky-th">
                Cost
              </th>
              <th class="py-2.5 sticky top-0 afn-sticky-th">
                Observed
              </th>
              <th class="py-2.5 pl-3 sticky top-0 afn-sticky-th">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y" style="border-color: var(--afn-border); color: var(--afn-text-subtle);">
            <tr v-for="o in observations" :key="o.id" class="afn-row">
              <td class="py-2.5 pr-3 font-medium afn-text-strong">
                <span class="afn-route">
                  <span class="afn-route-code">{{ o.originAirport }}</span>
                  <span class="afn-route-arrow">→</span>
                  <span class="afn-route-code">{{ o.destinationAirport }}</span>
                </span>
                <span class="ml-2 afn-text-faint">({{ o.destinationRegion }})</span>
              </td>
              <td class="py-2.5 pr-3">
                {{ o.airline }}{{ o.flightNumber.replace(o.airline, '') }}
              </td>
              <td class="py-2.5 pr-3 afn-text-strong">
                {{ new Date(o.departureDatetime).toLocaleString() }}
              </td>
              <td class="py-2.5 pr-3">
                <span class="afn-badge">{{ o.program }}</span>
              </td>
              <td class="py-2.5 pr-3">
                <span class="afn-badge">{{ o.cabin }}</span>
              </td>
              <td class="py-2.5 pr-3 text-right">
                <span class="afn-badge">{{ o.seatsAvailable }}</span>
              </td>
              <td class="py-2.5 pr-3 text-right">
                <div class="afn-metric justify-end">
                  <span class="afn-metric-val">{{ o.pointsCost.toLocaleString() }}</span>
                  <span class="afn-metric-sub">pts</span>
                </div>
                <div class="afn-metric justify-end">
                  <span class="afn-metric-sub">{{ o.taxesAmount }} {{ o.currency }}</span>
                </div>
              </td>
              <td class="py-2.5">
                <span class="afn-text-subtle">{{ new Date(o.observedAt).toLocaleString() }}</span>
              </td>
              <td class="py-2.5 pl-3">
                <NuxtLink
                  v-if="!session?.user"
                  to="/auth/login"
                  class="afn-link text-[11px]"
                >
                  Sign in
                </NuxtLink>
                <button
                  v-else
                  type="button"
                  class="afn-btn afn-btn-sm afn-btn-secondary px-3"
                  :disabled="createStatusById[o.id] === 'saving'"
                  @click="createAlertFromObservation(o)"
                >
                  <span v-if="createStatusById[o.id] === 'saving'">Saving…</span>
                  <span v-else-if="createStatusById[o.id] === 'success'">Saved</span>
                  <span v-else>Create alert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <button
          type="button"
          class="afn-btn afn-btn-sm afn-btn-secondary"
          :disabled="!hasPrev || pending"
          @click="goPrev()"
        >
          Prev
        </button>
        <button
          type="button"
          class="afn-btn afn-btn-sm afn-btn-secondary"
          :disabled="!hasNext || pending"
          @click="goNext()"
        >
          Next
        </button>
      </div>
      </div>
    </div>
  </section>
</template>

