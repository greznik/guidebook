<script setup lang="ts">
import PlusIcon from '~/components/Icons/PlusIcon.vue'
</script>
<template>
  <button class="card-button">
    <PlusIcon
      color="#0E1117"
      class="card-button-icon"
    />
    <p class="card-button-text">Новый отдел</p>
  </button>
</template>

<style lang="scss" scoped>
.card-button {
  border-radius: $mediumRadius;
  background-color: $cardButton;
  padding: 12px;
  height: 264px;
  transition: background-color 0.2s ease;

  @media screen and (max-width: $big) {
    height: fit-content;
  }

  &:hover {
    background-color: $cardButtonHover;
  }

  &-text {
    font-size: 16px;
    line-height: 20px;
    color: $textSecondary;
    margin-top: 24px;

    @media screen and (max-width: $big) {
      margin-top: 0;
    }
  }
}
</style>
