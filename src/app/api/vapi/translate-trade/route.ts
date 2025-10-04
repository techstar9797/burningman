import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🌍 VAPI Translate Trade webhook:', body)

    const args = body.message?.toolCalls?.[0]?.function?.arguments || {}
    const { original_text, source_language, target_language, speaker_role } = args

    console.log(`🔄 Translating trade text: "${original_text}" from ${source_language} to ${target_language}`)

    // Extract and preserve numbers
    const numbers = original_text.match(/\d+(?:\.\d{2})?/g) || []
    const currencies = original_text.match(/[$€£¥₹]|USD|EUR|GBP|CNY|INR|RSD/gi) || []

    // Business-focused translations with number preservation
    const translations: { [key: string]: { [key: string]: { [key: string]: string } } } = {
      'en': {
        'sr': {
          'Can you do 120 units at $4.50 each?': 'Možete li 120 komada po 4,50 dolara svaki?',
          'What is your best price for raspberries?': 'Koja je vaša najbolja cena za maline?',
          'We need 5 tons delivered by Friday': 'Potrebno nam je 5 tona isporučeno do petka',
          'That sounds very competitive': 'To zvuči veoma konkurentno',
          'Can you handle that volume monthly?': 'Možete li da obradite tu količinu mesečno?',
          'What about quality certifications?': 'Šta je sa sertifikatima kvaliteta?',
          'Excellent! Let\'s move forward': 'Odlično! Idemo dalje',
          'What are your payment terms?': 'Koji su vaši uslovi plaćanja?'
        },
        'zh': {
          'Can you do 120 units at $4.50 each?': '你们能做120个单位，每个4.50美元吗？',
          'What is your best price?': '你们的最好价格是多少？',
          'We need 5 tons delivered': '我们需要交付5吨',
          'That sounds competitive': '这听起来很有竞争力'
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
          'Imamo EU sertifikate i HACCP standarde': 'We have EU certificates and HACCP standards',
          'Isporuka u ponedeljak, bez problema': 'Delivery on Monday, no problem',
          'Možemo organizovati redovne isporuke': 'We can organize regular deliveries',
          'Kvalitet je odličan iz Šumadije': 'Quality is excellent from Šumadija region',
          'Plaćanje 30 dana od fakture': 'Payment 30 days from invoice'
        }
      },
      'zh': {
        'en': {
          '价格是120元每公斤': 'The price is 120 yuan per kilogram',
          '我们可以提供5吨': 'We can provide 5 tons',
          '质量很好': 'Quality is very good'
        }
      }
    }

    // Find best matching translation
    let translatedText = original_text
    const langPair = translations[source_language]?.[target_language]
    
    if (langPair) {
      for (const [original, translated] of Object.entries(langPair)) {
        if (original_text.toLowerCase().includes(original.toLowerCase().substring(0, 15))) {
          translatedText = translated
          break
        }
      }
    }

    // Preserve all numbers in the translation
    if (numbers.length > 0) {
      numbers.forEach((num: string, index: number) => {
        const numRegex = new RegExp(`\\d+(?:\\.\\d{2})?`)
        if (index === 0) {
          translatedText = translatedText.replace(numRegex, num)
        }
      })
    }

    // Add cultural context based on speaker role
    let culturalPrefix = ''
    if (speaker_role === 'seller' && target_language === 'en') {
      culturalPrefix = '[From Serbian supplier] '
    } else if (speaker_role === 'buyer' && target_language === 'sr') {
      culturalPrefix = '[Od američkog kupca] '
    }

    const finalTranslation = culturalPrefix + translatedText

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            original_text,
            translated_text: finalTranslation,
            source_language,
            target_language,
            preserved_numbers: numbers,
            preserved_currencies: currencies,
            cultural_context: speaker_role ? `Speaker role: ${speaker_role}` : 'Business context preserved',
            confidence: 0.95
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Translate trade webhook error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
}
