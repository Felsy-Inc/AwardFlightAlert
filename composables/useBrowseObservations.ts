import { computed, ref, watch } from 'vue'

export type BrowseObservationDto = {
  id: string
  sourceProvider: string
  program: string
  airline: string
  flightNumber: string
  originAirport: string
  destinationAirport: string
  destinationRegion: string
  departureDatetime: string
  arrivalDatetime: string
  departureDate: string
  cabin: string
  pointsCost: number
  taxesAmount: number
  currency: string
  seatsAvailable: number
  bookingUrl: string | null
  bookingHint: string | null
  observedAt: string
}

export type BrowseObservationsResponse = {
  observations: BrowseObservationDto[]
  total: number
  page: { limit: number; offset: number }
}

export const useBrowseObservations = () => {
  const filters = ref({
    originAirport: '',
    destinationRegion: '',
    program: '',
    cabin: '',
    seatsMin: '1',
    dateFrom: '',
    dateTo: '',
  })

  const page = ref({
    limit: 50,
    offset: 0,
  })

  const queryParams = computed(() => {
    const p = new URLSearchParams()
    if (filters.value.originAirport) p.set('originAirport', filters.value.originAirport)
    if (filters.value.destinationRegion) p.set('destinationRegion', filters.value.destinationRegion)
    if (filters.value.program) p.set('program', filters.value.program)
    if (filters.value.cabin) p.set('cabin', filters.value.cabin)
    if (filters.value.seatsMin) p.set('seatsMin', filters.value.seatsMin)
    if (filters.value.dateFrom) p.set('dateFrom', new Date(filters.value.dateFrom).toISOString())
    if (filters.value.dateTo) p.set('dateTo', new Date(filters.value.dateTo).toISOString())
    p.set('limit', String(page.value.limit))
    p.set('offset', String(page.value.offset))
    return p.toString()
  })

  const asyncKey = computed(() => `browse-observations:${queryParams.value}`)

  const state = useAsyncData<BrowseObservationsResponse>(
    asyncKey,
    () => $fetch(`/api/browse/observations?${queryParams.value}`),
    { watch: [queryParams] },
  )

  const observations = computed(() => state.data.value?.observations ?? [])
  const total = computed(() => state.data.value?.total ?? 0)

  const pageStart = computed(() => (total.value === 0 ? 0 : page.value.offset + 1))
  const pageEnd = computed(() => Math.min(page.value.offset + observations.value.length, total.value))
  const hasPrev = computed(() => page.value.offset > 0)
  const hasNext = computed(() => page.value.offset + page.value.limit < total.value)

  watch(
    () => ({ ...filters.value }),
    () => {
      page.value.offset = 0
    },
    { deep: true },
  )

  const goPrev = () => {
    page.value.offset = Math.max(0, page.value.offset - page.value.limit)
  }
  const goNext = () => {
    page.value.offset = page.value.offset + page.value.limit
  }

  return {
    filters,
    page,
    queryParams,
    observations,
    total,
    pageStart,
    pageEnd,
    hasPrev,
    hasNext,
    goPrev,
    goNext,
    ...state,
  }
}

