<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '~/stores/auth'
import type { IDecodeUser } from '~/types/app.types'

import SmallPopup from '~/components/Modals/SmallPopup.vue'
import UsersModal from '~/components/Modals/UsersModal.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import UserPopupIcon from '~/assets/svg/usersPopup.svg'
import SignOutIcon from '~/assets/svg/signOutIcon.svg'

defineProps<{
  user: IDecodeUser
}>()

const { userToken } = storeToRefs(useAuthStore())
const isShowPoppup = ref(false)
const isShowUsers = ref(false)
const poppup = ref(null)
const authButtonRef = ref()

const emit = defineEmits(['handleModal', 'logoutUser', 'handleSearch'])

onClickOutside(poppup, (event) => handlePoppup(), { ignore: [authButtonRef] })

const logoutUser = async () => {
  emit('logoutUser')
  handlePoppup()
  await navigateTo({
    path: '/',
  })
  await refreshNuxtData('tree')
}

const handleUsersModal = () => {
  isShowUsers.value = !isShowUsers.value
}

const handlePoppup = () => {
  isShowPoppup.value = !isShowPoppup.value
}

const popupButtons = [
  // { id: 0, name: 'Сотрудники', img: UserPopupIcon, action: handleUsersModal, class: '' },
  { id: 1, name: 'Выйти', img: SignOutIcon, action: logoutUser, class: 'exit' },
]
</script>

<template>
  <Teleport to="#teleports">
    <Transition name="fade">
      <UsersModal
        v-if="isShowUsers"
        @handleModal="handleUsersModal"
      />
    </Transition>
  </Teleport>

  <div class="header__buttons">
    <Transition name="fade">
      <SmallPopup v-if="isShowPoppup">
        <button
          v-for="button in popupButtons"
          :key="button.id"
          class="header__auth-button"
          @click="button.action"
          :class="button.class"
        >
          <img
            :src="button.img"
            alt=""
          />
          <p>{{ button.name }}</p>
        </button>
      </SmallPopup>
    </Transition>
    <button
      class="header__search"
      @click="emit('handleSearch')"
    >
      <img
        src="~/assets/svg/search.svg"
        width="24px"
        height="24px"
        alt="search"
      />
    </button>
    <ButtonComponent
      v-if="!userToken"
      @click="emit('handleModal')"
    >
      Войти
    </ButtonComponent>
    <div
      class="header__auth"
      v-if="userToken"
    >
      <ButtonComponent
        ref="authButtonRef"
        isAuth
        user
        @click="handlePoppup"
      >
        {{ user?.name }}
        <template #icon>
          <img
            class="header__auth-icon"
            :class="{ open: isShowPoppup }"
            src="~/assets/svg/chevronDown.svg"
            alt="chevronDown"
          />
        </template>
      </ButtonComponent>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  &__buttons {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    width: fit-content;
    margin-left: auto;
  }

  &__search {
    display: contents;
    padding: 0;
    border: none;
    font: inherit;
    color: inherit;
    background-color: transparent;
    cursor: pointer;
  }

  &__auth {
    position: relative;

    &-icon {
      transition: all 0.2s ease;

      &.open {
        transform: rotate(180deg);
      }
    }

    &-modal {
      position: absolute;
      right: 0;
      top: 50px;
      padding: 8px;
      background-color: #fff;
      border-radius: $smallRadius;
      box-shadow: 0px 0px 16px 0px #0101011a;
      box-shadow: 0px 4px 8px 0px #01010133;
    }

    &-button {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 16px;
      line-height: 24px;
      padding: 4px 8px;
      min-width: 204px;
      gap: 8px;
      transition: background-color 0.2s ease;

      &.exit {
        color: $softRed;
      }

      &:hover {
        background-color: #eaeaec;
        border-radius: 4px;
      }
    }
  }
}
</style>
