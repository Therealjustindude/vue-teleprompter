<script setup lang="ts">
import { ref } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/solid'
import { VideoCameraSlashIcon } from '@heroicons/vue/24/solid'
import RecordButton from './RecordButton.vue'
import { useVideoStreamStore } from '@/stores/video-stream'
import { useTeleprompterStore } from '@/stores/teleprompter'

const recordingStore = useVideoStreamStore()
const teleprompterStore = useTeleprompterStore()
const refWrapper = ref<HTMLElement | null>(null)

const handleRecordingClick = () => {
  if (recordingStore.isRecording) {
    recordingStore.stopRecording()
    teleprompterStore.stopPlaying()
  } else {
    recordingStore.startRecording()
    teleprompterStore.startPlaying()
  }
}

const handleCameraToggle = () => {
  recordingStore.toggleCamera()
}
</script>

<template>
  <div id="control-wrapper" ref="refWrapper">
    <VideoCameraIcon v-if="!recordingStore.isCameraOff" class="icon" @click="handleCameraToggle" />
    <VideoCameraSlashIcon
      v-if="recordingStore.isCameraOff"
      class="icon"
      @click="handleCameraToggle"
    />
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
