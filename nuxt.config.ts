const { BaseURL } = process.env
const development = process.env.NODE_ENV !== 'production'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  nitro: {
    prerender: {
      concurrency: 250,
      interval: 100,
    }
  },
  srcDir: 'src/',
  css: ['/assets/main.css'],
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@vee-validate/nuxt', '@nuxt/icon', 'pinia-plugin-persistedstate/nuxt'],
  imports: {
    dirs: ['./src/stores'],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/_variables.scss" as *;',
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: development ? process.env.NUXT_BASE_URL_DEV : process.env.NUXT_BASE_URL,
    },
  },
  pinia: {
    storesDirs: ['./src/stores/**'],
  },
})
