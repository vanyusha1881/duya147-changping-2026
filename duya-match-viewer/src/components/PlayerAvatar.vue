<template>
  <div class="avatar-box" :class="{ empty: !loaded }">
    <img
      v-show="loaded"
      :src="`/stars/${name}.webp`"
      class="avatar-img"
      @load="loaded = true"
      @error="loaded = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({ name: { type: String, required: true } })

const loaded = ref(false)
</script>

<style scoped>
.avatar-box {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  overflow: hidden;
  position: relative;
  background: #1e1e30;
  border: 1px solid #2a2a3a;
}
.avatar-box:not(.empty) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  border: none;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
