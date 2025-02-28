<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'bottom',
  },
  tooltipId: {
    type: String,
    default: 'tooltip__text',
  },
})

const tooltipClasses = computed(() => ({
  tooltip__text: true,
  [`tooltip--${props.position}`]: true,
}))
</script>

<template>
  <div class="tooltip-wrapper">
    <slot />
    <span
      :class="tooltipClasses"
      role="tooltip"
      :id="tooltipId"
      inert
      >{{ text }}</span
    >
  </div>
</template>

<style lang="scss" scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip__text {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s;

  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  text-align: center;
  padding: 8px 12px;
  min-width: 90px;
  border-radius: $ultraSmallRadius;
  background: $bgTooltip;

  position: absolute;
  z-index: 1;
}

.tooltip-wrapper:hover .tooltip__text {
  visibility: visible;
  opacity: 1;
}

:slotted(*):focus + .tooltip__text {
  visibility: visible;
  opacity: 1;
}

.tooltip--top {
  inset-block-end: 120%;
  inset-inline-start: 50%;
  margin-inline-start: -60px;
}

.tooltip--bottom {
  inset-block-start: 120%;
  inset-inline-start: -90%;
}

.tooltip--left {
  inset-block-start: 120%;
  inset-inline-start: -25%;
  margin-inline-start: -60px;
}

.tooltip--right {
  inset-block-end: 0%;
  inset-inline-start: 110%;
}

.tooltip__text::after {
  content: ' ';
  position: absolute;
  border-width: 5px;
  border-style: solid;
  border-color: $bgTooltip transparent transparent transparent;
}

.tooltip--left::after {
  inset-block-end: 100%;
  inset-inline-start: 75%;
  border-color: transparent transparent $bgTooltip transparent;
}

.tooltip--right::after {
  inset-block-start: 50%;
  inset-inline-end: 100%;
  border-color: transparent $bgTooltip transparent transparent;
}

.tooltip--top::after {
  inset-block-start: 100%;
  inset-inline-start: 50%;
  border-color: $bgTooltip transparent transparent transparent;
}

.tooltip--bottom::after {
  inset-block-end: 100%;
  inset-inline-start: 50%;
  border-color: transparent transparent $bgTooltip transparent;
}
</style>
