import { listAlertsForCurrentUser } from '../../services/alertService'

export default defineEventHandler(async (event) => {
  return listAlertsForCurrentUser(event)
})

