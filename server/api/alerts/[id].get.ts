import { getAlertForCurrentUser } from '../../services/alertService'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing alert id',
    })
  }

  return getAlertForCurrentUser(event, id)
})

