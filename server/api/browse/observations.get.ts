import { listObservations } from '../../services/observationsService'

const asString = (v: unknown) => (typeof v === 'string' && v.length > 0 ? v : undefined)
const asNumber = (v: unknown) => {
  if (typeof v !== 'string') return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  return listObservations(event, {
    originAirport: asString(q.originAirport),
    destinationRegion: asString(q.destinationRegion),
    program: asString(q.program),
    cabin: asString(q.cabin),
    seatsMin: asNumber(q.seatsMin),
    dateFrom: asString(q.dateFrom),
    dateTo: asString(q.dateTo),
    limit: asNumber(q.limit),
    offset: asNumber(q.offset),
  })
})

