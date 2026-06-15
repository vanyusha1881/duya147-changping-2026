<template>
  <div class="match-card" :class="{ 'is-special': isSpecial }">
    <div class="card-top">
      <span class="table-tag" :class="{ special: isSpecial }">
        <svg v-if="isSpecial" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {{ match.tableNo || '—' }}
      </span>
      <span v-if="match.refereeNameCn" class="referee-tag">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>
        {{ match.refereeNameCn }}
      </span>
    </div>

    <div class="players-row">
      <div class="player player-left">
        <PlayerAvatar :name="match.p1NameCn" />
        <div class="player-info">
          <span class="name-cn">{{ match.p1NameCn }}</span>
          <span class="name-en">{{ match.p1NameEn }}</span>
        </div>
      </div>

      <div class="vs-section">
        <span class="vs-text">VS</span>
      </div>

      <div class="player player-right">
        <PlayerAvatar :name="match.p2NameCn" />
        <div class="player-info">
          <span class="name-cn">{{ match.p2NameCn }}</span>
          <span class="name-en">{{ match.p2NameEn }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps({ match: { type: Object, required: true } })

const isSpecial = computed(() => {
  const t = props.match.tableNo
  return t ? !/^\d+$/.test(t) : false
})
</script>

<style scoped>
.match-card {
  background: #1a1a2a;
  border: 1px solid #24243a;
  border-radius: 14px;
  padding: 18px 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.match-card:hover {
  border-color: #33335a;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}

.match-card.is-special {
  background: linear-gradient(160deg, #1d1d33, #1a1a2a);
  border-color: #3d3520;
}
.match-card.is-special:hover {
  border-color: #5a4d2a;
  box-shadow: 0 4px 24px rgba(212,175,55,0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: #22223a;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #888;
}
.table-tag.special {
  background: rgba(212,175,55,0.12);
  border: 1px solid rgba(212,175,55,0.25);
  color: #d4af37;
}

.referee-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #555;
}

.players-row {
  display: flex;
  align-items: center;
}
.player {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}
.player-left { flex-direction: row; }
.player-right { flex-direction: row-reverse; text-align: right; }

.player-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.player-right .player-info { align-items: flex-end; }
.name-cn {
  font-size: 15px;
  font-weight: 700;
  color: #e8e8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
.name-en {
  font-size: 10px;
  color: #555;
  font-weight: 500;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}

.vs-section {
  flex-shrink: 0;
  padding: 0 12px;
}
.vs-text {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #444;
  letter-spacing: 2px;
}
</style>
