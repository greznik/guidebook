<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/vue-3'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'

interface Props {
  node: {
    attrs: {
      size: number
      src: string
      name: string
    }
  }
  updateAttributes: (attrs: Partial<Props['node']['attrs']>) => void
  editor: Editor
}

const { uploadFile } = useUploadStore()

const fileInput = ref<HTMLInputElement | null>(null)

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
          name: file.name,
        })
      }
    }
    handleEnter()
    reader.readAsDataURL(file)
  }
}

const props = defineProps<Props>()

const handleEnter = () => {
  props.editor.commands.focus()
  props.editor.commands.enter()
}

onMounted(() => {
  // handleEnter()
})
</script>

<template>
  <NodeViewWrapper class="file-upload">
    <template v-if="!node.attrs.src">
      <input
        type="file"
        multiple
        @change="handleFileUpload"
        ref="fileInput"
        class="file-upload__input"
      />
      <ButtonComponent
        outline
        class="file-upload__button"
        @click="triggerFileInput"
        >Выбери файл</ButtonComponent
      >
    </template>
    <div
      v-else
      class="file-upload__wrapper"
    >
      <img
        class="file-upload__icon"
        src="~/assets/svg/cardDownload.svg"
        alt="load"
      />
      <a
        class="file-upload__link"
        :href="props.node.attrs.src"
        :download="props.node.attrs.src"
        target="_blank"
      >
        {{ props.node.attrs.name }}
      </a>
      <p class="file-upload__size">{{ (props.node.attrs.size / Math.pow(1024, 1)).toFixed(2) }}KB</p>
    </div>
  </NodeViewWrapper>
</template>

<style lang="scss" scoped>
.file-upload {
  display: inline-block;
  width: 100%;
  font-size: 16px;
  line-height: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  transition: all 0.2s ease;
  cursor: pointer;

  &__input {
    display: none;
  }

  &__button {
    width: auto;
    font-size: 16px;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 4px;
    gap: 8px;

    &:hover {
      background-color: $disabledPrimary;
      border-radius: $smallRadius;
    }
  }

  &__link {
    font-weight: 700;
    color: $textPrimary;
  }

  &__size {
    font-weight: 400;
    color: $placeholderGrey;
  }

  &__icon {
    border: none;
    margin: 0;
  }
}
</style>
