<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStreamStore } from '@/stores/video-stream'

const recordingStore = useVideoStreamStore()
const videoRef = ref<HTMLVideoElement | null>(null)

const initializeMediaRecorder = async () => {
  try {
    // Request access to the user's webcam and microphone
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

    recordingStore.setVideoStream(stream)

    assignStreamToVideoRef(stream)

    // Initialize MediaRecorder only if the stream is successfully set
    if (recordingStore.videoStream) {
      recordingStore.setMediaRecorder(new MediaRecorder(recordingStore.videoStream))
    } else {
      console.error('Stream reference not found in the state store')
    }
  } catch (err) {
    console.error('Error accessing media devices:', err)
  }
}

const assignStreamToVideoRef = (stream: MediaStream) => {
  if (videoRef.value) {
    try {
      videoRef.value.srcObject = stream
      videoRef.value.play()
      recordingStore.setVideoElementRefContext(videoRef.value)
      recordingStore.isCameraOff = false
    } catch (err) {
      console.error('Error assigning stream to video element:', err)
    }
  } else {
    console.error('HTMLVideoElement reference not set')
  }
}

onMounted(() => {
  initializeMediaRecorder()
})
</script>

<template>
  <div id="video-wrapper">
    <video id="video-stream" ref="videoRef" autoplay loop muted />
  </div>
</template>

<style>
#video-wrapper {
  bottom: 100px;
  position: absolute;
  width: 100%;
  height: 60%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 2px 16px 2px rgba(84, 84, 84, 0.3);
  border: 2px solid black;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
</style>
