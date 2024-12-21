import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoStreamStore = defineStore('video-stream', () => {
  const isRecording = ref(false)
  const isCameraOff = ref(false)
  const videoStream = ref<MediaStream | null>(null)
  const videoElementRef = ref<HTMLVideoElement | null>(null)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const recordedChunks = ref<Blob[]>([])
  const recordedVideoURL = ref<string | null>(null)

  function startRecording() {
    if (!mediaRecorder.value) {
      console.error('MediaRecorder is not initialized.')
      return
    }

    try {
      // Handle data chunks
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.value.push(event.data)
        }
      }

      // Handle stop event to finalize the recording
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(recordedChunks.value, { type: 'video/mp4' })
        recordedVideoURL.value = URL.createObjectURL(blob)
        recordedChunks.value = []
      }

      // Start recording
      mediaRecorder.value.start()
      isRecording.value = true
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  function stopRecording() {
    if (!mediaRecorder.value) {
      console.error('MediaRecorder is not initialized or already stopped.')
      return
    }

    try {
      mediaRecorder.value.stop()
      isRecording.value = false

      // Stop stop the camera/microphone entirely.
      // videoStream.value?.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }

  function setMediaRecorder(recorder: MediaRecorder) {
    mediaRecorder.value = recorder
  }

  function setVideoStream(stream: MediaStream) {
    videoStream.value = stream
  }

  function setVideoElementRefContext(element: HTMLVideoElement) {
    videoElementRef.value = element
  }

  async function toggleCamera() {
    if (isCameraOff.value && videoElementRef.value) {
      // Camera is off, reinitialize the video stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setVideoStream(stream)
        videoElementRef.value.srcObject = videoStream.value
        videoElementRef.value?.play()
        isCameraOff.value = false
      } catch (error) {
        console.error('Error reinitializing camera:', error)
      }
    } else if (videoStream.value) {
      videoStream.value.getVideoTracks().forEach((track) => track.stop())
      videoStream.value = null
      isCameraOff.value = true
    } else {
      console.error('No active video stream to toggle.')
    }
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
    mediaRecorder,
    setMediaRecorder,
    videoStream,
    setVideoStream,
    toggleCamera,
    isCameraOff,
    setVideoElementRefContext,
    recordedVideoURL,
  }
})
