// Helper utilities for displaying units consistently across the app
export function normalizeSaltDisplay(raw) {
  // raw may be: grams (e.g., 0.315), mg (e.g., 315), or undefined
  const val = Number(raw) || 0

  // Heuristic:
  // - if value > 10, treat as mg already (common when backend stores 315)
  // - otherwise treat as grams and convert to mg
  if (val > 10) {
    return { value: Math.round(val), unit: 'mg' }
  }

  return { value: Math.round(val * 1000), unit: 'mg' }
}

export default {
  normalizeSaltDisplay
}
