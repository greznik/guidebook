<script setup lang="ts"></script>

<template>
  <footer class="footer">
    <p class="footer__text">© {{ new Date().getFullYear() }} Все права защищены. ООО Фирма «СТОМ»</p>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid $disabledPrimary;
  padding-top: 24px;
  padding-bottom: 24px;
  margin-top: auto;
  width: 100%;

  &__text {
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    color: $textSecondary;

    @media screen and (max-width: $medium) {
      font-size: 12px;
      line-height: 16px;
    }
  }
}
</style>
