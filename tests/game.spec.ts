import { test, expect, Page } from "@playwright/test";

async function dismissNicknameModal(page: Page) {
  const modal = page.locator(".nickname-modal");
  // Wait for it to appear (it should on first visit after clearing localStorage)
  await modal.waitFor({ state: "visible", timeout: 10000 });
  await modal.locator("button.next-btn").click();
  await expect(modal).not.toBeVisible({ timeout: 5000 });
}

async function waitForGame(page: Page) {
  await expect(page.locator(".word-slots")).toBeVisible({ timeout: 10000 });
}

test.describe("Mixle Game", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows nickname modal on first visit", async ({ page }) => {
    await expect(page.locator(".nickname-modal")).toBeVisible({ timeout: 10000 });
    await expect(page.locator(".nickname-modal h2")).toHaveText("Welcome to Mixle!");
  });

  test("can accept default nickname and start playing", async ({ page }) => {
    await expect(page.locator(".nickname-modal")).toBeVisible({ timeout: 10000 });
    await page.locator(".nickname-modal .next-btn").click();
    await expect(page.locator(".nickname-modal")).not.toBeVisible();
    await waitForGame(page);
  });

  test("can customize nickname", async ({ page }) => {
    await expect(page.locator(".nickname-modal")).toBeVisible({ timeout: 10000 });
    await page.locator(".nickname-edit-btn").click();
    const input = page.locator(".nickname-input");
    await expect(input).toBeVisible();
    await input.fill("TestPlayer");
    await page.locator(".nickname-modal .next-btn").click();
    await expect(page.locator(".nickname-modal")).not.toBeVisible();
  });

  test("displays 9 letter tiles in round 1", async ({ page }) => {
    await dismissNicknameModal(page);
    await waitForGame(page);
    const slots = page.locator(".slot");
    await expect(slots).toHaveCount(9);
  });

  test("can tap letters to form a word", async ({ page }) => {
    await dismissNicknameModal(page);
    await waitForGame(page);

    // Wait for any animation to settle
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
    await dismissNicknameModal(page);
    await waitForGame(page);
    await page.waitForTimeout(500);

    const slots = page.locator(".slot");
    await slots.nth(0).click();
    await expect(page.locator(".slot.selected")).toHaveCount(1);

    await slots.nth(0).click();
    await expect(page.locator(".slot.selected")).toHaveCount(0);
  });

  test("clear button removes all selections", async ({ page }) => {
    await dismissNicknameModal(page);
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
    await dismissNicknameModal(page);
    await waitForGame(page);

    const submitBtn = page.locator(".submit-btn");
    await expect(submitBtn).toBeDisabled();
  });

  test("shows how to play modal", async ({ page }) => {
    await dismissNicknameModal(page);
    await waitForGame(page);
    await page.waitForTimeout(500);

    await page.locator(".how-btn").click();
    await expect(page.locator(".modal h2")).toHaveText("How to Play");
    await page.locator(".close-btn").click();
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("round indicator shows correct round", async ({ page }) => {
    await dismissNicknameModal(page);
    await expect(page.locator(".round-label")).toContainText("Round 1 of 3");
  });
});
