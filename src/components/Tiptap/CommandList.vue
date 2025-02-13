<script setup lang="ts">
import type { SuggestionItem } from '~/types/app.types'

interface Props {
  items: SuggestionItem[]
  command: (item: SuggestionItem) => void
}

const props = defineProps<Props>()

const selectedIndex = ref(0)
const containerRef = ref<HTMLElement | null>(null)
const itemRefs = ref<(HTMLElement | null)[]>([])

const setItemRef = (el: HTMLElement | null, index: number) => {
  itemRefs.value[index] = el
}

const selectItem = (index: number) => {
  props.command(props.items[index])
}

const scrollToSelected = () => {
  nextTick(() => {
    const selectedElement = itemRefs.value[selectedIndex.value]
    if (selectedElement && containerRef.value) {
      const container = containerRef.value
      const elementTop = selectedElement.offsetTop
      const elementBottom = elementTop + selectedElement.offsetHeight
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.clientHeight

      if (elementTop < containerTop) {
        container.scrollTop = elementTop
      } else if (elementBottom > containerBottom) {
        container.scrollTop = elementBottom - container.clientHeight
      }
    }
  })
}

const onKeyDown = (event: KeyboardEvent): boolean => {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value - 1 + props.items.length) % props.items.length
    scrollToSelected()
    return true
  }
  if (event.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % props.items.length
    scrollToSelected()
    return true
  }
  if (event.key === 'Enter') {
    selectItem(selectedIndex.value)
    return true
  }
  return false
}

watch(
  () => props.items,
  () => {
    selectedIndex.value = 0
    scrollToSelected()
  },
)

onMounted(() => {
  scrollToSelected()
})

defineExpose({ onKeyDown })
</script>

<template>
  <div
    ref="containerRef"
    class="commands"
  >
    <div class="commands__title">НАЧАЛЬНЫЕ БЛОКИ</div>
    <button
      v-for="(item, index) in items"
      :key="item.name"
      :ref="(el) => setItemRef(el as HTMLElement | null, index)"
      class="commands__button"
      :class="{ active: index === selectedIndex }"
      @click="selectItem(index)"
    >
      <div class="commands__button-wrapper">
        <Icon
          :name="item.icon"
          class="commands__button-icon"
        />
      </div>
      <div class="commands__info">
        <span class="commands__info-name">{{ item.name }}</span>
        <span class="commands__info-description">{{ item.description }}</span>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.commands {
  background-color: white;
  max-height: 20rem; // 80 * 0.25rem (assuming base font size is 16px)
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid #e5e7eb; // gray-200
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem; // rounded-lg
  padding-top: 0.5rem; // py-2
  padding-bottom: 0.5rem; // py-2
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  width: 16rem; // 64 * 0.25rem

  &__title {
    padding-left: 0.75rem; // 12px
    padding-right: 0.75rem; // 12px
    padding-top: 0.5rem; // 8px
    padding-bottom: 0.5rem; // 8px
    font-size: 0.875rem; // 14px
    color: #6b7280;
    font-weight: 500;
  }

  &__button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.75rem; // 3 * 0.25rem
    padding: 0.5rem 0.75rem; // py-2 = 0.5rem, px-3 = 0.75rem
    transition: background-color 150ms;

    &.active {
      background-color: #f7fafc;
    }

    &:hover {
      background-color: #f7fafc; // Gray-100
    }

    &-wrapper {
      background-color: #e5e7eb; // bg-gray-200
      border-radius: 0.125rem; // rounded-sm
      height: 2rem; // h-8
      width: 2rem; // w-8
      display: flex; // flex
      align-items: center; // items-center
      justify-content: center; // justify-center
    }

    &-icon {
      width: 1.25rem; // 5 * 0.25rem
      height: 1.25rem; // 5 * 0.25rem
      color: #4b5563; // gray-600
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    text-align: left;

    &-name {
      color: #1f2937; // text-gray-900
      font-weight: 500; // font-medium
      font-size: 0.875rem; // text-sm
    }

    &-description {
      color: #6b7280; // text-gray-500
      font-size: 0.75rem; // text-xs
    }
  }
}
</style>
