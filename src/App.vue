<script setup lang="ts">
import VideoController from './components/VideoController.vue'
import TeleprompterComponent from './components/TeleprompterComponent.vue'
import VideoStream from './components/VideoStream.vue'
import { useVideoStreamStore } from '@/stores/video-stream'
import { script } from '@/utils/script.ts'
const videoStreamStore = useVideoStreamStore()

const handleStartTeleprompterEmit = () => {
  console.log('teleprompter started')
}
const handleStopTeleprompterEmit = () => {
  console.log('teleprompter stopped')
}
const handleResetTeleprompterEmit = () => {
  console.log('teleprompter restarted')
}
const handleSwitchToImageEmit = () => {
  console.log('teleprompter switched to image')
}
const handleSwitchToCameraEmit = () => {
  console.log('teleprompter switched to camera')
}

const handleStartRecordingEmit = () => {
  console.log('recording started')
  handleStartTeleprompterEmit()
}
const handleStopRecordingEmit = () => {
  console.log('recording stopped')
  handleStopTeleprompterEmit()
}
</script>

<template>
  <header>
    <h1>Teleprompter</h1>
    <div v-if="videoStreamStore.isRecording" id="recording-status">Recording...</div>
  </header>
  <main>
    <div id="main-wrapper">
      <TeleprompterComponent
        :script="script"
        @start="handleStartTeleprompterEmit"
        @stop="handleStopTeleprompterEmit"
        @reset="handleResetTeleprompterEmit"
        @switch-to-image="handleSwitchToImageEmit"
        @switch-to-camera="handleSwitchToCameraEmit"
      />
      <VideoStream />
    </div>
  </main>
  <footer>
    <VideoController
      @start-recording="handleStartRecordingEmit"
      @stop-recording="handleStopRecordingEmit"
    />
  </footer>
</template>

<style scoped>
header {
  width: 100%;
  height: 4rem;
  border-bottom: 1px solid var(--vt-c-divider-dark-1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 4px 0px rgba(84, 84, 84, 0.3);
}
header h1 {
  font-weight: 600;
  color: var(--vt-c-indigo);
}
main {
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
}
#main-wrapper {
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
}
#recording-status {
  font-size: large;
  color: red;
}
footer {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
}
</style>
