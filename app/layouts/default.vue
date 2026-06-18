<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue'
import AppFooter from '~/components/AppFooter.vue'
import BackToTop from '~/components/BackToTop.vue'
import Toast from '~/components/Toast.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col" style="background: var(--tk-bg)">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <BackToTop />
    <Toast />
  </div>
</template>
