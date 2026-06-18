<script setup lang="ts">
import { ref } from 'vue'
import { Upload } from 'lucide-vue-next'

interface Props {
  /** Called with the selected file. Parent validates (size / type) and converts. */
  onFile: (file: File) => void
  /** Disables interaction + shows spinner. */
  processing: boolean
  accept?: string
  maxSizeMB?: number
  label?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.webp,image/webp',
  maxSizeMB: 20,
  label: 'Drop WebP here',
  hint: 'or click to select',
})

const emit = defineEmits<{ oversize: [sizeMB: number] }>()

const dragOver = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  if (file.size > props.maxSizeMB * 1024 * 1024) {
    emit('oversize', Math.round(file.size / 1024 / 1024))
    return
  }
  props.onFile(file)
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  dragOver.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

function onInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
  // reset so the same file can be re-selected
  ;(e.target as HTMLInputElement).value = ''
}

function openPicker() {
  if (props.processing) return
  inputRef.value?.click()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openPicker()
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    aria-label="File drop zone"
    class="flex flex-col items-center justify-center text-center cursor-pointer select-none"
    :class="[
      'rounded-md',
      'transition-colors duration-100',
      'min-h-[280px] lg:min-h-[320px]',
    ]"
    :style="{
      border: `2px dashed ${dragOver ? 'var(--tk-accent)' : 'var(--tk-border-strong)'}`,
      background: dragOver ? 'var(--tk-surface-alt)' : 'var(--tk-surface)',
      padding: '48px 24px',
      opacity: processing ? 0.6 : 1,
      pointerEvents: processing ? 'none' : 'auto',
    }"
    @dragover.prevent="dragOver = true"
    @dragleave="dragOver = false"
    @drop="onDrop"
    @click="openPicker"
    @keydown="onKey"
  >
    <input
      ref="inputRef"
      type="file"
      :accept="accept"
      class="tk-sr-only"
      aria-hidden="true"
      @change="onInputChange"
    />

    <div v-if="processing" class="flex flex-col items-center gap-3">
      <div
        class="w-6 h-6 rounded-full border-2 border-transparent animate-spin"
        style="border-top-color: var(--tk-text-secondary)"
      />
      <span class="text-sm" style="color: var(--tk-text-secondary)">Converting...</span>
    </div>

    <template v-else>
      <Upload :size="28" class="mb-4" style="color: var(--tk-text-tertiary)" />
      <p class="mb-1" style="color: var(--tk-text-primary); font-weight: 500">
        {{ label }}
      </p>
      <p class="text-sm" style="color: var(--tk-text-secondary)">{{ hint }}</p>
      <p class="text-xs mt-3" style="color: var(--tk-text-tertiary)">
        Max {{ maxSizeMB }}MB · No upload · 100% local
      </p>
    </template>
  </div>
</template>
