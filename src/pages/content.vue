<script setup lang="ts">
import { ROLES, WIDTH_BREAKPOINT } from '~/constants'
import CopyLinkButton from '~/components/Buttons/CopyLinkButton.vue'
import DeleteModal from '~/components/Modals/DeleteModal.vue'
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import EditorViewer from '~/components/EditorViewer.vue'

const isPublishActive = ref(false)
const { width } = useWindowSize({ initialWidth: 0 })
const treeStore = useTreeStore()
const { updateSeed } = useSeedsStore()
const { updateGroup, deleteGroup } = useGroupsStore()
const { hasEditable } = storeToRefs(useAuthStore())

const selectedItem = ref<any>({
  id: '',
  name: '',
})
const isSidebarActive = ref<boolean>(false)
const showDeleteModal = ref(false)

const selectItem = (item: any) => {
  selectedItem.value = item
}

const route = useRoute()

const getSidebarList = computed(() => {
  return treeStore.getSidebarItems(route.query.chapter as string)
})

const handleDeleteModal = () => {
  showDeleteModal.value = !showDeleteModal.value
}

const closeSidebar = () => {
  isSidebarActive.value = false
}
const openSidebar = () => {
  isSidebarActive.value = true
}

const isChangeContent = () => {
  isPublishActive.value = true
}

const updateGroupName = useDebounceFn(async ($event) => {
  const nameValue = $event.target.value
  const groupId = getSidebarList.value.id
  try {
    if (groupId) {
      await updateGroup(nameValue, groupId, 'name')
    }
    await refreshNuxtData('tree')
  } catch (e) {
    useNuxtApp().$toast.error('Не удалось изменить имя')
  }
}, 500)

const updateSeedName = useDebounceFn(async ($event) => {
  const nameValue = $event.target.value
  const seedId = route.query.seed as string
  try {
    if (seedId) {
      await updateSeed(nameValue, seedId, 'name')
    }
    await refreshNuxtData('tree')
  } catch (e) {
    useNuxtApp().$toast.error('Не удалось изменить имя')
  }
}, 500)

const deleteGroupHandle = async () => {
  try {
    await deleteGroup(getSidebarList.value.id)
    await navigateTo({
      path: '/',
    })
    refreshNuxtData('tree')
  } catch (e) {}
}
</script>

<template>
  <section class="content">
    <!-- ClientOnly обход ошибки гидратации -->
    <DeleteModal
      v-if="showDeleteModal"
      @handleModal="handleDeleteModal"
      :sidebarList="getSidebarList"
      :deletingItem="getSidebarList"
    />
    <ClientOnly>
      <Transition name="slide">
        <Sidebar
          v-if="width > WIDTH_BREAKPOINT || isSidebarActive"
          :sidebarList="getSidebarList"
          @selectItem="selectItem"
          @closeSidebar="closeSidebar"
        >
          <template v-slot:header>
            <div class="sidebar__header">
              <NuxtLink
                to="/"
                class="sidebar__header-link"
                ><img
                  src="~/assets/svg/arrowLeft.svg"
                  alt="arrow left"
                />
                <p>Главная</p>
              </NuxtLink>
              <div class="sidebar__header-input">
                <input
                  v-if="getSidebarList"
                  v-model="getSidebarList.name"
                  placeholder="Новый отдел"
                  class="sidebar__header-title"
                  @input="updateGroupName"
                  :readonly="!hasEditable"
                />
                <button
                  v-if="hasEditable"
                  class="sidebar__header-input_button"
                  @click="handleDeleteModal"
                >
                  <img
                    src="~/assets/svg/deleteTrash.svg"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </template>
        </Sidebar>
      </Transition>
    </ClientOnly>
    <div class="content-block">
      <HeaderComponent isContentPage>
        <template
          #header
          v-if="getSidebarList?.chapters"
        >
          <input
            v-if="selectedItem"
            v-model="selectedItem.name"
            placeholder="Новый подраздел"
            @input="updateSeedName"
            class="content-block__input"
            :readonly="!hasEditable"
          />
          <button
            class="content-block__burger"
            @click="openSidebar"
          >
            <img
              class="content-block__burger-arrow"
              src="~/assets/svg/chevronDown.svg"
              alt=""
            />
            <h2 class="content-block__burger-title">
              {{ getSidebarList.name }} • {{ getSidebarList.chapters[0].name }}
            </h2>
            <img
              class="content-block__burger-image"
              src="~/assets/svg/burger.svg"
              alt=""
            />
          </button>
        </template>
      </HeaderComponent>
      <div class="content-block-wrapper">
        <div class="content-block__info">
          <NuxtLink
            to="/"
            class="content-block__tab"
            >Описание</NuxtLink
          >
        </div>
        <div class="content-block-wrapper__buttons">
          <!-- <ButtonComponent
            v-if="getDecodeToken?.role === 0 || getDecodeToken?.role === 1"
            :disabled="!isPublishActive"
            >Опубликовать</ButtonComponent
          > -->
          <CopyLinkButton />
        </div>
      </div>
    </div>

    <EditorViewer @isChangeContent="isChangeContent" />
  </section>
</template>

<style lang="scss" scoped>
.content {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'sidebar header'
    'sidebar content';
  width: 100%;
  max-height: 100vh;
  overflow: hidden;
}
.content-block {
  position: relative;
  grid-area: header;
  padding: 16px 40px;
  background-color: $greyNeutral;

  &-top {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 44px;
  }

  &__input {
    background: transparent;
    border: none;
    outline: none;
    font-family: Gilroy;
    font-size: 32px;
    font-weight: 700;
    line-height: 40px;
    width: 100%;
    text-overflow: ellipsis;
    margin-right: 32px;

    @media screen and (max-width: $big) {
      display: none;
    }
  }

  &__burger {
    display: none;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;

    &-arrow {
      transform: rotate(90deg);
    }

    &-title {
      font-family: 'Gilroy';
      font-size: 20px;
      line-height: 24px;
      font-weight: 700;
    }

    @media screen and (max-width: $big) {
      display: flex;
    }
  }

  &__button {
    margin-left: auto;
  }

  &-wrapper {
    display: flex;
    justify-content: flex-end;

    &__buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      height: 40px;
    }
  }

  &__info {
    position: absolute;
    left: 40px;
    bottom: 0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 24px;
  }

  &__tab {
    color: $textPrimary;
    font-size: 16px;
    line-height: 24px;
    padding-bottom: 16px;

    border-bottom: 2px solid black;
  }
}

.sidebar__header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 32px;
  height: 104px;

  &-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-family: 'Inter';
    font-size: 14px;
    line-height: 16px;
    color: $textSecondary;
  }

  &-title {
    color: $textPrimary;
    font-family: 'Gilroy';

    font-size: 20px;
    line-height: 24px;
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    text-overflow: ellipsis;

    &.active {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 24px 16px 24px;
    }
  }

  &-input {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover .sidebar__header-input_button {
      visibility: visible;
      opacity: 1;
    }

    &_button {
      display: flex;
      justify-content: center;
      align-items: center;
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.2s ease;
    }
  }
}
</style>
