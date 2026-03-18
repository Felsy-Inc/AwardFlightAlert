<script setup lang="ts">
import AppHeader from '../../components/layout/AppHeader.vue'
import AppFooter from '../../components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <AppHeader />
    <main class="flex-1">
      <div class="afn-container afn-page">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>