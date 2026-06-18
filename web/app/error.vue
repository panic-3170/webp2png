<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

// Custom 404 (Nuxt's `error.vue` is global)
defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
  }
}>()

useSeoMeta({
  title: 'Page not found — ToolKit',
  description: 'The page you are looking for does not exist.',
})

function handleHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
    <svg
      width="120"
      height="60"
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="mb-8"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="50"
        text-anchor="middle"
        font-size="52"
        font-weight="700"
        font-family="Inter, sans-serif"
        fill="var(--tk-border-strong)"
        letter-spacing="-2"
      >
        {{ error.statusCode }}
      </text>
    </svg>
    <p class="mb-8" style="color: var(--tk-text-secondary); font-size: 1.125rem">
      {{ error.statusMessage || 'Page not found.' }}
    </p>
    <button
      @click="handleHome"
      class="h-10 px-4 rounded inline-flex items-center transition-opacity duration-100 text-sm"
      style="
        background: var(--tk-accent);
        color: var(--tk-accent-fg);
        font-weight: 500;
      "
      @mouseover="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.9')"
      @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
    >
      <ArrowLeft :size="16" class="mr-2" />
      Back to home
    </button>
  </div>
</template>
