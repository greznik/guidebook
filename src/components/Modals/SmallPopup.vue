<script setup lang="ts"></script>

<template>
  <div
    class="popup"
    ref="poppup"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.popup {
  position: absolute;
  right: 0;
  z-index: 2;
  top: 50px;
  padding: 8px;
  background-color: #fff;
  border-radius: $smallRadius;
  box-shadow: 0px 0px 16px 0px #0101011a;
  box-shadow: 0px 4px 8px 0px #01010133;
}
</style>
