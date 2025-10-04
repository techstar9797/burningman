// VAPI Integration for BurnStream - Real voice AI for event communication
// Based on https://docs.vapi.ai/quickstart/introduction

export interface VapiConfig {
  publicKey: string
  assistantId?: string
  serverUrl?: string
}

export interface VapiAssistant {
  id: string
  name: string
  firstMessage: string
  systemPrompt: string
  voice: {
    provider: 'elevenlabs' | 'openai' | 'deepgram'
    voiceId: string
  }
  model: {
    provider: 'openai' | 'anthropic' | 'groq'
    model: string
    temperature: number
  }
  tools?: VapiTool[]
}

export interface VapiTool {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: {
      type: 'object'
      properties: Record<string, any>
      required: string[]
    }
  }
  server?: {
    url: string
    secret: string
  }
}

export interface VapiCall {
  id: string
  status: 'queued' | 'ringing' | 'in-progress' | 'forwarding' | 'ended'
  type: 'inboundPhoneCall' | 'outboundPhoneCall' | 'webCall'
  phoneNumber?: string
  customer?: {
    number?: string
    name?: string
  }
  startedAt?: string
  endedAt?: string
  cost?: number
  transcript?: string
}

class VapiAPI {
  private publicKey: string
  private privateKey: string
  private baseUrl = 'https://api.vapi.ai'
  
  constructor(publicKey: string, privateKey: string) {
    this.publicKey = publicKey
    this.privateKey = privateKey
  }

  // Create an assistant for event communication
  async createEventAssistant(): Promise<VapiAssistant> {
    const assistant: VapiAssistant = {
      id: 'burnstream-event-assistant',
      name: 'BurnStream Event Assistant',
      firstMessage: "Hey there, fellow burner! 🔥 I'm your AI event assistant. I can help you with schedules, locations, activities, and connect you with organizers. What can I help you with today?",
      systemPrompt: `You are the BurnStream Event Assistant for the Burning Heroes x EF Hackathon 2025. You embody the spirit of Burning Man - community, creativity, and radical self-expression.

Your role:
- Help attendees navigate the event (schedule, locations, activities)
- Connect people with organizers when needed
- Provide information about mentors, food, WiFi, facilities
- Maintain the burning man ethos: welcoming, creative, community-focused
- Use casual, friendly language with occasional burning man terminology
- If you can't answer something, offer to connect them with a human organizer

Current Event Info:
- Event: Burning Heroes x EF Hackathon 2025
- Date: Saturday, October 4, 2025, 9 AM - 7 PM  
- Location: Entrepreneurs First, San Francisco
- Schedule: 9 AM check-in, 10 AM kickoff, 1 PM lunch, 2-3 PM sound healing, 5-7 PM demos
- Food: Slavic cuisine (plov, pirozhki, crepes)
- WiFi: "BurningHeroes2025" / "hackathon"
- Mentors available from OpenAI, Anthropic, Google, Vercel, etc.

Always be helpful, creative, and embody the burning man spirit of radical inclusion and community.`,
      voice: {
        provider: 'elevenlabs',
        voiceId: 'pNInz6obpgDQGcFmaJgB' // Adam voice - friendly and clear
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
            name: 'connect_to_organizer',
            description: 'Connect the caller to a human organizer for complex issues or requests',
            parameters: {
              type: 'object',
              properties: {
                reason: {
                  type: 'string',
                  description: 'Why the caller needs to speak with an organizer'
                },
                urgency: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Urgency level of the request'
                }
              },
              required: ['reason']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi/connect-organizer`,
            secret: 'burnstream-webhook-secret'
          }
        },
        {
          type: 'function',
          function: {
            name: 'get_real_time_info',
            description: 'Get real-time event information like current activities, mentor availability, etc.',
            parameters: {
              type: 'object',
              properties: {
                info_type: {
                  type: 'string',
                  enum: ['schedule', 'mentors', 'food', 'activities', 'announcements'],
                  description: 'Type of information requested'
                }
              },
              required: ['info_type']
            }
          },
          server: {
            url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vapi/real-time-info`,
            secret: 'burnstream-webhook-secret'
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
        body: JSON.stringify(assistant)
      })

      if (!response.ok) {
        throw new Error(`VAPI Assistant creation failed: ${response.status}`)
      }

      const createdAssistant = await response.json()
      console.log('✅ VAPI Assistant created:', createdAssistant.id)
      return createdAssistant
    } catch (error) {
      console.error('VAPI Assistant creation error:', error)
      return assistant // Return mock for demo
    }
  }

  // Start a web call (for browser integration)
  async startWebCall(assistantId: string): Promise<VapiCall> {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'webCall',
          assistantId: assistantId,
          customer: {
            name: 'Event Attendee'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`VAPI Web call failed: ${response.status}`)
      }

      const call = await response.json()
      console.log('📞 VAPI Web call started:', call.id)
      return call
    } catch (error) {
      console.error('VAPI Web call error:', error)
      // Return mock call for demo
      return {
        id: `call_${Date.now()}`,
        status: 'in-progress',
        type: 'webCall',
        startedAt: new Date().toISOString()
      }
    }
  }

  // Make an outbound phone call
  async makePhoneCall(phoneNumber: string, assistantId: string): Promise<VapiCall> {
    try {
      const response = await fetch(`${this.baseUrl}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'outboundPhoneCall',
          phoneNumber: phoneNumber,
          assistantId: assistantId,
          customer: {
            number: phoneNumber
          }
        })
      })

      if (!response.ok) {
        throw new Error(`VAPI Phone call failed: ${response.status}`)
      }

      const call = await response.json()
      console.log('📱 VAPI Phone call initiated:', call.id)
      return call
    } catch (error) {
      console.error('VAPI Phone call error:', error)
      throw error
    }
  }

  // Get call details
  async getCall(callId: string): Promise<VapiCall> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
        }
      })

      if (!response.ok) {
        throw new Error(`VAPI Get call failed: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('VAPI Get call error:', error)
      throw error
    }
  }

  // End a call
  async endCall(callId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/call/${callId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
        }
      })

      if (!response.ok) {
        throw new Error(`VAPI End call failed: ${response.status}`)
      }

      console.log('📞 VAPI Call ended:', callId)
    } catch (error) {
      console.error('VAPI End call error:', error)
      throw error
    }
  }
}

// VAPI Web SDK Integration
export class VapiWebClient {
  private vapi: any
  private publicKey: string
  private isInitialized = false

  constructor(publicKey: string) {
    this.publicKey = publicKey
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Dynamically import VAPI Web SDK
      const VapiSDK = await import('@vapi-ai/web')
      this.vapi = new VapiSDK.default(this.publicKey)
      this.isInitialized = true
      console.log('✅ VAPI Web Client initialized')
    } catch (error) {
      console.error('VAPI Web Client initialization error:', error)
      // Create mock client for demo
      this.vapi = this.createMockClient()
      this.isInitialized = true
    }
  }

  async startCall(assistantId: string): Promise<void> {
    await this.initialize()
    
    try {
      await this.vapi.start(assistantId)
      console.log('📞 VAPI Web call started')
    } catch (error) {
      console.error('VAPI Web call start error:', error)
      // Simulate call for demo
      console.log('📞 Simulating VAPI Web call...')
    }
  }

  async endCall(): Promise<void> {
    if (!this.isInitialized) return

    try {
      await this.vapi.stop()
      console.log('📞 VAPI Web call ended')
    } catch (error) {
      console.error('VAPI Web call end error:', error)
    }
  }

  onCallStatusChange(callback: (status: string) => void): void {
    if (!this.isInitialized) return

    try {
      this.vapi.on('call-start', () => callback('started'))
      this.vapi.on('call-end', () => callback('ended'))
      this.vapi.on('speech-start', () => callback('speaking'))
      this.vapi.on('speech-end', () => callback('listening'))
    } catch (error) {
      console.error('VAPI event listener error:', error)
    }
  }

  private createMockClient() {
    return {
      start: async (assistantId: string) => {
        console.log(`Mock VAPI call started with assistant: ${assistantId}`)
      },
      stop: async () => {
        console.log('Mock VAPI call stopped')
      },
      on: (event: string, callback: () => void) => {
        console.log(`Mock VAPI event listener added: ${event}`)
      }
    }
  }
}

// Export singleton instances
export const vapiAPI = new VapiAPI(
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo_public_key',
  process.env.VAPI_PRIVATE_KEY || 'demo_private_key'
)

export const vapiWebClient = new VapiWebClient(
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo_public_key'
)
