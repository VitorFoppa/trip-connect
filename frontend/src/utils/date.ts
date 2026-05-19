export function getDays(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const diff =
    (endDate.getTime() - startDate.getTime()) /
    (1000 * 60 * 60 * 24);

  return Math.floor(diff) + 1;
}