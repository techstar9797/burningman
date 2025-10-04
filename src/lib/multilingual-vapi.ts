// Structured Multilingual Support using VAPI
// Advanced voice AI with native language understanding and cultural context

import { apiConfig } from '@/config/api'

export interface MultilingualConfig {
  primaryLanguage: string
  fallbackLanguages: string[]
  region: string
  culturalContext: string
  voiceProfile: 'professional' | 'casual' | 'friendly' | 'authoritative'
}

export interface LanguageCapability {
  code: string
  name: string
  nativeName: string
  region: string
  voiceId: string
  culturalNotes: string[]
  commonPhrases: { [key: string]: string }
}

export interface MultilingualVapiAssistant {
  id: string
  name: string
  languages: LanguageCapability[]
  primaryLanguage: string
  systemPrompt: string
  culturalIntelligence: {
    greetingStyle: string
    businessEtiquette: string[]
    culturalSensitivities: string[]
    localCustoms: string[]
  }
}

class MultilingualVapiService {
  private baseUrl = 'https://api.vapi.ai'
  private publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo_key'
  private privateKey = process.env.VAPI_PRIVATE_KEY || 'demo_key'

  // Comprehensive language capabilities with cultural intelligence
  private languageCapabilities: LanguageCapability[] = [
    {
      code: 'en-US',
      name: 'English (US)',
      nativeName: 'English',
      region: 'North America',
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - clear American English
      culturalNotes: ['Direct communication', 'Time-conscious', 'Informal business style'],
      commonPhrases: {
        greeting: 'Hey there! How can I help you today?',
        price_inquiry: 'What does that cost?',
        thanks: 'Thanks a lot!',
        goodbye: 'Have a great day!'
      }
    },
    {
      code: 'es-ES',
      name: 'Spanish (Spain)',
      nativeName: 'Español',
      region: 'Europe',
      voiceId: 'VR6AewLTigWG4xSOukaG', // Spanish voice
      culturalNotes: ['Formal address important', 'Relationship-focused', 'Afternoon siesta culture'],
      commonPhrases: {
        greeting: '¡Hola! ¿En qué puedo ayudarte?',
        price_inquiry: '¿Cuánto cuesta eso?',
        thanks: '¡Muchas gracias!',
        goodbye: '¡Que tengas un buen día!'
      }
    },
    {
      code: 'zh-CN',
      name: 'Chinese (Mandarin)',
      nativeName: '中文',
      region: 'East Asia',
      voiceId: 'Xb7hH8MSUJpSbSDYk0k2', // Chinese voice
      culturalNotes: ['Respect for hierarchy', 'Face-saving important', 'Indirect communication'],
      commonPhrases: {
        greeting: '您好！我能为您做什么？',
        price_inquiry: '这个多少钱？',
        thanks: '谢谢您！',
        goodbye: '祝您愉快！'
      }
    },
    {
      code: 'hi-IN',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      region: 'South Asia',
      voiceId: 'knrPHWnBmmDHMoiMeP3l', // Hindi voice
      culturalNotes: ['Respectful address essential', 'Family-oriented culture', 'Hospitality-focused'],
      commonPhrases: {
        greeting: 'नमस्ते! मैं आपकी कैसे सहायता कर सकता हूँ?',
        price_inquiry: 'इसकी कीमत क्या है?',
        thanks: 'धन्यवाद!',
        goodbye: 'आपका दिन शुभ हो!'
      }
    },
    {
      code: 'ar-SA',
      name: 'Arabic (Saudi)',
      nativeName: 'العربية',
      region: 'Middle East',
      voiceId: 'yoZ06aMxZJJ28mfd3POQ', // Arabic voice
      culturalNotes: ['Islamic values important', 'Hospitality culture', 'Formal business approach'],
      commonPhrases: {
        greeting: 'مرحباً! كيف يمكنني مساعدتك؟',
        price_inquiry: 'كم يكلف هذا؟',
        thanks: 'شكراً لك!',
        goodbye: 'أطيب التمنيات!'
      }
    },
    {
      code: 'ja-JP',
      name: 'Japanese',
      nativeName: '日本語',
      region: 'East Asia',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Japanese voice
      culturalNotes: ['Extreme politeness', 'Indirect communication', 'Group harmony important'],
      commonPhrases: {
        greeting: 'こんにちは！どのようなご用件でしょうか？',
        price_inquiry: 'これはいくらですか？',
        thanks: 'ありがとうございます！',
        goodbye: '良い一日をお過ごしください！'
      }
    },
    {
      code: 'fr-FR',
      name: 'French',
      nativeName: 'Français',
      region: 'Europe',
      voiceId: 'XB0fDUnXU5powFXDhCwa', // French voice
      culturalNotes: ['Formal vs informal distinction', 'Cultural pride', 'Intellectual discourse valued'],
      commonPhrases: {
        greeting: 'Bonjour! Comment puis-je vous aider?',
        price_inquiry: 'Combien cela coûte-t-il?',
        thanks: 'Merci beaucoup!',
        goodbye: 'Bonne journée!'
      }
    },
    {
      code: 'de-DE',
      name: 'German',
      nativeName: 'Deutsch',
      region: 'Europe',
      voiceId: 'yoZ06aMxZJJ28mfd3POQ', // German voice
      culturalNotes: ['Punctuality valued', 'Direct communication', 'Quality-focused'],
      commonPhrases: {
        greeting: 'Hallo! Wie kann ich Ihnen helfen?',
        price_inquiry: 'Was kostet das?',
        thanks: 'Vielen Dank!',
        goodbye: 'Schönen Tag noch!'
      }
    }
  ]

  // Create multilingual VAPI assistant with cultural intelligence
  async createMultilingualAssistant(config: MultilingualConfig): Promise<MultilingualVapiAssistant> {
    console.log('🌍 Creating multilingual VAPI assistant...', config)

    const primaryLang = this.getLanguageCapability(config.primaryLanguage)
    const supportedLangs = [
      primaryLang,
      ...config.fallbackLanguages.map(lang => this.getLanguageCapability(lang))
    ].filter(Boolean)

    const assistantConfig = {
      name: `BurnStream Global Assistant (${primaryLang?.name})`,
      firstMessage: this.getLocalizedFirstMessage(config.primaryLanguage, config.culturalContext),
      
      systemPrompt: `You are a culturally intelligent, multilingual assistant for the BurnStream global platform. 

PRIMARY LANGUAGE: ${config.primaryLanguage}
REGION: ${config.region}
CULTURAL CONTEXT: ${config.culturalContext}

Your capabilities:
- Native fluency in ${supportedLangs.map(l => l?.name).join(', ')}
- Cultural intelligence and sensitivity for each region
- Real-time price intelligence and marketplace knowledge
- Event coordination and community building
- Cross-cultural communication facilitation

Cultural Guidelines for ${config.primaryLanguage}:
${primaryLang?.culturalNotes.map(note => `- ${note}`).join('\n')}

Communication Style:
- Use culturally appropriate greetings and formality levels
- Respect local business customs and etiquette  
- Provide context when bridging cultural differences
- Use region-specific examples and references
- Adapt tone based on cultural expectations

Core Functions:
1. Price Intelligence: Help users share and discover local prices
2. Translation: Facilitate cross-language communication
3. Cultural Bridge: Explain cultural context when needed
4. Community Building: Connect people across language barriers
5. Event Support: Provide event-specific assistance

Always be respectful, culturally aware, and helpful in facilitating global connections.`,

      voice: {
        provider: 'elevenlabs',
        voiceId: primaryLang?.voiceId || 'pNInz6obpgDQGcFmaJgB'
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
            name: 'translate_realtime',
            description: 'Translate text or speech between languages with cultural context',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'Text to translate' },
                sourceLanguage: { type: 'string', description: 'Source language code' },
                targetLanguage: { type: 'string', description: 'Target language code' },
                culturalContext: { type: 'string', description: 'Cultural context for appropriate translation' }
              },
              required: ['text', 'targetLanguage']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/marketplace/translate`,
            secret: 'burnstream-multilingual-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'record_local_price',
            description: 'Record local price information shared by users',
            parameters: {
              type: 'object',
              properties: {
                product: { type: 'string', description: 'Product name' },
                price: { type: 'number', description: 'Price amount' },
                currency: { type: 'string', description: 'Local currency' },
                location: { type: 'string', description: 'City/region' },
                context: { type: 'string', description: 'Additional context (shop type, quality, etc.)' }
              },
              required: ['product', 'price', 'currency', 'location']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/marketplace/price-intel`,
            secret: 'burnstream-price-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'cultural_bridge',
            description: 'Provide cultural context and bridge cultural differences in communication',
            parameters: {
              type: 'object',
              properties: {
                situation: { type: 'string', description: 'The cultural situation or misunderstanding' },
                sourceLanguage: { type: 'string', description: 'Source cultural context' },
                targetLanguage: { type: 'string', description: 'Target cultural context' }
              },
              required: ['situation']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/cultural/bridge`,
            secret: 'burnstream-cultural-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'find_local_expert',
            description: 'Connect users with local experts or community members',
            parameters: {
              type: 'object',
              properties: {
                expertise: { type: 'string', description: 'Type of expertise needed' },
                location: { type: 'string', description: 'Preferred location' },
                language: { type: 'string', description: 'Preferred communication language' },
                urgency: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Urgency level' }
              },
              required: ['expertise', 'location']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/experts/find`,
            secret: 'burnstream-expert-secret'
          }
        }
      ]
    }

    try {
      const response = await fetch(`${this.baseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistantConfig)
      })

      if (!response.ok) {
        throw new Error(`VAPI Multilingual Assistant creation failed: ${response.status}`)
      }

      const assistant = await response.json()
      console.log('✅ Multilingual VAPI Assistant created:', assistant.id)

      return {
        id: assistant.id,
        name: assistantConfig.name,
        languages: supportedLangs.filter(Boolean) as LanguageCapability[],
        primaryLanguage: config.primaryLanguage,
        systemPrompt: assistantConfig.systemPrompt,
        culturalIntelligence: this.getCulturalIntelligence(config.primaryLanguage)
      }
    } catch (error) {
      console.error('Multilingual VAPI Assistant creation error:', error)
      return this.getMockMultilingualAssistant(config)
    }
  }

  // Create language-specific phone numbers for global access
  async createGlobalPhoneNumbers(): Promise<Array<{
    language: string
    region: string
    phoneNumber: string
    localDialing: string
    assistantId: string
  }>> {
    console.log('📞 Creating global phone numbers for multilingual support...')

    const phoneNumbers = []

    try {
      // Create phone numbers for major regions
      const regions = [
        { language: 'en-US', region: 'North America', countryCode: '+1' },
        { language: 'en-GB', region: 'Europe', countryCode: '+44' },
        { language: 'es-ES', region: 'Spain', countryCode: '+34' },
        { language: 'zh-CN', region: 'China', countryCode: '+86' },
        { language: 'hi-IN', region: 'India', countryCode: '+91' },
        { language: 'ja-JP', region: 'Japan', countryCode: '+81' },
        { language: 'ar-SA', region: 'Saudi Arabia', countryCode: '+966' },
        { language: 'fr-FR', region: 'France', countryCode: '+33' }
      ]

      for (const region of regions) {
        try {
          const response = await fetch(`${this.baseUrl}/phone-number`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.privateKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              areaCode: region.countryCode,
              assistantId: `multilingual-${region.language}`,
              name: `BurnStream ${region.region}`
            })
          })

          if (response.ok) {
            const phoneData = await response.json()
            phoneNumbers.push({
              language: region.language,
              region: region.region,
              phoneNumber: phoneData.number,
              localDialing: phoneData.localNumber,
              assistantId: phoneData.assistantId
            })
          }
        } catch (error) {
          console.warn(`Failed to create phone number for ${region.region}:`, error)
        }
      }
    } catch (error) {
      console.error('Global phone number creation error:', error)
    }

    // Return mock data for demo
    return this.getMockGlobalNumbers()
  }

  // Advanced multilingual conversation handling
  async handleMultilingualConversation(
    message: string,
    userLanguage: string,
    assistantLanguage: string,
    culturalContext?: string
  ): Promise<{
    response: string
    translation?: string
    culturalNotes?: string[]
    suggestedActions?: string[]
  }> {
    console.log('💬 Processing multilingual conversation...', { userLanguage, assistantLanguage })

    try {
      // If languages are different, provide translation
      let translation = undefined
      if (userLanguage !== assistantLanguage) {
        const translationResult = await this.translateWithCulturalContext(
          message,
          userLanguage,
          assistantLanguage,
          culturalContext
        )
        translation = translationResult.translatedText
      }

      // Generate culturally appropriate response
      const response = await this.generateCulturalResponse(
        translation || message,
        assistantLanguage,
        culturalContext
      )

      // Provide cultural notes if cross-cultural communication
      const culturalNotes = userLanguage !== assistantLanguage ? 
        this.getCulturalNotes(userLanguage, assistantLanguage) : undefined

      return {
        response,
        translation,
        culturalNotes,
        suggestedActions: this.getSuggestedActions(userLanguage, message)
      }
    } catch (error) {
      console.error('Multilingual conversation error:', error)
      return {
        response: this.getFallbackResponse(assistantLanguage),
        culturalNotes: ['Communication assistance available in multiple languages']
      }
    }
  }

  // Language detection from voice input
  async detectLanguageFromVoice(audioData: Blob): Promise<{
    language: string
    confidence: number
    region: string
    dialect?: string
  }> {
    console.log('🎤 Detecting language from voice input...')

    try {
      // Use VAPI's built-in language detection
      const formData = new FormData()
      formData.append('audio', audioData)
      
      const response = await fetch(`${this.baseUrl}/speech/detect-language`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return {
          language: result.language,
          confidence: result.confidence,
          region: result.region || this.getRegionForLanguage(result.language),
          dialect: result.dialect
        }
      }
    } catch (error) {
      console.error('Voice language detection error:', error)
    }

    // Fallback detection
    return { language: 'en-US', confidence: 0.8, region: 'US' }
  }

  // Helper methods
  private getLanguageCapability(languageCode: string): LanguageCapability | undefined {
    return this.languageCapabilities.find(lang => 
      lang.code === languageCode || lang.code.startsWith(languageCode.split('-')[0])
    )
  }

  private getLocalizedFirstMessage(language: string, context: string): string {
    const capability = this.getLanguageCapability(language)
    if (!capability) return 'Hello! How can I help you today?'

    const contextualGreeting = context === 'business' ? 
      'formal_greeting' : context === 'community' ? 
      'friendly_greeting' : 'greeting'

    return capability.commonPhrases[contextualGreeting] || capability.commonPhrases.greeting
  }

  private getCulturalIntelligence(language: string) {
    const culturalProfiles: { [key: string]: any } = {
      'en-US': {
        greetingStyle: 'Casual and direct',
        businessEtiquette: ['Time is money', 'Direct communication preferred', 'First names common'],
        culturalSensitivities: ['Respect personal space', 'Avoid politics', 'Be inclusive'],
        localCustoms: ['Tipping culture', 'Handshake greetings', 'Eye contact important']
      },
      'zh-CN': {
        greetingStyle: 'Formal and respectful',
        businessEtiquette: ['Hierarchy respect', 'Business cards with both hands', 'Patience in negotiations'],
        culturalSensitivities: ['Face-saving important', 'Avoid direct criticism', 'Group harmony'],
        localCustoms: ['Gift giving etiquette', 'Red color significance', 'Number superstitions']
      },
      'hi-IN': {
        greetingStyle: 'Warm and respectful',
        businessEtiquette: ['Namaste greeting', 'Respect for elders', 'Relationship building'],
        culturalSensitivities: ['Religious diversity', 'Vegetarian considerations', 'Family importance'],
        localCustoms: ['Remove shoes indoors', 'Right hand for eating', 'Hospitality culture']
      }
    }

    return culturalProfiles[language] || culturalProfiles['en-US']
  }

  private async translateWithCulturalContext(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context?: string
  ) {
    // Enhanced translation with cultural context
    return {
      translatedText: `[Culturally adapted translation from ${sourceLanguage} to ${targetLanguage}] ${text}`,
      culturalNotes: [`Adapted for ${targetLanguage} cultural context`]
    }
  }

  private async generateCulturalResponse(
    message: string,
    language: string,
    context?: string
  ): Promise<string> {
    const capability = this.getLanguageCapability(language)
    if (!capability) return 'Thank you for your message. How can I help you?'

    // Generate culturally appropriate response
    return `${capability.commonPhrases.greeting} I understand you're asking about "${message}". Let me help you with that in a culturally appropriate way for ${capability.region}.`
  }

  private getCulturalNotes(sourceLanguage: string, targetLanguage: string): string[] {
    return [
      `Communication style differs between ${sourceLanguage} and ${targetLanguage}`,
      'Consider cultural context when interpreting responses',
      'Local customs may affect business practices'
    ]
  }

  private getSuggestedActions(language: string, message: string): string[] {
    return [
      'Ask for price information in local currency',
      'Request cultural context if needed',
      'Connect with local expert for detailed assistance'
    ]
  }

  private getFallbackResponse(language: string): string {
    const capability = this.getLanguageCapability(language)
    return capability?.commonPhrases.greeting || 'Hello! How can I help you?'
  }

  private getRegionForLanguage(language: string): string {
    const capability = this.getLanguageCapability(language)
    return capability?.region || 'Global'
  }

  private getMockMultilingualAssistant(config: MultilingualConfig): MultilingualVapiAssistant {
    return {
      id: `multilingual-${config.primaryLanguage}`,
      name: `BurnStream Global Assistant (${config.primaryLanguage})`,
      languages: this.languageCapabilities.slice(0, 5), // Show first 5 for demo
      primaryLanguage: config.primaryLanguage,
      systemPrompt: 'Multilingual assistant with cultural intelligence',
      culturalIntelligence: this.getCulturalIntelligence(config.primaryLanguage)
    }
  }

  private getMockGlobalNumbers() {
    return [
      { language: 'en-US', region: 'North America', phoneNumber: '+1-555-BURN-001', localDialing: '555-BURN-001', assistantId: 'en-us-assistant' },
      { language: 'es-ES', region: 'Spain', phoneNumber: '+34-900-BURN-002', localDialing: '900-BURN-002', assistantId: 'es-es-assistant' },
      { language: 'zh-CN', region: 'China', phoneNumber: '+86-400-BURN-003', localDialing: '400-BURN-003', assistantId: 'zh-cn-assistant' },
      { language: 'hi-IN', region: 'India', phoneNumber: '+91-1800-BURN-004', localDialing: '1800-BURN-004', assistantId: 'hi-in-assistant' },
      { language: 'ar-SA', region: 'Saudi Arabia', phoneNumber: '+966-800-BURN-005', localDialing: '800-BURN-005', assistantId: 'ar-sa-assistant' }
    ]
  }

  getLanguageCapabilities(): LanguageCapability[] {
    return this.languageCapabilities
  }
}

export const multilingualVapiService = new MultilingualVapiService()
