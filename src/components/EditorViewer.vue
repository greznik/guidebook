<script setup lang="ts">
import TiptapEditor from '~/components/Tiptap/TiptapEditor.vue'

const emit = defineEmits(['isChangeContent'])

const useStore = useTreeStore()
const { getContent } = useStore
const { content } = storeToRefs(useStore)
const route = useRoute()

const routeQueryTab = computed(() => route.query.tab as string)

// await useAsyncData('posts', () => useStore.getContent(routeQueryTab.value), {
//   watch: [routeQueryTab],
// })
await getContent(routeQueryTab.value)

watch(
  () => routeQueryTab.value,
  async (value) => {
    await getContent(value)
  },
)
</script>

<template>
  <section class="page">
    <TiptapEditor
      @isChangeContent="emit('isChangeContent')"
      :content="content?.html || ''"
    />
  </section>
</template>

<style lang="scss" scoped>
.page {
  grid-area: content;
  background-color: $bgGrey;
  padding: 40px;
  font-size: 18px;
  overflow-y: auto;
}
.editor-container {
  max-width: 768px;
}
</style>
