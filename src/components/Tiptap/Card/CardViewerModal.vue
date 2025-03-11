<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['handleModal'])
const props = defineProps<{
  imageSrc: string
  imageName: string
  fileSrc: string
  fileName: string
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
          <a
            class="card-header__button"
            :href="imageSrc"
            :download="imageName"
            target="_blank"
            @click.stop=""
          >
            <img
              src="~/assets/svg/cardDownload.svg"
              alt=""
            />
          </a>
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
        <div class="card-scroll__wrapper">
          <div
            class="card__title"
            v-if="title"
          >
            <h2 class="card__title-text">{{ title }}</h2>
          </div>
          <p class="card__subtitle">
            {{ subtitle }}
          </p>
        </div>
        <a
          v-if="fileSrc"
          class="card__download-link"
          :href="fileSrc"
          :download="fileName"
          target="_blank"
          @click.stop=""
        >
          <img
            class="card__download-link_icon"
            src="~/assets/svg/cardDownload.svg"
            alt=""
          />
          <span>Скачать</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-viewer {
  position: relative;
  background: $bgWhite;
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

  &.image {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
}

.card {
  position: relative;
  padding: 24px;
  padding-right: 0;

  &-scroll__wrapper {
    max-height: 170px;
    padding-right: 24px;
    overflow-y: auto;
  }

  &-header {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    gap: 8px;

    &__wrapper {
      display: flex;
      gap: 8px;
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
      background-color: $white;
      padding: 8px;

      & img {
        border: none;
        margin: 0;
      }
    }
  }

  &__title {
    margin-bottom: 8px;
    &-text {
      display: inline;
      word-wrap: break-word;
      color: $textPrimary;
      font-weight: 600;
      font-size: 20px;
      line-height: 24px;
    }

    &-icon {
      cursor: pointer;
      border: none;
      margin: 0;
      margin-left: 8px;
      margin-bottom: -2px;
    }
  }

  &__download-link {
    display: inline-flex;
    justify-content: center;
    gap: 8px;
    font-size: 16px;
    line-height: 20px;
    color: $textPrimary;
    padding: 8px 16px;
    border: 1px solid $borderButton;
    border-radius: $smallRadius;
    margin-top: 20px;

    &:hover {
      text-decoration: none;
    }
  }

  &__subtitle {
    font-family: 'Inter';
    word-wrap: break-word;
    white-space: break-spaces;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    color: $textSecondary;
  }
}

.image-wrapper {
  max-height: 50vh;
}
</style>
