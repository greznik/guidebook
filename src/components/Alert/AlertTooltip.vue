<script setup lang="ts">
defineProps<{
  message: string
  type: string
}>()
</script>

<template>
  <div
    class="alert"
    :class="type"
  >
    {{ message }}
  </div>
</template>

<style scoped>

</style>
