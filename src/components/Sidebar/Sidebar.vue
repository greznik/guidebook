<script setup lang="ts">
import { onUnmounted } from 'vue'
import SidebarNavigation from './SidebarNavigation.vue'

const emit = defineEmits(['closeSidebar', 'selectItem'])

defineProps<{
  sidebarList: any
}>()

const route = useRoute()

onUnmounted(() => {
  emit('closeSidebar')
})

const selectItem = (item: any) => {
  emit('selectItem', item)
}
</script>

<template>
  <aside
    class="sidebar"
    :class="{ isContent: route.name === 'content' }"
  >
    <slot name="header"></slot>
    <SidebarNavigation
      :sidebarList="sidebarList"
      @selectItem="selectItem"
      @closeSidebar="emit('closeSidebar')"
    />

    <!-- <div class="sidebar__backdrop"></div> -->
  </aside>
</template>

<style lang="scss" scoped>
.sidebar {
  display: grid;
  grid-template-rows: auto 1fr;
  position: fixed;
  grid-area: sidebar;
  left: 0;
  top: 0;
  z-index: 5;
  background-color: $bgWhite;
  width: $sidebarWidth;
  min-height: 100dvh;
  min-height: 100vh;

  &.isContent {
    position: static;
    grid-template-rows: 154px 1fr;

    @media screen and (max-width: $big) {
      position: fixed;
    }
  }

  &__backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;
    background-color: #fff;
    opacity: 0.5;
    width: 100vw;
    height: 100vh;
  }

  &.sidebar-hidden {
    transform: translateX(-300px);
    opacity: 0;
    visibility: hidden;
  }
}
</style>
