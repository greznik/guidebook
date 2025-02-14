<script setup lang="ts">
const model = defineModel<boolean>()
defineProps<{}>()
</script>

<template>
  <label class="switcher">
    <input type="checkbox" v-model="model"/>
    <span class="switcher-switch"></span>
    <slot class="switcher__text"></slot>
  </label>
</template>

<style lang="scss" scoped>
.switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 28px;
  line-height: 20px;
  margin-right: 10px;
  position: relative;
  vertical-align: middle;
  font-size: 14px;
  user-select: none;
  cursor: pointer;

  &__text {
    font-family: 'Inter';
    font-size: 14px;
    line-height: 20px;
    color: $textPrimary;
  }
}
.switcher .switcher-switch {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 42px;
  height: 24px;
  border-radius: 25%/50%;
  vertical-align: top;
  background: $hoverGrey;
  transition: 0.2s;
}
.switcher .switcher-switch:before {
  content: '';
  position: absolute;
  top: 2px;
  left: 1px;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
  transition: 0.15s;
}
.switcher input[type='checkbox'] {
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  z-index: -1;
  opacity: 0;
}
.switcher input[type='checkbox']:not(:disabled):active + .switcher-switch:before {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
}
.switcher input[type='checkbox']:checked + .switcher-switch {
  background: $black;
}
.switcher input[type='checkbox']:checked + .switcher-switch:before {
  transform: translateX(20px);
}

/* Hover */
.switcher input[type='checkbox']:not(:disabled) + .switcher-switch {
  cursor: pointer;
}

/* Disabled */
.switcher input[type='checkbox']:disabled + .switcher-switch {
  filter: grayscale(70%);
  border-color: rgba(0, 0, 0, 0.1);
}
.switcher input[type='checkbox']:disabled + .switcher-switch:before {
  background: #eee;
}
</style>
