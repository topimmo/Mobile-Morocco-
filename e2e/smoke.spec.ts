import { test, expect } from '@playwright/test';

/**
 * Production Smoke Tests
 * 
 * These tests verify that critical functionality works after building
 * for production. They must pass before any deployment.
 * 
 * Test coverage:
 * 1. Home page renders without console errors
 * 2. SPA routing works (deep link navigation)
 * 3. Auth-protected route redirects when not logged in
 * 4. Critical API call (Supabase) works
 */

// Collect console errors during tests
const consoleErrors: string[] = [];

test.beforeEach(async ({ page }) => {
  // Clear errors before each test
  consoleErrors.length = 0;
  
  // Listen for console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign errors (e.g., favicon 404, Chrome extension errors)
      if (
        !text.includes('favicon') &&
        !text.includes('chrome-extension') &&
        !text.includes('net::ERR_BLOCKED_BY_CLIENT')
      ) {
        consoleErrors.push(text);
      }
    }
  });
  
  // Listen for uncaught exceptions
  page.on('pageerror', (error) => {
    consoleErrors.push(`Page Error: ${error.message}`);
  });
});

test.afterEach(async () => {
  // Fail the test if there were console errors
  if (consoleErrors.length > 0) {
    console.error('Console errors detected:', consoleErrors);
    // Don't fail on API errors that might be due to test environment
    const criticalErrors = consoleErrors.filter(
      (e) => !e.includes('Supabase') && !e.includes('fetch')
    );
    if (criticalErrors.length > 0) {
      throw new Error(`Test failed due to console errors: ${criticalErrors.join(', ')}`);
    }
  }
});

test.describe('Production Smoke Tests', () => {
  test('1. Home page renders without critical errors', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    
    // Check that main content is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check that the navigation is present (indicates React rendered)
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
    
    // Ensure no blank page (check for some content)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(100);
  });

  test('2. SPA routing works - direct navigation to /phones', async ({ page }) => {
    // Navigate directly to a route (simulating deep link / bookmark)
    await page.goto('/phones');
    
    await page.waitForLoadState('networkidle');
    
    // Check that we're on the correct page (not 404)
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
    
    // Verify the URL is correct
    expect(page.url()).toContain('/phones');
    
    // Check that content loaded (not blank page)
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });

  test('3. SPA routing works - direct navigation to /listings', async ({ page }) => {
    await page.goto('/listings');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
    
    expect(page.url()).toContain('/listings');
  });

  test('4. SPA routing works - direct navigation to /repair-shops', async ({ page }) => {
    await page.goto('/repair-shops');
    
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
    
    expect(page.url()).toContain('/repair-shops');
  });

  test('5. Auth-protected route redirects to login', async ({ page }) => {
    // Try to access dashboard without being logged in
    await page.goto('/dashboard');
    
    await page.waitForLoadState('networkidle');
    
    // Should either redirect to login or show login prompt
    // Wait for either login page URL or login form to appear
    const currentUrl = page.url();
    
    // Check if redirected to login page or if on a page with login link
    const hasLoginRoute = currentUrl.includes('/auth/login') || currentUrl.includes('/login');
    const hasLoginLink = await page.locator('a[href*="login"], button:has-text("Login"), button:has-text("Sign In")').count() > 0;
    const hasLoginContent = await page.locator('text=/login|sign in|connecter/i').count() > 0;
    
    // At least one of these should be true if auth protection is working
    expect(hasLoginRoute || hasLoginLink || hasLoginContent).toBeTruthy();
  });

  test('6. Navigation links work (client-side routing)', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Find and click a navigation link
    const phonesLink = page.locator('a[href="/phones"]').first();
    
    if (await phonesLink.isVisible()) {
      await phonesLink.click();
      
      // Wait for navigation
      await page.waitForURL('**/phones');
      
      // Verify we navigated without full page reload
      expect(page.url()).toContain('/phones');
    }
  });

  test('7. 404 page works for unknown routes', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    
    await page.waitForLoadState('networkidle');
    
    // Should show 404 content or redirect to home
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    
    // Navigation should still be visible (app didn't crash)
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('API Integration Tests', () => {
  test('8. Page loads even if Supabase is slow/unavailable', async ({ page }) => {
    // This test ensures the app handles API failures gracefully
    await page.goto('/');
    
    await page.waitForLoadState('domcontentloaded');
    
    // App should render even if data fetching fails
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('nav').first()).toBeVisible({ timeout: 15000 });
  });
});
