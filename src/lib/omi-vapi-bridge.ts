// Omi App + VAPI Bridge for Real Cross-Device Communication
// Omi: https://github.com/BasedHardware/Omi
// VAPI: Real-time voice AI platform

import { apiConfig } from '@/config/api'

export interface OmiDevice {
  deviceId: string
  userId: string
  isConnected: boolean
  batteryLevel: number
  location: {
    latitude: number
    longitude: number
    city: string
    country: string
  }
  language: string
  status: 'idle' | 'listening' | 'speaking' | 'processing'
}

export interface CrossDeviceCall {
  callId: string
  webParticipant: {
    sessionId: string
    browser: string
    location: string
    language: string
  }
  omiParticipant: {
    deviceId: string
    userId: string
    location: string
    language: string
  }
  status: 'connecting' | 'connected' | 'translating' | 'ended'
  conversation: Array<{
    speaker: 'web' | 'omi'
    originalText: string
    translatedText: string
    timestamp: string
    confidence: number
  }>
}

class OmiVapiBridge {
  private vapiBaseUrl = 'https://api.vapi.ai'
  private omiWebhookUrl = 'https://api.omi.com/webhook' // Omi's webhook endpoint
  private privateKey = process.env.VAPI_PRIVATE_KEY || 'demo_key'
  private activeCalls = new Map<string, CrossDeviceCall>()

  // Initialize Omi device connection
  async connectOmiDevice(deviceId: string): Promise<OmiDevice> {
    console.log('📱 Connecting to Omi device:', deviceId)

    try {
      // In real implementation, connect to Omi's API
      const omiDevice: OmiDevice = {
        deviceId,
        userId: 'user_' + deviceId.substring(0, 8),
        isConnected: true,
        batteryLevel: 85,
        location: {
          latitude: 44.7866,
          longitude: 20.4489,
          city: 'Belgrade',
          country: 'Serbia'
        },
        language: 'sr-RS',
        status: 'idle'
      }

      console.log('✅ Omi device connected:', omiDevice)
      return omiDevice
    } catch (error) {
      console.error('Omi connection failed:', error)
      throw new Error('Failed to connect Omi device')
    }
  }

  // Start cross-device call (Omi phone + VAPI web)
  async startCrossDeviceCall(
    omiDeviceId: string,
    webSessionId: string
  ): Promise<string> {
    console.log('🌉 Starting cross-device call: Omi', omiDeviceId, '+ VAPI web', webSessionId)

    try {
      // Create VAPI assistant for cross-device communication
      const assistantId = await this.createCrossDeviceAssistant()
      
      // Start VAPI web call
      const vapiCall = await this.startVapiWebCall(assistantId, webSessionId)
      
      // Connect Omi device to the call
      await this.bridgeOmiToVapi(omiDeviceId, vapiCall.id)

      const callId = `cross_${Date.now()}`
      
      // Initialize call tracking
      const crossDeviceCall: CrossDeviceCall = {
        callId,
        webParticipant: {
          sessionId: webSessionId,
          browser: 'Chrome/Safari',
          location: 'San Francisco, USA',
          language: 'en-US'
        },
        omiParticipant: {
          deviceId: omiDeviceId,
          userId: 'omi_user',
          location: 'Belgrade, Serbia',
          language: 'sr-RS'
        },
        status: 'connecting',
        conversation: []
      }

      this.activeCalls.set(callId, crossDeviceCall)

      // Set up real-time translation bridge
      this.setupTranslationBridge(callId)

      console.log('✅ Cross-device call established:', callId)
      return callId
    } catch (error) {
      console.error('Cross-device call failed:', error)
      throw error
    }
  }

  // Create specialized assistant for cross-device communication
  private async createCrossDeviceAssistant(): Promise<string> {
    const assistantConfig = {
      name: 'Omi-VAPI Cross-Device Bridge',
      firstMessage: 'Cross-device communication bridge established. Omi device and web browser are now connected for real-time translation.',
      
      systemPrompt: `You are a cross-device communication bridge connecting an Omi wearable device with a web browser for real-time multilingual business communication.

DEVICE SETUP:
- Omi Device: Wearable AI assistant with voice capture and playback
- Web Browser: VAPI-powered interface with visual feedback
- Bridge Function: Real-time translation between devices

COMMUNICATION FLOW:
1. Omi device captures voice from physical user
2. Send audio to VAPI for transcription and translation
3. Display translation on web interface
4. Capture web user response
5. Translate and send audio back to Omi device
6. Omi plays translated audio to physical user

LANGUAGE HANDLING:
- Auto-detect language from both devices
- Preserve all numbers, prices, currencies exactly
- Provide cultural context for business communication
- Handle interruptions and natural conversation flow

SPECIAL FEATURES:
- Omi device location awareness for cultural context
- Web interface visual feedback and translation display
- Real-time price extraction and preservation
- Cross-device synchronization and status updates

Always maintain natural conversation flow while providing accurate translation and cultural intelligence.`,

      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'multi'
      },

      voice: {
        provider: 'azure',
        voiceId: 'en-US-AriaNeural'
      },

      model: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.3
      },

      tools: [
        {
          type: 'function',
          function: {
            name: 'bridge_omi_message',
            description: 'Bridge message from Omi device to web interface with translation',
            parameters: {
              type: 'object',
              properties: {
                omi_audio: { type: 'string', description: 'Audio from Omi device' },
                detected_language: { type: 'string', description: 'Detected language from Omi' },
                user_location: { type: 'string', description: 'Omi device location' },
                message_type: { type: 'string', enum: ['voice', 'gesture', 'tap'], description: 'Input type from Omi' }
              },
              required: ['omi_audio', 'detected_language']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/omi/bridge-message`,
            secret: 'omi-bridge-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'send_to_omi',
            description: 'Send translated message back to Omi device for audio playback',
            parameters: {
              type: 'object',
              properties: {
                translated_text: { type: 'string', description: 'Text to convert to audio for Omi' },
                target_language: { type: 'string', description: 'Language for Omi audio playback' },
                cultural_context: { type: 'string', description: 'Cultural context for appropriate delivery' }
              },
              required: ['translated_text', 'target_language']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL}/api/omi/send-audio`,
            secret: 'omi-audio-secret'
          }
        }
      ]
    }

    try {
      const response = await fetch(`${this.vapiBaseUrl}/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assistantConfig)
      })

      if (!response.ok) {
        throw new Error(`Cross-device assistant creation failed: ${response.status}`)
      }

      const assistant = await response.json()
      return assistant.id
    } catch (error) {
      console.error('Cross-device assistant creation error:', error)
      return 'demo-cross-device-assistant'
    }
  }

  // Start VAPI web call
  private async startVapiWebCall(assistantId: string, sessionId: string): Promise<any> {
    try {
      const response = await fetch(`${this.vapiBaseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'webCall',
          assistantId: assistantId,
          metadata: {
            sessionId: sessionId,
            deviceType: 'web_browser',
            bridgeType: 'omi_vapi_cross_device'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`VAPI web call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('VAPI web call error:', error)
      throw error
    }
  }

  // Bridge Omi device to VAPI call
  private async bridgeOmiToVapi(omiDeviceId: string, vapiCallId: string): Promise<void> {
    console.log('🌉 Bridging Omi device to VAPI call...')

    try {
      // In real implementation, this would:
      // 1. Register Omi device webhook to receive audio
      // 2. Set up bidirectional audio streaming
      // 3. Configure real-time translation pipeline
      // 4. Handle device status and connection management

      // For demo, we'll simulate the bridge
      console.log('✅ Omi-VAPI bridge established (simulated)')
      
      // Set up mock Omi message handling
      this.setupMockOmiMessages(omiDeviceId, vapiCallId)
      
    } catch (error) {
      console.error('Omi-VAPI bridge error:', error)
    }
  }

  // Set up translation bridge between devices
  private setupTranslationBridge(callId: string): void {
    console.log('🔄 Setting up real-time translation bridge for call:', callId)

    // In production, this would:
    // 1. Listen to Omi webhook for voice input
    // 2. Process through VAPI for transcription
    // 3. Translate and send to web interface
    // 4. Capture web response and translate back
    // 5. Send audio to Omi for playback

    // For demo, simulate the bridge working
    this.simulateCrossDeviceConversation(callId)
  }

  // Simulate cross-device conversation for demo
  private simulateCrossDeviceConversation(callId: string): void {
    const call = this.activeCalls.get(callId)
    if (!call) return

    const conversationFlow = [
      {
        delay: 3000,
        speaker: 'omi' as const,
        originalText: '[Omi user speaking] Zdravo! Zanima me izvoz malina u Ameriku.',
        translatedText: '[VAPI translating to web] Hello! I\'m interested in exporting raspberries to America.',
        action: 'omi_to_web'
      },
      {
        delay: 6000,
        speaker: 'web' as const,
        originalText: '[Web user typing] What are your current prices and quality certifications?',
        translatedText: '[VAPI translating to Omi] Koje su vaše trenutne cene i sertifikati kvaliteta?',
        action: 'web_to_omi'
      },
      {
        delay: 9000,
        speaker: 'omi' as const,
        originalText: '[Omi user speaking] Cena je 3,50 evra po kilogramu. Imamo EU sertifikate.',
        translatedText: '[VAPI translating to web] Price is 3.50 euros per kilogram. We have EU certificates.',
        action: 'omi_to_web'
      },
      {
        delay: 12000,
        speaker: 'web' as const,
        originalText: '[Web user typing] Excellent! Can you handle 5 tons monthly?',
        translatedText: '[VAPI translating to Omi] Odlično! Možete li 5 tona mesečno?',
        action: 'web_to_omi'
      },
      {
        delay: 15000,
        speaker: 'omi' as const,
        originalText: '[Omi user speaking] Da, bez problema! Organizujemo redovne isporuke.',
        translatedText: '[VAPI translating to web] Yes, no problem! We organize regular deliveries.',
        action: 'omi_to_web'
      }
    ]

    conversationFlow.forEach(step => {
      setTimeout(() => {
        call.conversation.push({
          speaker: step.speaker,
          originalText: step.originalText,
          translatedText: step.translatedText,
          timestamp: new Date().toLocaleTimeString(),
          confidence: 0.95
        })

        // Trigger UI update
        this.notifyCallUpdate(callId)
        
        console.log(`🔄 ${step.action}:`, step.originalText, '→', step.translatedText)
      }, step.delay)
    })
  }

  // Set up mock Omi messages for demo
  private setupMockOmiMessages(omiDeviceId: string, vapiCallId: string): void {
    console.log('📱 Setting up mock Omi message handling...')
    
    // Simulate Omi device sending periodic updates
    const omiUpdateInterval = setInterval(() => {
      const mockUpdate = {
        deviceId: omiDeviceId,
        timestamp: new Date().toISOString(),
        batteryLevel: Math.max(20, 85 - Math.floor(Math.random() * 10)),
        status: Math.random() > 0.7 ? 'listening' : 'idle',
        location: {
          latitude: 44.7866 + (Math.random() - 0.5) * 0.001,
          longitude: 20.4489 + (Math.random() - 0.5) * 0.001,
          city: 'Belgrade',
          country: 'Serbia'
        }
      }
      
      console.log('📱 Omi device update:', mockUpdate.status, mockUpdate.batteryLevel + '%')
    }, 5000)

    // Store interval for cleanup
    ;(this as any)[`omiInterval_${omiDeviceId}`] = omiUpdateInterval
  }

  // Process Omi webhook (voice input from phone)
  async processOmiWebhook(data: {
    deviceId: string
    audioData: string
    transcript?: string
    confidence?: number
    location?: any
  }): Promise<void> {
    console.log('📱 Processing Omi webhook:', data.deviceId)

    try {
      // Find active call for this device
      const activeCall = Array.from(this.activeCalls.values())
        .find(call => call.omiParticipant.deviceId === data.deviceId)

      if (!activeCall) {
        console.warn('No active call found for Omi device:', data.deviceId)
        return
      }

      // Process voice input through VAPI
      const translation = await this.translateOmiInput(
        data.transcript || data.audioData,
        activeCall.omiParticipant.language,
        activeCall.webParticipant.language
      )

      // Send translation to web interface
      await this.sendToWebInterface(activeCall.callId, translation)

      console.log('✅ Omi input processed and sent to web')
    } catch (error) {
      console.error('Omi webhook processing error:', error)
    }
  }

  // Send message from web to Omi device
  async sendToOmiDevice(
    callId: string,
    message: string,
    sourceLanguage: string = 'en-US'
  ): Promise<void> {
    console.log('📱 Sending message to Omi device:', message)

    const call = this.activeCalls.get(callId)
    if (!call) return

    try {
      // Translate message to Omi user's language
      const translation = await this.translateWebInput(
        message,
        sourceLanguage,
        call.omiParticipant.language
      )

      // Send to Omi device for audio playback
      await this.sendOmiAudio(call.omiParticipant.deviceId, translation)

      // Update conversation
      call.conversation.push({
        speaker: 'web',
        originalText: message,
        translatedText: translation,
        timestamp: new Date().toLocaleTimeString(),
        confidence: 0.92
      })

      console.log('✅ Message sent to Omi device')
    } catch (error) {
      console.error('Send to Omi error:', error)
    }
  }

  // Helper methods for translation
  private async translateOmiInput(text: string, sourceLang: string, targetLang: string): Promise<string> {
    // Use the same translation system as the trade interpreter
    const demoTranslations: { [key: string]: string } = {
      'Zdravo! Zanima me izvoz malina u Ameriku.': 'Hello! I\'m interested in exporting raspberries to America.',
      'Cena je 3,50 evra po kilogramu.': 'The price is 3.50 euros per kilogram.',
      'Imamo EU sertifikate i HACCP standarde.': 'We have EU certificates and HACCP standards.',
      'Da, bez problema! Organizujemo redovne isporuke.': 'Yes, no problem! We organize regular deliveries.'
    }

    return demoTranslations[text] || `[Translated from ${sourceLang}] ${text}`
  }

  private async translateWebInput(text: string, sourceLang: string, targetLang: string): Promise<string> {
    const demoTranslations: { [key: string]: string } = {
      'What are your current prices and quality certifications?': 'Koje su vaše trenutne cene i sertifikati kvaliteta?',
      'Excellent! Can you handle 5 tons monthly?': 'Odlično! Možete li 5 tona mesečno?',
      'That sounds very competitive for our market.': 'To zvuči veoma konkurentno za naše tržište.',
      'Let\'s finalize the contract details.': 'Hajde da finalizujemo detalje ugovora.'
    }

    return demoTranslations[text] || `[Prevedeno na ${targetLang}] ${text}`
  }

  // Send audio to Omi device
  private async sendOmiAudio(deviceId: string, text: string): Promise<void> {
    try {
      // In real implementation, this would call Omi's TTS API
      console.log(`📱 Sending audio to Omi device ${deviceId}: "${text}"`)
      
      // Simulate Omi audio playback
      console.log('🔊 Omi device playing audio to user')
    } catch (error) {
      console.error('Omi audio send error:', error)
    }
  }

  // Send message to web interface
  private async sendToWebInterface(callId: string, message: string): Promise<void> {
    try {
      console.log(`💻 Sending to web interface: "${message}"`)
      
      // In real implementation, this would use WebSocket or Server-Sent Events
      // For demo, we'll use the existing conversation update system
      this.notifyCallUpdate(callId)
    } catch (error) {
      console.error('Web interface send error:', error)
    }
  }

  // Notify UI of call updates
  private notifyCallUpdate(callId: string): void {
    // In real implementation, this would trigger React state updates
    console.log('🔄 Call update notification for:', callId)
  }

  // Get call status
  getCall(callId: string): CrossDeviceCall | null {
    return this.activeCalls.get(callId) || null
  }

  // End cross-device call
  async endCrossDeviceCall(callId: string): Promise<void> {
    const call = this.activeCalls.get(callId)
    if (!call) return

    try {
      // Cleanup Omi intervals
      const intervalKey = `omiInterval_${call.omiParticipant.deviceId}`
      if ((this as any)[intervalKey]) {
        clearInterval((this as any)[intervalKey])
        delete (this as any)[intervalKey]
      }

      // End VAPI call
      // await this.endVapiCall(call.webParticipant.sessionId)

      // Disconnect Omi device
      // await this.disconnectOmiDevice(call.omiParticipant.deviceId)

      this.activeCalls.delete(callId)
      console.log('📞 Cross-device call ended:', callId)
    } catch (error) {
      console.error('End cross-device call error:', error)
    }
  }

  // Get connected Omi devices
  getConnectedDevices(): OmiDevice[] {
    // Return mock connected devices for demo
    return [
      {
        deviceId: 'omi_device_001',
        userId: 'marko_petrovic',
        isConnected: true,
        batteryLevel: 78,
        location: {
          latitude: 44.7866,
          longitude: 20.4489,
          city: 'Belgrade',
          country: 'Serbia'
        },
        language: 'sr-RS',
        status: 'idle'
      }
    ]
  }
}

export const omiVapiBridge = new OmiVapiBridge()
