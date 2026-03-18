<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ORIGIN_AIRPORTS, DESTINATION_REGIONS } from '~lib/constants/airports'
import { PROGRAMS, PROGRAM_LABELS } from '~lib/constants/programs'
import { CABINS, DEFAULT_CABIN } from '~lib/constants/cabins'

const props = defineProps<{
  allowTwoSeatAlerts: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [
    {
      originAirport: string
      destinationRegion: string
      startDate: string
      endDate: string
      program: string
      cabin: string
      seatsNeeded: number
      maxPoints: number | null
      maxTaxes: number | null
    },
  ]
  cancel: []
}>()

const today = new Date()
const inThreeMonths = new Date()
inThreeMonths.setMonth(inThreeMonths.getMonth() + 3)

const form = ref({
  originAirport: ORIGIN_AIRPORTS[0],
  destinationRegion: DESTINATION_REGIONS[0],
  startDate: today.toISOString().slice(0, 10),
  endDate: inThreeMonths.toISOString().slice(0, 10),
  program: PROGRAMS[0],
  cabin: DEFAULT_CABIN,
  seatsNeeded: 1,
  maxPoints: '',
  maxTaxes: '',
})

type FieldErrors = Partial<
  Record<
    | 'dateRange'
    | 'seatsNeeded'
    | 'maxPoints'
    | 'maxTaxes'
    | 'form',
    string
  >
>
const errors = ref<FieldErrors>({})

watch(
  () => props.allowTwoSeatAlerts,
  (allowed) => {
    if (!allowed && form.value.seatsNeeded > 1) {
      form.value.seatsNeeded = 1
    }
  },
)

const minEndDate = computed(() => form.value.startDate)

const handleSubmit = () => {
  errors.value = {}

  if (!form.value.startDate || !form.value.endDate) {
    errors.value.dateRange = 'Select a start and end date.'
    return
  }

  if (new Date(form.value.endDate) < new Date(form.value.startDate)) {
    errors.value.dateRange = 'End date must be on or after the start date.'
    return
  }

  if (!props.allowTwoSeatAlerts && form.value.seatsNeeded > 1) {
    errors.value.seatsNeeded = '2-seat alerts are available on Pro.'
    return
  }

  const maxPoints = form.value.maxPoints ? Number(form.value.maxPoints) : null
  if (maxPoints !== null && (!Number.isFinite(maxPoints) || maxPoints <= 0)) {
    errors.value.maxPoints = 'Enter a positive number of points, or leave empty.'
    return
  }

  const maxTaxes = form.value.maxTaxes ? Number(form.value.maxTaxes) : null
  if (maxTaxes !== null && (!Number.isFinite(maxTaxes) || maxTaxes <= 0)) {
    errors.value.maxTaxes = 'Enter a positive tax amount, or leave empty.'
    return
  }

  emit('submit', {
    originAirport: form.value.originAirport,
    destinationRegion: form.value.destinationRegion,
    startDate: new Date(form.value.startDate).toISOString(),
    endDate: new Date(form.value.endDate).toISOString(),
    program: form.value.program,
    cabin: form.value.cabin,
    seatsNeeded: form.value.seatsNeeded,
    maxPoints,
    maxTaxes,
  })
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="grid gap-4 sm:grid-cols-2">
    <div class="grid gap-3 sm:grid-cols-2">
      <label class="afn-label">
        <span class="afn-label-title">
          Origin airport
        </span>
        <select
          v-model="form.originAirport"
          class="afn-control afn-control-compact"
        >
          <option v-for="code in ORIGIN_AIRPORTS" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </label>

      <label class="afn-label">
        <span class="afn-label-title">
          Destination region
        </span>
        <select
          v-model="form.destinationRegion"
          class="afn-control afn-control-compact"
        >
          <option v-for="code in DESTINATION_REGIONS" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </label>
    </div>

    <div class="grid gap-3 sm:grid-cols-2">
      <label class="afn-label">
        <span class="afn-label-title">
          Start date
        </span>
        <input
          v-model="form.startDate"
          type="date"
          class="afn-control afn-control-compact"
        />
      </label>

      <label class="afn-label">
        <span class="afn-label-title">
          End date
        </span>
        <input
          v-model="form.endDate"
          type="date"
          :min="minEndDate"
          class="afn-control afn-control-compact"
        />
      </label>
    </div>
    </div>

    <p v-if="errors.dateRange" class="-mt-1 afn-error">
      {{ errors.dateRange }}
    </p>

    <div class="afn-divider-line pt-4" />

    <div class="grid gap-3 sm:grid-cols-3">
      <label class="afn-label">
        <span class="afn-label-title">
          Program
        </span>
        <select
          v-model="form.program"
          class="afn-control afn-control-compact"
        >
          <option v-for="code in PROGRAMS" :key="code" :value="code">
            {{ PROGRAM_LABELS[code] }}
          </option>
        </select>
      </label>

      <label class="afn-label">
        <span class="afn-label-title">
          Cabin
        </span>
        <select
          v-model="form.cabin"
          class="afn-control afn-control-compact"
        >
          <option v-for="code in CABINS" :key="code" :value="code">
            {{ code }}
          </option>
        </select>
      </label>

      <label class="afn-label">
        <span class="afn-label-title">
          Seats needed
        </span>
        <select
          v-model.number="form.seatsNeeded"
          class="afn-control afn-control-compact"
        >
          <option :value="1">
            1 seat
          </option>
          <option :value="2" :disabled="!allowTwoSeatAlerts">
            2 seats (Pro)
          </option>
        </select>
        <p v-if="!allowTwoSeatAlerts" class="afn-help">
          On Free you can create 1-seat alerts. Upgrade to Pro for 2 seats.
        </p>
      </label>
    </div>

    <p v-if="errors.seatsNeeded" class="-mt-1 afn-error">
      {{ errors.seatsNeeded }}
    </p>

    <div class="grid gap-3 sm:grid-cols-2">
      <label class="afn-label">
        <span class="afn-label-title">
          Max points (optional)
        </span>
        <input
          v-model="form.maxPoints"
          type="number"
          min="1"
          step="1000"
          class="afn-control afn-control-compact"
        />
        <p v-if="errors.maxPoints" class="afn-error">
          {{ errors.maxPoints }}
        </p>
      </label>

      <label class="afn-label">
        <span class="afn-label-title">
          Max taxes (EUR, optional)
        </span>
        <input
          v-model="form.maxTaxes"
          type="number"
          min="1"
          step="10"
          class="afn-control afn-control-compact"
        />
        <p v-if="errors.maxTaxes" class="afn-error">
          {{ errors.maxTaxes }}
        </p>
      </label>
    </div>

    <p v-if="errors.form" class="text-xs text-red-300">
      {{ errors.form }}
    </p>

    <div class="flex items-center justify-end gap-2 pt-2">
      <button
        type="button"
        class="afn-btn afn-btn-sm afn-btn-secondary"
        @click="emit('cancel')"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="afn-btn afn-btn-sm afn-btn-primary"
        :disabled="loading"
      >
        <span v-if="loading">
          Saving…
        </span>
        <span v-else>
          Save alert
        </span>
      </button>
    </div>
  </form>
</template>

