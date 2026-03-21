import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "enable1.txt");
const outputPath = join(__dirname, "..", "public", "words.json");

const raw = readFileSync(inputPath, "utf-8");
const words = raw
  .split(/\r?\n/)
  .map((w) => w.trim().toLowerCase())
  .filter((w) => /^[a-z]+$/.test(w) && w.length >= 3 && w.length <= 9)
  .sort();

const unique = Array.from(new Set(words));

writeFileSync(outputPath, JSON.stringify(unique));

console.log(`Wrote ${unique.length} words to public/words.json`);

const counts = {};
for (const w of unique) {
  counts[w.length] = (counts[w.length] || 0) + 1;
}
for (const len of Object.keys(counts).sort()) {
  console.log(`  ${len} letters: ${counts[len]}`);
}
