<script setup lang="ts">
import { ref } from 'vue'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { PauseIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon as ResetIcon } from '@heroicons/vue/24/solid'
import SettingsButton from './SettingsButton.vue'
import { useTeleprompterStore } from '@/stores/teleprompter'

const teleprompterStore = useTeleprompterStore()
const refWrapper = ref<HTMLElement | null>(null)

const toggleTeleprompter = () => {
  if (teleprompterStore.isPlaying) {
    teleprompterStore.stopPlaying()
  } else {
    teleprompterStore.startPlaying()
  }
}

const handleStartOver = () => {
  console.log('Start over')
}
</script>

<template>
  <div id="control-wrapper" ref="refWrapper">
    <SettingsButton />
    <ResetIcon class="icon" @click="handleStartOver" />
    <PlayIcon v-if="!teleprompterStore.isPlaying" class="icon" @click="toggleTeleprompter" />
    <PauseIcon v-if="teleprompterStore.isPlaying" class="icon" @click="toggleTeleprompter" />
  </div>
</template>

<style scoped>
#control-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  min-width: 20%;
  max-width: 80%;
  height: 50px;
  border: 1px solid black;
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(84, 84, 84, 0.3);
  bottom: 12px;
  position: absolute;
}
.icon {
  width: 32px;
  height: 32px;
  color: var(--vt-c-indigo);
  transition:
    transform 0.1s ease,
    color 0.3s ease;
}
.icon:hover {
  cursor: pointer;
}
.icon:active {
  transform: scale(0.9); /* Slightly shrink the icon */
  color: var(--vt-c-divider-dark-1); /* Optional color change on click */
}
</style>
