<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import TeleprompterController from './TeleprompterController.vue'
import { useTeleprompterStore } from '@/stores/teleprompter'

defineProps<{
  script: string
}>()
const teleprompterStore = useTeleprompterStore()
let isDragging = false
let startX: number, startY: number, startLeft: number, startTop: number
const teleprompterContainerRef = ref<HTMLElement | null>(null)
const textContainerRef = ref<HTMLElement | null>(null)
let animationFrameId: number | null = null
let position = 0

const textStyle = computed(() => ({
  fontSize: `${teleprompterStore.fontSizeSlider}px`,
}))

const isInBottomRightHandle = (e: MouseEvent | TouchEvent) => {
  if (!teleprompterContainerRef.value) return false
  const rect = teleprompterContainerRef.value.getBoundingClientRect()
  const resizeHandleMargin = 10
  let isInHorizontalHandle: boolean = false
  let isInVerticalHandle: boolean = false
  if (e instanceof TouchEvent) {
    isInHorizontalHandle = rect.right - e.touches[0].clientX <= resizeHandleMargin
    isInVerticalHandle = rect.bottom - e.touches[0].clientY <= resizeHandleMargin
  }
  if (e instanceof MouseEvent) {
    isInHorizontalHandle = rect.right - e.clientX <= resizeHandleMargin
    isInVerticalHandle = rect.bottom - e.clientY <= resizeHandleMargin
  }
  return isInHorizontalHandle && isInVerticalHandle
}

const onMouseDown = (e: MouseEvent) => {
  if (isInBottomRightHandle(e)) {
    return
  }
  if (
    teleprompterContainerRef.value &&
    (e.target === teleprompterContainerRef.value ||
      teleprompterContainerRef.value.contains(e.target as Node))
  ) {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    startLeft = parseInt(window.getComputedStyle(teleprompterContainerRef.value).left, 10)
    startTop = parseInt(window.getComputedStyle(teleprompterContainerRef.value).top, 10)

    document.addEventListener('mouseup', onMouseOrTouchUp)
    document.addEventListener('mousemove', onMouseMove)
  }
}

const onTouchDown = (e: TouchEvent) => {
  if (isInBottomRightHandle(e)) {
    return
  }
  if (
    teleprompterContainerRef.value &&
    (e.target === teleprompterContainerRef.value ||
      teleprompterContainerRef.value.contains(e.target as Node))
  ) {
    isDragging = true
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startLeft = parseInt(window.getComputedStyle(teleprompterContainerRef.value).left, 10)
    startTop = parseInt(window.getComputedStyle(teleprompterContainerRef.value).top, 10)

    document.addEventListener('touchend', onMouseOrTouchUp)
    document.addEventListener('touchmove', onTouchMove)
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (isDragging && teleprompterContainerRef.value) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    // Get viewport boundaries
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Element dimensions
    const rect = teleprompterContainerRef.value.getBoundingClientRect()
    const elementWidth = rect.width
    const elementHeight = rect.height

    // Calculate constrained positions
    const newLeft = Math.min(
      Math.max(startLeft + dx, 0), // Prevent going beyond the left boundary
      viewportWidth - elementWidth, // Prevent going beyond the right boundary
    )
    const newTop = Math.min(
      Math.max(startTop + dy, 0), // Prevent going beyond the top boundary
      viewportHeight - elementHeight, // Prevent going beyond the bottom boundary
    )
    teleprompterContainerRef.value.style.left = `${newLeft}px`
    teleprompterContainerRef.value.style.top = `${newTop}px`
  }
}

const onTouchMove = (e: TouchEvent) => {
  if (isDragging && teleprompterContainerRef.value) {
    const dx = e.touches[0].clientX - startX
    const dy = e.touches[0].clientY - startY
    // Get viewport boundaries
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Element dimensions
    const rect = teleprompterContainerRef.value.getBoundingClientRect()
    const elementWidth = rect.width
    const elementHeight = rect.height

    // Calculate constrained positions
    const newLeft = Math.min(
      Math.max(startLeft + dx, 0), // Prevent going beyond the left boundary
      viewportWidth - elementWidth, // Prevent going beyond the right boundary
    )
    const newTop = Math.min(
      Math.max(startTop + dy, 0), // Prevent going beyond the top boundary
      viewportHeight - elementHeight, // Prevent going beyond the bottom boundary
    )
    teleprompterContainerRef.value.style.left = `${newLeft}px`
    teleprompterContainerRef.value.style.top = `${newTop}px`
  }
}

const onMouseOrTouchUp = () => {
  if (isDragging) {
    isDragging = false

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseOrTouchUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onMouseOrTouchUp)
  }
}

watch(
  () => teleprompterStore.isPlaying,
  (isPlaying: boolean) => {
    if (isPlaying) {
      startTeleprompterScroll()
    } else {
      stopTeleprompterScroll()
    }
  },
)

const startTeleprompterScroll = () => {
  if (teleprompterStore.isPlaying && textContainerRef.value) {
    position += Number(teleprompterStore.teleprompterSpeedSlider)
    textContainerRef.value.style.transform = `translateY(-${position}px)`
    animationFrameId = requestAnimationFrame(startTeleprompterScroll)
  }
}

const stopTeleprompterScroll = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

const resetScroll = () => {
  position = 0
  if (textContainerRef.value) {
    textContainerRef.value.style.transform = 'translateY(0px)'
  }
}
</script>

<template>
  <div
    id="teleprompter"
    ref="teleprompterContainerRef"
    @mousedown="onMouseDown"
    @touchstart="onTouchDown"
  >
    <div id="script-container" ref="textContainerRef">
      <p id="script" :style="textStyle">{{ script }}</p>
    </div>
    <TeleprompterController @reset="resetScroll" />
  </div>
</template>

<style scoped>
#teleprompter {
  width: 100%;
  height: 25%;
  min-width: 350px;
  min-height: 150px;
  max-width: 100vw;
  max-height: 100vh;
  right: 0;
  background-color: rgba(84, 84, 84, 0.5);
  position: absolute;
  cursor: move;
  border: 2px solid black;
  border-radius: 10px;
  resize: both;
  overflow: auto;
  box-shadow: 0px 2px 16px 2px rgba(84, 84, 84, 0.3);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

#script-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  padding: 24px 32px;
}
#teleprompter p {
  color: white;
  font-size: 24px;
  line-height: 4rem;
  white-space: pre-wrap;
  pointer-events: none;
  transition: font-size 0.2s ease-in-out;
}
</style>
