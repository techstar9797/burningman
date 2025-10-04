// Real-time Bilingual Trade Interpreter using VAPI
// Based on https://docs.vapi.ai/assistants/examples/multilingual-agent

import { apiConfig } from '@/config/api'

export interface TradeParticipant {
  id: string
  name: string
  language: 'en' | 'sr' | 'zh' | 'hi' | 'vi' | 'pl' | 'cs'
  location: string
  role: 'buyer' | 'seller'
}

export interface TradeConversation {
  roomId: string
  participants: TradeParticipant[]
  activeTranscript: string
  lastTranslation: string
  extractedPrices: Array<{
    quantity: number
    unit: string
    unitPrice: number
    currency: string
    totalValue: number
  }>
}

export interface VapiWebhookEvent {
  type: 'transcript.partial' | 'transcript.final' | 'call-start' | 'call-end'
  payload: {
    text: string
    speakerId: string
    language?: string
    confidence: number
    roomId: string
  }
}

class VapiTradeInterpreter {
  private baseUrl = 'https://api.vapi.ai'
  private publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo_key'
  private privateKey = process.env.VAPI_PRIVATE_KEY || 'demo_key'
  private activeConversations = new Map<string, TradeConversation>()

  // Create bilingual trade interpreter assistant
  async createTradeInterpreter(): Promise<string> {
    console.log('🎙️ Creating VAPI bilingual trade interpreter...')

    const assistantConfig = {
      name: 'BurnStream Trade Interpreter',
      firstMessage: 'Hello! Hola! Zdravo! I am your bilingual trade interpreter. I will help facilitate your business conversation by translating between languages in real-time while preserving all prices and quantities exactly.',
      
      systemPrompt: `You are a professional bilingual trade interpreter for live voice conversations.

CORE RESPONSIBILITIES:
- Detect input language (English, Serbian, Chinese, Hindi, Vietnamese, Polish, Czech)
- Translate faithfully to target language without changing numbers, units, or named entities
- Maintain speaker's intent and tone (polite, professional, respectful)
- Prices and quantities MUST be preserved exactly as spoken
- Call parse_trade tool before speaking when prices/quantities are mentioned
- Output must be one clear sentence suitable for Text-to-Speech

LANGUAGE DETECTION RULES:
- Serbian: Contains ć, č, š, ž, đ characters or Serbian words
- Chinese: Contains Chinese characters or Mandarin patterns  
- Hindi: Contains Devanagari script or Hindi words
- Vietnamese: Contains Vietnamese diacritics or Vietnamese words
- Polish: Contains ą, ć, ę, ł, ń, ó, ś, ź, ż or Polish words
- Czech: Contains á, č, ď, é, ě, í, ň, ó, ř, š, ť, ú, ů, ý, ž or Czech words
- Default: English if no specific patterns detected

TRANSLATION GUIDELINES:
- Preserve business terminology exactly
- Maintain currency symbols and amounts
- Keep proper names unchanged
- Respect cultural communication styles
- Add "Translated from [language]:" prefix for clarity

PRICE PRESERVATION EXAMPLES:
- "120 units at $4.50 each" → "120 komada po 4,50 dolara svaki" (Serbian)
- "50 kg za 25 evra" → "50 kg for 25 euros" (English)
- Never change: numbers, currency symbols, units, measurements`,

      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'multi' // Enable automatic language detection
      },

      voice: {
        provider: 'azure',
        voiceId: 'en-US-AriaNeural' // Default voice, will be switched dynamically
      },

      model: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.3 // Lower temperature for accurate translation
      },

      tools: [
        {
          type: 'function',
          function: {
            name: 'parse_trade',
            description: 'Extract and preserve trade information (prices, quantities, units) before translation',
            parameters: {
              type: 'object',
              properties: {
                quantity: { 
                  type: 'number', 
                  description: 'Quantity mentioned (preserve exactly)' 
                },
                unit: { 
                  type: 'string', 
                  description: 'Unit of measurement (kg, tons, pieces, etc.)' 
                },
                unit_price: { 
                  type: 'number', 
                  description: 'Price per unit (preserve exactly)' 
                },
                currency: { 
                  type: 'string', 
                  description: 'Currency symbol or code (USD, EUR, RSD, etc.)' 
                },
                total_value: { 
                  type: 'number', 
                  description: 'Total transaction value if mentioned' 
                }
              },
              required: []
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/parse-trade`,
            secret: 'burnstream-trade-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'translate_preserve_numbers',
            description: 'Translate text while preserving all numbers, prices, and business terms exactly',
            parameters: {
              type: 'object',
              properties: {
                original_text: { 
                  type: 'string', 
                  description: 'Original text to translate' 
                },
                source_language: { 
                  type: 'string', 
                  description: 'Detected source language code' 
                },
                target_language: { 
                  type: 'string', 
                  description: 'Target language for translation' 
                },
                speaker_role: { 
                  type: 'string', 
                  description: 'Speaker role: buyer, seller, or interpreter' 
                }
              },
              required: ['original_text', 'target_language']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/translate-trade`,
            secret: 'burnstream-translate-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'switch_voice_language',
            description: 'Switch TTS voice to match target language for natural pronunciation',
            parameters: {
              type: 'object',
              properties: {
                target_language: { 
                  type: 'string', 
                  description: 'Target language code for voice switching' 
                },
                voice_gender: { 
                  type: 'string', 
                  enum: ['male', 'female'],
                  description: 'Preferred voice gender' 
                }
              },
              required: ['target_language']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/vapi/switch-voice`,
            secret: 'burnstream-voice-secret'
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
        throw new Error(`VAPI Trade Interpreter creation failed: ${response.status}`)
      }

      const assistant = await response.json()
      console.log('✅ VAPI Trade Interpreter created:', assistant.id)
      return assistant.id
    } catch (error) {
      console.error('Trade Interpreter creation error:', error)
      return 'demo-trade-interpreter'
    }
  }

  // Start a bilingual trade room
  async startTradeRoom(
    participant1: TradeParticipant,
    participant2: TradeParticipant
  ): Promise<string> {
    console.log('🏪 Starting bilingual trade room...', participant1.language, '↔', participant2.language)

    try {
      const assistantId = await this.createTradeInterpreter()

      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'webCall',
          assistantId: assistantId,
          metadata: {
            participant1: participant1,
            participant2: participant2,
            tradeType: 'bilingual_interpreter'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Trade room creation failed: ${response.status}`)
      }

      const call = await response.json()
      const roomId = call.id

      // Initialize conversation tracking
      this.activeConversations.set(roomId, {
        roomId,
        participants: [participant1, participant2],
        activeTranscript: '',
        lastTranslation: '',
        extractedPrices: []
      })

      console.log('✅ Bilingual trade room started:', roomId)
      return roomId
    } catch (error) {
      console.error('Trade room creation error:', error)
      return 'demo-room-id'
    }
  }

  // Process VAPI webhook events for real-time translation
  async processWebhookEvent(event: VapiWebhookEvent): Promise<void> {
    console.log('📡 Processing VAPI webhook event:', event.type)

    const conversation = this.activeConversations.get(event.payload.roomId)
    if (!conversation) {
      console.warn('No active conversation found for room:', event.payload.roomId)
      return
    }

    try {
      if (event.type === 'transcript.final') {
        await this.handleFinalTranscript(event, conversation)
      } else if (event.type === 'transcript.partial') {
        await this.handlePartialTranscript(event, conversation)
      }
    } catch (error) {
      console.error('Webhook processing error:', error)
    }
  }

  // Handle final transcript for translation
  private async handleFinalTranscript(event: VapiWebhookEvent, conversation: TradeConversation) {
    const { text, speakerId } = event.payload
    
    console.log('💬 Final transcript:', text, 'from speaker:', speakerId)

    // Detect source language
    const sourceLang = this.detectLanguage(text)
    
    // Find target participant and language
    const targetParticipant = conversation.participants.find(p => p.id !== speakerId)
    if (!targetParticipant) return

    const targetLang = targetParticipant.language

    // Skip translation if same language
    if (sourceLang === targetLang) return

    // Extract and preserve trade information
    const tradeInfo = this.extractTradeInfo(text)
    if (tradeInfo) {
      conversation.extractedPrices.push(tradeInfo)
    }

    // Translate with number preservation
    const translation = await this.translatePreserveNumbers(text, sourceLang, targetLang)
    
    // Send translation to target participant
    await this.speakToParticipant(
      conversation.roomId,
      targetParticipant.id,
      translation,
      targetLang
    )

    // Update conversation state
    conversation.activeTranscript = text
    conversation.lastTranslation = translation
  }

  private async handlePartialTranscript(event: VapiWebhookEvent, conversation: TradeConversation) {
    // For now, just update the active transcript
    conversation.activeTranscript = event.payload.text
  }

  // Language detection with Serbian focus
  private detectLanguage(text: string): string {
    const patterns = {
      'sr': /[ћћђшжчџ]|zdravo|cena|mogu|kako|šta|da|je|za|evra|dolara|komad/i,
      'zh': /[\u4e00-\u9fff]|你好|价格|多少|钱|元|人民币/i,
      'hi': /[\u0900-\u097f]|नमस्ते|कीमत|रुपए|कितना/i,
      'vi': /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]|xin chào|giá|bao nhiêu|đồng/i,
      'pl': /[ąćęłńóśźż]|dzień dobry|cena|ile|kosztuje|złoty/i,
      'cs': /[áčďéěíňóřšťúůýž]|dobrý den|cena|kolik|stojí|koruna/i
    }

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang
      }
    }

    return 'en' // Default to English
  }

  // Extract trade information (prices, quantities, units)
  private extractTradeInfo(text: string): any | null {
    const pricePatterns = [
      /(\d+(?:\.\d{2})?)\s*([€$£¥₹]|dollars?|euros?|yuan|rupees?|dinars?)/i,
      /(\d+)\s*(units?|pieces?|kg|tons?|liters?|komad[ai]?)/i,
      /(\d+(?:\.\d{2})?)\s*(per|po)\s*(unit|komad|kg|piece)/i
    ]

    for (const pattern of pricePatterns) {
      const match = text.match(pattern)
      if (match) {
        return {
          quantity: parseFloat(match[1]) || 0,
          unit: match[2] || 'units',
          unitPrice: parseFloat(match[1]) || 0,
          currency: this.extractCurrency(text),
          totalValue: 0 // Calculate if both quantity and unit price found
        }
      }
    }

    return null
  }

  private extractCurrency(text: string): string {
    const currencyPatterns = [
      { pattern: /\$|dollars?/i, currency: 'USD' },
      { pattern: /€|euros?/i, currency: 'EUR' },
      { pattern: /£|pounds?/i, currency: 'GBP' },
      { pattern: /¥|yuan/i, currency: 'CNY' },
      { pattern: /₹|rupees?/i, currency: 'INR' },
      { pattern: /dinars?/i, currency: 'RSD' }
    ]

    for (const { pattern, currency } of currencyPatterns) {
      if (pattern.test(text)) {
        return currency
      }
    }

    return 'USD' // Default
  }

  // Translate while preserving numbers and business terms
  private async translatePreserveNumbers(
    text: string,
    sourceLang: string,
    targetLang: string
  ): Promise<string> {
    console.log(`🔄 Translating: "${text}" from ${sourceLang} to ${targetLang}`)

    // Extract numbers and business terms to preserve
    const numbers = text.match(/\d+(?:\.\d{2})?/g) || []
    const currencies = text.match(/[$€£¥₹]|USD|EUR|GBP|CNY|INR|RSD/gi) || []

    try {
      // Use translation API
      const response = await fetch('/api/vapi/translate-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_text: text,
          source_language: sourceLang,
          target_language: targetLang,
          preserve_numbers: numbers,
          preserve_currencies: currencies
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.translated_text
      }
    } catch (error) {
      console.warn('Translation API failed, using fallback:', error)
    }

    // Fallback to demo translations with number preservation
    return this.getDemoTranslation(text, sourceLang, targetLang, numbers, currencies)
  }

  private getDemoTranslation(
    text: string,
    sourceLang: string,
    targetLang: string,
    numbers: string[],
    currencies: string[]
  ): string {
    const translations: { [key: string]: { [key: string]: { [key: string]: string } } } = {
      'en': {
        'sr': {
          'Can you do 120 units at $4.50 each?': 'Možete li 120 komada po 4,50 dolara svaki?',
          'What is your best price for raspberries?': 'Koja je vaša najbolja cena za maline?',
          'We need 5 tons delivered by Friday': 'Potrebno nam je 5 tona isporučeno do petka',
          'That sounds very competitive': 'To zvuči veoma konkurentno'
        },
        'zh': {
          'Can you do 120 units at $4.50 each?': '你们能做120个单位，每个4.50美元吗？',
          'What is your best price?': '你们的最好价格是多少？'
        },
        'hi': {
          'Can you do 120 units at $4.50 each?': 'क्या आप 120 यूनिट 4.50 डॉलर प्रति यूनिट कर सकते हैं？',
          'What is your best price?': 'आपकी सबसे अच्छी कीमत क्या है？'
        }
      },
      'sr': {
        'en': {
          'Možemo 120 komada po 4,50 dolara': 'We can do 120 units at $4.50 each',
          'Cena za maline je 3,50 evra po kilogramu': 'The price for raspberries is 3.50 euros per kilogram',
          'Imamo EU sertifikate': 'We have EU certificates',
          'Isporuka u ponedeljak': 'Delivery on Monday'
        }
      },
      'zh': {
        'en': {
          '价格是120元每公斤': 'The price is 120 yuan per kilogram',
          '我们可以提供5吨': 'We can provide 5 tons'
        }
      }
    }

    const langPair = translations[sourceLang]?.[targetLang]
    if (langPair) {
      for (const [original, translated] of Object.entries(langPair)) {
        if (text.toLowerCase().includes(original.toLowerCase().substring(0, 10))) {
          // Ensure numbers are preserved in translation
          let result = translated
          numbers.forEach((num, index) => {
            result = result.replace(/\d+(?:\.\d{2})?/, num)
          })
          return `Translated from ${sourceLang.toUpperCase()}: ${result}`
        }
      }
    }

    // Generic fallback with number preservation
    let result = `[${targetLang.toUpperCase()}] ${text}`
    numbers.forEach(num => {
      result = result.replace(/\d+/, num)
    })
    return result
  }

  // Send translated speech to specific participant
  private async speakToParticipant(
    roomId: string,
    participantId: string,
    text: string,
    language: string
  ): Promise<void> {
    console.log(`🔊 Speaking to ${participantId} in ${language}: "${text}"`)

    try {
      // Get appropriate voice for language
      const voice = this.getVoiceForLanguage(language)

      const response = await fetch(`${this.baseUrl}/call/${roomId}/speak`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          participantId: participantId,
          bargeIn: true // Allow interruption for natural conversation
        })
      })

      if (!response.ok) {
        console.error('Speak to participant failed:', response.status)
      }
    } catch (error) {
      console.error('Speak to participant error:', error)
    }
  }

  private getVoiceForLanguage(language: string): any {
    const voices: { [key: string]: any } = {
      'en': { provider: 'azure', voiceId: 'en-US-AriaNeural' },
      'sr': { provider: 'azure', voiceId: 'sr-RS-SophieNeural' },
      'zh': { provider: 'azure', voiceId: 'zh-CN-XiaoxiaoNeural' },
      'hi': { provider: 'azure', voiceId: 'hi-IN-SwaraNeural' },
      'vi': { provider: 'azure', voiceId: 'vi-VN-HoaiMyNeural' },
      'pl': { provider: 'azure', voiceId: 'pl-PL-ZofiaNeural' },
      'cs': { provider: 'azure', voiceId: 'cs-CZ-VlastaNeural' }
    }

    return voices[language] || voices['en']
  }

  // Get conversation status
  getConversation(roomId: string): TradeConversation | null {
    return this.activeConversations.get(roomId) || null
  }

  // End conversation and cleanup
  async endTradeRoom(roomId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/call/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
        }
      })

      this.activeConversations.delete(roomId)
      console.log('📞 Trade room ended:', roomId)
    } catch (error) {
      console.error('End trade room error:', error)
    }
  }

  // Mock data for demo
  private getMockLocationIntelligence(query: any): any {
    return {
      userLocation: {
        city: 'Belgrade',
        country: 'Serbia',
        countryCode: 'RS',
        region: 'Central Serbia',
        coordinates: { latitude: 44.7866, longitude: 20.4489 },
        timezone: 'Europe/Belgrade',
        primaryLanguage: 'sr-RS',
        secondaryLanguages: ['en-US', 'de-DE'],
        currency: 'RSD',
        businessHours: { open: '09:00', close: '17:00', timezone: 'Europe/Belgrade' },
        localCustoms: ['Coffee culture', 'Hospitality focus', 'Relationship building'],
        tradingPartners: ['Germany', 'Italy', 'China', 'United States']
      },
      nearbyBusinesses: [],
      marketContext: {
        economicActivity: 'Emerging IT and agricultural hub',
        majorIndustries: ['Information Technology', 'Agriculture', 'Manufacturing'],
        tradingOpportunities: ['IT outsourcing', 'Agricultural exports'],
        culturalNotes: ['Relationship-focused', 'Hospitality culture']
      },
      communicationContext: {
        preferredLanguages: ['sr-RS', 'en-US'],
        businessEtiquette: ['Warm greetings', 'Coffee meetings'],
        negotiationStyle: 'Relationship-based with trust building',
        timeOrientation: 'Flexible time, relationship over schedule'
      }
    }
  }
}

export const vapiTradeInterpreter = new VapiTradeInterpreter()
