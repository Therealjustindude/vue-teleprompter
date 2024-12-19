<script setup lang="ts">
import TeleprompterBox from './components/TeleprompterBox.vue'
import VideoStream from './components/VideoStream.vue'
</script>

<template>
  <header>
    <h1>Vue Teleprompter</h1>
    <div id="recording-status">Recording...</div>
  </header>

  <main>
    <div id="main-wrapper">
      <TeleprompterBox script="You did it!" />
      <VideoStream />
    </div>
  </main>
  <footer>
    <div id="control-wrapper"></div>
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
#control-wrapper {
  min-width: 300px;
  height: 50px;
  border: 1px solid black;
  border-radius: 10px;
  box-shadow: 0px 1px 4px 0px rgba(84, 84, 84, 0.3);
}
</style>
