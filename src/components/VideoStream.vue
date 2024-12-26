<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useVideoStreamStore } from '@/stores/video-stream'

const videoStreamStore = useVideoStreamStore()
const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const initializeVideoStream = async () => {
  try {
    if (videoRef.value) videoStreamStore.setVideoElementRefContext(videoRef.value)
    if (canvasRef.value) videoStreamStore.setCanvasElementRefContext(canvasRef.value)

    // Start video stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    videoStreamStore.setVideoStream(stream)
    videoRef.value!.srcObject = stream

    videoRef.value!.onloadedmetadata = async () => {
      // Match Canvas Resolution to Video Resolution
      if (canvasRef.value && videoRef.value) {
        canvasRef.value.width = videoRef.value.videoWidth
        canvasRef.value.height = videoRef.value.videoHeight
      }

      videoRef.value?.play()
      videoStreamStore.startCanvasDrawing()
    }

    // Initialize MediaRecorder
    if (canvasRef.value) {
      const canvasStream = canvasRef.value.captureStream()
      videoStreamStore.setMediaRecorder(new MediaRecorder(canvasStream))
    }
  } catch (error) {
    console.error('Error initializing video stream:', error)
  }
}

onMounted(() => {
  initializeVideoStream()
})

onUnmounted(() => {
  videoStreamStore.cleanup()
})
</script>

<template>
  <div id="video-wrapper">
    <video id="video-stream" ref="videoRef" autoplay loop muted />
    <canvas id="canvas-element" ref="canvasRef"></canvas>
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

#video-stream {
  display: none;
}
#canvas-element {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
}
</style>
