<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
const refEl = ref<HTMLVideoElement | null>(null)

onMounted(async () => {
  try {
    // Request access to the user's webcam
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })

    // Assign the stream to the <video> element
    if (refEl.value) {
      refEl.value.srcObject = stream
      refEl.value.play() // Start playback
    }
  } catch (err) {
    console.error('Error accessing webcam:', err)
  }
})

onBeforeUnmount(() => {})
</script>

<template>
  <div id="video-wrapper">
    <video id="video-stream" ref="refEl" autoplay loop muted />
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

/* For desktops (screens larger than 1299px) */
@media (min-width: 1299px) {
  #video-wrapper {
    position: relative;
    bottom: 0;
    width: 50%;
    height: 100%;
  }
}
</style>
