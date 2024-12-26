import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoStreamStore = defineStore('video-stream', () => {
  const isRecording = ref(false)
  const isCameraOff = ref(false)
  const videoStream = ref<MediaStream | null>(null)
  const videoElementRef = ref<HTMLVideoElement | null>(null)
  const canvasElementRef = ref<HTMLCanvasElement | null>(null)
  const mediaRecorder = ref<MediaRecorder | null>(null)
  const recordedChunks = ref<Blob[]>([])
  const recordedVideoURL = ref<string | null>(null)

  const isCanvasDrawing = ref(false)
  let animationFrameId: number | null = null

  function setMediaRecorder(recorder: MediaRecorder) {
    mediaRecorder.value = recorder
  }

  function setVideoStream(stream: MediaStream) {
    videoStream.value = stream
  }

  function setVideoElementRefContext(element: HTMLVideoElement) {
    videoElementRef.value = element
  }

  function setCanvasElementRefContext(element: HTMLCanvasElement) {
    canvasElementRef.value = element
  }

  function startRecording() {
    if (!mediaRecorder.value) {
      console.error('MediaRecorder is not initialized.')
      return
    }

    // Start recording
    mediaRecorder.value.start()
    isRecording.value = true

    try {
      // Handle data chunks
      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.value.push(event.data)
        }
      }

      // Save recording on stop
      mediaRecorder.value.onstop = () => {
        const blob = new Blob(recordedChunks.value, { type: 'video/webm' })
        recordedVideoURL.value = URL.createObjectURL(blob)
        recordedChunks.value = []
        const a = document.createElement('a')
        a.href = recordedVideoURL.value
        a.download = 'recording.webm'
        a.click()
      }
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
    } catch (error) {
      console.error('Error stopping recording:', error)
    }
  }

  function startCanvasDrawing() {
    if (!canvasElementRef.value || !videoElementRef.value) {
      console.error('Canvas or Video element is not set')
      return
    }

    const canvasCtx = canvasElementRef.value.getContext('2d')
    if (!canvasCtx) {
      console.error('Failed to get canvas context')
      return
    }

    isCanvasDrawing.value = true

    const draw = () => {
      if (videoElementRef.value && videoElementRef.value?.readyState >= 2) {
        canvasCtx.drawImage(
          videoElementRef.value,
          0,
          0,
          canvasElementRef.value!.width,
          canvasElementRef.value!.height,
        )
      }
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
  }

  function stopCanvasDrawing() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    isCanvasDrawing.value = false
  }

  function clearCanvas() {
    if (canvasElementRef.value) {
      const canvasCtx = canvasElementRef.value.getContext('2d')
      if (canvasCtx) {
        canvasCtx.fillStyle = 'black' // Or any placeholder color
        canvasCtx.fillRect(0, 0, canvasElementRef.value.width, canvasElementRef.value.height)
      }
    }
  }

  async function toggleCamera() {
    if (isCameraOff.value && videoElementRef.value) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setVideoStream(stream)
        videoElementRef.value.srcObject = videoStream.value
        videoElementRef.value?.play()
        startCanvasDrawing()
        isCameraOff.value = false
        changeTransformScaleX('scaleX(-1)')
      } catch (error) {
        console.error('Error reinitializing camera:', error)
      }
    } else if (videoStream.value) {
      videoStream.value.getVideoTracks().forEach((track) => track.stop())
      videoStream.value = null
      isCameraOff.value = true
      stopCanvasDrawing()
      changeTransformScaleX('scaleX(1)')
      clearCanvas()
    } else {
      console.error('No active video stream to toggle.')
    }
  }

  function showImageOnCanvas(imageSrc: string) {
    if (!canvasElementRef.value) {
      console.error('Canvas element is not set')
      return
    }

    const canvasCtx = canvasElementRef.value.getContext('2d')
    if (!canvasCtx) {
      console.error('Failed to get canvas context')
      return
    }

    stopCanvasDrawing()

    const img = new Image()
    img.onload = () => {
      canvasCtx.drawImage(img, 0, 0, canvasElementRef.value!.width, canvasElementRef.value!.height)
    }
    img.src = imageSrc
  }

  function changeTransformScaleX(scaleX: string) {
    if (canvasElementRef.value) {
      canvasElementRef.value.style.transform = scaleX
    }
  }

  function cleanup() {
    stopCanvasDrawing()
    mediaRecorder.value?.stop()
    videoStream.value?.getTracks().forEach((track) => track.stop())
    videoStream.value = null
    isRecording.value = false
    isCameraOff.value = true
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
    canvasElementRef,
    setCanvasElementRefContext,
    startCanvasDrawing,
    stopCanvasDrawing,
    cleanup,
    isCanvasDrawing,
    showImageOnCanvas,
  }
})
