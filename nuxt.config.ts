import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  alias: {
    '~lib': fileURLToPath(new URL('./lib', import.meta.url)),
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    // Server-only
    databaseUrl: process.env.DATABASE_URL,
    resendApiKey: process.env.RESEND_API_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    // Exposed to client
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
      emailFrom: process.env.EMAIL_FROM,
      billingEnabled: process.env.BILLING_ENABLED === 'true',
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      // Keep auth redirects explicit, but DO allow the callback flow to run
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/pricing', '/browse', '/auth/login', '/auth/confirm'],
    },
  },
})

