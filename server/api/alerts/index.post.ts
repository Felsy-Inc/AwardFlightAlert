import { createAlertForCurrentUser } from '../../services/alertService'

export default defineEventHandler(async (event) => {
  return createAlertForCurrentUser(event)
})

