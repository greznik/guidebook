import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import type { Instance as TippyInstance } from 'tippy.js'
import { Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import CommandsList from '~/components/Tiptap/CommandList.vue'

interface SuggestionItem {
  name: string
  icon: string
  command: (props: { editor: Editor; range: Range }) => void
}

interface SuggestionProps {
  query: string
  editor: Editor
  range: Range
  clientRect: () => DOMRect
}

const items: SuggestionItem[] = [
  {
    name: 'Заголовок',
    icon: 'mdi:format-header-2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
    },
  },
  {
    name: 'Список',
    icon: 'mdi:format-list-bulleted',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run()
    },
  },
  {
    name: 'Числовой список',
    icon: 'mdi:format-list-numbered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run()
    },
  },
  {
    name: 'Цитата',
    icon: 'mdi:format-quote-close',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run()
    },
  },
  {
    name: 'Картинка',
    icon: 'mdi:image',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent('<image-upload></image-upload>').run()

      editor.commands.setTextSelection(editor.state.selection.to)
      editor.commands.blur()
    },
  },
  {
    name: 'Карточка',
    icon: 'mdi:card',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent('<card-upload></card-upload>').run()

      editor.commands.setTextSelection(editor.state.selection.to)
      editor.commands.blur()
    },
  },
  {
    name: 'Файл',
    icon: 'mdi:file',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent('<file-upload></file-upload>').run()

      editor.commands.setTextSelection(editor.state.selection.to)
      editor.commands.blur()
    },
  },
  {
    name: 'Разделитель',
    icon: 'mdi:minus',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run()
    },
  },
]

export const suggestion = {
  items: ({ query }: { query: string }): SuggestionItem[] => {
    return items.filter((item) => item.name.toLowerCase().startsWith(query.toLowerCase()))
  },

  render: () => {
    let component: VueRenderer
    let popup: TippyInstance

    return {
      onStart: (props: SuggestionProps) => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }
        // @ts-ignore
        popup = tippy(document.body, {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup.setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        if (props.event.key === 'Escape') {
          popup.hide()
          return true
        }

        return component.ref?.onKeyDown(props.event)
      },

      onExit() {
        popup.destroy()
        component.destroy()
      },
    }
  },
}

export default suggestion
