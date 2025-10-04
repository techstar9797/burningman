import { NextRequest, NextResponse } from 'next/server'
import { tariffIntelligenceAPI } from '@/lib/tariff-intelligence'

export async function POST(request: NextRequest) {
  try {
    const { products, countries, alertThreshold } = await request.json()

    console.log('🚨 Tariff monitoring request:', { products, countries, alertThreshold })

    // Monitor real-time tariff changes
    const changes = await tariffIntelligenceAPI.monitorTariffChanges(products, countries)

    // Filter significant changes based on threshold
    const significantChanges = changes.filter(change => 
      Math.abs(change.priceImpact) >= (alertThreshold || 2.0)
    )

    // Calculate business impact
    const businessImpact = significantChanges.map(change => ({
      ...change,
      estimatedCostImpact: change.priceImpact * 1000, // Assume $1000 monthly volume
      recommendation: change.priceImpact > 0 
        ? 'Consider alternative suppliers or hedge against price increases'
        : 'Opportunity to lock in lower costs or expand volume'
    }))

    return NextResponse.json({
      success: true,
      totalChanges: changes.length,
      significantChanges: significantChanges.length,
      changes: businessImpact,
      alerts: significantChanges.map(change => ({
        type: change.priceImpact > 0 ? 'warning' : 'opportunity',
        message: `${change.product} tariff in ${change.country} changed by ${change.priceImpact.toFixed(1)}%`,
        impact: change.priceImpact > 0 ? 'negative' : 'positive',
        urgency: Math.abs(change.priceImpact) > 10 ? 'high' : 'medium'
      })),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Tariff monitoring API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Tariff monitoring failed',
        message: 'Unable to monitor tariff changes at this time'
      },
      { status: 500 }
    )
  }
}

// Get current tariff rates for specific trade routes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product = searchParams.get('product')
    const source = searchParams.get('source')
    const target = searchParams.get('target')

    if (!product || !source || !target) {
      return NextResponse.json(
        { error: 'Missing required parameters: product, source, target' },
        { status: 400 }
      )
    }

    console.log('📈 Current tariff rate request:', { product, source, target })

    const tariffImpact = await tariffIntelligenceAPI.calculateTariffImpact(
      product,
      source,
      target,
      100, // Base price for calculation
      'USD'
    )

    return NextResponse.json({
      success: true,
      tariffImpact,
      tradeRoute: `${source} → ${target}`,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Government Trade APIs + Apify Intelligence'
    })
  } catch (error) {
    console.error('Tariff rate API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Tariff rate lookup failed' 
      },
      { status: 500 }
    )
  }
}
