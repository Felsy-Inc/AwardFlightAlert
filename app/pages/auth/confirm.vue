<script setup lang="ts">
const client = useSupabaseClient()
const isWorking = ref(true)
const errorMessage = ref<string | null>(null)

onMounted(async () => {
  try {
    // The Nuxt Supabase module will usually persist the session automatically on this callback route.
    // We still touch getSession() so the client parses the URL and updates local state.
    const { error } = await client.auth.getSession()
    if (error) {
      errorMessage.value = error.message
      return
    }

    await navigateTo('/dashboard')
  } catch (e: any) {
    errorMessage.value = e?.message ?? String(e)
  } finally {
    isWorking.value = false
  }
})
</script>

<template>
  <section class="mx-auto max-w-md space-y-4 text-center">
    <p class="afn-kicker">
      Signing you in
    </p>
    <h1 class="text-xl font-semibold tracking-tight afn-text-strong">
      Confirming your magic link…
    </h1>
    <p v-if="isWorking" class="text-sm afn-text-subtle">
      One moment.
    </p>
    <p
      v-else-if="errorMessage"
      class="afn-callout afn-callout-danger"
    >
      {{ errorMessage }}
    </p>
    <p v-else class="text-sm afn-text-subtle">
      Redirecting…
    </p>
  </section>
</template>

