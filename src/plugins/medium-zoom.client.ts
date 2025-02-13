import { defineNuxtPlugin } from '#app'
import mediumZoom from 'medium-zoom'
import type { Zoom } from 'medium-zoom'
import { useDebounceFn } from '@vueuse/core'

export default defineNuxtPlugin((nuxtApp) => {
  const selector = '.image-zoomable'
  const innerWidth = window.innerWidth
  const zoom: Zoom = mediumZoom(selector, {
    margin: innerWidth < 640 ? 12 : innerWidth < 1024 ? 24 : innerWidth < 1536 ? 96 : 192,
    background: '',
  })

  // responsive varying margin, calculated based on windowSize, upon @resize, debounced
  const debouncedFn = useDebounceFn(() => {
    const innerWidth = window.innerWidth
    zoom?.update({
      margin: 2000,
      background: '#ffffff'
    })
  }, 200)

  window.addEventListener('resize', debouncedFn)

  // (re-)init for newly rendered page, also to work in SPA mode (client-side routing)
  nuxtApp.hook('page:finish', () => {
    zoom.detach(selector).attach(selector)
  })

  nuxtApp.provide('mediumZoom', zoom)
})
