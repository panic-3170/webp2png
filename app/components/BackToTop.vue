<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ArrowUp } from 'lucide-vue-next'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 600
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-100"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <button
      v-if="visible"
      @click="scrollToTop"
      aria-label="Back to top"
      class="hidden lg:flex fixed bottom-6 right-6 w-12 h-12 rounded-full items-center justify-center transition-opacity duration-100"
      style="background: var(--tk-accent); color: var(--tk-accent-fg)"
      @mouseover="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.9')"
      @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
    >
      <ArrowUp :size="18" />
    </button>
  </Transition>
</template>
