<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseBrowserClient } from '~lib/auth/supabaseClient'
const email = ref('')
const isSubmitting = ref(false)
const successMessage = ref<string | null>(null)
const errorMessage = ref<string | null>(null)

const client = useSupabaseBrowserClient()

const handleSubmit = async () => {
  errorMessage.value = null
  successMessage.value = null

  if (!email.value) {
    errorMessage.value = 'Please enter your email address.'
    return
  }

  isSubmitting.value = true

  try {
    const { error } = await client.auth.signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: window.location.origin + '/auth/confirm',
      },
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    successMessage.value =
      'Magic link sent. Check your inbox to continue.'
  } catch (err) {
    errorMessage.value = 'Something went wrong. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto max-w-md space-y-8">
    <div class="space-y-3 text-center">
      <p class="afn-kicker">
        Sign in
      </p>
      <h1 class="text-xl font-semibold tracking-tight afn-text-strong">
        Get a magic link to your inbox.
      </h1>
      <p class="text-sm afn-text-subtle">
        No passwords. Use your email address and we will send you a one-time
        login link.
      </p>
    </div>

    <form
      class="afn-card"
      @submit.prevent="handleSubmit"
    >
      <div class="afn-card-inner space-y-4">
      <label class="block space-y-1 text-left text-sm">
        <span class="text-xs font-medium afn-text">Email address</span>
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="afn-control"
        />
      </label>

      <button
        type="submit"
        class="afn-btn afn-btn-primary w-full"
        :disabled="isSubmitting"
      >
        <span v-if="!isSubmitting">Send magic link</span>
        <span v-else>Sending…</span>
      </button>

      <p class="text-[11px] afn-text-faint">
        By continuing, you agree that this MVP sends emails using Resend. No
        marketing spam, only account and alert messages.
      </p>

      <p
        v-if="errorMessage"
        class="afn-callout afn-callout-danger"
      >
        {{ errorMessage }}
      </p>
      <p
        v-if="successMessage"
        class="afn-callout afn-callout-success"
      >
        {{ successMessage }}
      </p>
      </div>
    </form>

    <p class="text-center text-xs afn-text-faint">
      Back to
      <NuxtLink
        to="/"
        class="afn-link"
      >
        homepage
      </NuxtLink>
    </p>
  </section>
</template>

