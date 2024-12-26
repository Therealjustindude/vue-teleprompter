<script setup lang="ts">
import { ref } from 'vue'
import { VideoCameraIcon } from '@heroicons/vue/24/solid'
import { VideoCameraSlashIcon } from '@heroicons/vue/24/solid'
import RecordButton from './RecordButton.vue'
import { useVideoStreamStore } from '@/stores/video-stream'
import { useTeleprompterStore } from '@/stores/teleprompter'

const emit = defineEmits(['start-recording', 'stop-recording'])
const videoStreamStore = useVideoStreamStore()
const teleprompterStore = useTeleprompterStore()
const refWrapper = ref<HTMLElement | null>(null)

const handleRecordingClick = () => {
  if (videoStreamStore.isRecording) {
    videoStreamStore.stopRecording()
    teleprompterStore.stopPlaying()
    emit('stop-recording')
  } else {
    videoStreamStore.startRecording()
    teleprompterStore.startPlaying()
    emit('start-recording')
  }
}

const handleCameraToggle = () => {
  videoStreamStore.toggleCamera()
}
</script>

<template>
  <div id="control-wrapper" ref="refWrapper">
    <RecordButton @click="handleRecordingClick" :isRecording="videoStreamStore.isRecording" />
    <VideoCameraIcon
      v-if="!videoStreamStore.isCameraOff"
      class="icon"
      @click="handleCameraToggle"
    />
    <VideoCameraSlashIcon
      v-if="videoStreamStore.isCameraOff"
      class="icon"
      @click="handleCameraToggle"
    />
  </div>
</template>

<style scoped>
#control-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  min-width: 150px;
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
