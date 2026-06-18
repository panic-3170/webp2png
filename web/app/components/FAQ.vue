<script setup lang="ts">
interface FAQItem {
  q: string
  a: string
}

defineProps<{
  items: FAQItem[]
}>()
</script>

<template>
  <section>
    <h2
      class="mb-8"
      style="
        color: var(--tk-text-primary);
        font-size: clamp(1.5rem, 3vw, 2rem);
        font-weight: 600;
        letter-spacing: -0.01em;
      "
    >
      Frequently Asked Questions
    </h2>
    <div class="flex flex-col">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="py-5"
        :style="i < items.length - 1 ? { borderBottom: '1px solid var(--tk-border)' } : {}"
      >
        <p
          class="mb-2"
          style="color: var(--tk-text-primary); font-size: 1rem; font-weight: 600"
        >
          {{ item.q }}
        </p>
        <p
          class="text-[14px]"
          style="color: var(--tk-text-secondary); line-height: 1.7"
        >
          {{ item.a }}
        </p>
      </div>
    </div>
  </section>
</template>
