/** Mix bits so consecutive seeds produce very different starting states */
function mixSeed(seed: number): number {
  let h = seed | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = h ^ (h >>> 16);
  // Ensure result is in valid LCG range [1, 2147483646]
  return ((h >>> 0) % 2147483646) + 1;
}

export function seededRandom(seed: number): () => number {
  let s = mixSeed(seed);
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
