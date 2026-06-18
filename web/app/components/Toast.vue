<script setup lang="ts">
import { watch } from 'vue'
import { X, AlertCircle, CheckCircle } from 'lucide-vue-next'

const { toast, dismiss } = useToast()

// Auto-dismiss after 4s; reset timer on every new toast.
let timer: ReturnType<typeof setTimeout> | null = null
watch(
  () => toast.value?.id,
  (id) => {
    if (timer) clearTimeout(timer)
    if (id) {
      timer = setTimeout(dismiss, 4000)
    }
  },
)
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="toast"
      role="alert"
      aria-live="polite"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] rounded flex items-start gap-3 px-4 py-3"
      :style="{
        background: 'var(--tk-surface)',
        border: `1px solid ${toast.type === 'error' ? 'var(--tk-danger)' : 'var(--tk-success)'}`,
        borderLeft: `4px solid ${toast.type === 'error' ? 'var(--tk-danger)' : 'var(--tk-success)'}`,
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      }"
    >
      <component
        :is="toast.type === 'error' ? AlertCircle : CheckCircle"
        :size="16"
        class="shrink-0 mt-0.5"
        :style="{ color: toast.type === 'error' ? 'var(--tk-danger)' : 'var(--tk-success)' }"
      />
      <span class="text-sm flex-1" style="color: var(--tk-text-primary)">
        {{ toast.message }}
      </span>
      <button
        @click="dismiss"
        aria-label="Dismiss"
        class="shrink-0 transition-colors duration-100"
        style="color: var(--tk-text-tertiary)"
        @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-primary)')"
        @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
      >
        <X :size="14" />
      </button>
    </div>
  </Transition>
</template>
