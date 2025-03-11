<script setup lang="ts">
import Modal from './Modal.vue'
import SwitchInput from '~/components/Inputs/SwitchInput.vue'
import CustomCheckbox from '~/components/Inputs/CustomCheckbox.vue'
import ButtonComponent from '~/components/Buttons/ButtonComponent.vue'
import type { IRightsDataGroups } from '~/types/app.types'

const emit = defineEmits(['handleModal'])
const props = defineProps<{
  chapterId: string
}>()

const route = useRoute()
const rightsStore = useRightsStore()
const { fetchGuestRights, deleteGuestRights } = useGuestStore()
const { rightsData } = storeToRefs(rightsStore)
const checkedUsers = ref<string[][] | any>([])

const fetchRightsData = async () => {
  try {
    await rightsStore.getRightsData(props.chapterId)
  } catch (e) {
    console.log(e)
  }
}

const saveRights = async () => {
  try {
    if (rightsData.value.guest) {
      await fetchGuestRights(props.chapterId)
    } else {
      await deleteGuestRights(props.chapterId)
    }

    const checkedIdsArr = checkedUsers.value.join().split(',')

    await rightsStore.patchRightsData(props.chapterId, checkedIdsArr)
    useNuxtApp().$toast.success('Данные сохранены')
    emit('handleModal')
  } catch (e) {
    useNuxtApp().$toast.error('Ошибка')
  }
}

const setCheckedItems = () => {
  checkedUsers.value = rightsData.value.groups.map((g, i) => {
    if (g.users) {
      return g.users
      .map((u, ind) => {
        if (u.pass) {
          return u.user_id
        }
      })
      .filter(Boolean)
    } else {
      return []
    }
  })
}

const toggleGroup = ($event: Event, index: number, group: IRightsDataGroups) => {
  checkedUsers.value[index] = []
  if (($event.target as HTMLInputElement).checked && group.users.length) {
    group.users.forEach((user: any, ind) => {
      checkedUsers.value[index].push(user.user_id)
    })
  }
}

const toggleAll = ($event: Event) => {
  checkedUsers.value = checkedUsers.value.map(() => [])
  if (($event.target as HTMLInputElement).checked) {
    rightsData.value.groups.forEach((group, ind) => {
      group.users.forEach((user) => {
        checkedUsers.value[ind].push(user.user_id)
      })
    })
  }
}

const isAllChecked = computed(() => {
  return checkedUsers.value.every((item: string[], index: number) => {
    return item.length === rightsData.value.groups[index].users?.length
  })
})

await useAsyncData('rights', fetchRightsData)

onMounted(() => {
  setCheckedItems()
})
</script>

<template>
  <Modal
    label="Права доступа"
    color="#ffffff"
    @handleModal="emit('handleModal')"
    v-if="rightsData"
  >
    <SwitchInput
      v-model="rightsData.guest"
      class="access__switch"
      >Внешний доступ</SwitchInput
    >
    <div class="access">
      <div class="access__checkbox access__checkbox-all">
        <CustomCheckbox
          :checked="isAllChecked"
          :disabled="rightsData.guest"
          @handleChange="toggleAll($event)"
          >Доступен всем заказчикам</CustomCheckbox
        >
      </div>
      <template
        v-for="(group, index) in rightsData.groups"
        :key="group.group_id"
      >
        <details
          class="access__details"
          v-if="group.users"
        >
          <summary class="access__summary">
            <img
              class="access__summary-image"
              src="~/assets/svg/chevronDown.svg"
              alt=""
            />
            <CustomCheckbox
              :id="group.group_id"
              :disabled="rightsData.guest"
              @handleChange="toggleGroup($event, index, group)"
              :checked="checkedUsers?.[index]?.length === group.users?.length"
              :indeterminate="
                checkedUsers?.[index]?.length < group.users?.length && checkedUsers?.[index]?.length !== 0
              "
            />
            <p>{{ group.name }}</p>
          </summary>
          <div class="access__checkbox-list" v-if="group.users">
            <div
              class="access__checkbox"
              v-for="user in group.users"
              :key="user.user_id"
            >
              <CustomCheckbox
                v-model="checkedUsers[index]"
                :value="user.user_id"
                :id="user.user_id"
                :checked="user.pass"
                :disabled="rightsData.guest"
                >{{ user.user_name }}</CustomCheckbox
              >
            </div>
          </div>
        </details>
      </template>
    </div>
    <div class="footer">
      <ButtonComponent
        class="footer__button"
        @click="saveRights"
      >
        Сохранить</ButtonComponent
      >
      <ButtonComponent
        class="footer__button"
        outline
        @click="emit('handleModal')"
      >
        Отмена
      </ButtonComponent>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  right: 0;
  width: -webkit-fill-available;
  background-color: $white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0px 0px 16px 0px #0101011a;
  box-shadow: 0px 4px 8px 0px #01010133;
  border-bottom-right-radius: $smallRadius;
  border-bottom-left-radius: $smallRadius;
  gap: 16px;

  &__button {
    width: auto;
    font-size: 16px;
  }
}

.access {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 24px;

  width: 702px;
  height: 500px;

  &__switch {
    position: absolute;
    top: 22px;
    right: 60px;
    z-index: 3;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
  }

  &__checkbox {
    display: flex;
    align-items: center;
    margin-left: 32px;

    &-all {
      font-family: 'Inter';
      font-weight: 600;
    }

    &-list {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 16px;
    }
  }

  &__details {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  &__details[open] summary {
    margin-bottom: 16px;
  }

  &__summary {
    position: relative;
    display: flex;
    align-items: center;
    style: none;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: margin 150ms ease-out;
    padding: 0;

    &-image {
      transition: 0.2s;
      margin-right: 8px;

      &.hidden {
        visibility: hidden;
      }
    }
  }

  details[open] > summary .access__summary-image {
    transform: rotate(180deg);
  }
}

details > summary {
  style: none;
}

summary::-webkit-details-marker {
  display: none;
}
</style>
