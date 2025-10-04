import { NextRequest, NextResponse } from 'next/server'
import { apiConfig } from '@/config/api-template'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, assistantConfig } = await request.json()
    
    console.log('📞 Starting VAPI phone call to:', phoneNumber)

    // Create assistant first
    const assistantResponse = await fetch(`${apiConfig.vapi.baseUrl}/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.vapi.privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: assistantConfig.name || 'Omi Integration Assistant',
        firstMessage: 'Hello! This is your Omi device connection. I can help with multilingual communication.',
        systemPrompt: assistantConfig.systemPrompt || 'You are a helpful multilingual assistant connecting through an Omi device.',
        voice: assistantConfig.voice || {
          provider: 'elevenlabs',
          voiceId: 'pNInz6obpgDQGcFmaJgB'
        },
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          temperature: 0.7
        }
      })
    })

    if (!assistantResponse.ok) {
      throw new Error(`Assistant creation failed: ${assistantResponse.status}`)
    }

    const assistant = await assistantResponse.json()
    console.log('✅ VAPI assistant created:', assistant.id)

    // Start web call (since we don't have a real phone number)
    const callResponse = await fetch(`${apiConfig.vapi.baseUrl}/call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiConfig.vapi.privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'webCall',
        assistantId: assistant.id,
        metadata: {
          omiIntegration: true,
          deviceType: 'cross_device',
          phoneNumber: phoneNumber
        }
      })
    })

    if (!callResponse.ok) {
      throw new Error(`Call creation failed: ${callResponse.status}`)
    }

    const call = await callResponse.json()
    console.log('✅ VAPI call started:', call.id)

    return NextResponse.json({
      success: true,
      callId: call.id,
      assistantId: assistant.id,
      status: 'call_initiated',
      message: 'VAPI call started successfully',
      webCallUrl: call.webCallUrl || null
    })

  } catch (error) {
    console.error('VAPI phone call API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to start VAPI call',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
