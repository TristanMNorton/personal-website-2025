<script setup lang="ts">
import SiteHeader from '~/components/SiteHeader.vue'
import AnimationCanvas from '~/components/AnimationCanvas.vue'
import '~/assets/styles/_global.scss'
</script>

<template>
  <div class="body">
    <AnimationCanvas />
    <SiteHeader class="siteHeader" />
  </div>
</template>

<style lang="scss" scoped>
.body {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: "EB Garamond", serif;
}

.siteHeader {
  position: relative;
  z-index: 1;
}
</style>
