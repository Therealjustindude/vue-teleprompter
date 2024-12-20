<script setup lang="ts">
import { ref } from 'vue'

const { isRecording = false } = defineProps<{
  isRecording: boolean
}>()
const emit = defineEmits(['click'])
const refEl = ref<HTMLElement | null>(null)
const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div id="record" ref="refEl" @click="handleClick">
    <div id="active-indicator" :class="{ 'is-recording': isRecording }"></div>
  </div>
</template>

<style>
#record {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background-color: var(--vt-c-indigo);
  border-radius: 50%;
  transition:
    transform 0.1s ease,
    color 0.3s ease;
}
#record:hover {
  cursor: pointer;
}
#record:active {
  transform: scale(0.9); /* Slightly shrink the icon */
  color: var(--vt-c-divider-dark-1); /* Optional color change on click */
}
#active-indicator {
  width: 12px;
  height: 12px;
  background-color: gray;
  border-radius: 50%;
}
#active-indicator.is-recording {
  background-color: var(--record-red);
}
</style>
