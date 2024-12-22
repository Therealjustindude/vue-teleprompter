<script setup lang="ts">
import { ref } from 'vue'
import { PlayIcon } from '@heroicons/vue/24/solid'
import { PauseIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon as ResetIcon } from '@heroicons/vue/24/solid'
import SettingsButton from './SettingsButton.vue'
import { useTeleprompterStore } from '@/stores/teleprompter'

const teleprompterStore = useTeleprompterStore()
const refWrapper = ref<HTMLElement | null>(null)
const emit = defineEmits(['reset'])

const toggleTeleprompter = () => {
  if (teleprompterStore.isPlaying) {
    teleprompterStore.stopPlaying()
  } else {
    teleprompterStore.startPlaying()
  }
}

const handleReset = () => {
  emit('reset')
  teleprompterStore.stopPlaying()
}
</script>

<template>
  <div id="control-wrapper" ref="refWrapper">
    <div id="est-wrapper">
      <p>Est time: {{ teleprompterStore.estimatedReadingTime }}</p>
    </div>
    <div id="buttons-wrapper">
      <SettingsButton />
      <ResetIcon class="icon" @click="handleReset" />
      <PlayIcon v-if="!teleprompterStore.isPlaying" class="icon" @click="toggleTeleprompter" />
      <PauseIcon v-if="teleprompterStore.isPlaying" class="icon" @click="toggleTeleprompter" />
    </div>
  </div>
</template>

<style scoped>
#control-wrapper {
  display: flex;
  align-items: center;
  min-width: 100%;
  min-height: 48px;
  box-shadow: 0px -3px 4px 0px rgba(84, 84, 84, 0.3);
  background-color: var(--vt-c-white-mute);
  bottom: 0;
  position: sticky;
  padding: 0px 16px;
}
#buttons-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
}
#est-wrapper {
  width: 20%;
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
  transform: scale(0.9);
  color: var(--vt-c-divider-dark-1);
}
</style>
