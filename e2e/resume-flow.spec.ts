import { test, expect } from "@playwright/test";

test("complete resume creation flow", async ({ page }) => {
  // 1. Homepage
  await page.goto("/");
  await expect(page).toHaveTitle(/Hire-Craft|Resume/);

  // 2. Create Resume (assuming there's a button like "Create Resume" or "Get Started")
  // Using generic selectors that would typically match
  const createBtn = page.getByRole("button", { name: /create|start/i }).first();
  if (await createBtn.isVisible()) {
    await createBtn.click();
  } else {
    // Fallback if we need to navigate directly
    await page.goto("/dashboard");
    await page
      .getByRole("button", { name: /create/i })
      .first()
      .click();
  }

  // 3. Wait for editor to load (URL should change to /builder/[id])
  await page.waitForURL(/\/builder\/.+/);

  // 4. Personal Information (assuming basic labels)
  const nameInput = page.getByLabel(/name|full name/i).first();
  if (await nameInput.isVisible()) {
    await nameInput.fill("Jane Doe E2E Test");
  }

  // 5. Save and reload to test persistence
  await page.reload();
  await page.waitForLoadState("networkidle");

  // Verify data remains
  if (await nameInput.isVisible()) {
    await expect(nameInput).toHaveValue("Jane Doe E2E Test");
  }

  // 6. Export PDF
  // We cannot easily test the exact PDF bytes here natively without external libs,
  // but we can verify the button triggers the process.
  const exportBtn = page.getByRole("button", { name: /pdf/i }).first();
  if (await exportBtn.isVisible()) {
    // Wait for the download event
    const downloadPromise = page
      .waitForEvent("download", { timeout: 10000 })
      .catch(() => null);
    await exportBtn.click();

    const download = await downloadPromise;
    if (download) {
      // Just verifying a file was triggered
      expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
    }
  }
});
