<script setup lang="ts">
// Static footer — content only, no logic.
</script>

<template>
  <footer class="mt-auto" style="border-top: 1px solid var(--tk-border)">
    <div class="max-w-[1100px] mx-auto px-4 lg:px-6 py-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        style="font-size: 13px; color: var(--tk-text-tertiary)"
      >
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© 2026 ToolKit.run</span>
          <span class="hidden sm:inline opacity-40">·</span>
          <NuxtLink
            to="/privacy"
            class="transition-colors duration-100 hover:opacity-100"
            style="color: var(--tk-text-tertiary)"
            @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-secondary)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
          >Privacy</NuxtLink>
          <span class="opacity-40">·</span>
          <NuxtLink
            to="/about"
            class="transition-colors duration-100"
            style="color: var(--tk-text-tertiary)"
            @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-secondary)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
          >About</NuxtLink>
          <span class="opacity-40">·</span>
          <NuxtLink
            to="/contact"
            class="transition-colors duration-100"
            style="color: var(--tk-text-tertiary)"
            @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-secondary)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
          >Contact</NuxtLink>
        </div>
        <span style="color: var(--tk-text-tertiary)">Files never leave your device.</span>
      </div>
    </div>
  </footer>
</template>
