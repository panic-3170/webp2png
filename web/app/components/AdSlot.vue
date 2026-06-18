<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: number
    height?: number
    label?: string
  }>(),
  { width: 728, height: 90, label: 'Ad placeholder' },
)
</script>

<template>
  <div
    class="rounded-md overflow-hidden"
    style="background: var(--tk-surface-alt); border: 1px dashed var(--tk-border); padding: 8px"
  >
    <div class="text-[11px] mb-1" style="color: var(--tk-text-tertiary)">Sponsored</div>
    <div
      class="flex items-center justify-center rounded-sm mx-auto"
      :style="{
        maxWidth: `${width}px`,
        width: '100%',
        height: `${height}px`,
        background: 'var(--tk-surface-alt)',
      }"
    >
      <span class="text-xs" style="color: var(--tk-text-tertiary)">{{ label }}</span>
    </div>
  </div>
</template>
