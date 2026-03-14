export function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function getDailySeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDayNumber(): number {
  const start = new Date(2026, 2, 13);
  const now = new Date();
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}
