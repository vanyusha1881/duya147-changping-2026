<template>
  <div class="app">
    <header class="app-header">
      <div class="header-badge">&#9678; LIVE</div>
      <h1 class="app-title">独牙传奇 · 中式九球公开赛</h1>
      <p class="app-subtitle">2026 北京 TOP 全球总决赛</p>
    </header>

    <div v-if="showSettings" class="settings-panel">
      <div class="settings-form">
        <label class="field">
          <span>API 地址</span>
          <input v-model="form.apiUrl" type="text" placeholder="/api/zba/api/getBilliardGameResultList" />
        </label>
        <div class="field-row">
          <label class="field">
            <span>Event ID</span>
            <input v-model="form.eventId" type="text" placeholder="E2057417488156594176" />
          </label>
          <label class="field">
            <span>Phase ID</span>
            <input v-model="form.phaseId" type="text" placeholder="1" />
          </label>
          <label class="field">
            <span>Stage ID</span>
            <input v-model="form.stageId" type="text" placeholder="2" />
          </label>
        </div>
        <div class="settings-actions">
          <button class="fetch-btn" @click="doFetch" :disabled="loading">
            {{ loading ? '获取中...' : '获取赛程数据' }}
          </button>
        </div>
      </div>
    </div>

    <DateSelector
      :dates="dates"
      :selectedDate="selectedDate"
      @select="selectDate"
    />

    <div class="toolbar">
      <SearchBar v-model="searchQuery" />
      <button class="settings-toggle" @click="showSettings = !showSettings">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </button>
    </div>

    <div v-if="loading" class="status-box">
      <div class="spinner"></div>
      <p>正在获取赛程数据...</p>
    </div>

    <div v-else-if="error" class="status-box error">
      <div class="status-icon">&#10060;</div>
      <p class="status-title">获取失败</p>
      <p class="status-desc">{{ error }}</p>
      <button class="retry-btn" @click="doFetch">重新获取</button>
    </div>

    <div v-else-if="timeSlots.length === 0 && searchQuery" class="status-box">
      <div class="status-icon">&#128269;</div>
      <p class="status-title">未找到球员</p>
      <p class="status-desc">没有匹配 "{{ searchQuery }}" 的结果</p>
    </div>

    <div v-else-if="timeSlots.length === 0 && selectedDate" class="status-box">
      <div class="status-icon">&#127921;</div>
      <p class="status-title">暂无赛程</p>
      <p class="status-desc">点击右上角齿轮配置 API 后获取数据</p>
    </div>

    <div v-else-if="!selectedDate" class="status-box">
      <div class="status-icon">&#128197;</div>
      <p class="status-title">选择日期</p>
      <p class="status-desc">请先获取赛程数据</p>
    </div>

    <div v-else class="match-list">
      <div class="summary-bar">
        <span class="summary-count">{{ filteredMatches.length }}</span> 场比赛
        <span class="summary-divider">|</span>
        <span class="summary-count">{{ timeSlots.length }}</span> 个时段
      </div>
      <TimeSlot
        v-for="slot in timeSlots"
        :key="slot.time"
        :slot-data="slot"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSchedule } from './composables/useSchedule.js'
import DateSelector from './components/DateSelector.vue'
import SearchBar from './components/SearchBar.vue'
import TimeSlot from './components/TimeSlot.vue'

const {
  config,
  dates,
  selectedDate,
  searchQuery,
  loading,
  error,
  filteredMatches,
  timeSlots,
  setConfig,
  fetchAllMatches,
  selectDate,
} = useSchedule()

const showSettings = ref(!config.value.apiUrl)

const form = reactive({
  apiUrl: config.value.apiUrl || '/api/zba/api/getBilliardGameResultList',
  eventId: config.value.eventId || 'E2057417488156594176',
  phaseId: config.value.phaseId || '1',
  stageId: config.value.stageId || '2',
})

watch(
  () => config.value,
  (c) => {
    if (c.apiUrl) form.apiUrl = c.apiUrl
    if (c.eventId) form.eventId = c.eventId
    if (c.phaseId) form.phaseId = c.phaseId
    if (c.stageId) form.stageId = c.stageId
  },
  { immediate: false }
)

async function doFetch() {
  setConfig({
    apiUrl: form.apiUrl.trim(),
    eventId: form.eventId.trim(),
    phaseId: form.phaseId.trim(),
    stageId: form.stageId.trim(),
  })
  await fetchAllMatches()
  if (!error.value && dates.value.length > 0) {
    showSettings.value = false
    selectDate(dates.value[0])
  }
}
</script>

<style scoped>
.app {
  max-width: 768px;
  margin: 0 auto;
  min-height: 100vh;
  background: #14141f;
}

.app-header {
  text-align: center;
  padding: 28px 20px 20px;
  background: linear-gradient(160deg, #1a1a30 0%, #14141f 100%);
  border-bottom: 1px solid #222;
  position: relative;
  overflow: hidden;
}
.app-header::before {
  content: '';
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.header-badge {
  display: inline-block;
  padding: 3px 12px;
  background: rgba(212,175,55,0.15);
  border: 1px solid rgba(212,175,55,0.3);
  color: #d4af37;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 10px;
}
.app-title {
  margin: 0;
  font-size: 21px;
  font-weight: 800;
  color: #f0f0f0;
  letter-spacing: 0.5px;
}
.app-subtitle {
  margin: 6px 0 0;
  font-size: 12px;
  color: #888;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.settings-panel {
  background: #1a1a2a;
  border-bottom: 1px solid #2a2a3a;
  padding: 14px 16px;
}
.settings-form { display: flex; flex-direction: column; gap: 10px; }
.field { display: flex; flex-direction: column; gap: 4px; }
.field span { font-size: 11px; color: #777; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
.field input {
  padding: 8px 12px;
  background: #12121f;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  font-size: 13px;
  color: #e0e0e0;
  outline: none;
  transition: border-color 0.2s;
}
.field input:focus { border-color: #d4af37; }
.field input::placeholder { color: #444; }
.field-row { display: flex; gap: 8px; }
.field-row .field { flex: 1; }
.fetch-btn {
  width: 100%;
  padding: 10px 0;
  background: linear-gradient(135deg, #d4af37, #b8942e);
  color: #0f0f1a;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  transition: opacity 0.2s;
}
.fetch-btn:hover { opacity: 0.9; }
.fetch-btn:disabled { opacity: 0.4; }

.toolbar {
  display: flex;
  align-items: center;
  padding: 0 4px 0 0;
}
.toolbar :deep(.search-bar) { flex: 1; }
.settings-toggle {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border: none;
  background: none;
  color: #666;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}
.settings-toggle:hover { color: #d4af37; }

.status-box {
  text-align: center;
  padding: 60px 24px;
}
.status-icon { font-size: 40px; margin-bottom: 12px; }
.status-title { font-size: 17px; font-weight: 600; color: #ccc; margin-bottom: 4px; }
.status-desc { font-size: 13px; color: #666; }
.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  background: #d4af37;
  color: #0f0f1a;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #2a2a3a;
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.summary-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 8px;
  font-size: 12px;
  color: #555;
  font-weight: 500;
}
.summary-count { color: #d4af37; font-weight: 700; }
.summary-divider { color: #2a2a3a; }
.match-list { padding-bottom: 30px; }
</style>
