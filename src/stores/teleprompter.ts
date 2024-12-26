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

  const parsedScript = computed(() => {
    const textContent: string[] = []
    const lines: string[] = []
    const events: { type: string; index: number; id?: string; url?: string }[] = []
    // const regex = /{(edit|image|camera):[^}]*}(.*?){\/edit}?/gs
    const regex = /\{(?<tag>\w+)(?::(?<attributes>[^}]*))?\}(?:(?<content>.*?)\{\/\k<tag>\})?/gs

    let match
    let wordIndex = 0
    while ((match = regex.exec(script.value)) !== null) {
      const [fullMatch, type, attributes, content] = match
      const idMatch = fullMatch.match(/id=([^}]+)/)
      const urlMatch = fullMatch.match(/url=([^}]+)/)

      if (type === 'edit') {
        const cleanLine = content.trim()
        const words = cleanLine.split(/\s+/)

        textContent.push(...words)
        lines.push(cleanLine) // Add the full line to lines array
        wordIndex += words.length
      } else if (type === 'image') {
        events.push({
          type: 'image',
          index: wordIndex,
          id: idMatch?.[1],
          url: urlMatch?.[1],
        })
      } else if (type === 'camera') {
        events.push({
          type: 'camera',
          index: wordIndex,
          id: idMatch?.[1],
        })
      }
    }

    return {
      cleanText: textContent.join(' '),
      lines,
      words: textContent,
      events,
    }
  })

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
    parsedScript,
  }
})

const DEFAULT_SPEED = '1'
const FONT_SIZE = '32'
