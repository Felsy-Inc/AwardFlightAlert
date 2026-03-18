export type FeatureFlags = {
  useMockProvider: boolean
  billingEnabled: boolean
  emailsEnabled: boolean
  publicBrowseEnabled: boolean
}

const toBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) return fallback
  const v = value.toLowerCase()
  if (v === 'true') return true
  if (v === 'false') return false
  return fallback
}

export const getFeatureFlags = (): FeatureFlags => ({
  useMockProvider: toBool(process.env.USE_MOCK_PROVIDER, true),
  billingEnabled: toBool(process.env.BILLING_ENABLED, false),
  emailsEnabled: toBool(process.env.EMAILS_ENABLED, true),
  publicBrowseEnabled: toBool(process.env.PUBLIC_BROWSE_ENABLED, true),
})

