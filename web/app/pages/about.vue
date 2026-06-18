<script setup lang="ts">
useSeoMeta({
  title: 'About ToolKit',
  description:
    'ToolKit.run is a collection of simple, fast, privacy-first browser tools. No accounts, no uploads, no tracking.',
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
      About ToolKit
    </h1>
    <div
      style="
        color: var(--tk-text-secondary);
        font-size: 1rem;
        line-height: 1.7;
      "
    >
      <p class="mb-4">
        ToolKit.run is a collection of simple, fast, privacy-first browser
        tools. No accounts, no uploads, no tracking.
      </p>
      <p class="mb-4">
        Every tool processes files directly in your browser using modern Web
        APIs — Canvas, WebAssembly, FileReader. Your files stay on your
        device.
      </p>
      <p class="mb-4">
        The project is maintained by a small team passionate about building
        useful software that respects users. It's free, ad-supported, and open
        source.
      </p>
      <p>Built with Nuxt 3, Vue 3, Tailwind CSS, and the Web Platform.</p>
    </div>
  </div>
</template>
