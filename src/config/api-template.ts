// API Configuration Template - Add your keys here for production
// DO NOT commit real API keys to public repositories

export const apiConfig = {
  // VAPI Configuration - Get keys from https://vapi.ai
  vapi: {
    publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'your_vapi_public_key_here',
    privateKey: process.env.VAPI_PRIVATE_KEY || 'your_vapi_private_key_here',
    baseUrl: 'https://api.vapi.ai'
  },
  
  // Apify Configuration - Get token from https://apify.com
  apify: {
    token: process.env.APIFY_TOKEN || 'your_apify_token_here',
    userId: process.env.APIFY_USER_ID || 'your_apify_user_id_here',
    baseUrl: 'https://api.apify.com/v2'
  },
  
  // Higgsfield Configuration - Provided by hackathon sponsors
  higgsfield: {
    apiKeyId: process.env.HIGGSFIELD_API_KEY_ID || '184a4cd0-2084-4d5c-a5e6-783e89bf96b1',
    apiKeySecret: process.env.HIGGSFIELD_API_KEY_SECRET || '5c08efefca0d3a2766db52591eb847b4e654719e226b360bc90074e423657a8c',
    baseUrl: 'https://api.higgsfield.ai/v1'
  },

  // 21st.dev Configuration
  twentyFirstDev: {
    credits: 10,
    apiUrl: 'https://api.21st.dev',
  },
  
  // Application URLs
  app: {
    localUrl: 'http://localhost:3000',
    productionUrl: process.env.NEXT_PUBLIC_VERCEL_URL || 'https://burnstream-ejl4fcjiy-techstar9797s-projects.vercel.app',
  }
}

// Helper function to get base64 auth for Higgsfield
export const getHiggsfieldAuth = () => {
  const credentials = `${apiConfig.higgsfield.apiKeyId}:${apiConfig.higgsfield.apiKeySecret}`
  return Buffer.from(credentials).toString('base64')
}

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production'
export const isDemoMode = !process.env.VAPI_PRIVATE_KEY || !process.env.APIFY_TOKEN

// Instructions for setup
export const setupInstructions = `
🔧 API Setup Instructions:

1. VAPI Keys (https://vapi.ai):
   - Add NEXT_PUBLIC_VAPI_PUBLIC_KEY to environment
   - Add VAPI_PRIVATE_KEY to environment

2. Apify Token (https://apify.com):
   - Add APIFY_TOKEN to environment  
   - Add APIFY_USER_ID to environment

3. For Vercel deployment:
   - Add all environment variables in Vercel dashboard
   - Redeploy after adding keys for full functionality

4. For local development:
   - Create .env.local file with all keys
   - Restart development server
`
