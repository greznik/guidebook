import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CardUpload from '~/components/Tiptap/Card/CardUpload.vue'

export interface CardUploadAttributes {
  src: string
  title: string
  caption: string
}

export const CardUploadNode = Node.create<never, CardUploadAttributes>({
  name: 'cardUpload',

  group: 'block',
  selectable: true,

  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
      title: {
        default: '',
      },
      caption: {
        default: '',
      },
    }
  },

  // addCommands() {
  //   return {
  //      yourCommand: () => ({ commands }) => commands.insertContent("<yourNode> something </yourNode>")
  //   }
  // },

  parseHTML() {
    return [
      {
        tag: 'card-upload',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['card-upload', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    // @ts-ignore
    return VueNodeViewRenderer(CardUpload)
  },
})

export default CardUploadNode
