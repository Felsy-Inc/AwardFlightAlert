<script setup lang="ts">
import { ref, onMounted } from 'vue'

const user = useSupabaseUser()
const client = useSupabaseClient()

const isDark = ref(false)

const applyTheme = (nextIsDark: boolean) => {
  isDark.value = nextIsDark
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', nextIsDark)
  try {
    localStorage.setItem('afn-theme', nextIsDark ? 'dark' : 'light')
  } catch {
    // ignore
  }
}

const toggleTheme = () => applyTheme(!isDark.value)

onMounted(() => {
  let initial: 'light' | 'dark' | null = null
  try {
    initial = (localStorage.getItem('afn-theme') as any) ?? null
  } catch {
    initial = null
  }

  if (initial !== 'light' && initial !== 'dark') {
    initial =
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  applyTheme(initial === 'dark')
})

const signOut = async () => {
  await client.auth.signOut()
  await navigateTo('/')
}
</script>

<template>
  <header class="afn-topbar">
    <div class="afn-container flex items-center justify-between py-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="h-6 w-6 rounded-full" style="background: color-mix(in srgb, var(--afn-accent) 65%, transparent); box-shadow: 0 0 0 1px color-mix(in srgb, var(--afn-accent) 30%, transparent);" />
        <span class="text-sm font-semibold tracking-wide afn-text-strong">
          AwardFlightAlert
        </span>
      </NuxtLink>
      <nav class="afn-nav flex flex-wrap items-center justify-end gap-3 text-sm">
        <button
          type="button"
          class="afn-btn afn-btn-sm afn-btn-secondary px-2"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.8A8.5 8.5 0 1111.2 3a6.7 6.7 0 009.8 9.8z" />
          </svg>
        </button>
        <NuxtLink to="/browse">
          Browse
        </NuxtLink>
        <NuxtLink to="/pricing">
          Pricing
        </NuxtLink>

        <NuxtLink
          v-if="user"
          to="/dashboard"
          class="afn-btn afn-btn-sm afn-btn-secondary"
        >
          Dashboard
        </NuxtLink>

        <NuxtLink
          v-if="!user"
          to="/auth/login"
          class="afn-btn afn-btn-sm afn-btn-primary"
        >
          Sign in
        </NuxtLink>
        <button
          v-else
          type="button"
          class="afn-btn afn-btn-sm afn-btn-secondary"
          @click="signOut"
        >
          Sign out
        </button>
      </nav>
    </div>
  </header>
</template>

