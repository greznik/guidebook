<script lang="ts" setup>
import { ref } from 'vue'
import { Form, useField } from 'vee-validate'
import { object, string } from 'yup'

import { useAuthStore } from '~/stores/auth'
import { useTreeStore } from '~/stores/tree'

import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import Modal from './Modal.vue'
import CustomInput from '../Inputs/CustomInput.vue'

const emit = defineEmits(['handleModal'])

const loading = ref(false)
const { loginUser } = useAuthStore()

const schema = object().shape({
  // email: string().email().required(),
  password: string()
    .required('Заполните нужные поля')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[a-zA-Z]/, 'Допустимы только латинские буквы'),
  login: string(),
})

const user = ref({
  login: '',
  password: '',
})
const showPassword = ref(false)

const handleSubmit = async (values: any) => {
  loading.value = true
  try {
    const result = await loginUser(values.login, values.password)
    if (!result) throw new Error()

    await refreshNuxtData('tree')
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

const { value, errorMessage, meta } = useField(() => 'login')
</script>

<template>
  <Modal
    label="Вход"
    @handleModal="handleModal"
  >
    <Form
      :validation-schema="schema"
      @submit="handleSubmit"
      :initial-values="user"
    >
      <CustomInput
        placeholder="Логин"
        name="login"
        type="text"
        class="form-input"
      />
      <div class="form-input password-input">
        <CustomInput
          placeholder="Пароль"
          name="password"
          :type="showPassword ? 'text' : 'password'"
        />

        <div class="password-icon">
          <img
            v-if="showPassword"
            src="~/assets/svg/passwordOpen.svg"
            alt="password"
            @click="showPassword = !showPassword"
          />
          <img
            v-else
            src="~/assets/svg/passwordClose.svg"
            @click="showPassword = !showPassword"
            alt="password"
          />
        </div>
      </div>

      <small :class="errorMessage ? 'error_message' : ''">{{ errorMessage }}</small>

      <div class="buttons">
        <ButtonComponent
          :disabled="loading"
          type="submit"
          >Войти</ButtonComponent
        >
      </div>
    </Form>
  </Modal>
</template>

<style lang="scss" scoped>
.form-input {
  margin-bottom: 18px;
}

.buttons {
  margin-top: 32px;

  & button {
    font-size: 16px;
  }
}

.password-input {
  position: relative;
}

.password-icon {
  position: absolute;
  top: 10px;
  right: 12px;
  cursor: pointer;
}
</style>
