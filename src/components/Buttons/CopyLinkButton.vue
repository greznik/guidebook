<script setup lang="ts">
import { useBrowserLocation } from '@vueuse/core'
const location = useBrowserLocation()

const onCopy = () => {
  useNuxtApp().$toast.info('Ссылка скопирована');
  if (location.value.href) {
    navigator.clipboard.writeText(location.value.href)
  }
}
</script>

<template>
  <button
    class="copy-button"
    @click="onCopy"
  >
    <img
      class="copy-button__icon"
      src="~/assets/svg/copyLink.svg"
      alt=""
    />
  </button>
</template>

<style lang="scss" scoped>
.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid $greyNeutral2;
  border-radius: $smallRadius;
  height: 100%;

  &__icon {
    padding: 8px;
  }
}
</style>
