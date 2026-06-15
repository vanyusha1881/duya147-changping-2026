<template>
  <div class="date-selector">
    <button
      v-for="d in dates"
      :key="d"
      :class="['date-tab', { active: d === selectedDate }]"
      @click="$emit('select', d)"
    >
      <span class="date-day">{{ formatDay(d) }}</span>
      <span class="date-label">{{ formatLabel(d) }}</span>
    </button>
    <div v-if="dates.length === 0" class="no-dates">暂无赛程</div>
  </div>
</template>

<script setup>
defineProps({
  dates: { type: Array, required: true },
  selectedDate: { type: String, required: true },
})
defineEmits(['select'])

const weekNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

function formatDay(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return parts[2] || ''
}

function formatLabel(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
  return `${parseInt(parts[1])}月 · ${weekNames[d.getDay()]}`
}
</script>

<style scoped>
.date-selector {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: #14141f;
  border-bottom: 1px solid #1e1e2e;
}
.date-selector::-webkit-scrollbar { display: none; }
.date-tab {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 56px;
  padding: 10px 14px;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  background: #1a1a28;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
}
.date-tab:hover {
  border-color: #555;
  color: #aaa;
}
.date-tab.active {
  background: linear-gradient(160deg, #1a1a30, #1f1f35);
  border-color: #d4af37;
  box-shadow: 0 0 12px rgba(212,175,55,0.1);
}
.date-day {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.date-tab.active .date-day { color: #d4af37; }
.date-label {
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}
.date-tab.active .date-label { color: #ccc; }
.no-dates {
  color: #555;
  font-size: 13px;
  padding: 8px 0;
}
</style>
