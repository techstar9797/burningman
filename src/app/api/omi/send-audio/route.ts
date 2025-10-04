import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔊 Omi Send Audio webhook:', body)

    const args = body.message?.toolCalls?.[0]?.function?.arguments || body
    const { translated_text, target_language, cultural_context } = args

    console.log(`📱 Sending audio to Omi device: "${translated_text}" in ${target_language}`)

    // Prepare audio for Omi device playback
    const audioResult = await prepareOmiAudio(translated_text, target_language, cultural_context)
    
    // In real implementation, this would:
    // 1. Convert text to speech using target language voice
    // 2. Optimize audio format for Omi device
    // 3. Send via Omi's audio API
    // 4. Handle device-specific audio settings
    // 5. Confirm audio delivery and playback

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id || 'omi_audio_' + Date.now(),
          result: {
            success: true,
            audio_sent: true,
            omi_device_status: 'audio_playing',
            audio_details: audioResult,
            delivery_confirmation: 'Audio delivered to Omi device successfully',
            playback_status: 'playing',
            estimated_duration: audioResult.duration_seconds + ' seconds',
            cultural_adaptation: cultural_context ? 'Applied cultural tone adjustments' : 'Standard delivery',
            next_action: 'wait_for_omi_response'
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Omi send audio error:', error)
    return NextResponse.json(
      { error: 'Failed to send audio to Omi device' },
      { status: 500 }
    )
  }
}

// Prepare audio for Omi device
async function prepareOmiAudio(
  text: string, 
  language: string, 
  culturalContext?: string
): Promise<{
  text: string
  language: string
  voice_profile: string
  duration_seconds: number
  cultural_adaptation: string
  audio_format: string
}> {
  console.log('🎙️ Preparing Omi audio:', { text, language, culturalContext })

  // Voice profiles optimized for Omi device speakers
  const omiVoiceProfiles: { [key: string]: string } = {
    'sr-RS': 'Serbian female voice - warm, friendly tone for business',
    'en-US': 'American English - clear, professional tone',
    'zh-CN': 'Mandarin Chinese - respectful, formal tone',
    'hi-IN': 'Hindi - warm, respectful tone with cultural sensitivity',
    'vi-VN': 'Vietnamese - polite, professional tone',
    'pl-PL': 'Polish - friendly, business-appropriate tone',
    'cs-CZ': 'Czech - professional, clear pronunciation'
  }

  // Estimate audio duration (roughly 150 words per minute for natural speech)
  const wordCount = text.split(' ').length
  const estimatedDuration = Math.ceil((wordCount / 150) * 60) // seconds

  // Apply cultural adaptations
  let culturalAdaptation = 'standard_delivery'
  if (culturalContext) {
    if (culturalContext.includes('Serbian') || culturalContext.includes('hospitality')) {
      culturalAdaptation = 'warm_hospitable_tone'
    } else if (culturalContext.includes('business') || culturalContext.includes('professional')) {
      culturalAdaptation = 'professional_business_tone'
    }
  }

  return {
    text: text,
    language: language,
    voice_profile: omiVoiceProfiles[language] || omiVoiceProfiles['en-US'],
    duration_seconds: Math.max(2, estimatedDuration),
    cultural_adaptation: culturalAdaptation,
    audio_format: 'omi_optimized_mp3'
  }
}

// Handle Omi device status updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID required' },
        { status: 400 }
      )
    }

    console.log('📱 Omi device status check:', deviceId)

    // Mock Omi device status
    const deviceStatus = {
      deviceId: deviceId,
      isConnected: true,
      batteryLevel: 78,
      signalStrength: 'strong',
      lastActivity: new Date().toISOString(),
      location: {
        city: 'Belgrade',
        country: 'Serbia',
        accuracy: 'high'
      },
      audioStatus: {
        isPlaying: false,
        volume: 0.8,
        lastPlayback: new Date().toISOString()
      },
      capabilities: {
        voiceCapture: true,
        audioPlayback: true,
        locationServices: true,
        realTimeTranslation: true
      }
    }

    return NextResponse.json({
      success: true,
      device: deviceStatus,
      bridge_status: 'ready_for_communication',
      vapi_connection: 'established'
    })
  } catch (error) {
    console.error('Omi device status error:', error)
    return NextResponse.json(
      { error: 'Device status check failed' },
      { status: 500 }
    )
  }
}
