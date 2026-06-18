<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  to: string
  icon: Component
  name: string
  description: string
  badge?: string
  disabled?: boolean
}>()

function onMouseOver(e: MouseEvent) {
  if (!props.disabled) {
    (e.currentTarget as HTMLElement).style.borderColor = 'var(--tk-border-strong)'
  }
}

function onMouseLeave(e: MouseEvent) {
  if (!props.disabled) {
    (e.currentTarget as HTMLElement).style.borderColor = 'var(--tk-border)'
  }
}
</script>

<template>
  <NuxtLink
    v-if="!disabled"
    :to="to"
    class="block rounded-md transition-colors duration-100"
    :style="{
      background: 'var(--tk-surface)',
      border: '1px solid var(--tk-border)',
      padding: '24px',
    }"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div class="flex items-start justify-between gap-2 mb-3">
      <component
        :is="icon"
        :size="24"
        class="mt-0.5 shrink-0"
        style="color: var(--tk-text-secondary)"
      />
      <span
        v-if="badge"
        class="text-[12px]"
        style="
          background: var(--tk-surface-alt);
          border: 1px solid var(--tk-border);
          border-radius: 4px;
          padding: 0 8px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          color: var(--tk-text-tertiary);
        "
      >
        {{ badge }}
      </span>
    </div>
    <h3 class="mb-1" style="color: var(--tk-text-primary); font-size: 1.0625rem; font-weight: 600">
      {{ name }}
    </h3>
    <p class="text-[14px] leading-relaxed" style="color: var(--tk-text-secondary)">
      {{ description }}
    </p>
  </NuxtLink>
  <div
    v-else
    class="block rounded-md cursor-not-allowed"
    :style="{
      background: 'var(--tk-surface)',
      border: '1px solid var(--tk-border)',
      padding: '24px',
      opacity: 0.6,
    }"
  >
    <div class="flex items-start justify-between gap-2 mb-3">
      <component
        :is="icon"
        :size="24"
        class="mt-0.5 shrink-0"
        style="color: var(--tk-text-secondary)"
      />
      <span
        v-if="badge"
        class="text-[12px]"
        style="
          background: var(--tk-surface-alt);
          border: 1px solid var(--tk-border);
          border-radius: 4px;
          padding: 0 8px;
          height: 20px;
          display: inline-flex;
          align-items: center;
          color: var(--tk-text-tertiary);
        "
      >
        {{ badge }}
      </span>
    </div>
    <h3 class="mb-1" style="color: var(--tk-text-primary); font-size: 1.0625rem; font-weight: 600">
      {{ name }}
    </h3>
    <p class="text-[14px] leading-relaxed" style="color: var(--tk-text-secondary)">
      {{ description }}
    </p>
  </div>
</template>
