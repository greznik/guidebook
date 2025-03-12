<script setup lang="ts">
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import Loader from '~/components/Loader/Loader.vue'
import { NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { useUploadStore } from '~/stores/upload'

interface Props {
  node: {
    attrs: {
      src: string | null
      alt: string | undefined
      caption: string | null
    }
  }
  updateAttributes: (attrs: Partial<Props['node']['attrs']>) => void
  editor: Editor
}

const props = defineProps<Props>()
const { uploadFile } = useUploadStore()

const fileInput = ref<HTMLInputElement | null>(null)
const caption = ref(props.node.attrs.caption || '')
const altText = ref(props.node.attrs.alt || '')
const showAltText = ref(false)
const isImageLoaded = ref(false)

const inputText = computed({
  get: () => (showAltText.value ? altText.value : caption.value),
  set: (value: string) => {
    if (showAltText.value) {
      altText.value = value
    } else {
      caption.value = value
    }
  },
})

const onImageLoad = () => {
  isImageLoaded.value = true
}

const handleEnter = () => {
  updateText()
  props.editor.commands.focus()
  props.editor.commands.enter()
}

const updateText = () => {
  showAltText.value ? updateAltText() : updateCaption()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const route = useRoute()
  const file = target.files?.[0]
  if (file) {
    // props.editor.chain().focus().setImage({ src: url }).run();
    const reader = new FileReader()
    reader.onload = async (e) => {
      const result = (await uploadFile(file, route.query.tab as string)) as any
      const url = result?.body?.url

      if (typeof url === 'string') {
        props.updateAttributes({
          src: url,
          alt: file.name,
        })
        altText.value = file.name
      }
    }
    handleEnter()
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  props.updateAttributes({
    src: null,
    alt: undefined,
    caption: null,
  })
  caption.value = ''
  altText.value = ''
}

const updateCaption = () => {
  props.updateAttributes({
    caption: caption.value,
  })
}

const updateAltText = () => {
  props.updateAttributes({
    alt: altText.value,
  })
}

const toggleAltText = () => {
  showAltText.value = !showAltText.value
}

watch(
  () => props.node.attrs.caption,
  (newCaption) => {
    caption.value = newCaption || ''
  },
)

watch(
  () => props.node.attrs.alt,
  (newAltText) => {
    altText.value = newAltText || ''
  },
)

onMounted(() => {
  props.editor.commands.blur()
})
</script>

<template>
  <node-view-wrapper class="image-upload">
    <template v-if="!node.attrs.src">
      <input
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        ref="fileInput"
        class="image-upload__input"
      />
      <ButtonComponent
        outline
        class="image-upload__button"
        @click="triggerFileInput"
        >Выберите картинку</ButtonComponent
      >
    </template>
    <img
      v-else
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      @load="onImageLoad"
      class="image"
    />
    <!-- <template v-else>
      <Loader v-if="!isImageLoaded" />
      <img
        v-else
        :src="node.attrs.src"
        :alt="node.attrs.alt"
        @load="onImageLoad"
        class="image"
      />
    </template> -->
  </node-view-wrapper>
</template>

<style lang="scss" scoped>
.image-upload {
  width: fit-content;
  margin: 24px 0;

  &__input {
    display: none;
  }

  &__button {
    width: auto;
    font-size: 16px;
  }

  &__icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
    color: $textSecondary;
  }

  &__text {
    color: $textSecondary;
    font-size: 0.875rem;
  }

  &__block {
    position: relative;
  }
}

.image {
  height: auto;
  object-fit: cover;
  transition: box-shadow 0.2s ease;
}
</style>
