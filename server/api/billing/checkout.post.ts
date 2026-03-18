import { requireUser } from '~lib/auth/guard'
import { getFeatureFlags } from '~lib/config/featureFlags'

export default defineEventHandler(async (event) => {
  const flags = getFeatureFlags()
  if (!flags.billingEnabled) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Billing is disabled (BILLING_ENABLED=false)',
    })
  }

  await requireUser(event)

  throw createError({
    statusCode: 501,
    statusMessage: 'Checkout not implemented yet',
  })
})

