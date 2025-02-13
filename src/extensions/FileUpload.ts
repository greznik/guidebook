import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import FileUpload from '~/components/Tiptap/FileUpload.vue'

export interface FileUploadAttributes {
  file: number
  src: string
  name: string
}

export const FileUploadNode = Node.create<never, FileUploadAttributes>({
  name: 'fileUpload',
  type: 'fileUpload',

  group: 'block',
  selectable: true,

  atom: true,
  draggable: true,

  addAttributes() {
    return {
      size: {
        default: 0,
      },
      src: {
        default: '',
      },
      name: {
        default: '',
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'file-upload',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['file-upload', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    // @ts-ignore
    return VueNodeViewRenderer(FileUpload)
  },
})

export default FileUploadNode
