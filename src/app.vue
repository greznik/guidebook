<script setup lang="ts">
import { useTreeStore } from '~/stores/tree'
import favicon from '~/assets/favicon.ico'

const { getItemsTree } = useTreeStore()
const { storeToken } = useAuthStore()

useHead({
  title: 'Guidebook',
  link: [{ rel: 'icon', type: 'image/png', href: favicon }],
  meta: [{ name: 'Guidebook', content: 'Betboom guidebook' }],
})

await useAsyncData('tree', getItemsTree)
refreshNuxtData('tree')
storeToken(useCookie('token'))
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtPage />
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.1s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

/* Toastify */
:root {
  --toastify-toast-min-height: 40px;
  --toastify-icon-color-info: #ff8b00;
  --toastify-toast-width: 400px;
}

.Toastify__toast-theme--light {
  background: $bgWhite;
  color: $textPrimary;
  font-family: 'Inter';
  font-size: 16px;
  font-weight: 400;
}

.Toastify__toast-body {
  padding: 0;
}

.Toastify__toast {
  box-shadow: 0px 0px 1px 0px #01010166;
  box-shadow: 0px 2px 2px 0px #01010133;
  border-radius: 8px;
  padding: 16px;
}

.Toastify__close-button {
  align-self: auto;

  & svg {
    fill: #0e1117;
    width: 18px;
    height: 18px;
  }
}

.Toastify__progress-bar {
  visibility: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
