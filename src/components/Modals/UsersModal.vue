<script setup lang="ts">
import Modal from './Modal.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'

const emit = defineEmits(['handleModal'])
</script>

<template>
  <Modal
    @handleModal="emit('handleModal')"
    label="Сотрудники"
  >
    <details>
      <summary>
        <p>12312312</p>
        <p>1231231212312</p>
      </summary>
    </details>
    <div class="footer">
      <ButtonComponent> Создать</ButtonComponent>
      <ButtonComponent outline> Отмена </ButtonComponent>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.footer {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    border: 1px solid $textSecondary;
    box-shadow: 0px 0px 16px 0px #0101011a;
    box-shadow: 0px 4px 8px 0px #01010133;
  }

  & button {
    width: auto;
  }
}
</style>
