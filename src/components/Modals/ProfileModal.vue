<script lang="ts" setup>
import { ref } from 'vue'
import { Form, useField } from 'vee-validate'
import { getSubmitFn } from '~/helpers/getSubmitFn'
import { ROLES_NAMES } from '~/constants'

import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import Modal from './Modal.vue'
import CustomInput from '../Inputs/CustomInput.vue'
import { object, string, ref as YupRef } from 'yup'

const emit = defineEmits(['handleModal'])

const loading = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)
const { getUserInfo, updateUser } = useUsersStore()

const { data: userData } = await useAsyncData('user', getUserInfo)

const schema = object().shape({
  password: string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[a-zA-Z]/, 'Допустимы только латинские буквы'),
  confirm_password: string().oneOf([YupRef('password')], 'Пароли не совпадают'),
  name: string().required('Имя должно быть заполнено'),
})

const initialValues = {
  name: userData.value?.name,
}

const onSubmit = getSubmitFn(schema, async (values) => {
  if (userData.value) {
    loading.value = true
    const password = values.password ? values.password : ''
    const updateData = { name: values.name, password, id: userData.value.id }
    await updateUser(updateData)
    loading.value = false
    handleModal()
  }
})

const handleModal = () => {
  emit('handleModal')
}
</script>

<template>
  <Modal
    label="Мой профиль"
    color="#FFFFFF"
    disableOutside
    @handleModal="handleModal"
  >
    <Form
      :validation-schema="schema"
      :initial-values="initialValues"
      @submit="onSubmit"
      class="profile"
    >
      <div class="profile__block top">
        <div class="profile__block-header">
          <p class="profile__block-title">Общая информация</p>
          <span class="profile__block-line"></span>
        </div>
        <div class="profile__inputs">
          <CustomInput
            placeholder="Имя и фамилия"
            label="Имя и фамилия"
            name="name"
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
        <div class="profile__info-block" v-if="userData.group_name">
          <span class="profile__info-label">Отдел</span>
          <p class="profile__info-text">{{ userData.group_name }}</p>
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
              placeholder="Не менее 8 символов"
              label="Новый пароль"
              name="password"
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
              placeholder="Не менее 8 символов"
              label="Повтори пароль"
              name="confirm_password"
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
          :disabled="loading"
          type="submit"
          class="profile__button"
          >Сохранить</ButtonComponent
        >
      </div>
    </Form>
  </Modal>
</template>

<style lang="scss" scoped>
.profile {
  min-width: 616px;
  width: 100%;

  @media screen and (max-width: $medium) {
    min-width: auto;
  }

  &__block {
    margin-bottom: 24px;

    &.top {
      margin-bottom: 16px;
    }

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

    @media screen and (max-width: $medium) {
      flex-direction: column;
    }
  }

  &__button {
    font-size: 16px;
    width: auto;
  }
}

.password-input {
  width: 100%;
  position: relative;
}

.password-icon {
  position: absolute;
  top: 30px;
  right: 12px;
  cursor: pointer;
}
</style>
