<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import MainCard from '~/components/MainCard.vue'
import Footer from '~/components/Footer/FooterComponent.vue'
import Sidebar from '~/components/Sidebar/Sidebar.vue'
import AddCardButton from '~/components/Buttons/AddCardButton.vue'

// definePageMeta({
//   middleware: 'content',
// })
const useStore = useTreeStore()
const { createGroup } = useGroupsStore()
const { tree, getSidebarItems } = storeToRefs(useStore)
const { getDecodeToken } = storeToRefs(useAuthStore())

const isLoading = ref(false)

const isSidebarActive = ref(false)
const chapterId = ref<string>('')
const { width } = useWindowSize({ initialWidth: 0 })

const closeSidebar = () => {
  isSidebarActive.value = false
}

const openSidebar = (id: string) => {
  chapterId.value = id
  isSidebarActive.value = true
}

const getSidebarList = computed(() => {
  return getSidebarItems.value(chapterId.value)
})

const createGroupHandle = async () => {
  isLoading.value = true
  try {
    const result = await createGroup('Новый отдел')
    if (result.body) {
      await navigateTo({
        path: '/content',
        query: {
          chapter: result.body.chapter_id,
          seed: result.body.seed_id,
          tab: result.body.sheet_id,
        },
      })
      useNuxtApp().$toast.success('Отдел успешно создан')
      await refreshNuxtData('tree')
    }
  } catch (e) {
    useNuxtApp().$toast.error('Не удалось создать отдел')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <HeaderComponent>
      <template #header>
        <div class="header__logo">GuideBook</div>
      </template>
    </HeaderComponent>
    <main class="main">
      <ClientOnly>
        <Transition name="slide">
          <Sidebar
            v-if="width < 1024 && isSidebarActive"
            :sidebarList="getSidebarList"
            @closeSidebar="closeSidebar"
            :key="1"
          >
            <template v-slot:header>
              <div class="sidebar__header-title">
                {{ getSidebarList?.name || '' }}
                <button @click="closeSidebar">
                  <img
                    src="~/assets/svg/closeLarge.svg"
                    alt="close"
                  />
                </button>
              </div>
            </template>
          </Sidebar>
        </Transition>
      </ClientOnly>
      <section class="main__block">
        <div>
          <h1 class="main__title">Гайдбук BetBoom</h1>
          <p class="main__subtitle">Всё, что поможет улучшить пользовательский опыт и создать целостный образ бренда</p>
        </div>
        <img
          class="main__image"
          src="~/assets/svg/abstraction.svg"
          alt="abstraction"
        />
      </section>
      <section class="main__cards">
        <MainCard
          v-for="(card, index) in tree"
          :key="index"
          :card="card"
          @openSidebar="openSidebar"
        />
        <AddCardButton
          @click="createGroupHandle"
          :disabled="isLoading"
          v-if="getDecodeToken?.role === 0"
        />
      </section>
    </main>
    <Footer />
  </div>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;

  &__block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;

    @media screen and (max-width: $medium) {
      flex-direction: column-reverse;
      gap: 52px;
    }
  }

  &__title {
    font-family: 'Gilroy';
    text-wrap: nowrap;
    font-size: clamp(40px, 4vw, 60px);
    line-height: 48px;
    color: $textPrimary;
    margin-bottom: 16px;

    @media screen and (max-width: $small) {
      text-wrap: wrap;
    }
  }

  &__subtitle {
    display: block;
    max-width: 380px;
    font-size: 16px;
    font-size: clamp(14px, 2vw, 16px);
    line-height: 24px;
    color: $textSecondary;

    @media screen and (max-width: $small) {
      line-height: 20px;
    }
  }

  &__image {
    width: clamp(286px, 30vw, 368px);
  }

  &__cards {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 32px;
    margin-bottom: 32px;

    @media screen and (max-width: $big) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: $medium) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
.sidebar__header-title {
  color: $textPrimary;
  font-family: 'Gilroy';

  font-size: 20px;
  line-height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 16px 24px;
}

.wrapper {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1440px;
  margin: 0 auto;
  padding-left: clamp(32px, 8vw, 120px);
  padding-right: clamp(32px, 8vw, 120px);
  background-color: $bgGrey;

  @media screen and (max-width: $medium) {
    padding: 0 32px;
  }

  @media screen and (max-width: $small) {
    padding: 0 16px;
  }
}

.header__logo {
  font-size: 20px;
  font-family: 'Gilroy';
}
</style>
