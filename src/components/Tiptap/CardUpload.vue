<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { useUploadStore } from '~/stores/upload'
import { ROLES } from '~/constants';
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import CardUploadModal from './CardUploadModal.vue'
import CardViewerModal from './CardViewerModal.vue'

interface Props {
  node: {
    attrs: {
      src: string
      title: string
      caption: string
    }
  }
  updateAttributes: (attrs: Partial<Props['node']['attrs']>) => void
  editor: Editor
}

const props = defineProps<Props>()

const { hasEditable } = storeToRefs(useAuthStore())
const { uploadFile } = useUploadStore()

const showModal = ref<boolean>(false)
const showViewerModal = ref<boolean>(false)
const cardTitle = ref<string>('')
const cardDescription = ref<string>('')
const localSrc = ref<string>('')
const reader = ref<FileReader>()
const localFile = ref<File>()
const isLoading = ref<boolean>(false)

const handleModal = () => {
  showModal.value = !showModal.value
}

const handleViewerModal = () => {
  showViewerModal.value = !showViewerModal.value
}

const handleOpenCard = () => {
  handleModal()
}

const handleEnter = () => {
  props.editor.commands.focus()
  props.editor.commands.enter()
}

const handleLoadCard = async () => {
  const route = useRoute()
  isLoading.value = true
  if (localFile.value) {
    const result = (await uploadFile(localFile.value, route.query.tab as string)) as any
    const url = result?.body?.url

    if (typeof url === 'string') {
      props.updateAttributes({
        src: url,
      })
    }
  }

  props.updateAttributes({
    title: cardTitle.value,
    caption: cardDescription.value,
  })

  isLoading.value = false
  props.editor.commands.blur()
  handleModal()
  handleEnter()
}

const caption = ref(props.node.attrs.caption || '')
const title = ref(props.node.attrs.title || '')

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  localFile.value = target.files?.[0]
  if (localFile.value) {
    // props.editor.chain().focus().setImage({ src: url }).run();
    reader.value = new FileReader()
    reader.value.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        localSrc.value = result
      }
    }
    reader.value.readAsDataURL(localFile.value)
  }
}

const editCardHandle = () => {
  cardDescription.value = props.node.attrs.caption
  cardTitle.value = props.node.attrs.title
  localSrc.value = props.node.attrs.src
  handleModal()
}

const removeImage = () => {
  localSrc.value = ''
}

const removeCard = () => {
  props.updateAttributes({
    src: '',
    title: '',
    caption: '',
  })
  caption.value = ''
  title.value = ''
  props.editor.commands.deleteSelection()
}

const copyTitle = () => {
  if (title.value) {
    navigator.clipboard.writeText(title.value)
    useNuxtApp().$toast.info('Название скопировано')
  }
}

watch(
  () => props.node.attrs.caption,
  (newCaption) => {
    caption.value = newCaption || ''
  },
)

watch(
  () => props.node.attrs.title,
  (newTitleText) => {
    title.value = newTitleText || ''
  },
)

onMounted(() => {
  props.editor.commands.blur()
})
</script>

<template>
  <node-view-wrapper>
    <div
      class="card-upload"
      draggable="true"
      data-drag-handle
    >
      <Teleport to="#teleports">
        <Transition name="fade">
          <CardViewerModal
            v-if="showViewerModal"
            :imageSrc="node.attrs.src"
            :title="node.attrs.title"
            :subtitle="node.attrs.caption"
            @handleModal="handleViewerModal"
          />
        </Transition>

        <Transition name="fade">
          <CardUploadModal
            v-if="showModal"
            v-model:title="cardTitle"
            v-model:description="cardDescription"
            :localSrc="localSrc"
            :isLoading="isLoading"
            @removeImage="removeImage"
            @handleFileUpload="handleFileUpload"
            @handleLoadCard="handleLoadCard"
            @handleModal="handleModal"
          />
        </Transition>
      </Teleport>

      <ButtonComponent
        outline
        @click="handleOpenCard"
        v-if="!node.attrs.src"
        >Создать карточку</ButtonComponent
      >
      <div
        class="card"
        @click.prevent="handleViewerModal"
        v-else
      >
        <div
          class="card__header"
          v-if="hasEditable"
        >
          <button
            class="card__header-button"
            @click.stop="editCardHandle"
          >
            <img
              src="~/assets/svg/editPopup.svg"
              alt="edit image"
            />
          </button>
          <button
            class="card__header-button"
            @click.stop="removeCard"
          >
            <img
              src="~/assets/svg/deleteTrash.svg"
              alt="delete image"
            />
          </button>
        </div>
        <div>
          <img
            :src="node.attrs.src"
            alt="file"
            class="card__image"
          />
          <div class="card__wrapper">
            <div
              class="card__title"
              v-if="title"
            >
              <h2 class="card__title-text">{{ title }}</h2>
              <img
                @click.stop="copyTitle"
                class="card__title-icon"
                src="~/assets/svg/cardCopyButton.svg"
                alt="copy image"
              />
            </div>
            <p class="card__subtitle">
              {{ caption }}
            </p>
            <a
              class="card__download-link"
              :href="node.attrs.src"
              :download="node.attrs.src"
              target="_blank"
              @click.stop=""
              v-if="node.attrs.src"
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
    </div>
  </node-view-wrapper>
</template>

<style lang="scss" scoped>
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

  &__buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;

    & button {
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
      top: 120px;
    }
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: $fileCardInput;
    font-weight: 700;
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

    color: $textPrimary;
  }

  &__text {
    color: $textPrimary;
    font-size: 0.875rem;
  }

  &__block {
    position: relative;
  }
}

.image-wrapper {
  overflow: hidden;

  &.image {
    width: 100%;
    height: auto;
    object-fit: cover;
    margin: 0.25rem 0 !important;
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
  cursor: pointer;

  &:hover .card__header {
    visibility: visible;
    opacity: 1;
  }

  &__header {
    visibility: hidden;
    opacity: 0;
    position: absolute;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
    top: 0;
    transition: opacity 0.2s ease;

    &-button {
      margin-top: 8px;
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
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: $textPrimary;
    padding: 8px 16px;
    border-radius: $smallRadius;
    width: fit-content;
    height: fit-content;

    & span {
      color: $bgWhite;
    }

    &_icon {
      margin: 0;
      border: none;
      margin-right: 8px;
    }

    &:hover {
      text-decoration: none;
    }
  }
}
</style>
