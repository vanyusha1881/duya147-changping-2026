<template>
  <div class="search-bar">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    <input
      v-model="model"
      type="text"
      placeholder="搜索球员 · 支持中文 / 拼音"
      class="search-input"
    />
    <span v-if="model" class="clear-btn" @click="model = ''">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 16px;
  padding: 10px 14px;
  background: #1a1a28;
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  transition: border-color 0.2s;
}
.search-bar:focus-within {
  border-color: #d4af37;
}
.search-icon {
  color: #555;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #e0e0e0;
}
.search-input::placeholder { color: #444; }
.clear-btn {
  color: #555;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
}
.clear-btn:hover { color: #999; }
</style>
