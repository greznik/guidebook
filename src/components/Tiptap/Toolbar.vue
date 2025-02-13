<script setup lang="ts">
import { Editor, BubbleMenu } from '@tiptap/vue-3'
import type { EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

interface ContentType {
  name: string
  label: string
  icon: string
  command: () => void
  attrs?: Record<string, unknown>
}

interface TextAction {
  name: string
  label: string
  icon: string
  command: () => void
}

interface Color {
  name: string
  value: string
}

const props = defineProps<{
  editor?: Editor
}>()

const showContentTypeMenu = ref(false)
const showColorMenu = ref(false)
const { getDecodeToken } = storeToRefs(useAuthStore())

const shouldShow: any = (props: {
  editor: Editor
  view: EditorView
  state: EditorState
  oldState?: EditorState
  from: number
  to: number
}) => {
  const { state, from } = props
  const { doc, selection } = state
  const { empty } = selection

  if (empty) return false

  const nodeAtSelection = doc.nodeAt(from)
  if (nodeAtSelection && nodeAtSelection.type.name === 'imageUpload') {
    return false
  }
  if (nodeAtSelection && nodeAtSelection.type.name === 'cardUpload') {
    return false
  }
  if (nodeAtSelection && nodeAtSelection.type.name === 'fileUpload') {
    return false
  }
  if (nodeAtSelection && nodeAtSelection.type.name === 'image') {
    return false
  }
  if (getDecodeToken.value?.role !== 0) {
    return false
  }

  return true
}

const contentTypes: ContentType[] = [
  {
    name: 'paragraph',
    label: 'Текст',
    icon: 'mdi:text',
    command: () => props.editor?.chain().focus().setParagraph().run(),
  },
  {
    name: 'heading',
    label: 'Заголовок',
    icon: 'mdi:format-header-1',
    command: () => props.editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    attrs: { level: 1 },
  },
  {
    name: 'bulletList',
    label: 'Список',
    icon: 'material-symbols-light:format-list-bulleted',
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    label: 'Числовой список',
    icon: 'material-symbols-light:format-list-numbered',
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
  {
    name: 'blockquote',
    label: 'Цитата',
    icon: 'mdi:format-quote-close',
    command: () => props.editor?.chain().focus().toggleBlockquote().run(),
  },
]

const textActions: TextAction[] = [
  {
    name: 'bold',
    label: 'Bold',
    icon: 'material-symbols-light:format-bold',
    command: () => props.editor?.chain().focus().toggleBold().run(),
  },
  {
    name: 'italic',
    label: 'Italic',
    icon: 'material-symbols-light:format-italic',
    command: () => props.editor?.chain().focus().toggleItalic().run(),
  },
  {
    name: 'strike',
    label: 'Strikethrough',
    icon: 'material-symbols-light:format-strikethrough',
    command: () => props.editor?.chain().focus().toggleStrike().run(),
  },
  {
    name: 'bulletList',
    label: 'Список',
    icon: 'material-symbols-light:format-list-bulleted',
    command: () => props.editor?.chain().focus().toggleBulletList().run(),
  },
  {
    name: 'orderedList',
    label: 'Числовой список',
    icon: 'material-symbols-light:format-list-numbered',
    command: () => props.editor?.chain().focus().toggleOrderedList().run(),
  },
]

const colors: Color[] = [
  { name: 'Default', value: 'inherit' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Brown', value: '#92400E' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Yellow', value: '#CA8A04' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Red', value: '#DC2626' },
]

const currentContentType = computed(() => {
  if (props.editor?.isActive('heading', { level: 1 })) return 'Заголовок'
  if (props.editor?.isActive('bulletList')) return 'Список'
  if (props.editor?.isActive('orderedList')) return 'Числовой список'
  if (props.editor?.isActive('blockquote')) return 'Цитата'
  return 'Текст'
})

const toggleContentTypeMenu = () => {
  showContentTypeMenu.value = !showContentTypeMenu.value
  showColorMenu.value = false
}

const toggleColorMenu = () => {
  showColorMenu.value = !showColorMenu.value
  showContentTypeMenu.value = false
}

const setContentType = (command: () => void) => {
  command()
  showContentTypeMenu.value = false
}

const setTextColor = (color: string) => {
  props.editor?.chain().focus().setColor(color).run()
  showColorMenu.value = false
}
</script>

<template>
  <bubble-menu
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    :shouldShow="shouldShow"
    v-if="editor"
    class="toolbar"
  >
    <div class="toolbar__menu">
      <button
        @click="toggleContentTypeMenu"
        :class="{ active: showContentTypeMenu }"
        class="toolbar__menu-button"
      >
        {{ currentContentType }}
        <Icon
          name="mdi:chevron-down"
          class="toolbar__menu-icon"
        />
      </button>
      <div
        v-if="showContentTypeMenu"
        class="toolbar__menu-content"
      >
        <button
          v-for="type in contentTypes"
          :key="type.name"
          @click="setContentType(type.command)"
          :class="{
            active: editor.isActive(type.name, type.attrs),
          }"
          class="toolbar__menu-item"
        >
          <div class="toolbar__menu-wrapper">
            <Icon
              :name="type.icon"
              class="toolbar__menu-wrapper_icon"
            />
          </div>
          <span class="toolbar__menu-label">{{ type.label }}</span>
        </button>
      </div>
    </div>
    <div class="toolbar__separator"></div>
    <div class="toolbar__actions">
      <button
        v-for="action in textActions"
        :key="action.name"
        @click="action.command()"
        :class="{
          active: editor.isActive(action.name),
        }"
        :title="action.label"
        class="toolbar__actions-button"
      >
        <Icon
          :name="action.icon"
          class="toolbar__actions-icon"
        />
      </button>
    </div>
    <div class="toolbar__colors">
      <button
        @click="toggleColorMenu"
        :class="{ 'bg-gray-100/80 text-gray-900': showColorMenu }"
        class="toolbar__colors-toggle"
        title="Text color"
      >
        <Icon
          name="material-symbols-light:format-color-text"
          class="toolbar__colors-icon"
        />
      </button>
      <div
        v-if="showColorMenu"
        class="toolbar__colormenu"
      >
        <button
          v-for="color in colors"
          :key="color.name"
          @click="setTextColor(color.value)"
          :class="{
            active: editor.isActive('textStyle', {
              color: color.value,
            }),
          }"
          class="toolbar__colormenu-button"
        >
          <span
            class="toolbar__colormenu-view"
            :style="{ backgroundColor: color.value }"
          ></span>
          <span class="toolbar__colormenu-name">{{ color.name }}</span>
        </button>
      </div>
    </div>
  </bubble-menu>
</template>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  padding: 0.25rem;
  margin-bottom: 0.625rem;
  border-radius: 0.375rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &__menu {
    display: flex;
    position: relative;
    align-items: center;

    &.active {
      background-color: rgb(243 244 246 / 0.8);
    }

    &-button {
      display: flex;
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      padding-left: 0.625rem;
      padding-right: 0.625rem;
      align-items: center;
      border-radius: 0.25rem;
      font-size: 0.875rem;
      line-height: 1.25rem;

      &:hover {
        background-color: rgb(243, 244, 246, 0.8);
      }
    }

    &-icon {
      margin-left: 0.25rem;
      height: 0.875rem;
      width: 0.875rem;
    }

    &-content {
      position: absolute;
      left: 0px;
      top: 100%;
      z-index: 10;
      min-width: 140px;
      border-radius: 0.375rem;
      background-color: rgb(255, 255, 255);
      padding-top: 0.375rem;
      padding-bottom: 0.375rem;
      box-shadow: 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0, 0, 0, 0.1), 0 2px 4px -2px rgb(0, 0, 0, 0.1);
    }

    &-item {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      border-radius: 0.25rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      text-align: left;
      background-color: rgb(243, 244, 246, 0.8);

      &.active {
        border-radius: 0.25rem;
        background-color: rgb(243, 244, 246, 0.8);
      }
    }

    &-wrapper {
      display: grid;
      height: 1.25rem;
      width: 1.25rem;
      place-items: center;
      border-radius: 9999px;
      border-width: 1px;
      border-color: rgb(229, 231, 235);

      &_icon {
        height: 0.625rem;
        width: 0.625rem;
      }
    }

    &-label {
      margin-left: 0.5rem;
      flex-grow: 1;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }

  &_separator {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
    margin-top: auto;
    margin-bottom: auto;
    height: 2rem;
    width: 1px;
    background-color: rgb(229, 231, 235, 0.7);
  }

  &__actions {
    display: flex;
    align-items: center;
    margin-right: calc(0.5rem * 0);
    margin-left: calc(0.5rem * calc(1 - 0));

    &-button {
      display: grid;
      height: 2rem;
      width: 2rem;
      place-items: center;
      border-radius: 0.25rem;
      background-color: rgb(243, 244, 246, 0.8);

      &.active {
        background-color: rgb(243, 244, 246, 0.8);
        color: rgb(17, 24, 39);
      }
    }

    &-icon {
      height: 1.25rem;
      width: 1.25rem;
    }
  }

  &__colors {
    display: flex;
    align-items: center;
    position: relative;

    &-toggle {
      display: grid;
      height: 2rem;
      width: 2rem;
      place-items: center;
      border-radius: 0.25rem;
      background-color: rgb(243, 244, 246, 0.8);
    }

    &-icon {
      height: 1.25rem;
      width: 1.25rem;
    }
  }

  &__colormenu {
    position: absolute;
    left: 0px;
    top: 100%;
    z-index: 10;
    border-radius: 0.375rem;
    background-color: rgb(255, 255, 255);
    padding-top: 0.375rem;
    padding-bottom: 0.375rem;
    box-shadow: 0 0 #0000, 0 0 #0000, 0 4px 6px -1px rgb(0, 0, 0, 0.1), 0 2px 4px -2px rgb(0, 0, 0, 0.1);

    &-button {
      display: flex;
      width: 100%;
      align-items: center;
      border-radius: 0.25rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
      text-align: left;
      background-color: rgb(243, 244, 246, 0.8);

      &.active {
        background-color: rgb(243, 244, 246, 0.8);
      }
    }

    &-view {
      margin-right: 0.5rem;
      height: 1rem;
      width: 1rem;
      border-radius: 9999px;
      border-width: 2px;
      border-color: rgb(229, 231, 235);
    }

    &-name {
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 500;
      color: rgb(75, 85, 99);
    }
  }
}
</style>
