import { listRecentMatchesForCurrentUser } from '../../services/matchesService'

export default defineEventHandler(async (event) => {
  const limitParam = getQuery(event)?.limit
  const limit =
    typeof limitParam === 'string' ? Math.min(50, Math.max(1, Number(limitParam))) : 20

  return listRecentMatchesForCurrentUser(event, Number.isFinite(limit) ? limit : 20)
})

