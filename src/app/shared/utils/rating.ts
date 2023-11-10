export function getAverageRating(rating: { [x: string]: number }): number {
  const values = Object.values(rating);
  const sum = values.reduce((a, b) => a + b, 0);
  return (sum / values.length) || 0;
}
