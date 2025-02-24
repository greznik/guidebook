<script setup lang="ts">
import { number, object, string } from 'yup'
import { getSubmitFn } from '~/helpers/getSubmitFn'
import { Form, useField } from 'vee-validate'

import { ROLES_NAMES } from '~/constants'
import type { ICreateUserBody, IUserInfo, IUsersList } from '~/stores/users'
import Modal from './Modal.vue'
import CustomInput from '~/components/Inputs/CustomInput.vue'
import CustomSelect from '~/components/Inputs/CustomSelect.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import CheckLargeIcon from '~/components/Icons/CheckLarge.vue'

const { getUsersList } = useUsersStore()
const emit = defineEmits(['handleModal'])

const { createUser, deleteUser, updateUser } = useUsersStore()
const groupFormVisible = ref<string | boolean>(false)
const userFormVisible = ref<string | boolean>(false)
const groupIdEdit = ref<string>('')

const { data: users } = await useAsyncData<IUsersList[]>('users', getUsersList)

const schema = object().shape({
  password: string()
    .required()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[a-zA-Z]/, 'Допустимы только латинские буквы'),
  name: string().required(),
  role: number().required(),
  login: string().required(),
})

const user = reactive({
  name: '',
  role: {},
  login: '',
  password: '',
})

const loading = ref(false)

const userFormHandler = (groupId: string) => {
  user.name = ''
  user.role = {}
  user.login = ''
  userFormVisible.value = false
  groupIdEdit.value = groupId
  groupFormVisible.value = groupId
}

const onSubmit = getSubmitFn(schema, async (values) => {
  loading.value = true
  const updateData = { ...values, group_id: groupIdEdit.value }
  if (userFormVisible.value) {
    await updateUser(updateData)
  } else {
    await createUser(updateData)
  }
  loading.value = false
  closeForm()
})

const editUserHandler = (userId: string, groupId: string) => {
  groupIdEdit.value = groupId
  userFormVisible.value = userId
  groupFormVisible.value = false
}

const closeForm = () => {
  groupFormVisible.value = false
  userFormVisible.value = false
}

const { value, errorMessage, meta } = useField(() => 'login')
</script>

<template>
  <Modal
    @handleModal="emit('handleModal')"
    color="#ffffff"
    label="Сотрудники"
  >
    <div class="users">
      <details
        class="users__details"
        v-for="(group, index) in users"
        :key="group.group_id"
        open
      >
        <summary class="users__summary">
          <img
            class="users__summary-image"
            src="~/assets/svg/chevronDown.svg"
            alt=""
          />
          <p>{{ group.name }}</p>
        </summary>
        <div class="users__list">
          <transition
            name="fade"
            mode="out-in"
          >
            <Form
              v-if="groupFormVisible === group.group_id"
              class="users__info form"
              :validation-schema="schema"
              :initial-values="user"
              @submit="onSubmit"
              key="2"
            >
              <CustomInput
                placeholder="Имя и фамилия"
                name="name"
                type="text"
              />
              <CustomSelect name="role" />
              <CustomInput
                placeholder="Логин"
                name="login"
                type="text"
              />
              <CustomInput
                placeholder="Пароль"
                name="password"
                type="password"
              />

              <div class="form__buttons">
                <ButtonComponent
                  type="submit"
                  :disabled="loading || !!errorMessage"
                  class="form__button check"
                >
                  <template #icon>
                    <CheckLargeIcon />
                  </template>
                </ButtonComponent>
                <ButtonComponent
                  outline
                  class="form__button"
                  @click="closeForm"
                >
                  <template #icon>
                    <img
                      src="~/assets/svg/closeLarge.svg"
                      alt="close"
                    />
                  </template>
                </ButtonComponent>
              </div>
            </Form>
            <ButtonComponent
              v-else
              class="users__list-button"
              iconColor="#22242D"
              outline
              hasIcon
              @click="userFormHandler(group.group_id)"
              key="1"
              >Добавить пользователя</ButtonComponent
            >
          </transition>
          <template
            v-for="user in group.users"
            :key="user.id"
          >
            <Form
              v-if="userFormVisible === user.id"
              class="users__info form"
              :validation-schema="schema"
              :initial-values="user"
              @submit="onSubmit"
            >
              <CustomInput
                placeholder="Имя и фамилия"
                name="name"
                type="text"
              />
              <CustomSelect name="role" />
              <CustomInput
                placeholder="Логин"
                name="login"
                type="text"
              />
              <CustomInput
                placeholder="Пароль"
                name="password"
                type="password"
              />

              <div class="form__buttons">
                <ButtonComponent
                  type="submit"
                  :disabled="loading || !!errorMessage"
                  class="form__button check"
                >
                  <template #icon>
                    <CheckLargeIcon />
                  </template>
                </ButtonComponent>
                <ButtonComponent
                  outline
                  class="form__button"
                  @click="closeForm"
                >
                  <template #icon>
                    <img
                      src="~/assets/svg/closeLarge.svg"
                      alt="close"
                    />
                  </template>
                </ButtonComponent>
              </div>
            </Form>

            <div
              v-else
              class="users__info"
            >
              <p class="users__info-item">{{ user.name }}</p>
              <p class="users__info-item">{{ ROLES_NAMES[user.role] }}</p>
              <p class="users__info-item">{{ user.login }}</p>
              <div class="form__buttons">
                <ButtonComponent
                  outline
                  @click="editUserHandler(user.id, group.group_id)"
                  class="form__button"
                >
                  <template #icon>
                    <img
                      src="~/assets/svg/editPopup.svg"
                      alt="edit"
                    />
                  </template>
                </ButtonComponent>
                <ButtonComponent
                  outline
                  @click="deleteUser(user.id)"
                  class="form__button"
                >
                  <template #icon>
                    <img
                      src="~/assets/svg/deleteTrash.svg"
                      alt="delete"
                    />
                  </template>
                </ButtonComponent>
              </div>
            </div>
          </template>
        </div>
      </details>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.users {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;
  width: clamp(850px, 100vw, 1000px);
  height: 680px;

  &__list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    margin-left: 36px;

    &-button {
      width: auto;
      font-family: 'Inter';
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
      padding: 8px;
    }
  }

  &__info {
    display: grid;
    grid-template-columns: repeat(4, minmax(100px, 1fr));
    align-items: center;
    width: 100%;
    gap: 8px;
    color: $textPrimary;

    &-item {
      grid-row: 1;
    }

    &.form {
      grid-template-columns: repeat(5, minmax(100px, 1fr));
    }
  }

  &__details {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &__details[open] summary {
    margin-bottom: 16px;
  }

  &__summary {
    position: relative;
    display: flex;
    gap: 12px;
    align-items: center;
    style: none;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    transition: margin 150ms ease-out;
    padding: 0;

    &-image {
      transition: 0.2s;

      &.hidden {
        visibility: hidden;
      }
    }
  }

  .form {
    width: 100%;

    &__buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 12px;
    }

    &__button {
      width: fit-content;
      display: inline-flex;
      padding: 8px;

      &.check {
        background-color: $black;

        &:hover {
          background-color: $textPrimary;
        }
      }
    }
  }

  details[open] > summary .users__summary-image {
    transform: rotate(180deg);
  }
}

details > summary {
  style: none;
}

summary::-webkit-details-marker {
  display: none;
}
</style>
