// Feature flags configuration
// This file controls the visibility of features across the application

export interface FeatureFlags {
  // Premium features (hidden for public launch)
  premiumListings: boolean;
  featuredProducts: boolean;
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customBranding: boolean;
  bulkOperations: boolean;

  // Beta features (in development)
  productComparison: boolean;
  productFavorites: boolean;
  advancedSearch: boolean;
  socialSharing: boolean;
  whatsappIntegration: boolean;

  // Core features (always enabled)
  basicSearch: boolean;
  productListing: boolean;
  userProfiles: boolean;
  notifications: boolean;
}

// Default feature flags - Premium features are disabled for public launch
const defaultFeatures: FeatureFlags = {
  // Premium features - DISABLED for public launch
  premiumListings: false,
  featuredProducts: false,
  advancedAnalytics: false,
  prioritySupport: false,
  customBranding: false,
  bulkOperations: false,

  // Beta features - ENABLED for development
  productComparison: true,
  productFavorites: true,
  advancedSearch: true,
  socialSharing: false,
  whatsappIntegration: false,

  // Core features - ENABLED
  basicSearch: true,
  productListing: true,
  userProfiles: true,
  notifications: true,
};

// Environment-based feature overrides
const getEnvironmentFeatures = (): Partial<FeatureFlags> => {
  // In development, we can enable more features for testing
  if (import.meta.env.DEV) {
    return {
      // Enable some beta features in development
      socialSharing: true,
      whatsappIntegration: true,
    };
  }

  // In production, stick to default (conservative) settings
  return {};
};

// Merge default features with environment overrides
const environmentFeatures = getEnvironmentFeatures();
export const features: FeatureFlags = {
  ...defaultFeatures,
  ...environmentFeatures,
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return features[feature];
};

// Helper function to get all enabled features
export const getEnabledFeatures = (): string[] => {
  return Object.entries(features)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature);
};

// Helper function to get all disabled features
export const getDisabledFeatures = (): string[] => {
  return Object.entries(features)
    .filter(([_, enabled]) => !enabled)
    .map(([feature, _]) => feature);
};

// Development helper - log feature status
if (import.meta.env.DEV) {
  console.log("🚀 Feature Flags Status:");
  console.log("✅ Enabled:", getEnabledFeatures());
  console.log("❌ Disabled:", getDisabledFeatures());
}
