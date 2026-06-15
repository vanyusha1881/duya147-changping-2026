<template>
  <div class="time-slot" :class="{ collapsed: !expanded }">
    <button class="slot-header" @click="expanded = !expanded">
      <div class="slot-header-left">
        <div class="time-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="time-label">{{ formatTime(slotData.time) }}</span>
        </div>
        <span class="slot-summary">{{ totalMatches }} 场 · {{ slotData.rounds.length }} 轮</span>
      </div>
      <svg
        class="chevron"
        :class="{ open: expanded }"
        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <div v-show="expanded" class="slot-body">
      <div v-for="round in slotData.rounds" :key="round.roundName" class="round-block">
        <div class="round-header">
          <span class="round-dot"></span>
          <span class="round-name">{{ round.roundName }}</span>
          <span class="round-count">{{ round.matches.length }} 场</span>
        </div>
        <div class="match-grid">
          <MatchCard v-for="m in round.matches" :key="m.gameId || m.gid" :match="m" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MatchCard from './MatchCard.vue'

const props = defineProps({ slotData: { type: Object, required: true } })

const expanded = ref(true)

const totalMatches = computed(() => {
  let n = 0
  for (const r of props.slotData.rounds) n += r.matches.length
  return n
})

function formatTime(dateStr) {
  if (!dateStr) return ''
  const t = dateStr.slice(11, 16)
  const h = parseInt(t.slice(0, 2))
  if (h < 12) return '上午 ' + t
  if (h < 18) return '下午 ' + t
  return '晚上 ' + t
}
</script>

<style scoped>
.time-slot {
  margin-bottom: 4px;
}

/* ---- Header ---- */
.slot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 14px 16px;
  background: none;
  border: none;
  border-top: 1px solid #1e1e30;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;
}
.slot-header:hover { background: rgba(255,255,255,0.015); }
.slot-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.time-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #1e1e32;
  border-radius: 20px;
  border: 1px solid #2a2a40;
}
.time-badge svg { color: #d4af37; }
.time-label {
  font-size: 15px;
  font-weight: 700;
  color: #e0e0e0;
}
.slot-summary {
  font-size: 12px;
  color: #555;
  font-weight: 500;
}
.chevron {
  color: #555;
  transition: transform 0.25s;
  flex-shrink: 0;
}
.chevron.open { transform: rotate(180deg); }

/* ---- Body ---- */
.slot-body {
  padding: 0 0 16px;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

/* ---- Round ---- */
.round-block {
  margin-bottom: 18px;
}
.round-block:last-child { margin-bottom: 0; }
.round-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 10px;
}
.round-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #444;
}
.round-name {
  font-size: 13px;
  font-weight: 600;
  color: #999;
  flex: 1;
}
.round-count {
  font-size: 11px;
  color: #555;
}

/* ---- Grid ---- */
.match-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px;
}
@media (max-width: 480px) {
  .match-grid { grid-template-columns: 1fr; }
}

/* Collapsed state */
.collapsed .slot-header {
  opacity: 0.7;
}
</style>
