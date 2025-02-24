<script setup lang="ts">
import PlusIcon from '~/components/Icons/PlusIcon.vue'

interface IButton {
  hasIcon?: boolean
  type?: 'button' | 'submit' | 'reset'
  transparent?: boolean
  disabled?: boolean
  isAuth?: boolean
  user?: boolean
  outline?: boolean
  isDelete?: boolean
  iconColor?: string
}

withDefaults(defineProps<IButton>(), {
  hasIcon: false,
  type: 'button',
  transparent: false,
  disabled: false,
  isAuth: false,
  outline: false,
  isDelete: false,
  iconColor: '#F9FAFB',
})
</script>

<template>
  <button
    :disabled="disabled"
    class="button"
    :class="{ active: isAuth, transparent: transparent, user: user, outline: outline, delete: isDelete }"
    :type="type"
  >
    <PlusIcon
      v-if="hasIcon"
      :color="iconColor"
    />
    <slot />
    <slot name="icon"></slot>
  </button>
</template>

<style lang="scss">
.button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  color: $bgWhite;
  background-color: $textPrimary;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  & svg path {
    fill: #f9fafb;
  }

  &:disabled {
    background-color: $disabledPrimary;
    cursor: default;
  }

  &.active {
    background-color: $disabledPrimary;
  }

  &:hover:not(:disabled) {
    background-color: $hoverPrimary;
  }

  &.delete {
    background-color: $softRed;
  }

  &.user {
    background-color: $disabledPrimary;
    color: $textPrimary;
    padding: 10px 8px;
    justify-content: flex-start;
    padding: 10px 16px;

    &:hover {
      background-color: $hoverGrey;
    }
  }

  &.transparent {
    background-color: transparent;
    color: $textPrimary;
    padding: 10px 8px;
    justify-content: flex-start;

    &:hover {
      background-color: $bgGrey;
    }

    & path {
      fill: #0e1117;
      stroke: #0e1117;
    }
  }

  &.outline {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: $textPrimary;
    border: 1px solid $greyNeutral2;
    border-radius: $smallRadius;

    &:hover {
      background-color: transparent;
    }
  }

  &.transparent .button__text {
    font-family: 'Inter';
    font-weight: 500;
    font-size: 14px;
  }

  &__text {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>
