<script lang="ts" setup>
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import AddChapterModal from '~/components/Modals/AddChapterModal.vue'
import DeleteModal from '~/components/Modals/DeleteModal.vue'
import SmallPopup from '~/components/Modals/SmallPopup.vue'
import DeleteIcon from '~/assets/svg/deleteTrash.svg'
import EditPopupIcon from '~/assets/svg/editPopup.svg'
import AccessPopupIcon from '~/assets/svg/accessPopup.svg'
import type { IChapterItem, ISeedItem } from '~/types/app.types'
import AccessRightsModal from '../Modals/AccessRightsModal.vue'

const emit = defineEmits(['selectItem'])

const { getDecodeToken } = storeToRefs(useAuthStore())
const { createSeed } = useSeedsStore()

const props = defineProps<{
  sidebarList: any
}>()

const seedName = ref('Новый подраздел')
const isShowPoppupId = ref('')
const chapterId = ref('')
const route = useRoute()
const showChapterModal = ref<boolean>(false)
const showAccessModal = ref<boolean>(false)
const showDeleteModal = ref<boolean>(false)
const deletingItem = ref<IChapterItem | ISeedItem | null>(null)
const chapterItem = ref<IChapterItem | null>(null)

const selectItem = (item: any) => {
  emit('selectItem', item)
}

const showChapterModalHandle = () => {
  chapterItem.value = null
  showChapterModal.value = !showChapterModal.value
}

const accessModalHandle = () => {
  showAccessModal.value = !showAccessModal.value
}

const addSeedHandle = async (chapterId: string) => {
  try {
    const result = (await createSeed(seedName.value, chapterId)) as any
    if (result.body) {
      await refreshNuxtData('tree')

      await navigateTo({
        path: '/content',
        query: {
          chapter: chapterId,
          seed: result.body.seed_id,
          tab: result.body.sheet_id,
        },
      })

      useNuxtApp().$toast.success('Подраздел успешно создан')
    }
  } catch (e) {
    useNuxtApp().$toast.error('Ошибка создания подраздела')
  }
}

const handlePopup = (id: string) => {
  if (chapterId.value !== id && id) {
    chapterId.value = id
  }
  if (id !== isShowPoppupId.value) {
    isShowPoppupId.value = id
  } else {
    isShowPoppupId.value = ''
  }
}

const handleDeleteModal = () => {
  showDeleteModal.value = !showDeleteModal.value
}

const editChapterHandle = (chapter: IChapterItem) => {
  showChapterModalHandle()
  chapterItem.value = chapter
  handlePopup('')
}

const selectDeletingItem = (seletedItem: IChapterItem) => {
  if (props.sidebarList.chapters.length === 1) {
    useNuxtApp().$toast.error('Нельзя удалить посследний раздел')
    return
  }
  deletingItem.value = seletedItem
  handleDeleteModal()
  handlePopup('')
}

const isAdminToken = computed(() => {
  return getDecodeToken.value?.role === 0 || getDecodeToken.value?.role === 1
})

const popupButtons = reactive([
  { id: 0, img: EditPopupIcon, name: 'Редактировать', action: editChapterHandle },
  { id: 1, img: AccessPopupIcon, name: 'Права доступа', action: accessModalHandle },
  {
    id: 2,
    img: DeleteIcon,
    name: 'Удалить',
    action: selectDeletingItem,
  },
])
</script>

<template>
  <Teleport to="#teleports">
    <Transition name="fade">
      <AddChapterModal
        v-if="showChapterModal"
        @handleModal="showChapterModalHandle"
        :sidebarList="sidebarList"
        :chapterItem="chapterItem"
      />
    </Transition>
    <Transition name="fade">
      <AccessRightsModal
        v-if="showAccessModal"
        @handleModal="accessModalHandle"
        :chapterId="chapterId"
      />
    </Transition>
    <Transition name="fade">
      <DeleteModal
        v-if="showDeleteModal"
        @handleModal="handleDeleteModal"
        :sidebarList="sidebarList"
        :deletingItem="deletingItem"
      />
    </Transition>
  </Teleport>

  <nav class="navigation">
    <ul
      class="navigation__list"
      v-if="sidebarList"
      :class="{ content: route.name === 'content' }"
    >
      <li
        v-for="(chapter, index) in sidebarList.chapters"
        :key="index"
        class="navigation__list-item"
      >
        <details
          :open="chapter.id === route.query.chapter"
          class="navigation__list-details"
        >
          <Transition name="fade">
            <SmallPopup
              @handlePopup="handlePopup('')"
              v-if="isShowPoppupId === chapter.id"
            >
              <button
                v-for="button in popupButtons"
                :key="button.id"
                class="navigation__popup-button"
                @click="button.action(chapter)"
              >
                <img
                  :src="button.img"
                  alt=""
                />
                <p>{{ button.name }}</p>
              </button>
            </SmallPopup>
          </Transition>

          <summary class="navigation__list-summary">
            <img
              class="navigation__list-summary_image"
              src="~/assets/svg/chevronDown.svg"
              alt=""
            />
            {{ chapter.name }}
            <button
              v-if="isAdminToken && route.name === 'content'"
              class="navigation__list-button"
              @click="handlePopup(chapter.id)"
            >
              <img
                src="~/assets/svg/horizontalDots.svg"
                alt="horizontalDots"
              />
            </button>
          </summary>
          <SidebarLink
            v-for="(item, index) in chapter.seeds"
            :key="index"
            :item="item"
            :card="chapter"
            @selectItem="selectItem"
            @selectDeletingItem="selectDeletingItem"
          />
          <ButtonComponent
            v-if="isAdminToken"
            @click="addSeedHandle(chapter.id)"
            hasIcon
            transparent
            class="navigation__subsection-button"
          >
            <p>Добавить подраздел</p>
          </ButtonComponent>
        </details>
      </li>
    </ul>

    <ButtonComponent
      v-if="isAdminToken"
      class="navigation__button"
      @click="showChapterModalHandle"
      hasIcon
      >Добавить раздел</ButtonComponent
    >
  </nav>
</template>

<style lang="scss" scoped>
.navigation {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 16px;

  &__popup-button {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    line-height: 24px;
    padding: 4px 8px;
    min-width: 204px;
    gap: 8px;
    color: $textPrimary;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #eaeaec;
      border-radius: 4px;
    }
  }

  &__button {
    margin-bottom: 16px;
    margin-top: auto;
  }

  &__list {
    overflow-y: auto;
    max-height: calc(100vh - 140px);
    border-top: 1px solid $navBorder;
    border-bottom: 1px solid $navBorder;

    &.content {
      max-height: calc(100vh - 230px);
    }
    &-item:not(:last-child) {
      border-bottom: 1px solid $navBorder;
    }

    &-details {
      position: relative;
      display: flex;
      flex-direction: column;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    &-details[open] summary {
      margin-bottom: 10px;
    }

    &-details[open] .navigation__list-button {
      display: inline-flex;
    }

    &-summary {
      position: relative;
      display: flex;
      align-items: center;
      gap: 4px;
      list-style: none;
      font-family: 'Gilroy';
      font-size: 16px;
      cursor: pointer;
      transition: margin 150ms ease-out;

      &_image {
        transition: 0.2s;

        &.hidden {
          visibility: hidden;
        }
      }
    }

    &-button {
      display: none;
      margin-left: auto;
    }

    details[open] > summary .navigation__list-summary_image {
      transform: rotate(180deg);
    }
  }

  &__subsection-button {
    margin-top: 8px;
  }
}

details > summary {
  list-style: none;
}

summary::-webkit-details-marker {
  display: none;
}
</style>
