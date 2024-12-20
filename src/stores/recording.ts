import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRecordingStore = defineStore('recoding', () => {
  const isRecording = ref(false)
  function startRecording() {
    isRecording.value = true
  }
  function stopRecording() {
    isRecording.value = false
  }

  return { isRecording, startRecording, stopRecording }
})
