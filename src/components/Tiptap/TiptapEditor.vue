<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import StarterKit from '@tiptap/starter-kit'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import { useAuthStore } from '~/stores/auth'
import Toolbar from '~/components/Tiptap/Toolbar.vue'
import Commands from '~/extensions/Commands'
import suggestion from '~/extensions/Suggestion'
import Image from '@tiptap/extension-image'
import ImageUpload from '~/extensions/ImageUpload'
import CardUpload from '~/extensions/CardUpload'
import FileUpload from '~/extensions/FileUpload'
import Link from '@tiptap/extension-link'
import { useEditor, EditorContent } from '@tiptap/vue-3'

const props = defineProps<{
  content: any
}>()
const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp']
const emit = defineEmits(['isChangeContent'])
const route = useRoute()
const { updateSheet } = useSheetsStore()
const { uploadFile } = useUploadStore()

const updateTabContent = useDebounceFn(async (editor) => {
  emit('isChangeContent')
  const tabId = route.query.tab as string
  const html = editor.getHTML()
  if (tabId) {
    await updateSheet(html, tabId, 'html')
  }
}, 1000)

const createDropFileLink = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.items && editor.value) {
    const position = editor.value?.view.posAtCoords({ top: event.clientY, left: event.clientX })
    if (!position) {
      return
    }

    ;[...event.dataTransfer.items].forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile()

        if (file) {
          const fileType = file['type']

          const reader = new FileReader()
          reader.onload = async () => {
            const result = (await uploadFile(file, route.query.tab as string)) as any
            const url = result?.body?.url
            if (typeof url === 'string') {
              if (validImageTypes.includes(fileType)) {
                editor.value
                  ?.chain()
                  .focus()
                  .insertContentAt(position.pos, {
                    type: 'imageUpload',
                    attrs: { src: url, alt: '', caption: '' },
                  })
                  .run()
              } else {
                editor.value
                  ?.chain()
                  .focus()
                  .insertContentAt(position.pos, {
                    type: 'fileUpload',
                    attrs: { size: file.size, src: url, name: file.name },
                  })
                  .run()
              }

              editor.value?.commands.blur()
            }
          }
          reader.readAsDataURL(file)
        }
      }
    })
  }
}

const editor = useEditor({
  content: props.content,
  onDrop: (event, slice, moved) => {
    if (slice.content.childCount || moved) {
      return
    }
    createDropFileLink(event)
  },
  onUpdate({ editor }) {
    updateTabContent(editor)
  },
  extensions: [
    StarterKit,
    Color,
    TextStyle,
    Link,
    Image.configure({}),
    ImageUpload,
    FileUpload,
    CardUpload,
    Placeholder.configure({
      placeholder: 'Введите текст или "/" для меню',
    }),

    Commands.configure({
      suggestion,
    }),
  ],
})

const { getDecodeToken } = storeToRefs(useAuthStore())

watch(
  () => getDecodeToken.value,
  (value) => {
    editor.value?.setEditable(value?.role === 0)
  },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(
  () => props.content,
  (value) => {
    editor?.value?.commands.setContent(value)
  },
)

onMounted(() => {
  editor.value?.setEditable(getDecodeToken.value?.role === 0)
})
</script>

<template>
  <div class="editor-container">
    <Toolbar :editor="editor" />
    <EditorContent
      :editor="editor"
      class="prose"
    />
  </div>
</template>

<style lang="scss">
.image {
  max-width: 100%;
  position: relative;
}
.tiptap {
  outline: none;

  & p {
    line-height: 24px;
    font-weight: 400;
    font-size: 16px;
    font-family: 'Inter';
    color: $textSecondary;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:not(:first-child) {
      margin-top: 32px;
    }
  }

  h2 {
    font-size: 20px;
    font-family: 'Gilroy';
    font-weight: 700;
    line-height: 24px;
    margin-bottom: 12px;
  }
}

.tiptap h3 {
  font-size: 1.5rem;
}

.tiptap h4 {
  font-size: 1.25rem;
}

.tiptap h5 {
  font-size: 1rem;
}

.tiptap h6 {
  font-size: 0.875rem;
}

.tiptap strong {
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  color: #22242d;
}

.tiptap ul {
  list-style: disc;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.tiptap ul li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.tiptap ol {
  list-style: decimal;
  padding-left: 1.5rem;
  margin: 1rem 0;
}

.tiptap blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1rem;
  color: #666;
  font-style: italic;
  margin: 1rem 0;
}

.tiptap ul,
.tiptap ol {
  margin: 1rem 0 1rem 2rem;
}

.tiptap li {
  margin-bottom: 0.5rem;
}

.tiptap p code {
  color: rgb(231, 41, 161);
  background: #fcf8f8;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.tiptap pre {
  background-color: #fcf8f8cc;
  border-radius: 6px;
  margin: 1em 0;
  padding: 10px;
  overflow: hidden;
}

.tiptap pre code {
  display: block;
  padding: 1em;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9em;
  line-height: 1.5;
  color: #24292e;
}

.tiptap hr {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 2rem 0;
}

.tiptap img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 1rem 0;
  object-fit: contain;
}

.tiptap a {
  color: $softRed;
  cursor: pointer;

  &:hover {
    color: $softRed;
    text-decoration: underline $softRed;
  }
}

.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.ProseMirror-selectednode .image-wrapper__image {
  box-shadow: 0px 0px 20px 0px #0101011a;
  box-shadow: 0px 8px 12px 0px #01010133;
}

.ProseMirror-selectednode .card {
  box-shadow: 0px 0px 20px 0px #0101011a;
  box-shadow: 0px 8px 12px 0px #01010133;
}

.ProseMirror-selectednode .file-upload {
  box-shadow: 0px 0px 20px 0px #0101011a;
  box-shadow: 0px 8px 12px 0px #01010133;
  border-radius: 8px;
}
</style>
