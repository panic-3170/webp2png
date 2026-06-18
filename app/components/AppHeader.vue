<script setup lang="ts">
import { ref } from 'vue'
import { Github, Twitter, Mail, Menu, X } from 'lucide-vue-next'

const route = useRoute()
const menuOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/webp-to-png', label: 'Tools' },
  { to: '/about', label: 'About' },
]

const isActive = (to: string) => {
  const base = useRuntimeConfig().app.baseURL || '/'
  const normalizedPath = route.path.replace(base, '/')
  if (to === '/') return normalizedPath === '/'
  return normalizedPath.startsWith(to)
}

const closeMenu = () => (menuOpen.value = false)
</script>

<template>
  <header
    class="relative z-10"
    style="height: var(--tk-header-h); border-bottom: 1px solid var(--tk-border); background: var(--tk-surface)"
  >
    <div class="max-w-[1100px] mx-auto h-full px-4 lg:px-6 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="hover:opacity-80 transition-opacity duration-100"
        style="color: var(--tk-text-primary); font-weight: 700; font-size: 1.125rem; letter-spacing: -0.02em"
      >
        ToolKit<span class="opacity-40">.run</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm transition-colors duration-100"
          :style="{
            color: isActive(link.to) ? 'var(--tk-text-primary)' : 'var(--tk-text-secondary)',
            fontWeight: isActive(link.to) ? 500 : 400,
          }"
          @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-primary)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = isActive(link.to) ? 'var(--tk-text-primary)' : 'var(--tk-text-secondary)')"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Desktop social -->
      <div class="hidden md:flex items-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="transition-colors duration-100"
          style="color: var(--tk-text-tertiary)"
          @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-primary)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
        >
          <Github :size="20" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
          class="transition-colors duration-100"
          style="color: var(--tk-text-tertiary)"
          @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-primary)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
        >
          <Twitter :size="20" />
        </a>
        <NuxtLink
          to="/contact"
          aria-label="Contact"
          class="transition-colors duration-100"
          style="color: var(--tk-text-tertiary)"
          @mouseover="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-primary)')"
          @mouseleave="(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--tk-text-tertiary)')"
        >
          <Mail :size="20" />
        </NuxtLink>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="md:hidden p-2 -mr-2"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        style="color: var(--tk-text-primary)"
        @click="menuOpen = !menuOpen"
      >
        <component :is="menuOpen ? X : Menu" :size="20" />
      </button>
    </div>

    <!-- Mobile drawer -->
    <Transition
      enter-active-class="transition-opacity duration-100"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="menuOpen"
        class="md:hidden absolute top-full left-0 right-0"
        style="background: var(--tk-surface); border-bottom: 1px solid var(--tk-border)"
      >
        <nav class="max-w-[1100px] mx-auto px-4 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="py-2 text-sm transition-colors duration-100"
            style="color: var(--tk-text-secondary)"
            @click="closeMenu"
          >
            {{ link.label }}
          </NuxtLink>
          <div
            class="flex items-center gap-4 pt-2 mt-2"
            style="border-top: 1px solid var(--tk-border); color: var(--tk-text-tertiary)"
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github :size="18" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter :size="18" />
            </a>
            <NuxtLink to="/contact" aria-label="Contact" @click="closeMenu">
              <Mail :size="18" />
            </NuxtLink>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>
