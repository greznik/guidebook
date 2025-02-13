<script lang="ts" setup>
import { refDebounced } from '@vueuse/core'
import Modal from './Modal.vue'
import CustomInput from '../Inputs/CustomInput.vue'

const { searchContent } = useTreeStore()

const search = ref('')
const debouncedSearch = refDebounced(search, 1000)
const emit = defineEmits(['handleSearch'])
const searchData = ref([]) as any
const canNotFind = ref(false)

const handleSearch = async (value: string) => {
  try {
    const result = await searchContent(value)
    if (result) {
      canNotFind.value = false
    } else {
      canNotFind.value = true
    }
    searchData.value = result
  } catch (error) {
    console.log(error)
  }
}

const isUpperCase = (c: string) => {
  return !!c && c != c.toLocaleLowerCase()
}

const isLowerCase = (str: string) => {
  return str !== str.toUpperCase()
}

const highlightText = (text: string) => {
  return text.replace(search.value, `<span style="color: white; background: black;">${search.value}</span>`)
}

const selectSearch = async (chapter: any) => {
  emit('handleSearch')
  await navigateTo({
    path: '/content',
    query: {
      chapter: chapter.id,
      seed: chapter.seed.id,
      tab: chapter.seed.sheet.id,
    },
  })
}

watch(
  () => debouncedSearch.value,
  (value) => {
    handleSearch(value)
  },
)
</script>

<template>
  <Modal isSearch>
    <div class="search">
      <div class="search__block">
        <div class="search__input">
          <button
            @click="emit('handleSearch')"
            class="search__input-close chevron"
          >
            <img
              src="~/assets/svg/chevronRight.svg"
              alt=""
            />
          </button>
          <CustomInput
            placeholder="Найти"
            name="search"
            type="search"
            v-model="search"
            inputOnly
          >
            <template #icon>
              <img
                class="search__input-search"
                src="~/assets/svg/search.svg"
                alt="search"
              />
            </template>
          </CustomInput>
          <button
            @click="emit('handleSearch')"
            class="search__input-close"
          >
            Отмена
          </button>
        </div>
        <div class="search__field">
          <ul
            class="search__list"
            v-if="search"
          >
            <li
              v-for="(search, index) in searchData"
              :key="index"
              class="search__list-item"
            >
              <button
                class="search__list-link"
                @click="selectSearch(search.group.chapter)"
              >
                <div class="search__list-block">
                  <p v-html="highlightText(search.group.chapter.name)"></p>
                  <p
                    class="search__list-block_name"
                    v-html="highlightText(search.group.chapter.seed.name)"
                  ></p>
                  <p
                    class="search__list-block_name"
                    v-html="highlightText(search.group.chapter.seed.sheet.name)"
                  ></p>
                </div>
                <p class="search__list-link_group">{{ search.group.name }}</p>
              </button>
            </li>
          </ul>
          <div v-else>
            <p class="search__field-description">Введите поисковой запрос</p>
          </div>

          <div
            v-if="canNotFind && search"
            class="search__field-noresult"
          >
            <img
              src="~/assets/svg/search.svg"
              alt="search"
            />
            <h3>Ничего не найдено</h3>
            <p>Попробуй изменить запрос</p>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.search {
  margin: 0 auto;
  max-width: 800px;

  &__block {
    margin-right: 16px;
    margin-left: 16px;
  }

  &__input {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    width: 100%;
    margin-bottom: 24px;

    &-search {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;

      @media screen and (max-width: $medium) {
        left: 50px;
      }
    }

    &-close {
      display: inline-block;
      font-size: 16px;
      line-height: 24px;
      color: $textPrimary;

      @media screen and (max-width: $medium) {
        display: none;
      }

      &.chevron {
        display: none;
        transform: rotate(180deg);
        @media screen and (max-width: $medium) {
          display: inline-flex;
        }
      }
    }
  }

  &__field {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60px;

    &-description {
      font-family: 'Inter';
      font-size: 16px;
      line-height: 20px;
    }

    &-noresult {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      & h3 {
        font-family: 'Gilroy';
        font-size: 20px;
        line-height: 24px;
        font-weight: 700;
      }

      & p {
        font-size: 16px;
        line-height: 24px;
        color: $textSecondary;
      }

      & img {
        margin-bottom: 24px;
      }
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
    width: 100%;

    &-item {
      width: 100%;
    }

    &-link {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-direction: row;
      font-family: 'Inter';
      color: $textPrimary;
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      padding: 8px;

      &:hover {
        background-color: $greyNeutral;
        border-radius: $mediumRadius;
      }

      &_group {
        font-family: 'Inter';
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: $textPrimary;
        background-color: $bgGrey;
        border-radius: $smallRadius;
        padding: 4px 8px;
      }
    }

    &-block {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;

      &_name:last-child {
        @media screen and (max-width: $medium) {
          white-space: nowrap;
          overflow: hidden !important;
          text-overflow: ellipsis;
          width: 80px;
        }
      }

      &_name:before {
        content: '·';
        margin-right: 4px;
      }
    }
  }
}
</style>
