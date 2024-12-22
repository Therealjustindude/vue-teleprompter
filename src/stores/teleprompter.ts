import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { formatTimeMMSS } from '@/utils/formatTimeMMSS'

export const useTeleprompterStore = defineStore('teleprompter', () => {
  const isPlaying = ref(false)
  const teleprompterSpeedSlider = ref(DEFAULT_SPEED)
  const fontSizeSlider = ref(FONT_SIZE)
  const AVERAGE_READING_SPEED = 200 // Words per minute
  const script = ref('')

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

  const wordCount = computed(() => script.value.split(/\s+/).length)

  const estimatedReadingTime = computed(() => {
    const wordsPerSecond = AVERAGE_READING_SPEED / 60
    const speedFactor = Number(teleprompterSpeedSlider.value) || 1
    const effectiveWordsPerSecond = wordsPerSecond * speedFactor
    const totalSeconds = wordCount.value / effectiveWordsPerSecond

    return formatTimeMMSS(totalSeconds)
  })

  function updateScript(newScript: string) {
    script.value = newScript
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
    estimatedReadingTime,
    updateScript,
  }
})

const DEFAULT_SPEED = '1'
const FONT_SIZE = '32'
