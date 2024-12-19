<script setup lang="ts">
defineProps<{
  script: string
}>()
</script>

<template>
  <div id="teleprompter">
    <h1 id="script">{{ script }}</h1>
  </div>
</template>

<style scoped></style>
