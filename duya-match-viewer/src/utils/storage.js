const STORAGE_PREFIX = 'duya_schedule_'

/**
 * Save match list for a specific date.
 * @param {string} date - e.g. "2026-06-15"
 * @param {Array} matches - flat list of match objects
 */
export function saveSchedule(date, matches) {
  const key = STORAGE_PREFIX + date
  const wrapper = {
    updatedAt: Date.now(),
    count: matches.length,
    matches,
  }
  localStorage.setItem(key, JSON.stringify(wrapper))
}

/**
 * Load match list for a specific date.
 * @param {string} date
 * @returns {Array|null}
 */
export function loadSchedule(date) {
  const key = STORAGE_PREFIX + date
  const raw = localStorage.getItem(key)
  if (!raw) return null
  try {
    const wrapper = JSON.parse(raw)
    return wrapper.matches || []
  } catch {
    return null
  }
}

/**
 * List all dates that have cached schedule data.
 * @returns {string[]}
 */
export function getCachedDates() {
  const dates = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(STORAGE_PREFIX)) {
      dates.push(key.slice(STORAGE_PREFIX.length))
    }
  }
  return dates.sort()
}

/**
 * Extract date part from a datetime string like "2026-06-15 14:00:00".
 * @param {string} datetime
 * @returns {string}
 */
export function extractDate(datetime) {
  if (!datetime) return ''
  return datetime.slice(0, 10)
}
