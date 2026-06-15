/**
 * Fuzzy match a query against a player's Chinese name and English/Pinyin name.
 * Returns true if the query appears as a substring (case-insensitive) in either field.
 *
 * @param {string} query - user input
 * @param {object} match - match object with p1NameCn, p1NameEn, p2NameCn, p2NameEn
 * @returns {boolean}
 */
export function matchPlayer(query, match) {
  if (!query || !query.trim()) return true
  const q = query.trim().toLowerCase()

  const fields = [
    match.p1NameCn || '',
    match.p1NameEn || '',
    match.p2NameCn || '',
    match.p2NameEn || '',
  ]

  return fields.some((f) => f.toLowerCase().includes(q))
}
