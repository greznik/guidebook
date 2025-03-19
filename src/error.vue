<script setup lang="ts">
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
const error = useError()

const handleError = () => {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <NuxtLayout>
    <div class="error">
      <div class="error__wrapper">
        <HeaderComponent>
          <template #header>
            <div class="header__logo">GuideBook</div>
          </template>
        </HeaderComponent>
        <div class="error__block">
          <div class="error__info">
            <p
              class="error__info-text"
              v-if="error?.statusCode === 404"
            >
              Страница не найдена
            </p>
            <p
              class="error__info-text"
              v-else
            >
              Раздел недоступен
            </p>
            <ButtonComponent
              class="error__info-button"
              outline
              @click="handleError"
            >
              На главную
            </ButtonComponent>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.error {
  height: 100%;
  background-color: $bgGrey;

  &__wrapper {
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

  &__block {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    height: 80vh;
    background-color: $bgWhite;
    border-radius: $mediumRadius;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 16px;
    &-text {
      font-size: 16px;
      color: $textSecondary;
    }

    &-button {
      width: auto;
    }
  }
}
</style>
