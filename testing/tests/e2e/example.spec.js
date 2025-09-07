// @ts-check
import dotenv from "dotenv";

// Load your .env file
dotenv.config({ path: ".env.test" });

import { test, expect } from "@playwright/test";

test("Log into dashboard, delete and readd widget, signout", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/"); // change to your app’s URL

  // Check the title
  await expect(page).toHaveTitle("Creator Control Room");

  // Fill in Company name
  await page
    .getByPlaceholder(" eg. Creator Control Room")
    .fill("StreamerHouse");

  // Fill in password
  await page
    .getByPlaceholder("Enter password")
    .fill(process.env.PASSWORD ?? "");

  // Click login
  await page.getByRole("button", { name: "Log in" }).click();

  // deletes widget
  await page.getByTestId("delete me").click();

  // adds widhet
  await page.getByRole("button", { name: "Add Widget +" }).click();
  await page.getByTestId("add me").click();

  // Signs out
  await page.getByRole("button", { name: "Sign out" }).click();
});
