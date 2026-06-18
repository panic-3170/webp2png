<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { FileImage, Image as ImageIcon, Code } from 'lucide-vue-next'
import Dropzone from '~/components/Dropzone.vue'
import PreviewCompare from '~/components/PreviewCompare.vue'
import AdSlot from '~/components/AdSlot.vue'
import FAQ from '~/components/FAQ.vue'
import ToolCard from '~/components/ToolCard.vue'
import {
  convertWebpFileToJpg,
  deriveJpgName,
} from '~/composables/useWebpToJpg'
import { WebpConversionError } from '~/composables/useWebpToPng'

useSeoMeta({
  title: 'WebP to JPG Converter — Free & Private | ToolKit',
  description:
    'Convert WebP to JPG/JPEG in your browser. Files never leave your device. Free, fast, and 100% local processing.',
  ogTitle: 'WebP to JPG — ToolKit',
  ogDescription: '100% local processing. Files never leave your device.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// JSON-LD: FAQPage (per PRD §6.2)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this tool really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. No signup, no payment, no catch. ToolKit.run is supported by non-intrusive ads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you upload my files?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All processing happens entirely in your browser using the Canvas API. Your files never leave your device.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens to transparency in the JPG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JPG does not support transparency. Transparent areas of your WebP will be composited onto a white background in the output JPG.',
      },
    },
    {
      '@type': 'Question',
      name: "What's the maximum file size?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: '20 MB per file in this version. Larger files may be supported in future updates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will the JPG be larger than the WebP?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not necessarily. JPG is a different codec tuned for photographs; it can be smaller or larger than the source WebP depending on content. Visual quality is preserved at the default 92% quality setting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why convert WebP to JPG?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Some applications, devices, and platforms still do not support WebP. Converting to JPG ensures maximum compatibility — for example when uploading to older CMSes, email clients, or third-party services that reject WebP uploads.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The tool works on iOS Safari, Android Chrome, and all modern mobile browsers.',
      },
    },
  ],
}
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(faqJsonLd),
    },
  ],
})

const { show: showToast } = useToast()
const { track } = useAnalytics()

const processing = ref(false)
const result = ref<import('~/composables/useWebpToJpg').ConvertedJpg | null>(null)

async function handleFile(file: File) {
  processing.value = true
  result.value = null
  track('upload', { format: 'webp', target: 'jpg', size_kb: Math.round(file.size / 1024) })

  try {
    const converted = await convertWebpFileToJpg(file)
    result.value = converted
    track('convert', {
      target: 'jpg',
      width: converted.width,
      height: converted.height,
      size_kb: converted.sizeKB,
    })
  } catch (e) {
    if (e instanceof WebpConversionError) {
      if (e.code === 'NOT_WEBP') {
        showToast('Please select a WebP file.', 'error')
      } else if (e.code === 'TOO_LARGE') {
        showToast('File is too large. Maximum size is 20 MB.', 'error')
      } else {
        showToast('Conversion failed. Please try another file.', 'error')
      }
    } else {
      showToast('Conversion failed. Please try another file.', 'error')
    }
    track('error', { stage: 'convert', target: 'jpg' })
  } finally {
    processing.value = false
  }
}

function handleOversize(sizeMB: number) {
  showToast(
    `File is too large (${sizeMB} MB). Maximum size is 20 MB.`,
    'error',
  )
}

function handleDownload() {
  if (!result.value) return
  const a = document.createElement('a')
  a.href = result.value.jpgUrl
  a.download = deriveJpgName(result.value.originalName)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  track('download', {
    format: 'jpg',
    size_kb: result.value.sizeKB,
    width: result.value.width,
  })
}

function handleReset() {
  if (result.value) {
    URL.revokeObjectURL(result.value.originalUrl)
    URL.revokeObjectURL(result.value.jpgUrl)
  }
  result.value = null
}

onBeforeUnmount(() => {
  if (result.value) {
    URL.revokeObjectURL(result.value.originalUrl)
    URL.revokeObjectURL(result.value.jpgUrl)
  }
})

const faqItems = [
  {
    q: 'Is this tool really free?',
    a: 'Yes. No signup, no payment, no catch. ToolKit.run is supported by non-intrusive ads.',
  },
  {
    q: 'Do you upload my files?',
    a: 'No. All processing happens entirely in your browser using the Canvas API. Your files never leave your device.',
  },
  {
    q: 'What happens to transparency in the JPG?',
    a: 'JPG does not support transparency. Transparent areas of your WebP will be composited onto a white background in the output JPG.',
  },
  {
    q: "What's the maximum file size?",
    a: '20 MB per file in this version. Larger files may be supported in future updates.',
  },
  {
    q: 'Will the JPG be larger than the WebP?',
    a: 'Not necessarily. JPG is a different codec tuned for photographs; it can be smaller or larger than the source WebP depending on content. Visual quality is preserved at the default 92% quality setting.',
  },
  {
    q: 'Why convert WebP to JPG?',
    a: 'Some applications, devices, and platforms still do not support WebP. Converting to JPG ensures maximum compatibility — for example when uploading to older CMSes, email clients, or third-party services that reject WebP uploads.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. The tool works on iOS Safari, Android Chrome, and all modern mobile browsers.',
  },
]

const relatedTools = [
  {
    to: '/webp-to-png',
    icon: FileImage,
    name: 'WebP → PNG',
    description: 'Convert WebP images to transparent PNG.',
    disabled: false,
  },
  {
    to: '/heic-to-jpg',
    icon: ImageIcon,
    name: 'HEIC → JPG',
    description: 'Convert iPhone HEIC photos to universal JPEG.',
    disabled: true,
  },
  {
    to: '/svg-to-png',
    icon: Code,
    name: 'SVG → PNG',
    description: 'Rasterize SVG vectors to PNG at any resolution.',
    disabled: true,
  },
]
</script>

<template>
  <div class="flex gap-8">
    <!-- Main content -->
    <div class="flex-1 min-w-0 max-w-[1100px] mx-auto px-4 lg:px-6 py-8 lg:py-16">
      <!-- Top ad -->
      <div class="mb-10 hidden sm:block">
        <AdSlot :width="728" :height="90" label="728×90 Ad" />
      </div>
      <div class="mb-8 sm:hidden">
        <AdSlot :width="320" :height="100" label="320×100 Ad" />
      </div>

      <!-- Heading -->
      <div class="mb-10">
        <h1
          class="mb-3"
          style="
            color: var(--tk-text-primary);
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 700;
            letter-spacing: -0.02em;
            line-height: 1.15;
          "
        >
          WebP to JPG
        </h1>
        <p
          style="
            color: var(--tk-text-secondary);
            font-size: 1rem;
            line-height: 1.6;
          "
        >
          100% local processing. Files never leave your device.
        </p>
      </div>

      <!-- Dropzone or Result -->
      <Dropzone
        v-if="!result"
        :on-file="handleFile"
        :processing="processing"
        label="Drop WebP here"
        hint="or click to select"
        @oversize="handleOversize"
      />

      <template v-else>
        <PreviewCompare
          :original="{
            url: result.originalUrl,
            name: result.originalName,
            width: result.width,
            height: result.height,
            sizeKB: result.originalSizeKB,
            label: 'Original',
          }"
          :converted="{
            url: result.jpgUrl,
            name: deriveJpgName(result.originalName),
            width: result.width,
            height: result.height,
            sizeKB: result.sizeKB,
            label: 'JPG (white background)',
          }"
        />

        <!-- Actions -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            @click="handleDownload"
            class="h-12 px-5 rounded transition-opacity duration-100 sm:w-auto w-full"
            style="
              background: var(--tk-accent);
              color: var(--tk-accent-fg);
              font-weight: 500;
              font-size: 1rem;
            "
            @mouseover="(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.9')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')"
          >
            Download JPG
          </button>
          <button
            @click="handleReset"
            class="h-12 px-5 rounded transition-colors duration-100 sm:w-auto w-full"
            style="
              background: var(--tk-surface);
              border: 1px solid var(--tk-border);
              color: var(--tk-text-primary);
              font-weight: 500;
              font-size: 1rem;
            "
            @mouseover="(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--tk-border-strong)')"
            @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--tk-border)')"
          >
            Convert Another
          </button>
        </div>

        <!-- Post-conversion ad (golden slot) -->
        <div class="mt-10">
          <AdSlot :width="336" :height="280" label="336×280 Ad" />
        </div>
      </template>

      <!-- FAQ -->
      <div
        class="mt-16 lg:mt-24"
        style="border-top: 1px solid var(--tk-border); padding-top: 64px"
      >
        <FAQ :items="faqItems" />
      </div>

      <!-- Related tools -->
      <div class="mt-16 lg:mt-24">
        <h2
          class="mb-6"
          style="
            color: var(--tk-text-primary);
            font-size: clamp(1.5rem, 3vw, 2rem);
            font-weight: 600;
            letter-spacing: -0.01em;
          "
        >
          Related Tools
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ToolCard
            v-for="tool in relatedTools"
            :key="tool.to"
            v-bind="tool"
          />
        </div>
      </div>
    </div>

    <!-- Sidebar sticky ad (desktop only) -->
    <aside class="hidden xl:block w-[320px] shrink-0 pt-8 lg:pt-16">
      <div class="sticky top-6">
        <AdSlot :width="300" :height="600" label="300×600 Ad" />
      </div>
    </aside>
  </div>
</template>
