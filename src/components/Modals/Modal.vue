<script lang="ts" setup>
defineProps<{
  isSearch?: boolean
  label?: string
  color?: string
}>()

const emit = defineEmits(['handleModal'])
const modalRef = ref()
const closeRef = ref()

onClickOutside(modalRef, (event) => emit('handleModal'), { ignore: [closeRef] })
</script>

<template>
  <div class="modal-backdrop">
    <div
      ref="modalRef"
      class="modal"
      :style="{ backgroundColor: color }"
      :class="{ search: isSearch }"
    >
      <div
        class="modal-header"
        v-if="!isSearch"
      >
        <h2 class="modal-label">{{ label }}</h2>
        <button
          class="modal-close"
          @click="emit('handleModal')"
          ref="closeRef"
        >
          <img
            src="~/assets/svg/closeLarge.svg"
            alt="close"
          />
        </button>
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: relative;
  background: $bgGrey;
  padding: 24px;
  border-radius: $mediumRadius;
  z-index: 999;
  min-width: 380px;

  @media screen and (max-width: $medium) {
    min-width: 340px;
  }

  &.search {
    position: fixed;
    top: 0;
    width: 100%;
    border-radius: none;
    background-color: $white;
  }

  &-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    &__left {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
  }

  &-label {
    display: flex;
    justify-content: flex-end;
    font-family: 'Gilroy';
    font-size: 24px;
    line-height: 28px;
    font-weight: 700;
  }
}
</style>
