// Configuration constants for the app
// Using environment-specific configuration with cost optimization in mind

// API endpoints
export const API_CONFIG = {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.hatchling.app',
    timeout: 10000, // 10 seconds
  };
  
  // Feature flags to control premium features and costs
  export const FEATURES = {
    // Free tier features
    basicTracking: true,
    simpleAnalytics: true,
    
    // Premium tier features - disabled by default in development
    aiInsights: process.env.EXPO_PUBLIC_ENABLE_AI === 'true',
    smsNotifications: process.env.EXPO_PUBLIC_ENABLE_SMS === 'true',
    advancedAnalytics: process.env.EXPO_PUBLIC_ENABLE_ADVANCED_ANALYTICS === 'true',
  };
  
  // Cost optimization settings
  export const COST_OPTIMIZATION = {
    // Cache durations in milliseconds
    cacheDuration: {
      activities: 5 * 60 * 1000, // 5 minutes
      insights: 60 * 60 * 1000,  // 1 hour
      analytics: 30 * 60 * 1000, // 30 minutes
    },
    
    // Batch sizes for API operations
    batchSize: {
      activities: 20,
      notifications: 10,
    },
    
    // Rate limits to prevent excessive API usage
    rateLimit: {
      aiRequests: 10, // Max AI requests per day per user
      smsNotifications: 5, // Max SMS notifications per day per user
    },
  };
  
  // App metadata
  export const APP_INFO = {
    name: 'Hatchling',
    version: '1.0.0',
    isPremium: false, // Default to free tier
  };
  