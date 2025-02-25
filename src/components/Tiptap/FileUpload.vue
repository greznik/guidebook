<script setup lang="ts">
import type { Editor } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/vue-3'

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
    <div class="file-upload__wrapper">
      <img
        class="file-upload__icon"
        src="~/assets/svg/loadDocument.svg"
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
  font-size: 16px;
  line-height: 20px;
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 4px;
  transition: all 0.2s ease;
  cursor: pointer;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
  }

  &:hover {
    background-color: $disabledPrimary;
    border-radius: $smallRadius;
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
