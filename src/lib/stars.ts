/** Thresholds for the star rating, as a fraction of remaining time. */
const THREE_STAR_RATIO = 0.7;
const TWO_STAR_RATIO = 0.3;

/**
 * Star rating earned on a win.
 * 3 stars: more than 70% of the time left.
 * 2 stars: more than 30% of the time left.
 * 1 star:  finished at all.
 */
export function computeStars(secondsLeft: number, secondsTotal: number): number {
  if (secondsTotal <= 0) return 1;
  const ratio = secondsLeft / secondsTotal;
  if (ratio > THREE_STAR_RATIO) return 3;
  if (ratio > TWO_STAR_RATIO) return 2;
  return 1;
}
