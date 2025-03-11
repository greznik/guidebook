<script lang="ts" setup>
import { ref } from 'vue'
import { ROLES_NAMES } from '~/constants'

import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import Modal from './Modal.vue'
import CustomInput from '../Inputs/CustomInput.vue'

const emit = defineEmits(['handleModal'])

const loading = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const { getDecodeToken } = storeToRefs(useAuthStore())
const { getUserInfo, patchUpdateUser } = useUsersStore()

const { data: userData } = await useAsyncData('user', getUserInfo)

const user = reactive({
  name: '',
  family: '',
})

const password1 = ref('')
const password2 = ref('')

const handleSubmit = async (values: any) => {
  loading.value = true
  try {
    if (password1 !== password2) {
      useNuxtApp().$toast.error('Пароли не совпадают')
      return
    }
    const result = await patchUpdateUser(values.login)
    if (!result) throw new Error()

    useNuxtApp().$toast.success('Успешная авторизация')
    handleModal()
  } catch (e) {
    useNuxtApp().$toast.error('Пользователь не найден')
  } finally {
    loading.value = false
  }
}

const handleModal = () => {
  emit('handleModal')
}

const setUserValues = () => {
  if (userData.value) {
    const name = userData.value.name.split(/\s+/)
    user.name = name[0]
    user.family = name[1]
  }
}

onMounted(() => {
  setUserValues()
})

const isDisabled = computed(() => {
  return !user.name
})
</script>

<template>
  <Modal
    label="Мой профиль"
    color="#FFFFFF"
    @handleModal="handleModal"
  >
    <form
      @submit="handleSubmit"
      class="profile"
    >
      <div class="profile__block">
        <div class="profile__block-header">
          <p class="profile__block-title">Общая информация</p>
          <span class="profile__block-line"></span>
        </div>
        <div class="profile__inputs">
          <CustomInput
            placeholder="Имя"
            inputOnly
            label="Имя"
            name="name"
            v-model="user.name"
            type="text"
            class="form-input"
          />
          <CustomInput
            placeholder="Фамилия"
            name="family"
            v-model="user.family"
            label="Фамилия"
            type="text"
            class="form-input"
          />
        </div>
      </div>
      <div
        class="profile__info"
        v-if="userData"
      >
        <div class="profile__info-block">
          <span class="profile__info-label">Логин</span>
          <p class="profile__info-text">{{ userData.login }}</p>
        </div>
        <div class="profile__info-block">
          <span class="profile__info-label">Роль</span>
          <p class="profile__info-text">{{ ROLES_NAMES[userData.role] }}</p>
        </div>
      </div>
      <div class="profile__block">
        <div class="profile__block-header">
          <p class="profile__block-title">Сменить пароль</p>
          <span class="profile__block-line"></span>
        </div>
        <div class="profile__inputs">
          <div class="password-input">
            <CustomInput
              placeholder="Не менее 6 символов"
              label="Новый пароль"
              name="password1"
              inputOnly
              v-model="password1"
              :type="showPassword1 ? 'text' : 'password'"
            />

            <div class="password-icon">
              <img
                v-if="showPassword1"
                src="~/assets/svg/passwordOpen.svg"
                alt="password"
                @click="showPassword1 = !showPassword1"
              />
              <img
                v-else
                src="~/assets/svg/passwordClose.svg"
                @click="showPassword1 = !showPassword1"
                alt="password"
              />
            </div>
          </div>
          <div class="password-input">
            <CustomInput
              placeholder="Не менее 6 символов"
              label="Повтори пароль"
              inputOnly
              name="password2"
              v-model="password2"
              :type="showPassword2 ? 'text' : 'password'"
            />

            <div class="password-icon">
              <img
                v-if="showPassword2"
                src="~/assets/svg/passwordOpen.svg"
                alt="password"
                @click="showPassword2 = !showPassword2"
              />
              <img
                v-else
                src="~/assets/svg/passwordClose.svg"
                @click="showPassword2 = !showPassword2"
                alt="password"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="buttons">
        <ButtonComponent
          :disabled="isDisabled"
          type="submit"
          class="profile__button"
          >Сохранить</ButtonComponent
        >
      </div>
    </form>
  </Modal>
</template>

<style lang="scss" scoped>
.profile {
  &__block {
    margin-bottom: 24px;

    &-header {
      display: flex;
      flex-direction: row;
      margin-bottom: 16px;
    }

    &-title {
      display: inline-block;
      white-space: nowrap;
      font-weight: 600;
      font-size: 16px;
      line-height: 14px;
      color: $textPrimary;
      margin-right: 8px;
    }

    &-line {
      display: block;
      width: 100%;
      border-bottom: 1px solid $bgGrey;
      //   border-bottom: 1px solid red;
    }
  }

  &__info {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 24px;
    margin-top: 24px;

    &-block {
      width: 50%;
    }

    &-label {
      font-size: 12px;
      line-height: 14px;
      color: $textSecondary;
      margin-bottom: 4px;
    }

    &-text {
      font-size: 16px;
      line-height: 24px;
      color: $textPrimary;
    }
  }

  &__inputs {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  &__button {
    width: auto;
  }
}

.password-input {
  position: relative;
}

.password-icon {
  position: absolute;
  top: 30px;
  right: 12px;
  cursor: pointer;
}
</style>
