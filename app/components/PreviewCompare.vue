<script setup lang="ts">
interface FileInfo {
  url: string
  name: string
  width: number
  height: number
  sizeKB: number
  label: string
}

defineProps<{
  original: FileInfo
  converted: FileInfo
}>()

// CSS-only checker background — works in both light & dark.
const checkerStyle = {
  backgroundImage: `
    linear-gradient(45deg, var(--tk-surface-alt) 25%, transparent 25%),
    linear-gradient(-45deg, var(--tk-surface-alt) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--tk-surface-alt) 75%),
    linear-gradient(-45deg, transparent 75%, var(--tk-surface-alt) 75%)
  `,
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
  backgroundColor: 'var(--tk-surface)',
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Original -->
    <div class="flex-1 min-w-0">
      <div class="relative w-full h-[240px] rounded-md overflow-hidden" :style="checkerStyle">
        <img
          :src="original.url"
          :alt="`${original.label} image`"
          class="w-full h-full object-contain"
        />
      </div>
      <div class="mt-3 text-left">
        <p class="text-[14px]" style="color: var(--tk-text-primary); font-weight: 500">
          {{ original.label }}
        </p>
        <p class="text-[13px] mt-0.5" style="color: var(--tk-text-secondary)">
          {{ original.width }} × {{ original.height }} · {{ original.sizeKB }} KB
        </p>
      </div>
    </div>

    <!-- Converted -->
    <div class="flex-1 min-w-0">
      <div class="relative w-full h-[240px] rounded-md overflow-hidden" :style="checkerStyle">
        <img
          :src="converted.url"
          :alt="`${converted.label} image`"
          class="w-full h-full object-contain"
        />
      </div>
      <div class="mt-3 text-left">
        <p class="text-[14px]" style="color: var(--tk-text-primary); font-weight: 500">
          {{ converted.label }}
        </p>
        <p class="text-[13px] mt-0.5" style="color: var(--tk-text-secondary)">
          {{ converted.width }} × {{ converted.height }} · {{ converted.sizeKB }} KB
        </p>
      </div>
    </div>
  </div>
</template>
