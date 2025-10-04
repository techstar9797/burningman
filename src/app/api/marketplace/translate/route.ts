import { NextRequest, NextResponse } from 'next/server'
import { globalTranslationService } from '@/lib/translation'

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage, region } = await request.json()

    console.log('🌍 Translation request:', { text, sourceLanguage, targetLanguage, region })

    const translation = await globalTranslationService.translateVoiceText(text, {
      sourceLanguage: sourceLanguage || 'auto',
      targetLanguage: targetLanguage || 'en',
      region: region || 'US'
    })

    return NextResponse.json({
      success: true,
      translation,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Translation failed',
        message: 'Unable to translate text at this time'
      },
      { status: 500 }
    )
  }
}
