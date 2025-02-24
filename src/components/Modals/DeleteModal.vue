<script setup lang="ts">
import type { IChapterItem, IGroupItem, ISeedItem } from '~/types/app.types'
import Modal from './Modal.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'

const emit = defineEmits(['handleModal'])
const props = defineProps<{
  sidebarList: any
  deletingItem: IChapterItem | ISeedItem | IGroupItem
}>()

const route = useRoute()
const loading = ref(false)
const { deleteChapter } = useChaptersStore()
const { deleteSeed } = useSeedsStore()
const { deleteGroup } = useGroupsStore()

const setNextRoute = async () => {
  if (props.deletingItem?.type === 'chapter') {
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
    if (props.deletingItem?.type === 'chapter') {
      await deleteChapter(props.deletingItem.id as string, props.sidebarList.id)
    } else if (props.deletingItem?.type === 'seed') {
      await deleteSeed(route.query.seed as string, route.query.chapter as string)
    } else {
      await deleteGroup(props.deletingItem.id as string)
      await navigateTo({
        path: '/',
      })
      refreshNuxtData('tree')
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
  if (props.deletingItem?.type === 'chapter') {
    return 'Удалить раздел с подразделами?'
  } else if (props.deletingItem?.type === 'seed') {
    return 'Удалить подраздел'
  } else {
    return 'Удалить отдел'
  }
})

const subtitleFromDeletingElement = computed(() => {
  const deletingItem = props.deletingItem as IChapterItem
  if (deletingItem?.type === 'chapter') {
    return `Раздел «${deletingItem.name}» и ${deletingItem.seeds.length} подраздела будут удалены без возможности восстановления`
  } else if (deletingItem?.type === 'seed') {
    return 'Будет удален без возможности восстановления'
  } else {
    return 'Отдел будет безвозвратно удалён'
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
    font-family: 'Inter';
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    width: fit-content;
  }
}
</style>
