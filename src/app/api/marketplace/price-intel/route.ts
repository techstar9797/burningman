import { NextRequest, NextResponse } from 'next/server'
import { globalTranslationService } from '@/lib/translation'

export async function POST(request: NextRequest) {
  try {
    const { voiceText, userLocation, userLanguage, userId } = await request.json()

    console.log('💰 Price intelligence request:', { voiceText, userLocation, userLanguage })

    // Extract price information from voice input
    const priceInfo = await globalTranslationService.extractPriceIntelligence(
      voiceText,
      userLocation,
      userLanguage
    )

    if (priceInfo) {
      // In a real implementation, this would:
      // 1. Store price data in database
      // 2. Trigger verification process
      // 3. Calculate and queue incentive payment
      // 4. Update global price intelligence
      
      console.log('💰 Price intelligence extracted:', priceInfo)
      
      return NextResponse.json({
        success: true,
        priceIntelligence: priceInfo,
        message: `Thank you for sharing! You've earned $${priceInfo.incentiveEarned.toFixed(2)} for this price report.`,
        verificationStatus: 'pending',
        estimatedVerificationTime: '2-5 minutes'
      })
    } else {
      return NextResponse.json({
        success: false,
        message: 'No price information detected in your message. Try saying something like "Coffee costs $4 here" or "The price of rice is 50 rupees"',
        suggestions: [
          'Share specific product prices',
          'Include currency or location context',
          'Speak clearly about local prices'
        ]
      })
    }
  } catch (error) {
    console.error('Price intelligence API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Price extraction failed',
        message: 'Unable to process price information at this time'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product = searchParams.get('product')
    const location = searchParams.get('location')

    console.log('🔍 Price lookup request:', { product, location })

    // Mock global price data for demo
    const mockPriceData = [
      {
        product: product || 'Coffee',
        location: location || 'Global Average',
        price: 3.50,
        currency: 'USD',
        lastUpdated: '5 minutes ago',
        contributor: 'Community Average',
        confidence: 0.92
      },
      {
        product: product || 'Coffee',
        location: 'Tokyo, Japan',
        price: 420,
        currency: 'JPY',
        lastUpdated: '12 minutes ago',
        contributor: 'Yuki S.',
        confidence: 0.95
      },
      {
        product: product || 'Coffee',
        location: 'Mumbai, India',
        price: 150,
        currency: 'INR',
        lastUpdated: '8 minutes ago',
        contributor: 'Raj P.',
        confidence: 0.88
      }
    ]

    return NextResponse.json({
      success: true,
      prices: mockPriceData,
      totalResults: mockPriceData.length,
      searchQuery: { product, location },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Price lookup API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Price lookup failed' 
      },
      { status: 500 }
    )
  }
}
