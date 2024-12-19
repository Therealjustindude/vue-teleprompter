<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineProps<{
  script: string
}>()
const refEl = ref<HTMLElement | null>(null)
let isDragging = false
let startX: number, startY: number, startLeft: number, startTop: number
const resizeHandleMargin = 10

const isInBottomRightHandle = (e: MouseEvent | TouchEvent) => {
  if (!refEl.value) return false
  const rect = refEl.value.getBoundingClientRect()
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
  if (refEl.value && e.target === refEl.value) {
    e.preventDefault()
    e.stopPropagation()
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    startLeft = parseInt(window.getComputedStyle(refEl.value).left, 10)
    startTop = parseInt(window.getComputedStyle(refEl.value).top, 10)

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }
}

const onTouchDown = (e: TouchEvent) => {
  if (isInBottomRightHandle(e)) {
    return
  }
  if (refEl.value && e.target === refEl.value) {
    isDragging = true
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
    startLeft = parseInt(window.getComputedStyle(refEl.value).left, 10)
    startTop = parseInt(window.getComputedStyle(refEl.value).top, 10)

    document.addEventListener('touchend', onMouseUp)
    document.addEventListener('touchmove', onTouchMove)
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (isDragging && refEl.value) {
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    // Get viewport boundaries
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Element dimensions
    const rect = refEl.value.getBoundingClientRect()
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
    refEl.value.style.left = `${newLeft}px`
    refEl.value.style.top = `${newTop}px`
  }
}

const onTouchMove = (e: TouchEvent) => {
  if (isDragging && refEl.value) {
    const dx = e.touches[0].clientX - startX
    const dy = e.touches[0].clientY - startY
    // Get viewport boundaries
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Element dimensions
    const rect = refEl.value.getBoundingClientRect()
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
    refEl.value.style.left = `${newLeft}px`
    refEl.value.style.top = `${newTop}px`
  }
}

const onMouseUp = () => {
  if (isDragging) {
    isDragging = false

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('touchmove', onTouchMove)
    document.removeEventListener('touchend', onMouseUp)
  }
}

onMounted(() => {
  if (refEl.value) {
    refEl.value.addEventListener('mousedown', onMouseDown)
    refEl.value.addEventListener('touchstart', onTouchDown)
  }
})

onBeforeUnmount(() => {
  if (refEl.value) {
    refEl.value.removeEventListener('mousedown', onMouseDown)
  }
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
})
</script>

<template>
  <div id="teleprompter" ref="refEl">
    <p id="script">{{ script }}</p>
  </div>
</template>

<style scoped>
#teleprompter {
  width: 50%;
  height: 85%;
  min-width: 350px;
  min-height: 150px;
  max-width: 100vw;
  max-height: 100vh;
  right: 0;
  background-color: rgba(84, 84, 84, 0.5);
  color: white;
  position: absolute;
  cursor: move;
  border: 2px solid black;
  border-radius: 10px;
  resize: both;
  overflow: auto;
  padding: 8px 16px;
  box-shadow: 0px 2px 16px 2px rgba(84, 84, 84, 0.3);
  z-index: 1000;
}
</style>
