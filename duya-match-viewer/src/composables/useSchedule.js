import { ref, computed } from 'vue'
import { saveSchedule, loadSchedule, getCachedDates, extractDate } from '../utils/storage.js'
import { matchPlayer } from '../utils/search.js'

const CONFIG_KEY = 'duya_api_config'

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
}

/**
 * Sort key for table priority:
 * - Non-numeric tables (TV, named venues) come first
 * - Numeric tables sorted by number
 */
function tablePriority(tableNo) {
  if (!tableNo) return 9999
  if (/^\d+$/.test(tableNo)) return parseInt(tableNo) + 1000 // push numeric to back
  return 0 // non-numeric first
}

export function useSchedule() {
  const config = ref(loadConfig())
  const dates = ref(getCachedDates())
  const selectedDate = ref(dates.value[0] || '')
  const matches = ref([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref('')

  const filteredMatches = computed(() => {
    const q = searchQuery.value.trim()
    if (!q) return matches.value
    return matches.value.filter((m) => matchPlayer(q, m))
  })

  /**
   * Three-level grouping: time slot → round name → matches
   * Matches within each round are sorted: special tables first, then numeric
   */
  const timeSlots = computed(() => {
    const slots = new Map()

    for (const m of filteredMatches.value) {
      const timeKey = m.start || ''
      if (!slots.has(timeKey)) {
        slots.set(timeKey, { time: timeKey, rounds: new Map() })
      }
      const slot = slots.get(timeKey)

      const roundKey = m.roundName || '未分组'
      if (!slot.rounds.has(roundKey)) {
        slot.rounds.set(roundKey, { roundName: roundKey, matches: [] })
      }
      slot.rounds.get(roundKey).matches.push(m)
    }

    // Sort and flatten
    const result = []
    const sortedSlots = [...slots.values()].sort((a, b) => a.time.localeCompare(b.time))
    for (const slot of sortedSlots) {
      const rounds = []
      for (const [, r] of slot.rounds) {
        // sort matches: special tables first
        r.matches.sort((a, b) => tablePriority(a.tableNo) - tablePriority(b.tableNo))
        rounds.push(r)
      }
      result.push({ time: slot.time, rounds })
    }
    return result
  })

  function setConfig(newConfig) {
    config.value = { ...config.value, ...newConfig }
    saveConfig(config.value)
  }

  async function fetchAllMatches() {
    const { apiUrl, eventId, phaseId, stageId } = config.value
    if (!apiUrl) {
      error.value = '请先设置 API 地址'
      return null
    }

    loading.value = true
    error.value = ''

    try {
      let allMatches = []
      let page = 1
      const size = 50

      while (true) {
        const body = JSON.stringify({
          page,
          size,
          eventId: eventId || '',
          phaseId: phaseId || '1',
          stageId: stageId || '2',
          player: '',
          state: 0,
        })

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = await res.json()
        if (json.code !== 0) throw new Error(json.message || 'API error')

        const list = json.data?.list || []
        const total = json.data?.total || 0

        allMatches = allMatches.concat(list)

        if (allMatches.length >= total || list.length === 0) break
        page++
      }

      const dateGroups = new Map()
      for (const m of allMatches) {
        const date = extractDate(m.start)
        if (!date) continue
        if (!dateGroups.has(date)) dateGroups.set(date, [])
        dateGroups.get(date).push(m)
      }

      for (const [date, list] of dateGroups) {
        saveSchedule(date, list)
      }

      dates.value = getCachedDates()
      return allMatches
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  function selectDate(date) {
    selectedDate.value = date
    const cached = loadSchedule(date)
    matches.value = cached && cached.length > 0 ? cached : []
  }

  if (selectedDate.value) {
    const cached = loadSchedule(selectedDate.value)
    if (cached) matches.value = cached
  }

  return {
    config,
    dates,
    selectedDate,
    matches,
    searchQuery,
    loading,
    error,
    filteredMatches,
    timeSlots,
    setConfig,
    fetchAllMatches,
    selectDate,
  }
}
