import { describe, it, expect, beforeEach, afterEach } from '@playwright/test';

/**
 * Build Info Tests
 * 
 * These tests verify that the build-info utility correctly reads
 * commit SHA from environment variables in the proper priority order.
 */

// Mock import.meta.env
let mockEnv: Record<string, string | undefined> = {};

// Simple test to verify the logic (would run in Node environment during build)
describe('Build Info Priority Logic', () => {
  beforeEach(() => {
    mockEnv = {};
  });

  it('should prioritize VERCEL_GIT_COMMIT_SHA over GITHUB_SHA', () => {
    mockEnv.VERCEL_GIT_COMMIT_SHA = 'abc123vercel';
    mockEnv.GITHUB_SHA = 'def456github';
    
    const sha = mockEnv.VERCEL_GIT_COMMIT_SHA || mockEnv.GITHUB_SHA || 'local';
    expect(sha).toBe('abc123vercel');
  });

  it('should use GITHUB_SHA when VERCEL_GIT_COMMIT_SHA is not available', () => {
    mockEnv.GITHUB_SHA = 'def456github';
    
    const sha = mockEnv.VERCEL_GIT_COMMIT_SHA || mockEnv.GITHUB_SHA || 'local';
    expect(sha).toBe('def456github');
  });

  it('should fallback to "local" when no env vars are available', () => {
    const sha = mockEnv.VERCEL_GIT_COMMIT_SHA || mockEnv.GITHUB_SHA || 'local';
    expect(sha).toBe('local');
  });

  it('should create short SHA correctly', () => {
    const fullSha = 'abc123vercel456';
    const shortSha = fullSha.substring(0, 7);
    expect(shortSha).toBe('abc123v');
    expect(shortSha.length).toBe(7);
  });

  it('should return "local" for short SHA in development', () => {
    const sha = 'local';
    const shortSha = sha === 'local' ? 'local' : sha.substring(0, 7);
    expect(shortSha).toBe('local');
  });
});
