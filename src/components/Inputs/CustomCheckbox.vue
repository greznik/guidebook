<script setup lang="ts">
const model = defineModel()

const emit = defineEmits(['handleChange'])
defineProps<{
  indeterminate?: boolean
  value?: string
  id?: string
  checked: boolean
  disabled: boolean
}>()
</script>

<template>
  <div class="custom-checkbox">
    <input
      class="custom-checkbox__input"
      type="checkbox"
      :id="id ? id : 'checkbox'"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      :indeterminate.prop="indeterminate"
      @change="$emit('handleChange', $event)"
      v-model="model"
    />
    <label :for="id ? id : 'checkbox'"><slot /></label>
  </div>
</template>

<style lang="scss" scoped>
.custom-checkbox {
  display: contents;

  &__input {
    position: absolute;
    z-index: -1;
    opacity: 0;
    & + label {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      user-select: none;

      font-size: 14px;
      line-height: 20px;
      color: $textPrimary;
    }

    &:disabled:checked + label:before {
      border-color: $disabledCheckbox;
      background-color: $disabledCheckbox;
    }

    &:disabled + label:before {
      border-color: $disabledCheckbox;
      background-color: $disabledCheckbox;
      background-image: url('~/assets/svg/checkbox.svg');
      background-size: 60%;
    }

    & + label:before {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      flex-grow: 0;
      border: 1px solid #a1a3ab;
      border-radius: 4px;
      margin-right: 12px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50% 50%;
    }

    &:checked + label:before {
      border-color: #010101;
      background-color: #010101;
      background-image: url('~/assets/svg/checkbox.svg');
      background-size: 60%;
    }

    &:indeterminate + label:before {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 17px;
      color: #fff;
      content: '─';
      border-color: #010101;
      background-color: #010101;
      background-image: none;
    }
  }
}
</style>
