<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['handleModal'])
const props = defineProps<{
  imageSrc: string
  title: string | number
  subtitle: string | number
}>()

const modalRef = ref(null)

onClickOutside(modalRef, (event) => emit('handleModal'))

const copyTitle = () => {
  if (props.title) {
    navigator.clipboard.writeText(String(props.title))
    useNuxtApp().$toast.info('Название скопировано')
  }
}
</script>

<template>
  <div class="card-viewer__backdrop">
    <div
      class="card-viewer"
      ref="modalRef"
    >
      <div class="card-header">
        <div class="card-header__wrapper">
          <button
            class="card-header__button"
            @click="emit('handleModal')"
          >
            <img
              src="~/assets/svg/closeLarge.svg"
              alt="close"
            />
          </button>
        </div>
      </div>
      <div class="image-wrapper">
        <img
          :src="imageSrc"
          alt="preview"
          class="image"
        />
      </div>

      <div class="card">
        <div
          class="card__title"
          v-if="title"
        >
          <h2 class="card__title-text">{{ title }}</h2>
          <img
            @click.self="copyTitle"
            class="card__title-icon"
            src="~/assets/svg/cardCopyButton.svg"
            alt="copy image"
          />
        </div>
        <p class="card__subtitle">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-viewer {
  position: relative;
  background: $bgGrey;
  border-radius: $mediumRadius;
  z-index: 999;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  max-height: calc(100vh - 10%);

  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.image-wrapper {
  border-top-left-radius: $mediumRadius;
  border-top-right-radius: $mediumRadius;
  overflow: hidden;
  max-height: 340px;

  &.image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
}

.card {
  position: relative;
  padding: 24px;
  overflow-y: auto;
  max-height: 400px;

  &-header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    gap: 8px;

    &__wrapper {
      margin-left: auto;
      width: fit-content;
      margin-top: 8px;
      margin-right: 8px;
    }

    &__button {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $disabledPrimary;
      border-radius: $smallRadius;
      background-color: $bgWhite;
      padding: 8px;
    }
  }

  &__title {
    margin-bottom: 8px;
    &-text {
      display: inline;
      word-wrap: break-word;
      font-family: 'Gilroy';
      font-weight: 700;
      font-size: 20px;
      line-height: 24px;
    }

    &-icon {
      cursor: pointer;
      border: none;
      margin: 0;
      margin-left: 12px;
      margin-bottom: -5px;
    }
  }

  &__subtitle {
    font-family: 'Inter';
    word-wrap: break-word;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    color: $textPrimary;
    margin-bottom: 16px;
  }
}
</style>
