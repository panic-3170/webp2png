<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy — ToolKit',
  description:
    'ToolKit.run is a browser-based tool suite. All file processing happens entirely on your device. We never receive, store, or transmit your files.',
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
      Privacy Policy
    </h1>
    <div
      style="
        color: var(--tk-text-secondary);
        font-size: 1rem;
        line-height: 1.7;
      "
    >
      <p class="mb-4">
        ToolKit.run is a browser-based tool suite. All file processing happens
        entirely on your device. We never receive, store, or transmit your files
        to any server.
      </p>
      <p class="mb-4">
        We use minimal, privacy-respecting analytics to understand which tools
        are used. No personal data is collected.
      </p>
      <p class="mb-4">
        This site may display contextual advertisements served by third-party ad
        networks. These networks may use cookies to serve ads based on your
        browsing history.
      </p>
      <p>
        If you have questions, please
        <NuxtLink
          to="/contact"
          class="underline transition-colors duration-100"
          style="color: var(--tk-text-primary)"
        >contact us</NuxtLink>.
      </p>
    </div>
  </div>
</template>
