<script setup lang="ts">
import { ref, computed } from 'vue'
import { Cog6ToothIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon as ResetIcon } from '@heroicons/vue/24/solid'
import { useTeleprompterStore } from '@/stores/teleprompter'

const isMenuVisible = ref(false)
const wrapperRef = ref<HTMLElement | null>(null)
const teleprompterStore = useTeleprompterStore()

const teleprompterSpeedSlider = computed({
  get: () => teleprompterStore.teleprompterSpeedSlider,
  set: (value) => {
    teleprompterStore.updateSpeedSlider(value)
  },
})

const fontSizeSlider = computed({
  get: () => teleprompterStore.fontSizeSlider,
  set: (value) => {
    teleprompterStore.updateFontSlider(value)
  },
})

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value
  if (isMenuVisible.value) {
    document.addEventListener('click', handleClickOutside)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node)) {
    isMenuVisible.value = false
    document.removeEventListener('click', handleClickOutside)
  }
}

const handleReset = () => {
  teleprompterStore.resetTeleprompterSliders()
}
</script>

<template>
  <div class="wrapper" ref="wrapperRef">
    <Cog6ToothIcon class="icon" @click="toggleMenu" />

    <div v-if="isMenuVisible" class="menu">
      <ul>
        <li>
          <div>
            <label for="text-speed">
              Speed:
              <strong>
                {{ teleprompterStore.teleprompterSpeedSlider }}
              </strong>
            </label>
            <input
              type="range"
              id="text-speed"
              v-model="teleprompterSpeedSlider"
              min="1"
              max="10"
              step="1"
            />
          </div>
        </li>
        <li>
          <div>
            <label for="font-size">
              Font size:
              <strong>
                {{ teleprompterStore.fontSizeSlider }}
              </strong>
            </label>
            <input type="range" id="font-size" v-model="fontSizeSlider" min="0" max="64" step="4" />
          </div>
        </li>
        <li>
          <div id="reset-wrapper" @click="handleReset">
            Reset
            <ResetIcon class="reset-icon" />
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
  display: inline-block;
}

.icon {
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    color 0.3s ease;
}

.icon:active {
  transform: scale(0.9);
  color: var(--vt-c-divider-dark-1);
}

#reset-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition:
    transform 0.1s ease,
    color 0.3s ease;
}

#reset-wrapper:hover {
  cursor: pointer;
}

#reset-wrapper:active {
  transform: scale(0.9);
  color: var(--vt-c-divider-dark-1);
}

.reset-icon {
  width: 16px;
  height: 16px;
}

.menu {
  position: absolute;
  bottom: 140%;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 2000;
  min-width: 150px;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  padding: 8px;
}

.menu li:hover {
  background-color: #f0f0f0;
  border-radius: 8px;
}

input[type='range'] {
  cursor: pointer;
}

label {
  font-size: 16px;
  font-weight: 500;
  color: var(--vt-c-indigo);
}
label strong {
  font-size: 16px;
  font-weight: 600;
  color: var(--vt-c-indigo);
}
</style>
