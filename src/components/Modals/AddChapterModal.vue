<script setup lang="ts">
import Modal from './Modal.vue'
import CustomCheckbox from '~/components/Inputs/CustomCheckbox.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import CustomInput from '~/components/Inputs/CustomInput.vue'
import type { IChapterItem } from '~/types/app.types'

const emit = defineEmits(['handleModal'])

const props = defineProps<{
  sidebarList: any
  chapterItem: IChapterItem | null
}>()
const { createChapter, updateChapter } = useChaptersStore()

const name = ref('')

const fullName = computed({
  get() {
    return name.value
  },
  set(newValue) {
    name.value = newValue
  },
})

const checked = ref(false)
const loading = ref(false)

const isCreateChapter = async () => {
  try {
    loading.value = true
    if (props.chapterItem?.id) {
      await updateChapter(name.value, props.chapterItem.id, 'name')
    } else {
      const result = await createChapter(name.value, props.sidebarList.id, checked.value)
      if (result.body) {
        await refreshNuxtData('tree')

        await navigateTo({
          path: '/content',
          query: {
            chapter: result.body.chapter_id,
            seed: result.body.seed_id,
            tab: result.body.sheet_id,
          },
        })

        useNuxtApp().$toast.success('Раздел успешно создан')
      }
    }
    emit('handleModal')
  } catch (e) {
  } finally {
    loading.value = false
  }
}

const isUpdateChapter = async () => {
  try {
    loading.value = true
    if (props.chapterItem?.id) {
      await updateChapter(name.value, props.chapterItem.id, 'name')
      await refreshNuxtData('tree')
      emit('handleModal')
    }
  } catch (e) {
  } finally {
    loading.value = false
  }
}

onUpdated(() => {
  if (!name.value && props.chapterItem?.name) {
    name.value = props.chapterItem.name
  } else {
    name.value = ''
  }
})

onMounted(() => {
  if (props.chapterItem?.name) {
    fullName.value = props.chapterItem.name
  }
})
</script>

<template>
  <Modal
    :label="`${chapterItem?.id ? 'Редактировать' : 'Новый раздел'}`"
    @handleModal="emit('handleModal')"
  >
    <CustomInput
      placeholder="Название"
      class="chapter-modal__input"
      name="name"
      v-model="fullName"
      type="text"
      inputOnly
    />
    <div class="chapter-modal__buttons">
      <ButtonComponent
        v-if="chapterItem?.id"
        :disabled="loading || !name"
        @click="isUpdateChapter"
      >
        Редактировать</ButtonComponent
      >
      <ButtonComponent
        v-else
        :disabled="loading || !name"
        @click="isCreateChapter"
      >
        Создать</ButtonComponent
      >
      <ButtonComponent
        @click="emit('handleModal')"
        outline
      >
        Отмена
      </ButtonComponent>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.chapter-modal__buttons {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  width: 230px;
  margin-top: 20px;
}

.chapter-modal__input {
  margin-bottom: 20px;
}
</style>
