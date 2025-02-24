<script setup lang="ts">
import { useTemplateRef, onMounted, computed, ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import useAnimation from '~/modules/animation.client'

// @ts-expect-error I swear to god TS I will harm you
let funcs = null

const patternStarted = ref(false)

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvas')

const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')

const overlayBackgroundFilterInvertValue = computed(() => {
  if (isPreferredDark.value) {
    return 'invert(1)'
  }

  return 'invert(0)'
})

const buttonText = computed(() => patternStarted.value ? 'Stop Sound' : 'Start Sound')

onMounted(() => {
  if (canvasEl.value !== null) {
    // @ts-expect-error I swear to god TS I will harm you
    funcs = useAnimation(canvasEl)
  }
})

const handleSoundEnable = () => {
  if (!patternStarted.value) {
    // @ts-expect-error I swear to god TS I will harm you
    funcs.initPattern()

    patternStarted.value = true
  }
  else {
    // @ts-expect-error I swear to god TS I will harm you
    funcs.stopPattern()

    patternStarted.value = false
  }
  // @ts-expect-error I swear to god TS I will harm you
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
  <button
    class="sound-start"
    @click="handleSoundEnable"
  >
    <span class="sound-start-text">
      {{ buttonText }}
    </span>
    <svg
      width="500"
      height="500"
      viewBox="0 0 75 75"
      class="sound-start-icon"
    >
      <path
        d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
        style="stroke:currentColor;stroke-width:5;stroke-linejoin:round;fill:currentColor;"
      />
      <path
        v-if="patternStarted"
        d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
        style="fill:transparent;stroke:currentColor;stroke-width:5;stroke-linecap:round"
      />
    </svg>
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

.sound-start {
  background-color: transparent;
  padding: 0;
  border: none;
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  z-index: 2;
  color: var(--text-color);
  cursor: pointer;
}

.sound-start-text {

  border: 0;
    padding: 0;
    margin: 0;
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
}

.sound-start-icon {
  width: 4rem;
  height: 4rem;
}
</style>
