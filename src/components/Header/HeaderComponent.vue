<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import AuthModal from '../Modals/AuthModal.vue'
import SearchModal from '../Modals/SearchModal.vue'

withDefaults(defineProps<{ isContentPage?: boolean }>(), {
  isContentPage: false,
})

const showModal = ref(false)
const showSearch = ref(false)

const authStore = useAuthStore()
const { getDecodeToken } = storeToRefs(useAuthStore())

const handleModal = () => {
  showModal.value = !showModal.value
}

const handleSearch = () => {
  showSearch.value = !showSearch.value
}

const logoutUser = () => {
  authStore.clearAuth()
}
</script>

<template>
  <Teleport to="#teleports">
    <Transition name="fade">
      <AuthModal
        v-if="showModal"
        @handleModal="handleModal"
      />
    </Transition>
    <Transition name="fade">
      <SearchModal
        v-if="showSearch"
        @handleSearch="handleSearch"
      />
    </Transition>
  </Teleport>
  <header
    class="header"
    :class="{ isContent: isContentPage }"
  >
    <slot name="header"></slot>

    <HeaderButtons
      :user="getDecodeToken"
      @logoutUser="logoutUser"
      @handleModal="handleModal"
      @handleSearch="handleSearch"
    />
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 80px;
  width: 100%;

  &.isContent {
    height: auto;
    margin-bottom: 44px;
  }

  &__logo {
    font-size: 20px;
    font-family: 'Gilroy';
  }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  &__search {
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
  }
}
</style>
