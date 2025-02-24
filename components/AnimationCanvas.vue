<script setup lang="ts">
import { useTemplateRef, onMounted, computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import useAnimation from '~/modules/animation.client'

let funcs = null
let patternStarted = false

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvas')

const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')

const overlayBackgroundFilterInvertValue = computed(() => {
  if (isPreferredDark.value) {
    return 'invert(1)'
  }

  return 'invert(0)'
})

onMounted(() => {
  if (canvasEl.value !== null) {
    // @ts-expect-error I swear to god TS I will harm you
    funcs = useAnimation(canvasEl)
  }
})

const handleSoundEnable = () => {
  console.log('enableing')

  if (!patternStarted) {
    funcs.initPattern()

    patternStarted = true
  }
  else {
    funcs.stopPattern()

    patternStarted = false
  }
  funcs.initSynth()
}
</script>

<template>
  <canvas
    ref="canvas"
    width="400"
    height="400"
    class="canvas"
  />
  <div class="overlay" />
  <button @click="handleSoundEnable">
    Start Synth
  </button>
</template>

<style lang="scss" scoped>
.canvas {
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  z-index: 0;
  background-color: #fff;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
  top: 0;
  left: 0;
  opacity: 1;
  background-color: #effaf3;
  z-index: 1;
  mix-blend-mode: multiply;
  backdrop-filter: v-bind(overlayBackgroundFilterInvertValue);
  transition: backdrop-filter var(--theme-transition-time) var(--easing);
}

button {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
}
</style>
