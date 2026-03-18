import { test, expect } from '@playwright/test'

test('home loads', async ({ page }) => {
  await page.goto('/')
  // Nuxt doesn't set a title by default unless we configure it.
  // Use a stable, user-visible assertion instead.
  await expect(page.getByRole('heading', { name: /Track business class award seats/i })).toBeVisible()
  await expect(page.locator('a[href="/pricing"]').first()).toBeVisible()
})

test('pricing loads', async ({ page }) => {
  await page.goto('/pricing')
  await expect(page.getByText(/Simple plans/i)).toBeVisible()
  await expect(page.getByText(/Billing status/i)).toBeVisible()
})

test('browse loads', async ({ page }) => {
  await page.goto('/browse')
  await expect(page.getByText(/Recent availability/i)).toBeVisible()
  await expect(page.getByText('Observations', { exact: true })).toBeVisible()
})

test('observations API responds', async ({ request }) => {
  const res = await request.get('/api/browse/observations?limit=1&offset=0')
  expect(res.ok()).toBeTruthy()
  const json = await res.json()
  expect(json).toHaveProperty('observations')
  expect(json).toHaveProperty('page')
})

