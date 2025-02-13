<script setup>
import { useField } from 'vee-validate'

const model = defineModel()

const emit = defineEmits(['inputChange'])
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: String,
  placeholder: String,
  label: String,
  inputOnly: Boolean,
  maxLength: Number,
})

const { value, errorMessage, meta } = useField(() => props.name)
</script>

<template>
  <div class="wrapper">
    <label
      v-if="label"
      :for="name"
      >{{ label }}</label
    >
    <slot name="icon"></slot>
    <textarea
      v-if="type === 'textarea'"
      class="textarea"
      v-model="model"
      :placeholder="placeholder"
      :maxLength="maxLength"
      @input="emit('inputChange', $event)"
      :id="type"
      rows="5"
    ></textarea>
    <template v-else>
      <input
        v-if="inputOnly"
        :id="name"
        :class="{
          field_error: errorMessage,
          valid: meta.valid,
          'search-input': type === 'search',
        }"
        class="input"
        v-model="model"
        :maxLength="maxLength"
        @input="emit('inputChange', $event)"
        :placeholder="placeholder"
        :type="type || 'text'"
        autocomplete="on"
      />
      <input
        v-else
        :id="name"
        :class="{ field_error: errorMessage, valid: meta.valid }"
        class="input"
        v-model="value"
        @input="emit('inputChange', $event)"
        :placeholder="placeholder"
        :type="type || 'text'"
        autocomplete="on"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  flex-direction: column;
}
.error_message {
  color: red;
}
.field_error {
  border: 1px solid red !important;
}
.textarea {
  border-radius: $smallRadius;
  padding: 10px 20px;
  font-size: 14px;
  font-family: 'Inter';
  background-color: $greyNeutral;
  border: none;
  outline: none;
  resize: none;

  &::placeholder {
    color: $placeholderGrey;
    font-size: 14px;
  }
}
.input {
  height: 40px;
  border-radius: $smallRadius;
  padding: 0px 20px;
  font-size: 14px;
  background-color: $greyNeutral;
  border: none;

  &.search-input {
    padding-left: 40px;
    border: 1px solid $bgGrey;
  }

  &::placeholder {
    color: $placeholderGrey;
    font-size: 14px;
    opacity: 1; /* Firefox */
  }

  &:focus {
    outline: none;
  }
}
// .valid {
//   border: 1px solid green !important;
// }
label {
  font-size: 14px;
  font-weight: 600;
}

input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
  height: 1.5rem;
  width: 1.5rem;
  background: url('~/assets/svg/closeLarge.svg') no-repeat;
  background-size: contain;
  opacity: 0;
  filter: brightness(0%);
}

input[type='search']:focus::-webkit-search-cancel-button {
  opacity: 0.3;
  pointer-events: all;
}
</style>
