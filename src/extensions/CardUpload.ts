import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CardUpload from '~/components/Tiptap/Card/CardUpload.vue'

export interface CardUploadAttributes {
  imageSrc: string
  fileSrc: string
  title: string
  caption: string
  imageName: string
  fileName: string
}

export const CardUploadNode = Node.create<never, CardUploadAttributes>({
  name: 'cardUpload',

  group: 'block',
  selectable: true,

  atom: true,
  draggable: true,

  addAttributes() {
    return {
      imageSrc: {
        default: '',
      },
      fileSrc: {
        default: '',
      },
      title: {
        default: '',
      },
      caption: {
        default: '',
      },
      imageName: {
        default: '',
      },
      fileName: {
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
