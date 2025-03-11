<script setup lang="ts">
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { useUploadStore } from '~/stores/upload'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import CardUploadModal from './CardUploadModal.vue'
import CardViewerModal from './CardViewerModal.vue'

interface Props {
  node: {
    attrs: {
      imageSrc: string
      fileSrc: string
      title: string
      caption: string
      imageName: string
      fileName: string
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
const reader = ref<FileReader>()
const localImage = ref<File>()
const localFile = ref<File>()
const isLoading = ref<boolean>(false)

const caption = ref(props.node.attrs.caption || '')
const title = ref(props.node.attrs.title || '')

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
  if (localImage.value) {
    const result = (await uploadFile(localImage.value, route.query.tab as string)) as any
    const url = result?.body?.url

    if (typeof url === 'string') {
      props.updateAttributes({
        imageSrc: url,
      })
    } else {
      useNuxtApp().$toast.error('Не удалось загрузить картинку')
    }
  }
  if (localFile.value) {
    const result = (await uploadFile(localFile.value, route.query.tab as string)) as any
    const url = result?.body?.url

    if (typeof url === 'string') {
      props.updateAttributes({
        fileSrc: url,
      })
    } else {
      useNuxtApp().$toast.error('Не удалось загрузить файл')
    }
  }

  props.updateAttributes({
    title: cardTitle.value,
    caption: cardDescription.value,
  })

  isLoading.value = false
  handleModal()
  // handleEnter()
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  localImage.value = target.files?.[0]
  if (localImage.value) {
    props.updateAttributes({
      imageName: localImage.value.name,
    })
    // props.editor.chain().focus().setImage({ src: url }).run();
    reader.value = new FileReader()
    reader.value.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        props.updateAttributes({
          imageSrc: result,
        })
      }
    }
    reader.value.readAsDataURL(localImage.value)
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  localFile.value = target.files?.[0]
  if (localFile.value) {
    props.updateAttributes({
      fileName: localFile.value.name,
    })
    reader.value = new FileReader()
    reader.value.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        props.updateAttributes({
          fileSrc: result,
        })
      }
    }
    reader.value.readAsDataURL(localFile.value)
  }
}

const editCardHandle = () => {
  cardDescription.value = props.node.attrs.caption
  cardTitle.value = props.node.attrs.title
  handleModal()
}

const removeImage = () => {
  props.updateAttributes({
    imageSrc: '',
    imageName: '',
  })
}

const removeFile = () => {
  props.updateAttributes({
    fileSrc: '',
    fileName: '',
  })
}

const removeCard = () => {
  props.updateAttributes({
    imageSrc: '',
    fileSrc: '',
    title: '',
    caption: '',
    imageName: '',
    fileName: '',
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
  <node-view-wrapper
    draggable="true"
    data-drag-handle
    class="card-upload"
  >
    <Teleport to="#teleports">
      <Transition name="fade">
        <CardViewerModal
          v-if="showViewerModal"
          :imageSrc="node.attrs.imageSrc"
          :imageName="node.attrs.imageName"
          :fileSrc="node.attrs.fileSrc"
          :fileName="node.attrs.fileName"
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
          :imageSrc="node.attrs.imageSrc"
          :imageName="node.attrs.imageName"
          :fileSrc="node.attrs.fileSrc"
          :fileName="node.attrs.fileName"
          :isLoading="isLoading"
          @removeImage="removeImage"
          @removeFile="removeFile"
          @handleImageUpload="handleImageUpload"
          @handleFileUpload="handleFileUpload"
          @handleLoadCard="handleLoadCard"
          @handleModal="handleModal"
        />
      </Transition>
    </Teleport>
    <div
      class="card"
      @click.prevent="handleViewerModal"
      v-if="node.attrs.imageSrc && node.attrs.title"
    >
      <div class="card__header">
        <template v-if="hasEditable">
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
        </template>
      </div>
      <div class="image-wrapper">
        <img
          :src="node.attrs.imageSrc"
          alt="file"
          class="card__image"
        />
      </div>
      <div class="card__wrapper">
        <h2 class="card__title">{{ title }}</h2>
        <p
          v-if="caption"
          class="card__subtitle"
          v-html="caption"
        ></p>

        <a
          v-if="node.attrs.fileSrc"
          class="card__download-link"
          :href="node.attrs.fileSrc"
          :download="node.attrs.fileName"
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

    <ButtonComponent
      outline
      v-else
      @click="handleOpenCard"
      class="card-upload__button_add"
      >Создать карточку</ButtonComponent
    >
  </node-view-wrapper>
</template>

<style lang="scss" scoped>
.card-upload {
  display: inline-flex;
  flex-direction: column;
  gap: 24px;
  width: fit-content;
  margin: 24px 0;
  margin-right: 24px;

  &__button_add {
    font-size: 16px;
  }

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
  background-color: $bgWhite;
  max-width: 400px;
  border-radius: $smallRadius;
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
      display: flex;
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
    display: block;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    margin: 16px;
  }

  &__title {
    font-family: 'Inter';
    display: inline;
    color: $textPrimary;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;

    &-icon {
      cursor: pointer;
      border: none;
      margin: 0;
      margin-left: 8px;
      margin-bottom: -2px;
    }
  }

  &__subtitle {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    margin-top: 8px;

    display: -webkit-box;
    white-space: break-spaces;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: $textSecondary;
  }

  &__download-link {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #6b7280;
    border-radius: $ultraSmallRadius;
    padding: 8px 16px;
    font-size: 16px;
    border-radius: $smallRadius;
    width: fit-content;
    height: fit-content;
    margin-top: 16px;

    & span {
      color: $textPrimary;
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
