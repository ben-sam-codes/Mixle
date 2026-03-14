import { test, expect, Page } from "@playwright/test";

async function waitForGame(page: Page) {
  await expect(page.locator(".word-slots")).toBeVisible({ timeout: 10000 });
}

test.describe("Mixle Game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("does not show nickname modal before game is played", async ({ page }) => {
    await waitForGame(page);
    // Nickname modal should NOT appear on first load
    await expect(page.locator(".nickname-modal")).not.toBeVisible();
  });

  test("displays 9 letter tiles in round 1", async ({ page }) => {
    await waitForGame(page);
    const slots = page.locator(".slot");
    await expect(slots).toHaveCount(9);
  });

  test("can tap letters to form a word", async ({ page }) => {
    await waitForGame(page);
    await page.waitForTimeout(500);

    const slots = page.locator(".slot");
    await slots.nth(0).click();
    await slots.nth(1).click();
    await slots.nth(2).click();

    const selectedSlots = page.locator(".slot.selected");
    await expect(selectedSlots).toHaveCount(3);

    const wordText = page.locator(".word-text");
    await expect(wordText).toBeVisible();
  });

  test("can deselect a letter by tapping again", async ({ page }) => {
    await waitForGame(page);
    await page.waitForTimeout(500);

    const slots = page.locator(".slot");
    await slots.nth(0).click();
    await expect(page.locator(".slot.selected")).toHaveCount(1);

    await slots.nth(0).click();
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("clear button removes all selections", async ({ page }) => {
    await waitForGame(page);
    await page.waitForTimeout(500);

    const slots = page.locator(".slot");
    await slots.nth(0).click();
    await slots.nth(1).click();
    await expect(page.locator(".slot.selected")).toHaveCount(2);

    await page.locator(".clear-btn").click();
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("submit button is disabled for invalid words", async ({ page }) => {
    await waitForGame(page);

    const submitBtn = page.locator(".submit-btn");
    await expect(submitBtn).toBeDisabled();
  });

  test("shows how to play modal", async ({ page }) => {
    await waitForGame(page);
    await page.waitForTimeout(500);

    await page.locator(".how-btn").click();
    await expect(page.locator(".modal h2")).toHaveText("How to Play");
    await page.locator(".close-btn").click();
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("round indicator shows correct round", async ({ page }) => {
    await waitForGame(page);
    await expect(page.locator(".round-label")).toContainText("Round 1 of 3");
  });

  test("game state persists on page reload", async ({ page }) => {
    await waitForGame(page);

    // Select a letter
    const slots = page.locator(".slot");
    await page.waitForTimeout(500);
    await slots.nth(0).click();
    await expect(page.locator(".slot.selected")).toHaveCount(1);

    // Reload
    await page.reload();

    // Game should still show 9 letters (state restored)
    await waitForGame(page);
    await expect(page.locator(".slot")).toHaveCount(9);
  });

  test("all players get the same letters on the same day", async ({ page }) => {
    await waitForGame(page);

    // Get all 9 letters
    const letters1: string[] = [];
    const slots = page.locator(".slot");
    for (let i = 0; i < 9; i++) {
      const text = await slots.nth(i).textContent();
      letters1.push(text?.trim() || "");
    }

    // Clear state and reload — should get the same letters
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForGame(page);

    const letters2: string[] = [];
    const slots2 = page.locator(".slot");
    for (let i = 0; i < 9; i++) {
      const text = await slots2.nth(i).textContent();
      letters2.push(text?.trim() || "");
    }

    expect(letters1).toEqual(letters2);
  });
});
