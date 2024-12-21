import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTeleprompterStore = defineStore('teleprompter', () => {
  const isPlaying = ref(false)
  const teleprompterSpeedSlider = ref(DEFAULT_SPEED)
  const fontSizeSlider = ref(FONT_SIZE)

  function startPlaying() {
    isPlaying.value = true
  }

  function stopPlaying() {
    isPlaying.value = false
  }

  function updateSpeedSlider(value: string) {
    teleprompterSpeedSlider.value = value
  }

  function updateFontSlider(value: string) {
    fontSizeSlider.value = value
  }

  function resetTeleprompterSliders() {
    teleprompterSpeedSlider.value = DEFAULT_SPEED
    fontSizeSlider.value = FONT_SIZE
  }

  return {
    isPlaying,
    startPlaying,
    stopPlaying,
    teleprompterSpeedSlider,
    fontSizeSlider,
    updateSpeedSlider,
    updateFontSlider,
    resetTeleprompterSliders,
  }
})

const DEFAULT_SPEED = '1'
const FONT_SIZE = '32'
