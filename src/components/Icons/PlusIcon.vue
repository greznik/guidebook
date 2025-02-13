<script lang="ts" setup>
withDefaults(defineProps<{ color?: string }>(), {
  color: '#F9FAFB',
})
</script>

<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    :fill="color"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_2349_16122)">
      <path
        d="M12 4.99999V19"
        :stroke="color"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 12H19"
        :stroke="color"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2349_16122">
        <rect
          width="24"
          height="24"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
</template>
