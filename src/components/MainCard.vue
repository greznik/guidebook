<script lang="ts" setup>
import { useWindowSize } from '@vueuse/core'
import { WIDTH_BREAKPOINT } from '~/constants'
const emit = defineEmits(['openSidebar'])

const props = defineProps<{
  card: any
}>()
const { width } = useWindowSize({ initialWidth: 0 })


const handleCardClick = async () => {
  if (width.value > WIDTH_BREAKPOINT) {
    await navigateTo({
      path: '/content',
      query: {
        chapter: props.card?.chapters?.[0]?.id,
        seed: props.card?.chapters?.[0]?.seeds?.[0]?.id,
        tab: props.card?.chapters?.[0]?.seeds?.[0]?.sheets?.[0]?.id,
      },
    })
  }
}

const getShorterChapterList = computed(() => {
  return props.card.chapters.slice(0, 4)
})

const getRemainingChapters = computed(() => {
  if (props.card.chapters.length > 5) {
    return props.card.chapters.length - getShorterChapterList.value.length
  } else {
    return 0
  }
})
</script>

<template>
  <div
    class="card"
    @click="handleCardClick"
  >
    <ClientOnly>
      <NuxtLink
        v-if="width > WIDTH_BREAKPOINT"
        :to="{
          path: '/content',
          query: {
            chapter: card?.chapters?.[0]?.id,
            seed: card?.chapters?.[0]?.seeds?.[0]?.id,
            tab: card?.chapters?.[0]?.seeds?.[0]?.sheets?.[0]?.id,
          },
        }"
        class="card__header"
      >
        <h2 class="card__header-title">{{ card.name }}</h2>
        <img
          src="~/assets/svg/chevronRight.svg"
          alt="chevrone"
          class="card__header-icon"
        />
      </NuxtLink>
      <button
        v-else
        class="card__header"
        @click="emit('openSidebar', card.chapters?.[0]?.id)"
      >
        <h2 class="card__header-title">{{ card.name }}</h2>
        <img
          v-if="card.chapters?.length"
          src="~/assets/svg/chevronRight.svg"
          alt="chevrone"
          class="card__header-icon"
        />
      </button>
    </ClientOnly>
    <ul
      v-if="card.chapters?.length"
      class="card__list"
    >
      <li
        v-for="(item, index) in getShorterChapterList"
        :key="`${index}${item.id}`"
      >
        <NuxtLink
          class="card__list-link"
          :to="{
            path: '/content',
            query: { chapter: item.id, seed: item.seeds?.[0].id, tab: item.seeds?.[0]?.sheets?.[0]?.id },
          }"
          >{{ item.name }}
        </NuxtLink>
      </li>
      <li
        v-if="getRemainingChapters"
        class="card__list-button"
      >
        + {{ getRemainingChapters }} разделов
      </li>
    </ul>
    <div
      v-else
      class="card__empty"
    >
      <p>Добавь первый раздел</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 264px;
  border-radius: 12px;
  background-color: $bgWhite;
  padding: 24px;
  cursor: pointer;
  transition: box-shadow 0.4s ease;

  &:hover {
    box-shadow: 0px 4px 8px 0px #01010126;
  }

  @media screen and (max-width: $big) {
    height: fit-content;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    font-family: 'Gilroy';
    color: $textPrimary;

    &-hidden {
      display: none;
    }

    &-title {
      font-size: 20px;
      line-height: 24px;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    flex: 1;
    margin-top: 12px;

    @media screen and (max-width: $big) {
      display: none;
    }

    &-link {
      font-size: 16px;
      line-height: 24px;
      color: $textSecondary;
      margin: 0;

      &:hover {
        color: $softRed;
        text-decoration: underline $softRed;
      }
    }

    &-button {
      font-family: 'Inter';
      font-size: 16px;
      line-height: 24px;
      color: $textPrimary;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: $textSecondary;
    font-size: 16px;
    line-height: 20px;

    @media screen and (max-width: $big) {
      display: none;
    }

    p {
      font-family: 'Inter';
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
    }
  }
}
</style>
