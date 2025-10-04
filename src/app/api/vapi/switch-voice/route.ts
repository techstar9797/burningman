import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🎤 VAPI Switch Voice webhook:', body)

    const args = body.message?.toolCalls?.[0]?.function?.arguments || {}
    const { target_language, voice_gender } = args

    console.log(`🔊 Switching voice to ${target_language} (${voice_gender || 'default'})`)

    // Language-specific voice configurations based on VAPI Azure integration
    const voiceConfigs: { [key: string]: { [key: string]: any } } = {
      'en': {
        'male': { provider: 'azure', voiceId: 'en-US-DavisNeural' },
        'female': { provider: 'azure', voiceId: 'en-US-AriaNeural' }
      },
      'sr': {
        'male': { provider: 'azure', voiceId: 'sr-RS-NicholasNeural' },
        'female': { provider: 'azure', voiceId: 'sr-RS-SophieNeural' }
      },
      'zh': {
        'male': { provider: 'azure', voiceId: 'zh-CN-YunxiNeural' },
        'female': { provider: 'azure', voiceId: 'zh-CN-XiaoxiaoNeural' }
      },
      'hi': {
        'male': { provider: 'azure', voiceId: 'hi-IN-MadhurNeural' },
        'female': { provider: 'azure', voiceId: 'hi-IN-SwaraNeural' }
      },
      'vi': {
        'male': { provider: 'azure', voiceId: 'vi-VN-NamMinhNeural' },
        'female': { provider: 'azure', voiceId: 'vi-VN-HoaiMyNeural' }
      },
      'pl': {
        'male': { provider: 'azure', voiceId: 'pl-PL-MarekNeural' },
        'female': { provider: 'azure', voiceId: 'pl-PL-ZofiaNeural' }
      },
      'cs': {
        'male': { provider: 'azure', voiceId: 'cs-CZ-AntoninNeural' },
        'female': { provider: 'azure', voiceId: 'cs-CZ-VlastaNeural' }
      }
    }

    const selectedVoice = voiceConfigs[target_language]?.[voice_gender || 'female'] || 
                         voiceConfigs[target_language]?.['female'] ||
                         voiceConfigs['en']['female']

    // Cultural context for voice switching
    const culturalNotes: { [key: string]: string } = {
      'en': 'Switched to clear, professional English voice for US business communication',
      'sr': 'Prebačeno na srpski glas za prirodnu komunikaciju na srpskom jeziku',
      'zh': '切换到中文语音，便于中文商务交流',
      'hi': 'हिंदी आवाज़ में बदल गया है व्यापारिक बातचीत के लिए',
      'vi': 'Chuyển sang giọng tiếng Việt để giao tiếp kinh doanh tự nhiên',
      'pl': 'Przełączono na polski głos dla naturalnej komunikacji biznesowej',
      'cs': 'Přepnuto na český hlas pro přirozenou obchodní komunikaci'
    }

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            voice_config: selectedVoice,
            target_language,
            voice_gender: voice_gender || 'female',
            cultural_note: culturalNotes[target_language] || 'Voice switched for natural communication',
            message: `Voice switched to ${target_language} for natural pronunciation and cultural context.`,
            technical_details: {
              provider: selectedVoice.provider,
              voiceId: selectedVoice.voiceId,
              language_code: target_language,
              quality: 'neural_premium'
            }
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Switch voice webhook error:', error)
    return NextResponse.json(
      { error: 'Voice switching failed' },
      { status: 500 }
    )
  }
}
