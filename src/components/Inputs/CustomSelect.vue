<script setup lang="ts">
import { ROLES_NAMES, SELECT_ROLES } from '~/constants'
import { useForm } from 'vee-validate'

const props = defineProps<{
  name: string
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const currentSelect = ref('')

const { value, errorMessage, meta } = useField(() => props.name)

const selectItem = (item: { name: string; role: number }) => {
  currentSelect.value = item.name
  value.value = item.role
}

onMounted(() => {
  const roleKey = value.value as keyof typeof ROLES_NAMES
  currentSelect.value = ROLES_NAMES[roleKey]
})

watch(
  () => errorMessage.value,
  (newValue) => {
    useNuxtApp().$toast.error('Заполни данные пользователя');
  },
)
</script>

<template>
  <div
    class="aselect"
    :data-list="SELECT_ROLES"
  >
    <div
      class="selector"
      :class="{ error: errorMessage }"
      @click="toggle()"
    >
      <div class="label">
        <span
          class="label__span"
          v-if="currentSelect"
          >{{ currentSelect }}</span
        >
        <span v-else>Роль</span>
      </div>
      <img
        class="arrow"
        :class="{ expanded: isOpen }"
        src="~/assets/svg/chevronDown.svg"
        alt="chevronDown"
      />
      <div :class="{ hidden: !isOpen, isOpen }">
        <ul>
          <li
            :class="{ current: item.name === currentSelect }"
            v-for="item in SELECT_ROLES"
            @click="selectItem(item)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aselect {
  .selector {
    height: 40px;
    border-radius: 8px;
    padding: 0px 12px;
    font-size: 14px;
    background-color: #f3f4f6;
    border: none;
    position: relative;
    z-index: 1;
    cursor: pointer;

    &.error {
      border: 1px solid red;
    }

    .arrow {
      position: absolute;
      right: 10px;
      top: 10px;
      transform: rotateZ(0deg) translateY(0px);
      transition-duration: 0.3s;
      transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
    }
    .expanded {
      transform: rotateZ(180deg) translateY(2px);
    }
    .label {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100%;
      font-size: 16px;
      color: $placeholderGrey;

      &__span {
        color: $textPrimary;
      }
    }
  }
  ul {
    width: 100%;
    list-style-type: none;
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    border-radius: $smallRadius;
    box-shadow: 0px 0px 16px 0px #0101011a;
    box-shadow: 0px 4px 8px 0px #01010133;
    position: absolute;
    right: 0;
    top: 45px;
    z-index: 1;
    background: #fff;
  }

  li {
    padding: 4px 8px;
    margin: 4px 0;
    border-radius: $ultraSmallRadius;
    color: $textPrimary;
    &:hover {
      cursor: pointer;
      background: $bgGrey;
    }
  }
  .current {
    position: relative;
    background: #eaeaea;

    &:after {
      content: '';
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      background-image: url('~/assets/svg/checkSmall.svg');
    }
  }
  .hidden {
    visibility: hidden;
  }
  .visible {
    visibility: visible;
  }
}
</style>
