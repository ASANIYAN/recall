/** Named constants for the SM-2-style scheduling algorithm — the standard values, shipped as v1 defaults, not placeholders. */

export const INITIAL_EASE_FACTOR = 2.5
export const EASE_FACTOR_FLOOR = 1.3
export const GRADUATION_INTERVAL_DAYS = 1

export const AGAIN_EASE_DELTA = -0.2
export const HARD_EASE_DELTA = -0.15
export const EASY_EASE_DELTA = 0.15

export const HARD_INTERVAL_MULTIPLIER = 1.2
export const EASY_INTERVAL_MULTIPLIER = 1.3

/** Mastery thresholds, in days. Tunable, not architectural. */
export const SHAKY_MAX_DAYS = 7
export const SOLID_MAX_DAYS = 21
