import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🌍 Cultural bridge request:', body)

    const { situation, sourceLanguage, targetLanguage } = body.message?.toolCalls?.[0]?.function?.arguments || {}

    // Cultural intelligence database
    const culturalGuidance: { [key: string]: { [key: string]: any } } = {
      'en-US': {
        'zh-CN': {
          businessStyle: 'Americans prefer direct communication, while Chinese value relationship-building first',
          negotiation: 'Americans focus on quick decisions, Chinese prefer longer relationship development',
          timeOrientation: 'Americans are deadline-focused, Chinese take longer-term view',
          hierarchy: 'Americans are more egalitarian, Chinese respect clear hierarchy'
        },
        'hi-IN': {
          businessStyle: 'Americans are task-oriented, Indians value personal relationships',
          negotiation: 'Americans negotiate directly, Indians prefer consensus-building',
          timeOrientation: 'Americans are punctual, Indians have flexible time concepts',
          hierarchy: 'Americans question authority, Indians respect seniority'
        },
        'ar-SA': {
          businessStyle: 'Americans are informal, Arabs prefer formal respect',
          negotiation: 'Americans focus on facts, Arabs value trust and honor',
          timeOrientation: 'Americans schedule tightly, Arabs allow for social time',
          hierarchy: 'Americans are direct with superiors, Arabs show deference'
        }
      },
      'zh-CN': {
        'en-US': {
          businessStyle: 'Chinese build relationships first, Americans focus on tasks immediately',
          negotiation: 'Chinese avoid direct "no", Americans expect clear yes/no answers',
          timeOrientation: 'Chinese plan long-term, Americans want quick results',
          hierarchy: 'Chinese respect age/position, Americans value merit/performance'
        }
      },
      'hi-IN': {
        'en-US': {
          businessStyle: 'Indians emphasize personal connection, Americans separate business/personal',
          negotiation: 'Indians seek win-win harmony, Americans compete to win',
          timeOrientation: 'Indians see time as flexible, Americans see time as fixed resource',
          hierarchy: 'Indians respect traditional authority, Americans challenge status quo'
        }
      }
    }

    // Get cultural guidance
    const guidance = culturalGuidance[sourceLanguage]?.[targetLanguage] || 
                    culturalGuidance[targetLanguage]?.[sourceLanguage] || {}

    // Generate contextual advice
    let advice = ''
    let recommendations: string[] = []

    if (situation?.toLowerCase().includes('price') || situation?.toLowerCase().includes('money')) {
      advice = 'Price negotiations vary significantly across cultures. '
      if (targetLanguage === 'zh-CN') {
        advice += 'In Chinese culture, building relationship and trust comes before discussing price. Take time to establish rapport first.'
        recommendations = [
          'Start with relationship building, not immediate price discussion',
          'Show respect for their business and expertise',
          'Be patient - rushing may be seen as disrespectful'
        ]
      } else if (targetLanguage === 'hi-IN') {
        advice += 'In Indian culture, bargaining is expected and shows engagement. Don\'t accept first price - it may offend.'
        recommendations = [
          'Engage in friendly bargaining - it shows respect',
          'Ask about family or business - personal connection matters',
          'Be prepared for longer conversations with tea/refreshments'
        ]
      } else if (targetLanguage === 'ar-SA') {
        advice += 'In Arab culture, honor and respect are paramount. Price discussions should maintain dignity for all parties.'
        recommendations = [
          'Show respect for their knowledge and expertise',
          'Avoid aggressive negotiation tactics',
          'Allow face-saving opportunities in negotiations'
        ]
      }
    }

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            culturalAdvice: advice,
            recommendations: recommendations,
            culturalContext: guidance,
            communicationTips: [
              `When speaking with someone from ${targetLanguage} culture:`,
              ...Object.values(guidance).slice(0, 3)
            ],
            potentialMisunderstandings: [
              'Direct vs indirect communication styles',
              'Different concepts of time and urgency',
              'Varying approaches to hierarchy and respect'
            ]
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Cultural bridge API error:', error)
    return NextResponse.json(
      { error: 'Cultural bridge failed' },
      { status: 500 }
    )
  }
}
