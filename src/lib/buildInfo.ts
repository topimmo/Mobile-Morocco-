/**
 * Build Information Utility
 * 
 * Provides access to build metadata like commit SHA and build time.
 * Automatically uses Vercel's VERCEL_GIT_COMMIT_SHA or GitHub Actions' GITHUB_SHA
 * without requiring manual environment variable configuration.
 */

/**
 * Get the commit SHA for the current build
 * 
 * Priority order:
 * 1. VERCEL_GIT_COMMIT_SHA - Automatically provided by Vercel
 * 2. GITHUB_SHA - Automatically provided by GitHub Actions
 * 3. "local" - Fallback for local development
 * 
 * @returns The commit SHA or "local" if not available
 */
export function getCommitSha(): string {
  // Priority 1: Vercel automatic environment variable
  if (import.meta.env.VERCEL_GIT_COMMIT_SHA) {
    return import.meta.env.VERCEL_GIT_COMMIT_SHA;
  }
  
  // Priority 2: GitHub Actions automatic environment variable
  if (import.meta.env.GITHUB_SHA) {
    return import.meta.env.GITHUB_SHA;
  }
  
  // Priority 3: Local development fallback
  return 'local';
}

/**
 * Get a short version of the commit SHA (first 7 characters)
 * Useful for display purposes
 * 
 * @returns Short commit SHA or "local"
 */
export function getShortCommitSha(): string {
  const sha = getCommitSha();
  return sha === 'local' ? 'local' : sha.substring(0, 7);
}

/**
 * Get build information object
 * 
 * @returns Object containing build metadata
 */
export function getBuildInfo() {
  return {
    commitSha: getCommitSha(),
    shortCommitSha: getShortCommitSha(),
    environment: import.meta.env.MODE,
  };
}

/**
 * Check if running in a CI/CD environment
 * 
 * @returns true if running in Vercel or GitHub Actions
 */
export function isCI(): boolean {
  return Boolean(
    import.meta.env.VERCEL_GIT_COMMIT_SHA || 
    import.meta.env.GITHUB_SHA
  );
}
