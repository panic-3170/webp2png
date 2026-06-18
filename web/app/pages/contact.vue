<script setup lang="ts">
useSeoMeta({
  title: 'Contact — ToolKit',
  description: 'Get in touch with the ToolKit team.',
})
</script>

<template>
  <div class="max-w-[720px] mx-auto px-4 lg:px-6 py-16 lg:py-24">
    <h1
      class="mb-10"
      style="
        color: var(--tk-text-primary);
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        line-height: 1.15;
      "
    >
      Contact
    </h1>
    <div
      style="
        color: var(--tk-text-secondary);
        font-size: 1rem;
        line-height: 1.7;
      "
    >
      <p class="mb-4">
        Have a question, found a bug, or want to suggest a new tool? We'd love
        to hear from you.
      </p>
      <p class="mb-4">
        Email us at:
        <a
          href="mailto:hello@toolkit.run"
          class="underline transition-colors duration-100"
          style="color: var(--tk-text-primary)"
        >hello@toolkit.run</a>
      </p>
      <p class="text-sm" style="color: var(--tk-text-tertiary)">
        We try to respond within 24–48 hours on business days.
      </p>
    </div>
  </div>
</template>
