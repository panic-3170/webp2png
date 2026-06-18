<script setup lang="ts">
import { FileImage, FileType, Image as ImageIcon, Code } from 'lucide-vue-next'
import ToolCard from '~/components/ToolCard.vue'

useSeoMeta({
  title: 'Free Online Tools — Private & Browser-Based | ToolKit',
  description:
    'Simple, private, browser-based online tools. Convert images, decode text, and more. No uploads, no signup, no tracking.',
  ogTitle: 'Free Online Tools — ToolKit.run',
  ogDescription: 'Simple, private, browser-based. No uploads, no signup.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const tools = [
  {
    to: '/webp-to-png',
    icon: FileImage,
    name: 'WebP → PNG',
    description: 'Convert WebP images to transparent PNG. 100% local, no upload.',
    badge: 'Free',
    disabled: false,
  },
  {
    to: '/webp-to-jpg',
    icon: FileType,
    name: 'WebP → JPG',
    description: 'Convert WebP to JPEG with white background. Instant, browser-based.',
    badge: 'Free',
    disabled: false,
  },
  {
    to: '/heic-to-jpg',
    icon: ImageIcon,
    name: 'HEIC → JPG',
    description: 'Turn iPhone HEIC photos into universal JPEG files. No software needed.',
    badge: 'Soon',
    disabled: true,
  },
  {
    to: '/svg-to-png',
    icon: Code,
    name: 'SVG → PNG',
    description: 'Rasterize SVG vectors to PNG at any resolution. Client-side only.',
    badge: 'Soon',
    disabled: true,
  },
]

const valueProps = [
  'Files never leave your device.',
  'No signup, no email, no tracking.',
  'Works on any modern browser.',
  'Open source. Free forever.',
]
</script>

<template>
  <div class="max-w-[1100px] mx-auto px-4 lg:px-6 py-16 lg:py-24">
    <!-- Hero -->
    <div class="mb-16">
      <h1
        class="mb-4"
        style="
          color: var(--tk-text-primary);
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.15;
        "
      >
        Free Online Tools
      </h1>
      <p
        class="max-w-xl"
        style="
          color: var(--tk-text-secondary);
          font-size: 1.125rem;
          line-height: 1.6;
        "
      >
        Simple, private, browser-based. No uploads, no signup.
      </p>
    </div>

    <!-- Tool grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-24">
      <ToolCard
        v-for="tool in tools"
        :key="tool.to"
        v-bind="tool"
      />
    </div>

    <!-- Value props -->
    <div style="border-top: 1px solid var(--tk-border); padding-top: 64px">
      <h2
        class="mb-8 uppercase tracking-widest"
        style="
          color: var(--tk-text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
        "
      >
        Why ToolKit?
      </h2>
      <ul class="flex flex-col gap-4">
        <li
          v-for="prop in valueProps"
          :key="prop"
          class="flex items-center gap-3"
        >
          <span style="color: var(--tk-success); font-weight: 600; font-size: 1rem">✓</span>
          <span style="color: var(--tk-text-primary); font-size: 1.0625rem">
            {{ prop }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
