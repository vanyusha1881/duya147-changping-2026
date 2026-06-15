const PALETTE = [
  ['#e74c3c', '#c0392b'],
  ['#e67e22', '#d35400'],
  ['#f1c40f', '#f39c12'],
  ['#2ecc71', '#27ae60'],
  ['#1abc9c', '#16a085'],
  ['#3498db', '#2980b9'],
  ['#9b59b6', '#8e44ad'],
  ['#e84393', '#d63384'],
  ['#00b894', '#00a381'],
  ['#6c5ce7', '#5b4cdb'],
  ['#0984e3', '#0773cc'],
  ['#fd79a8', '#e8658f'],
  ['#00cec9', '#00b5b0'],
  ['#fdcb6e', '#f9b84e'],
  ['#55efc4', '#3ae0b0'],
  ['#ff7675', '#e75d5c'],
  ['#74b9ff', '#5ba4e6'],
  ['#a29bfe', '#8e85f0'],
  ['#fab1a0', '#f09380'],
  ['#81ecec', '#65dcdc'],
]

/**
 * Simple string hash function.
 */
function hashName(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * Get a deterministic gradient pair for a player name.
 * Same name always gets the same colors.
 */
export function avatarGradient(name) {
  if (!name) return PALETTE[0]
  const idx = hashName(name) % PALETTE.length
  return PALETTE[idx]
}

/**
 * Get initials from a Chinese name (first 1-2 characters).
 */
export function initials(name) {
  if (!name) return '?'
  // Remove parenthetical disambiguation like "(辽宁)" or "(河南)"
  const clean = name.replace(/[（(][^)）]*[)）]/g, '')
  return clean.slice(0, 2)
}
