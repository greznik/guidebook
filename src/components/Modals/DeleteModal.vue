<script setup lang="ts">
import type { IChapterItem, ISeedItem } from '~/types/app.types'
import Modal from './Modal.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'

const emit = defineEmits(['handleModal'])
const props = defineProps<{
  sidebarList: any
  deletingItem: IChapterItem | ISeedItem | any
}>()

const route = useRoute()
const loading = ref(false)
const { deleteChapter } = useChaptersStore()
const { deleteSeed } = useSeedsStore()

const setNextRoute = async () => {
  if (props.deletingItem.type === 'chapter') {
    if (props.deletingItem.id === route.query.chapter) {
      const chapterItem = props.sidebarList.chapters.find((item: IChapterItem) => {
        return item.id !== route.query.chapter
      })

      if (chapterItem) {
        await navigateTo({
          path: '/content',
          query: {
            chapter: chapterItem.id,
          },
        })
      } else {
        await navigateTo({
          path: '/',
        })
      }
    }
  }
}

const deleteItem = async () => {
  loading.value = true
  try {
    if (props.deletingItem.type === 'chapter') {
      await deleteChapter(props.deletingItem.id as string, props.sidebarList.id)
    } else {
      await deleteSeed(route.query.seed as string, route.query.chapter as string)
    }
    await setNextRoute()
    emit('handleModal')
    await refreshNuxtData('tree')
  } catch (e) {
  } finally {
    loading.value = false
  }
}

const titleFromDeletingElement = computed(() => {
  if (props.deletingItem.type === 'chapter') {
    return 'Удалить раздел с подразделами?'
  } else {
    return 'Удалить подраздел'
  }
})

const subtitleFromDeletingElement = computed(() => {
  if (props.deletingItem.type === 'chapter') {
    return `Раздел «${props.deletingItem.name}» и ${props.deletingItem.seeds.length} подраздела будут удалены без возможности восстановления`
  } else {
    return 'Будет удален без возможности восстановления'
  }
})
</script>

<template>
  <Modal @handleModal="emit('handleModal')">
    <div class="delete-modal">
      <h2 class="delete-modal__title">{{ titleFromDeletingElement }}</h2>
      <p class="delete-modal__subtitle">{{ subtitleFromDeletingElement }}</p>
      <div class="delete-modal__buttons">
        <ButtonComponent
          isDelete
          :disabled="loading"
          class="delete-modal__button"
          @click="deleteItem"
          >Удалить</ButtonComponent
        >
        <ButtonComponent
          outline
          :disabled="loading"
          @click="emit('handleModal')"
          class="delete-modal__button"
          >Отмена</ButtonComponent
        >
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.delete-modal {
  &__title {
    font-family: 'Gilroy';
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    margin-top: -20px;
    margin-bottom: 16px;
  }

  &__subtitle {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    text-align: center;
    color: $textSecondary;
    margin-bottom: 24px;
  }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  &__button {
    width: fit-content;
  }
}
</style>
