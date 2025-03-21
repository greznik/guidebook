<script setup lang="ts">
import Modal from '~/components/Modals/Modal.vue'
import CustomInput from '~/components/Inputs/CustomInput.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'

import { MAX_EDITOR_CARD_TITLE_SYMBOLS, MAX_EDITOR_CARD_SUBTITLE_SYMBOLS } from '~/constants'

const emit = defineEmits([
  'handleModal',
  'handleImageUpload',
  'handleFileUpload',
  'handleLoadCard',
  'removeImage',
  'removeFile',
])
const props = defineProps<{
  isLoading: boolean
  imageSrc: string
  imageName: string
  fileSrc: string
  fileName: string
}>()

const cardTitle = defineModel<string | number>('title', { required: true })
const cardDescription = defineModel<string | number>('description', { required: true })

const imageInput = ref<HTMLInputElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const titleInputLength = ref<number>(0)
const subtitleInputLength = ref<number>(0)
const isNotNewCard = ref<boolean>(false)

const triggerImageInput = () => {
  imageInput.value?.click()
}
const triggerFileInput = () => {
  fileInput.value?.click()
}

const checkMaxLength = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.id === 'textarea') {
    subtitleInputLength.value = target.value.length
  } else {
    titleInputLength.value = target.value.length
  }
}

onMounted(() => {
  subtitleInputLength.value = String(cardDescription.value).length
  titleInputLength.value = String(cardTitle.value).length

  if (cardTitle.value || cardDescription.value) {
    isNotNewCard.value = true
  }
})
</script>

<template>
  <Modal
    label="Карточка объекта"
    @handleModal="emit('handleModal')"
  >
    <div class="wrapper">
      <input
        type="file"
        accept="image/*"
        @change="emit('handleImageUpload', $event)"
        ref="imageInput"
        class="card-upload__input"
      />
      <input
        type="file"
        multiple
        @change="emit('handleFileUpload', $event)"
        ref="fileInput"
        class="card-upload__input"
      />
      <div class="card-upload__placeholder">
        <button
          @click.prevent="triggerImageInput"
          class="card-upload__button"
        >
          <template v-if="!imageSrc">
            <img
              src="~/assets/svg/folderLoad.svg"
              alt="fileLoad"
              class="card-upload__icon"
            />
            <span class="card-upload__text">Добавить изображение*</span>
          </template>
          <template v-else>
            <img
              :src="imageSrc"
              :alt="imageSrc"
              class="card-upload__preview"
            />
            <span class="card-upload__text">{{ imageName }}</span>

            <button
              class="card-upload__remove"
              @click.stop="emit('removeImage')"
            >
              <img
                src="~/assets/svg/closeLarge.svg"
                alt="delete image"
              />
            </button>
          </template>
        </button>
        <button
          @click.prevent="triggerFileInput"
          class="card-upload__button"
        >
          <template v-if="!fileSrc">
            <img
              src="~/assets/svg/folderLoad.svg"
              alt="fileLoad"
              class="card-upload__icon"
            />
            <span class="card-upload__text">Добавить файл</span>
          </template>
          <template v-else>
            <Icon
              name="bx:file"
              class="card-upload__icon"
            />
            <span class="card-upload__text">{{ fileName }}</span>

            <button
              class="card-upload__remove"
              @click.stop="emit('removeFile')"
            >
              <img
                src="~/assets/svg/closeLarge.svg"
                alt="delete image"
              />
            </button>
          </template>
        </button>
      </div>
      <!-- <div
      v-else
      class="image-block"
    >
      <div class="image-wrapper">
        <button
          class="card__header-button"
          @click.stop="emit('removeImage')"
        >
          <img
            src="~/assets/svg/deleteTrash.svg"
            alt="delete image"
          />
        </button>
        <img
          :src="localSrc"
          :alt="localSrc"
          class="image-wrapper__image"
        />
      </div>
    </div> -->
      <div class="card-upload__inputs">
        <CustomInput
          class="card-upload__info"
          name="text"
          inputOnly
          type="text"
          v-model="cardTitle"
          placeholder="Название*"
          @inputChange="checkMaxLength"
          :maxLength="MAX_EDITOR_CARD_TITLE_SYMBOLS"
        />
        <span class="card-upload__maxlength">{{ titleInputLength }}/{{ MAX_EDITOR_CARD_TITLE_SYMBOLS }}</span>
      </div>
      <div class="card-upload__inputs">
        <CustomInput
          class="card-upload__info"
          name="textarea"
          inputOnly
          type="textarea"
          placeholder="Описание"
          v-model="cardDescription"
          @inputChange="checkMaxLength"
          :maxLength="MAX_EDITOR_CARD_SUBTITLE_SYMBOLS"
        />
        <span class="card-upload__maxlength textarea"
          >{{ subtitleInputLength }}/{{ MAX_EDITOR_CARD_SUBTITLE_SYMBOLS }}</span
        >
      </div>
      <div class="card-upload__buttons">
        <ButtonComponent
          :disabled="!imageSrc || isLoading || !cardTitle"
          @click="emit('handleLoadCard')"
        >
          {{ isNotNewCard ? 'Сохранить' : 'Создать' }}</ButtonComponent
        >
        <ButtonComponent
          @click="emit('handleModal')"
          outline
        >
          Отмена
        </ButtonComponent>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 476px;

  @media screen and (max-width: $medium) {
    width: auto;
  }
}
.card-upload {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: fit-content;
  padding: 1rem 0;

  &__input {
    display: none;
  }

  &__placeholder {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 24px;
  }

  &__info {
    margin-bottom: 32px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  &__info:last-child {
    margin-bottom: 48px;
  }

  &__inputs {
    position: relative;
  }

  &__remove {
    margin-left: auto;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;

    & button {
      font-size: 16px;
      width: auto;
    }
  }

  &__maxlength {
    position: absolute;
    right: 0;
    top: 50px;
    font-family: 'Inter';
    color: $textSecondary;
    font-size: 12px;
    line-height: 14px;

    &.textarea {
      top: 128px;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: $fileCardInput;
    font-weight: 700;
    max-height: 72px;
    font-family: 'Inter';
    padding: 24px;
    border-radius: $smallRadius;
    width: 100%;
    transition: background-color 150ms ease-in-out;

    &:hover {
      background-color: $cardHoverButton;
    }
  }

  &__icon {
    margin-right: 16px;
    height: 24px;
    width: 24px;
    color: $textPrimary;
  }

  &__preview {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  &__text {
    color: $textPrimary;
    font-weight: 600;
    line-height: 20px;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  &__block {
    position: relative;
  }
}

.image-wrapper {
  position: relative;
  overflow: hidden;
  max-width: 450px;

  &__image {
    width: 100%;
    height: auto;
    margin-bottom: 24px !important;
    object-fit: cover;
    border: none;
  }
}

.card {
  position: relative;
  background-color: $cardBg;
  max-width: 400px;
  border-radius: $smallRadius;
  box-shadow: 0px 0px 8px 0px #0101011a;
  box-shadow: 0px 2px 4px 0px #01010133;
  transition: box-shadow 0.2s ease;

  &:hover .card__header {
    visibility: visible;
    opacity: 1;
  }

  &__image {
    width: 100%;
    margin: 0;

    border: none;
    border-top-left-radius: $smallRadius;
    border-top-right-radius: $smallRadius;
  }

  &__wrapper {
    padding: 16px;
  }

  &__title {
    margin-bottom: 8px;
    &-text {
      display: inline;
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
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: $textPrimary;
    margin-bottom: 16px;
  }

  &__download-link {
    &:hover {
      text-decoration: none;
    }
  }

  &__load-button {
    width: auto;

    & span {
      color: $bgWhite;
    }

    &_icon {
      margin: 0;
      border: none;
      margin-right: 8px;
    }
  }
}

.card__header-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background-color: $white;
  padding: 8px;
  border-radius: $smallRadius;

  &:last-child {
    margin-right: 8px;
  }

  & img {
    border: none;
    margin: 0;
  }
}
</style>
