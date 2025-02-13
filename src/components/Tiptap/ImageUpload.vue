<script setup lang="ts">
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
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
          src: result,
          alt: file.name,
        })
        altText.value = file.name
      }
    }
    // handleEnter()
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
    <input
      type="file"
      accept="image/*"
      @change="handleFileUpload"
      ref="fileInput"
      class="image-upload__input"
    />
    <ButtonComponent
      outline
      @click="triggerFileInput"
      v-if="!node.attrs.src"
      >Нажмите, чтобы выбрать картинку</ButtonComponent
    >
    <div
      v-else
      class="image-block"
    >
      <div class="image-wrapper">
        <img
          :src="node.attrs.src"
          :alt="node.attrs.alt"
          class="image-wrapper__image"
        />
      </div>
    </div>
  </node-view-wrapper>
</template>

<style lang="scss" scoped>
.image-upload {
  max-width: 100%;
  width: 100%;

  &__input {
    display: none;
  }

  &__button {
    background-color: $greyNeutral;
    color: #1f2937;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 4rem;
    transition: background-color 150ms ease-in-out;

    &:hover {
      background-color: $bgWhite;
    }
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

.image-wrapper {
  &__image {
    height: auto;
    object-fit: cover;
    transition: box-shadow 0.2s ease;
  }
}
</style>
