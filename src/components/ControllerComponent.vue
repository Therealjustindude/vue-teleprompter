<script setup lang="ts">
import { ref } from 'vue'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { PauseIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon as ResetIcon } from '@heroicons/vue/24/solid'
import RecordButton from './RecordButton.vue'
import SettingsButton from './SettingsButton.vue'
import { useRecordingStore } from '@/stores/recording'
import { useTeleprompterStore } from '@/stores/teleprompter'

const recordingStore = useRecordingStore()
const teleprompterStore = useTeleprompterStore()
const refWrapper = ref<HTMLElement | null>(null)

const toggleTeleprompter = () => {
  if (teleprompterStore.isPlaying) {
    teleprompterStore.stopPlaying()
  } else {
    teleprompterStore.startPlaying()
  }
}

const handleRecordingClick = () => {
  if (recordingStore.isRecording) {
    recordingStore.stopRecording()
    teleprompterStore.stopPlaying()
  } else {
    recordingStore.startRecording()
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
    <RecordButton @click="handleRecordingClick" :isRecording="recordingStore.isRecording" />
  </div>
</template>

<style scoped>
#control-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  min-width: 300px;
  height: 50px;
  border: 1px solid black;
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(84, 84, 84, 0.3);
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
