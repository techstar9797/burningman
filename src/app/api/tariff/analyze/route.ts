import { NextRequest, NextResponse } from 'next/server'
import { tariffIntelligenceAPI } from '@/lib/tariff-intelligence'

export async function POST(request: NextRequest) {
  try {
    const { product, sourceCountry, targetCountry, basePrice, currency } = await request.json()

    console.log('📊 Tariff analysis request:', { product, sourceCountry, targetCountry, basePrice })

    // Calculate real-time tariff impact
    const tariffImpact = await tariffIntelligenceAPI.calculateTariffImpact(
      product,
      sourceCountry,
      targetCountry,
      basePrice,
      currency || 'USD'
    )

    // Get comprehensive trade intelligence
    const tradeIntelligence = await tariffIntelligenceAPI.getGlobalTradeIntelligence(product)

    return NextResponse.json({
      success: true,
      tariffImpact,
      tradeIntelligence,
      recommendations: [
        `Current tariff rate of ${tariffImpact.tariffRate}% adds ${tariffImpact.tariffAmount.toFixed(2)} ${currency} to your costs`,
        `Consider alternative sourcing countries to reduce tariff exposure`,
        `Monitor upcoming trade policy changes for this product category`,
        `Implement dynamic pricing to adjust for tariff fluctuations`
      ],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Tariff analysis API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Tariff analysis failed',
        message: 'Unable to analyze tariff impact at this time'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product = searchParams.get('product') || 'Electronics'

    console.log('🌍 Global trade intelligence request for:', product)

    const tradeIntelligence = await tariffIntelligenceAPI.getGlobalTradeIntelligence(product)

    return NextResponse.json({
      success: true,
      product,
      tradeIntelligence,
      timestamp: new Date().toISOString(),
      dataSource: 'Apify Pricing Intelligence + Government Trade APIs'
    })
  } catch (error) {
    console.error('Trade intelligence API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Trade intelligence failed' 
      },
      { status: 500 }
    )
  }
}
