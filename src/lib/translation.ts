// Real-time Translation Service for Global Voice Communication
// Supports Google Translate API and regional language processing

export interface TranslationConfig {
  sourceLanguage: string
  targetLanguage: string
  region: string
  dialect?: string
}

export interface TranslationResult {
  originalText: string
  translatedText: string
  confidence: number
  sourceLanguage: string
  targetLanguage: string
  region: string
}

export interface PriceIntelligence {
  product: string
  price: number
  currency: string
  location: string
  shopkeeper: string
  timestamp: string
  verified: boolean
  incentiveEarned: number
}

export interface GlobalVoiceSession {
  sessionId: string
  participants: Array<{
    userId: string
    name: string
    location: string
    language: string
    role: 'buyer' | 'seller' | 'translator' | 'moderator'
  }>
  translations: TranslationResult[]
  priceData: PriceIntelligence[]
}

class GlobalTranslationService {
  private googleTranslateApiKey = process.env.GOOGLE_TRANSLATE_API_KEY || 'demo_key'
  private supportedLanguages = [
    { code: 'en', name: 'English', regions: ['US', 'UK', 'AU', 'CA'] },
    { code: 'es', name: 'Spanish', regions: ['ES', 'MX', 'AR', 'CO'] },
    { code: 'zh', name: 'Chinese', regions: ['CN', 'TW', 'HK', 'SG'] },
    { code: 'hi', name: 'Hindi', regions: ['IN'] },
    { code: 'ar', name: 'Arabic', regions: ['SA', 'AE', 'EG', 'MA'] },
    { code: 'ja', name: 'Japanese', regions: ['JP'] },
    { code: 'ko', name: 'Korean', regions: ['KR'] },
    { code: 'fr', name: 'French', regions: ['FR', 'CA', 'BE', 'CH'] },
    { code: 'de', name: 'German', regions: ['DE', 'AT', 'CH'] },
    { code: 'pt', name: 'Portuguese', regions: ['BR', 'PT'] },
    { code: 'ru', name: 'Russian', regions: ['RU', 'BY', 'KZ'] },
    { code: 'it', name: 'Italian', regions: ['IT'] },
    { code: 'tr', name: 'Turkish', regions: ['TR'] },
    { code: 'th', name: 'Thai', regions: ['TH'] },
    { code: 'vi', name: 'Vietnamese', regions: ['VN'] }
  ]

  // Real-time translation for voice conversations
  async translateVoiceText(
    text: string, 
    config: TranslationConfig
  ): Promise<TranslationResult> {
    console.log(`🌍 Translating: "${text}" from ${config.sourceLanguage} to ${config.targetLanguage}`)
    
    try {
      // Use Google Translate API for real translation
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.googleTranslateApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: config.sourceLanguage,
            target: config.targetLanguage,
            format: 'text'
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const translatedText = data.data.translations[0].translatedText
        const detectedLanguage = data.data.translations[0].detectedSourceLanguage || config.sourceLanguage

        return {
          originalText: text,
          translatedText: translatedText,
          confidence: 0.95, // Google Translate typically has high confidence
          sourceLanguage: detectedLanguage,
          targetLanguage: config.targetLanguage,
          region: config.region
        }
      }
    } catch (error) {
      console.warn('Google Translate API error, using demo translation:', error)
    }

    // Fallback to demo translation for hackathon
    return this.getDemoTranslation(text, config)
  }

  // Detect language from voice input
  async detectLanguage(text: string): Promise<{ language: string; confidence: number; region?: string }> {
    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${this.googleTranslateApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text
          })
        }
      )

      if (response.ok) {
        const data = await response.json()
        const detection = data.data.detections[0][0]
        
        return {
          language: detection.language,
          confidence: detection.confidence,
          region: this.getRegionForLanguage(detection.language)
        }
      }
    } catch (error) {
      console.warn('Language detection error:', error)
    }

    // Fallback language detection
    return { language: 'en', confidence: 0.8, region: 'US' }
  }

  // Process price intelligence from voice input
  async extractPriceIntelligence(
    voiceText: string,
    userLocation: string,
    userLanguage: string
  ): Promise<PriceIntelligence | null> {
    console.log(`💰 Extracting price intelligence from: "${voiceText}"`)

    // Translate to English for processing if needed
    let processText = voiceText
    if (userLanguage !== 'en') {
      const translation = await this.translateVoiceText(voiceText, {
        sourceLanguage: userLanguage,
        targetLanguage: 'en',
        region: userLocation
      })
      processText = translation.translatedText
    }

    // Extract price information using pattern matching
    const pricePatterns = [
      /(\w+.*?)\s*(?:costs?|is|price)\s*(?:about|around)?\s*([₹$€£¥₩]+)?\s*(\d+(?:\.\d{2})?)\s*([a-zA-Z]{3})?/i,
      /(\w+.*?)\s*(?:selling|available)\s*(?:for|at)\s*([₹$€£¥₩]+)?\s*(\d+(?:\.\d{2})?)\s*([a-zA-Z]{3})?/i,
      /(?:price of|cost of)\s*(\w+.*?)\s*(?:is|costs)\s*([₹$€£¥₩]+)?\s*(\d+(?:\.\d{2})?)\s*([a-zA-Z]{3})?/i
    ]

    for (const pattern of pricePatterns) {
      const match = processText.match(pattern)
      if (match) {
        const [, product, currencySymbol, priceStr, currencyCode] = match
        const price = parseFloat(priceStr)
        
        if (price && product) {
          const currency = this.determineCurrency(currencySymbol, currencyCode, userLocation)
          
          return {
            product: product.trim(),
            price: price,
            currency: currency,
            location: userLocation,
            shopkeeper: 'Anonymous Local Source', // Could be enhanced with user identification
            timestamp: new Date().toISOString(),
            verified: false, // Requires verification process
            incentiveEarned: this.calculateIncentive(price, currency)
          }
        }
      }
    }

    return null
  }

  // Calculate incentive payment for price sharing
  private calculateIncentive(price: number, currency: string): number {
    // Base incentive: $0.10-$1.00 USD equivalent based on price range
    const baseIncentive = Math.min(Math.max(price * 0.01, 0.10), 1.00)
    
    // Convert to local currency equivalent
    const exchangeRates: { [key: string]: number } = {
      'USD': 1.00,
      'EUR': 0.85,
      'GBP': 0.73,
      'JPY': 110.0,
      'INR': 75.0,
      'CNY': 6.5,
      'KRW': 1200.0,
      'BRL': 5.2,
      'RUB': 70.0
    }
    
    const rate = exchangeRates[currency] || 1.0
    return Math.round((baseIncentive * rate) * 100) / 100
  }

  // Get regional language variants
  getRegionalVariant(language: string, region: string): string {
    const regionalVariants: { [key: string]: { [key: string]: string } } = {
      'en': {
        'US': 'en-US',
        'UK': 'en-GB', 
        'AU': 'en-AU',
        'CA': 'en-CA'
      },
      'es': {
        'ES': 'es-ES',
        'MX': 'es-MX',
        'AR': 'es-AR',
        'CO': 'es-CO'
      },
      'zh': {
        'CN': 'zh-CN',
        'TW': 'zh-TW',
        'HK': 'zh-HK'
      },
      'ar': {
        'SA': 'ar-SA',
        'AE': 'ar-AE',
        'EG': 'ar-EG'
      }
    }

    return regionalVariants[language]?.[region] || language
  }

  // VAPI Integration for multilingual voice calls
  async createMultilingualVapiAssistant(primaryLanguage: string, supportedLanguages: string[]) {
    const assistantConfig = {
      name: 'Global Marketplace Assistant',
      firstMessage: this.getLocalizedGreeting(primaryLanguage),
      systemPrompt: `You are a multilingual marketplace assistant that helps people share and discover real-time price information globally. 

Core capabilities:
- Understand and respond in ${supportedLanguages.join(', ')}
- Help users share local product prices
- Connect buyers with local sellers
- Provide real-time translation during conversations
- Calculate and offer incentive payments for price sharing

Key phrases to recognize:
- Price sharing: "The price of [product] here is [amount]"
- Price inquiry: "What does [product] cost in [location]?"
- Translation request: "Can you translate this to [language]?"

Always be helpful, culturally sensitive, and encourage global community sharing.`,
      
      voice: {
        provider: 'elevenlabs',
        voiceId: 'pNInz6obpgDQGcFmaJgB' // Multilingual capable voice
      },
      
      model: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
      },

      tools: [
        {
          type: 'function',
          function: {
            name: 'translate_message',
            description: 'Translate a message between languages in real-time',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Text to translate' },
                sourceLanguage: { type: 'string', description: 'Source language code' },
                targetLanguage: { type: 'string', description: 'Target language code' }
              },
              required: ['text', 'targetLanguage']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'record_price_intelligence',
            description: 'Record local price information shared by users',
            parameters: {
              type: 'object',
              properties: {
                product: { type: 'string', description: 'Product name' },
                price: { type: 'number', description: 'Price amount' },
                currency: { type: 'string', description: 'Currency code' },
                location: { type: 'string', description: 'Location/city' }
              },
              required: ['product', 'price', 'currency', 'location']
            }
          }
        },
        {
          type: 'function',
          function: {
            name: 'find_local_prices',
            description: 'Find local prices for products in specific locations',
            parameters: {
              type: 'object',
              properties: {
                product: { type: 'string', description: 'Product to search for' },
                location: { type: 'string', description: 'Location to search in' },
                maxAge: { type: 'number', description: 'Maximum age of price data in hours' }
              },
              required: ['product', 'location']
            }
          }
        }
      ]
    }

    return assistantConfig
  }

  // Helper methods
  private getDemoTranslation(text: string, config: TranslationConfig): TranslationResult {
    // Demo translations for common phrases
    const demoTranslations: { [key: string]: { [key: string]: string } } = {
      'en': {
        'es': 'Hello, how much does this cost? → Hola, ¿cuánto cuesta esto?',
        'zh': 'Hello, how much does this cost? → 你好，这个多少钱？',
        'hi': 'Hello, how much does this cost? → नमस्ते, इसकी कीमत कितनी है?',
        'ar': 'Hello, how much does this cost? → مرحبا، كم يكلف هذا؟'
      },
      'es': {
        'en': 'El precio del arroz es 2 euros → The price of rice is 2 euros',
        'zh': 'El precio del arroz es 2 euros → 大米的价格是2欧元'
      },
      'zh': {
        'en': '苹果的价格是5元 → The price of apples is 5 yuan',
        'es': '苹果的价格是5元 → El precio de las manzanas es 5 yuan'
      }
    }

    const translationKey = `${config.sourceLanguage}-${config.targetLanguage}`
    const demoText = demoTranslations[config.sourceLanguage]?.[config.targetLanguage] || 
                     `[${config.sourceLanguage.toUpperCase()}] ${text} → [${config.targetLanguage.toUpperCase()}] ${text}`

    return {
      originalText: text,
      translatedText: demoText,
      confidence: 0.85,
      sourceLanguage: config.sourceLanguage,
      targetLanguage: config.targetLanguage,
      region: config.region
    }
  }

  private getLocalizedGreeting(language: string): string {
    const greetings: { [key: string]: string } = {
      'en': 'Hello! I can help you share and discover prices from around the world. What would you like to know?',
      'es': '¡Hola! Puedo ayudarte a compartir y descubrir precios de todo el mundo. ¿Qué te gustaría saber?',
      'zh': '你好！我可以帮助您分享和发现世界各地的价格。您想了解什么？',
      'hi': 'नमस्ते! मैं आपको दुनिया भर की कीमतों को साझा करने और खोजने में मदद कर सकता हूं। आप क्या जानना चाहेंगे?',
      'ar': 'مرحبا! يمكنني مساعدتك في مشاركة واكتشاف الأسعار من جميع أنحاء العالم. ماذا تريد أن تعرف؟',
      'ja': 'こんにちは！世界中の価格を共有し、発見するお手伝いができます。何を知りたいですか？',
      'fr': 'Bonjour! Je peux vous aider à partager et découvrir les prix du monde entier. Que souhaitez-vous savoir?',
      'de': 'Hallo! Ich kann Ihnen helfen, Preise aus aller Welt zu teilen und zu entdecken. Was möchten Sie wissen?'
    }

    return greetings[language] || greetings['en']
  }

  private getRegionForLanguage(languageCode: string): string {
    const languageRegions: { [key: string]: string } = {
      'en': 'US',
      'es': 'ES', 
      'zh': 'CN',
      'hi': 'IN',
      'ar': 'SA',
      'ja': 'JP',
      'ko': 'KR',
      'fr': 'FR',
      'de': 'DE',
      'pt': 'BR',
      'ru': 'RU',
      'it': 'IT'
    }

    return languageRegions[languageCode] || 'US'
  }

  private determineCurrency(symbol?: string, code?: string, location?: string): string {
    if (code) return code.toUpperCase()
    
    const symbolToCurrency: { [key: string]: string } = {
      '$': 'USD',
      '€': 'EUR', 
      '£': 'GBP',
      '¥': 'JPY',
      '₹': 'INR',
      '₩': 'KRW'
    }

    if (symbol && symbolToCurrency[symbol]) {
      return symbolToCurrency[symbol]
    }

    // Determine by location
    const locationToCurrency: { [key: string]: string } = {
      'US': 'USD', 'USA': 'USD', 'United States': 'USD',
      'EU': 'EUR', 'Europe': 'EUR', 'Germany': 'EUR', 'France': 'EUR',
      'UK': 'GBP', 'Britain': 'GBP', 'England': 'GBP',
      'JP': 'JPY', 'Japan': 'JPY',
      'IN': 'INR', 'India': 'INR',
      'KR': 'KRW', 'Korea': 'KRW', 'South Korea': 'KRW',
      'CN': 'CNY', 'China': 'CNY'
    }

    if (location) {
      for (const [loc, curr] of Object.entries(locationToCurrency)) {
        if (location.toLowerCase().includes(loc.toLowerCase())) {
          return curr
        }
      }
    }

    return 'USD' // Default fallback
  }

  getSupportedLanguages() {
    return this.supportedLanguages
  }
}

export const globalTranslationService = new GlobalTranslationService()
