import { test, expect } from "@playwright/test";

test.describe("Resume Builder Flow", () => {
  test("creates a resume, persists data, and handles PDF export", async ({
    page,
  }) => {
    // 1. Visit homepage and navigate to dashboard
    await page.goto("/");
    await expect(page).toHaveTitle(/Hire-Craft|Resume Builder/i);

    // 2. Go to Dashboard and create a resume
    await page.goto("/dashboard");
    const createBtn = page.getByRole("button", {
      name: "Create Resume",
    });
    await createBtn.waitFor({ state: "visible" });
    await createBtn.click();

    // Wait for the builder to load by waiting for a specific form element
    const fullNameInput = page.getByPlaceholder("John Doe");
    await fullNameInput.waitFor({ state: "visible", timeout: 15000 });

    // 3. Form Input test (Personal Info)
    await fullNameInput.fill("E2E Test User");

    const jobTitleInput = page.getByPlaceholder("Frontend Developer");
    await jobTitleInput.waitFor({ state: "visible" });
    await jobTitleInput.fill("Senior Quality Engineer");

    // 4. Validate data is shown in the preview
    // The preview should contain the text we just typed
    const previewContainer = page.locator("#resume-preview-paper");
    await expect(previewContainer).toContainText("E2E Test User");
    await expect(previewContainer).toContainText("Senior Quality Engineer");

    // 5. Test persistence by reloading
    await page.reload();
    await fullNameInput.waitFor({ state: "visible", timeout: 15000 });

    // Ensure inputs still have the value
    await expect(page.getByPlaceholder("John Doe")).toHaveValue(
      "E2E Test User",
    );
    await expect(page.getByPlaceholder("Frontend Developer")).toHaveValue(
      "Senior Quality Engineer",
    );

    // 6. Test PDF Export
    const downloadBtn = page.getByRole("button", { name: /Download PDF|PDF/i });
    await expect(downloadBtn).toBeVisible();

    // Trigger download and catch the event
    const downloadPromise = page.waitForEvent("download");
    await downloadBtn.click();

    const download = await downloadPromise;
    // Verify filename matches the expected format (e.g. name_backup.pdf or similar)
    // In our app it uses fullName with spaces replaced by underscores + .pdf
    expect(download.suggestedFilename()).toBe("E2E_Test_User.pdf");

    // Verify it doesn't crash the page after download
    await expect(page.getByPlaceholder("John Doe")).toBeVisible();
  });
});
