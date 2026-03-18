import { test, expect, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

// Load word list for finding valid words during tests
const wordList: string[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "public", "words.json"), "utf-8")
);
const wordSet = new Set(wordList);

async function waitForGame(page: Page) {
  await expect(page.locator(".word-slots")).toBeVisible({ timeout: 10000 });
}

/** Click a slot by index using dispatchEvent for cross-browser compat */
async function clickSlot(page: Page, index: number) {
  await page.locator(".slot").nth(index).dispatchEvent("click");
}

/** Read the 9 letters currently displayed on the board */
async function getLetters(page: Page): Promise<string[]> {
  const slots = page.locator(".slot");
  const letters: string[] = [];
  for (let i = 0; i < 9; i++) {
    const text = await slots.nth(i).textContent();
    letters.push(text?.trim().toLowerCase() || "");
  }
  return letters;
}

/** Find indices of letters that form a valid 3-letter word */
function findValidWordIndices(letters: string[]): number[] {
  for (let a = 0; a < letters.length; a++) {
    for (let b = 0; b < letters.length; b++) {
      if (b === a) continue;
      for (let c = 0; c < letters.length; c++) {
        if (c === a || c === b) continue;
        const word = letters[a] + letters[b] + letters[c];
        if (wordSet.has(word)) return [a, b, c];
      }
    }
  }
  return [];
}

/** Select letters by index and submit the word */
async function selectAndSubmit(page: Page, indices: number[]) {
  for (const i of indices) {
    await clickSlot(page, i);
  }
  await page.locator(".submit-btn").dispatchEvent("click");
}

test.describe("Mixle Game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("does not show nickname modal before game is played", async ({
    page,
  }) => {
    await waitForGame(page);
    await expect(page.locator(".nickname-modal")).not.toBeVisible();
  });

  test("displays 9 letter tiles in round 1", async ({ page }) => {
    await waitForGame(page);
    const slots = page.locator(".slot");
    await expect(slots).toHaveCount(9);
  });

  test("can tap letters to form a word", async ({ page }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await clickSlot(page, 1);
    await clickSlot(page, 2);

    await expect(page.locator(".slot.selected")).toHaveCount(3);
    await expect(page.locator(".word-text")).toBeVisible();
  });

  test("can deselect a letter by tapping again", async ({ page }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await expect(page.locator(".slot.selected")).toHaveCount(1);

    await clickSlot(page, 0);
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("clear button removes all selections", async ({ page }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await clickSlot(page, 1);
    await expect(page.locator(".slot.selected")).toHaveCount(2);

    await page.locator(".clear-btn").dispatchEvent("click");
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("submit button is disabled for invalid words", async ({ page }) => {
    await waitForGame(page);
    await expect(page.locator(".submit-btn")).toBeDisabled();
  });

  test("shows how to play modal", async ({ page }) => {
    await waitForGame(page);

    await page.locator(".how-btn").dispatchEvent("click");
    await expect(page.locator(".modal h2")).toHaveText("How to Play");
    await page.locator(".close-btn").dispatchEvent("click");
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("round indicator shows correct round", async ({ page }) => {
    await waitForGame(page);
    await expect(page.locator(".round-label")).toContainText("Round 1 of 3");
  });

  test("game state persists on page reload", async ({ page }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await expect(page.locator(".slot.selected")).toHaveCount(1);

    await page.reload();
    await waitForGame(page);
    await expect(page.locator(".slot")).toHaveCount(9);
  });

  test("all players get the same letters on the same day", async ({ page }) => {
    await waitForGame(page);
    const letters1 = await getLetters(page);

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForGame(page);
    const letters2 = await getLetters(page);

    expect(letters1).toEqual(letters2);
  });

  test("shows score preview for valid words", async ({ page }) => {
    await waitForGame(page);

    const letters = await getLetters(page);
    const indices = findValidWordIndices(letters);
    expect(indices.length).toBeGreaterThan(0);

    for (const i of indices) {
      await clickSlot(page, i);
    }

    await expect(page.locator(".arrange-valid")).toBeVisible();
    await expect(page.locator(".arrange-valid")).toContainText("pts");
  });

  test("shows 'Not a valid word' for invalid 3+ letter combinations", async ({
    page,
  }) => {
    await waitForGame(page);

    const letters = await getLetters(page);

    // Find a 3-letter combo that is NOT a valid word
    let invalidIndices: number[] = [];
    outer: for (let a = 0; a < 9; a++) {
      for (let b = 0; b < 9; b++) {
        if (b === a) continue;
        for (let c = 0; c < 9; c++) {
          if (c === a || c === b) continue;
          const word = letters[a] + letters[b] + letters[c];
          if (!wordSet.has(word)) {
            invalidIndices = [a, b, c];
            break outer;
          }
        }
      }
    }
    expect(invalidIndices.length).toBe(3);

    for (const i of invalidIndices) {
      await clickSlot(page, i);
    }

    await expect(page.locator(".arrange-invalid")).toContainText(
      "Not a valid word"
    );
    await expect(page.locator(".submit-btn")).toBeDisabled();
  });

  test("shows hint when fewer than 3 letters selected", async ({ page }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await expect(page.locator(".word-hint")).toContainText(
      "Need at least 3 letters"
    );
  });

  test("submitting a valid word shows score toast", async ({ page }) => {
    await waitForGame(page);

    const letters = await getLetters(page);
    const indices = findValidWordIndices(letters);
    expect(indices.length).toBeGreaterThan(0);

    await selectAndSubmit(page, indices);

    await expect(page.locator(".score-toast")).toBeVisible();
    await expect(page.locator(".score-toast-word")).toBeVisible();
    await expect(page.locator(".score-toast-pts")).toContainText("pts");
  });

  test("submitting a word advances to round 2", async ({ page }) => {
    await waitForGame(page);

    const letters = await getLetters(page);
    const indices = findValidWordIndices(letters);
    expect(indices.length).toBeGreaterThan(0);

    await selectAndSubmit(page, indices);

    // Wait for toast to clear and round to advance
    await page.waitForTimeout(1500);

    // Should be on round 2 or game over if no valid word in next round
    const roundLabel = page.locator(".round-label");
    const gameOverTitle = page.locator(".result-title");

    const isRound2 = await roundLabel.isVisible().catch(() => false);
    const isGameOver = await gameOverTitle.isVisible().catch(() => false);

    expect(isRound2 || isGameOver).toBe(true);
    if (isRound2) {
      await expect(roundLabel).toContainText("Round 2 of 3");
      await expect(page.locator(".round-score-card")).toHaveCount(1);
    }
  });

  test("completing all 3 rounds shows game over screen", async ({ page }) => {
    await waitForGame(page);

    for (let round = 0; round < 3; round++) {
      const gameOverTitle = page.locator(".result-title");
      if (await gameOverTitle.isVisible().catch(() => false)) break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".result-title")).toBeVisible();
    await expect(page.locator(".final-score-value")).toBeVisible();
    await expect(page.locator(".stats-display")).toBeVisible();
    await expect(page.locator(".share-btn")).toBeVisible();
  });

  test("game over screen shows correct stats", async ({ page }) => {
    await waitForGame(page);

    for (let round = 0; round < 3; round++) {
      if (await page.locator(".result-title").isVisible().catch(() => false))
        break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".result-title")).toBeVisible();

    const statLabels = page.locator(".stat-label");
    await expect(statLabels.filter({ hasText: "Played" })).toBeVisible();
    await expect(statLabels.filter({ hasText: "Best" })).toBeVisible();
    await expect(statLabels.filter({ hasText: /^Streak$/ })).toBeVisible();
    await expect(statLabels.filter({ hasText: /^Max Streak$/ })).toBeVisible();
  });

  test("score accumulates across rounds", async ({ page }) => {
    await waitForGame(page);

    const letters = await getLetters(page);
    const indices = findValidWordIndices(letters);
    expect(indices.length).toBeGreaterThan(0);

    await selectAndSubmit(page, indices);
    await page.waitForTimeout(1500);

    // After round 1, total score should be shown if we advanced
    const roundLabel = page.locator(".round-label");
    if (await roundLabel.isVisible().catch(() => false)) {
      await expect(roundLabel).toContainText("pts");
    }
  });

  test("letters cannot be selected during score toast", async ({ page }) => {
    await waitForGame(page);

    const letters = await getLetters(page);
    const indices = findValidWordIndices(letters);
    expect(indices.length).toBeGreaterThan(0);

    await selectAndSubmit(page, indices);

    // Toast is showing
    await expect(page.locator(".score-toast")).toBeVisible();

    // Try to click a letter — should not select
    await clickSlot(page, 0);
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("daily reset: stale seed in localStorage is discarded", async ({
    page,
  }) => {
    await waitForGame(page);
    const letters1 = await getLetters(page);

    // Inject a saved game state with a different seed (simulating yesterday)
    await page.evaluate(() => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const todayKey = `mixle-${yyyy}-${mm}-${dd}`;
      const staleSeed = 12345678;
      localStorage.setItem(
        todayKey,
        JSON.stringify({
          seed: staleSeed,
          round: 1,
          letters: ["x", "x", "x", "x", "x", "x", "x", "x", "x"],
          selectedIndices: [],
          roundResults: [
            {
              word: "fake",
              score: {
                valid: true,
                letterScore: 10,
                allUsedBonus: 0,
                total: 10,
              },
              lettersUsed: ["f", "a", "k", "e"],
              carryOverLetters: ["x", "x", "x", "x", "x"],
            },
          ],
          gameOver: false,
          gameOverReason: "completed",
          totalScore: 10,
        })
      );
    });

    await page.reload();
    await waitForGame(page);

    // Should get fresh letters, not the stale "x" letters
    const letters2 = await getLetters(page);
    expect(letters2).toEqual(letters1);
    expect(letters2.every((l) => l === "x")).toBe(false);
    await expect(page.locator(".round-label")).toContainText("Round 1 of 3");
  });

  test("completed game persists on reload", async ({ page }) => {
    await waitForGame(page);

    for (let round = 0; round < 3; round++) {
      if (await page.locator(".result-title").isVisible().catch(() => false))
        break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".result-title")).toBeVisible();
    const scoreText = await page.locator(".final-score-value").textContent();

    await page.reload();
    await page.waitForTimeout(2000);

    await expect(page.locator(".result-title")).toBeVisible();
    await expect(page.locator(".final-score-value")).toHaveText(scoreText!);
  });

  test("share button copies results to clipboard", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForGame(page);

    for (let round = 0; round < 3; round++) {
      if (await page.locator(".result-title").isVisible().catch(() => false))
        break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".share-btn")).toBeVisible();
    await page.locator(".share-btn").dispatchEvent("click");

    await expect(page.locator(".copied-toast")).toContainText(
      "Copied to clipboard!"
    );

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );
    expect(clipboardText).toContain("Mixle");
    expect(clipboardText).toContain("pts");
    expect(clipboardText).toContain("www.mixle.fun");
  });

  test("selection order numbers appear on selected letters", async ({
    page,
  }) => {
    await waitForGame(page);

    await clickSlot(page, 0);
    await clickSlot(page, 3);
    await clickSlot(page, 5);

    const orders = page.locator(".selection-order");
    await expect(orders).toHaveCount(3);
    await expect(orders.nth(0)).toHaveText("1");
    await expect(orders.nth(1)).toHaveText("2");
    await expect(orders.nth(2)).toHaveText("3");
  });

  test("game over screen shows best word for each round", async ({ page }) => {
    await waitForGame(page);

    let roundsPlayed = 0;
    for (let round = 0; round < 3; round++) {
      if (await page.locator(".result-title").isVisible().catch(() => false))
        break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      roundsPlayed++;
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".result-title")).toBeVisible();

    // Each completed round card should have a best word indicator
    const roundCards = page.locator(".round-score-card");
    const cardCount = await roundCards.count();
    expect(cardCount).toBeGreaterThan(0);
    expect(cardCount).toBeLessThanOrEqual(roundsPlayed);

    for (let i = 0; i < cardCount; i++) {
      const card = roundCards.nth(i);
      const bestEl = card.locator(".rd-best");
      await expect(bestEl).toBeVisible();

      // Should show either "Best!" or a word with score
      const isBestMatch = await card.locator(".rd-best-match").isVisible().catch(() => false);
      const hasBestWord = await card.locator(".rd-best-word").isVisible().catch(() => false);

      expect(isBestMatch || hasBestWord).toBe(true);
      if (hasBestWord) {
        await expect(card.locator(".rd-best-score")).toContainText("pts");
      }
    }
  });

  test("share text does not contain best word", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await waitForGame(page);

    for (let round = 0; round < 3; round++) {
      if (await page.locator(".result-title").isVisible().catch(() => false))
        break;

      const letters = await getLetters(page);
      const indices = findValidWordIndices(letters);
      if (indices.length === 0) break;

      await selectAndSubmit(page, indices);
      await page.waitForTimeout(1500);
    }

    await expect(page.locator(".result-title")).toBeVisible();

    // Collect any best words shown (only the ones the player didn't find)
    const bestWordEls = page.locator(".rd-best-word");
    const bestWordCount = await bestWordEls.count();
    const bestWords: string[] = [];
    for (let i = 0; i < bestWordCount; i++) {
      const text = await bestWordEls.nth(i).textContent();
      if (text) bestWords.push(text.trim().toLowerCase());
    }

    // Share results
    await page.locator(".share-btn").dispatchEvent("click");
    await expect(page.locator(".copied-toast")).toContainText(
      "Copied to clipboard!"
    );

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText()
    );

    // Share text should have the standard fields
    expect(clipboardText).toContain("Mixle");
    expect(clipboardText).toContain("pts");
    expect(clipboardText).toContain("www.mixle.fun");

    // But should NOT contain any of the best words
    for (const word of bestWords) {
      expect(clipboardText.toLowerCase()).not.toContain(word);
    }
  });
});
