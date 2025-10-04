// API Configuration for all integrations
export const apiConfig = {
  // Higgsfield AI Configuration
  higgsfield: {
    apiKeyId: '184a4cd0-2084-4d5c-a5e6-783e89bf96b1',
    apiKeySecret: '5c08efefca0d3a2766db52591eb847b4e654719e226b360bc90074e423657a8c',
    baseUrl: 'https://api.higgsfield.ai/v1',
  },
  
  // 21st.dev Configuration
  twentyFirstDev: {
    credits: 10,
    apiUrl: 'https://api.21st.dev',
  },
  
  // Apify Configuration
  apify: {
    token: process.env.APIFY_TOKEN || 'demo_token',
    baseUrl: 'https://api.apify.com/v2',
  },
  
  // Application URLs
  app: {
    localUrl: 'http://localhost:3000',
    productionUrl: 'https://burnstream-9rixqxnhh-techstar9797s-projects.vercel.app',
  },
}

// Helper function to get base64 auth for Higgsfield
export const getHiggsfieldAuth = () => {
  const credentials = `${apiConfig.higgsfield.apiKeyId}:${apiConfig.higgsfield.apiKeySecret}`
  return Buffer.from(credentials).toString('base64')
}
