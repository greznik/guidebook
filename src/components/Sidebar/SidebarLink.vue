<script setup lang="ts">
import { ROLES } from '~/constants';

const props = defineProps<{
  item: any
  card: any
}>()

const emit = defineEmits(['selectItem', 'selectDeletingItem'])

const { hasEditable } = storeToRefs(useAuthStore())
const route = useRoute()

const selectItem = async (item: any) => {
  await navigateTo({
    path: '/content',
    query: {
      chapter: props.card?.id,
      seed: item?.id,
      tab: item?.sheets?.[0]?.id,
    },
  })
  emit('selectItem', item)
}

const choiseDeleteItem = (item: any) => {
  selectItem(item)
  emit('selectDeletingItem', item)
}

onMounted(() => {
  if (props.item?.id === route.query.seed) {
    selectItem(props.item)
  }
})

watch(
  () => route.query.seed,
  (value) => {
    if (value === props.item.id) {
      selectItem(props.item)
    }
  },
)
</script>

<template>
  <div
    class="navigation__list-buttons"
    :class="{ active: item.id === route.query.seed }"
  >
    <button
      class="navigation__list-link"
      @click="selectItem(item)"
    >
      <img
        :class="{ hidden: true }"
        src="~/assets/svg/dragVerticalDots.svg"
        alt=""
      />
      <p class="navigation__list-text">{{ item.name }}</p>
    </button>
    <button
      v-if="hasEditable && route.name === 'content' && card.seeds.length > 1"
      class="navigation__list-delete"
      @click="choiseDeleteItem(item)"
    >
      <img
        src="~/assets/svg/deleteTrash.svg"
        alt=""
      />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.navigation__list {
  &-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: $smallRadius;
    transition: background-color 0.3s ease;
    padding: 8px;
    margin-bottom: 8px;

    &:hover {
      background-color: $greyNeutral;
    }

    &:hover .navigation__list-delete {
      visibility: visible;
      opacity: 1;
    }

    &.active {
      background-color: $bgGrey;
    }
  }

  &-delete {
    display: flex;
    justify-content: center;
    align-items: center;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    font-family: 'Inter';
    font-size: 14px;
    line-height: 20px;
    color: $textPrimary;

    & img.hidden {
      visibility: hidden;
    }
  }

  &-text {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}
</style>
