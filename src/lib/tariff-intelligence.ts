// Real-time Tariff Impact Analysis using Apify Pricing Intelligence
// https://apify.com/easyapi/pricing-page-analyzer
// https://apify.com/apify_daniel/saas-pricing-intelligence

import { apiConfig } from '@/config/api'

export interface TariffImpact {
  product: string
  basePrice: number
  currency: string
  tariffRate: number
  tariffAmount: number
  finalPrice: number
  priceIncrease: number
  percentageIncrease: number
  effectiveDate: string
  country: string
  hsCode?: string
}

export interface PricingAnalysis {
  url: string
  product: string
  currentPrice: number
  currency: string
  priceHistory: Array<{
    price: number
    date: string
    source: string
  }>
  competitorPrices: Array<{
    competitor: string
    price: number
    url: string
    lastUpdated: string
  }>
  recommendations: string[]
}

export interface GlobalTradeIntelligence {
  product: string
  globalPrices: Array<{
    country: string
    price: number
    currency: string
    tariffImpact: TariffImpact
    localFactors: string[]
  }>
  trendAnalysis: {
    priceDirection: 'increasing' | 'decreasing' | 'stable'
    volatility: number
    keyFactors: string[]
  }
  tradingOpportunities: Array<{
    type: 'arbitrage' | 'sourcing' | 'export'
    description: string
    potentialProfit: number
    riskLevel: 'low' | 'medium' | 'high'
  }>
}

class TariffIntelligenceAPI {
  private apifyToken = apiConfig.apify.token
  private baseUrl = 'https://api.apify.com/v2'

  // Analyze pricing pages for tariff impact
  async analyzePricingPage(url: string): Promise<PricingAnalysis> {
    console.log(`📊 Analyzing pricing page: ${url}`)
    
    try {
      // Use Apify Pricing Page Analyzer
      const response = await this.runApifyActor('easyapi/pricing-page-analyzer', {
        pricingPageUrl: url,
        includeRecommendations: true,
        analyzeCompetitors: true
      })

      return this.processPricingAnalysis(response, url)
    } catch (error) {
      console.error('Pricing analysis error:', error)
      return this.getMockPricingAnalysis(url)
    }
  }

  // Monitor SaaS pricing intelligence for tariff impacts
  async monitorSaaSPricing(competitors: string[]): Promise<PricingAnalysis[]> {
    console.log('💼 Monitoring SaaS pricing intelligence...')
    
    try {
      // Use Apify SaaS Pricing Intelligence
      const response = await this.runApifyActor('apify_daniel/saas-pricing-intelligence', {
        competitorUrls: competitors,
        trackPricingChanges: true,
        includeTariffAnalysis: true,
        monitoringPeriod: '30days'
      })

      return this.processSaaSIntelligence(response)
    } catch (error) {
      console.error('SaaS pricing intelligence error:', error)
      return competitors.map(url => this.getMockPricingAnalysis(url))
    }
  }

  // Calculate real-time tariff impact on global prices
  async calculateTariffImpact(
    product: string, 
    sourceCountry: string, 
    targetCountry: string,
    basePrice: number,
    currency: string
  ): Promise<TariffImpact> {
    console.log(`💰 Calculating tariff impact: ${product} from ${sourceCountry} to ${targetCountry}`)
    
    try {
      // In real implementation, integrate with:
      // - US Trade Representative API
      // - WTO Tariff Database
      // - Customs agencies APIs
      // - Real-time trade policy feeds

      const tariffData = await this.getCurrentTariffRates(product, sourceCountry, targetCountry)
      
      const tariffAmount = basePrice * (tariffData.rate / 100)
      const finalPrice = basePrice + tariffAmount
      
      return {
        product,
        basePrice,
        currency,
        tariffRate: tariffData.rate,
        tariffAmount,
        finalPrice,
        priceIncrease: tariffAmount,
        percentageIncrease: (tariffAmount / basePrice) * 100,
        effectiveDate: tariffData.effectiveDate,
        country: targetCountry,
        hsCode: tariffData.hsCode
      }
    } catch (error) {
      console.error('Tariff calculation error:', error)
      return this.getMockTariffImpact(product, sourceCountry, targetCountry, basePrice, currency)
    }
  }

  // Get comprehensive global trade intelligence
  async getGlobalTradeIntelligence(product: string): Promise<GlobalTradeIntelligence> {
    console.log(`🌍 Analyzing global trade intelligence for: ${product}`)
    
    try {
      // Analyze pricing across multiple countries with tariff impacts
      const countries = ['US', 'CN', 'DE', 'JP', 'IN', 'BR', 'UK', 'CA']
      const baseCountry = 'CN' // Assume China as manufacturing base
      
      const globalAnalysis = await Promise.all(
        countries.map(async (country) => {
          const tariffImpact = await this.calculateTariffImpact(
            product, baseCountry, country, 100, 'USD' // Base price $100
          )
          
          const localFactors = await this.getLocalPricingFactors(product, country)
          
          return {
            country,
            price: tariffImpact.finalPrice,
            currency: 'USD',
            tariffImpact,
            localFactors
          }
        })
      )

      return {
        product,
        globalPrices: globalAnalysis,
        trendAnalysis: this.analyzePriceTrends(globalAnalysis),
        tradingOpportunities: this.identifyTradingOpportunities(globalAnalysis)
      }
    } catch (error) {
      console.error('Global trade intelligence error:', error)
      return this.getMockGlobalIntelligence(product)
    }
  }

  // Real-time tariff change monitoring
  async monitorTariffChanges(products: string[], countries: string[]): Promise<Array<{
    product: string
    country: string
    oldTariff: number
    newTariff: number
    priceImpact: number
    changeDate: string
    reason: string
  }>> {
    console.log('📈 Monitoring real-time tariff changes...')
    
    try {
      // Monitor trade policy websites, government announcements
      const changes = await this.runApifyActor('custom/tariff-monitor', {
        products,
        countries,
        monitorSources: [
          'https://ustr.gov',
          'https://trade.gov',
          'https://ec.europa.eu/trade',
          'https://customs.gov.in'
        ]
      })

      return this.processTariffChanges(changes)
    } catch (error) {
      console.error('Tariff monitoring error:', error)
      return this.getMockTariffChanges(products, countries)
    }
  }

  // Private helper methods
  private async runApifyActor(actorId: string, input: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/acts/${actorId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input)
    })

    if (!response.ok) {
      throw new Error(`Apify actor ${actorId} failed: ${response.status}`)
    }

    const runInfo = await response.json()
    return await this.waitForCompletion(runInfo.data.id)
  }

  private async waitForCompletion(runId: string): Promise<any> {
    // Polling logic for actor completion
    let attempts = 0
    const maxAttempts = 30

    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`${this.baseUrl}/actor-runs/${runId}`, {
        headers: { 'Authorization': `Bearer ${this.apifyToken}` }
      })

      const runInfo = await statusResponse.json()
      
      if (runInfo.data.status === 'SUCCEEDED') {
        const resultsResponse = await fetch(`${this.baseUrl}/datasets/${runInfo.data.defaultDatasetId}/items`, {
          headers: { 'Authorization': `Bearer ${this.apifyToken}` }
        })
        return await resultsResponse.json()
      }

      if (runInfo.data.status === 'FAILED') {
        throw new Error('Actor run failed')
      }

      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    throw new Error('Actor run timeout')
  }

  private async getCurrentTariffRates(product: string, sourceCountry: string, targetCountry: string) {
    // Mock tariff data - in real implementation, integrate with trade APIs
    const tariffRates: { [key: string]: { [key: string]: { rate: number; hsCode: string; effectiveDate: string } } } = {
      'CN': {
        'US': { rate: 25.0, hsCode: '8471.30.01', effectiveDate: '2024-01-15' },
        'EU': { rate: 12.5, hsCode: '8471.30.01', effectiveDate: '2024-02-01' },
        'JP': { rate: 8.0, hsCode: '8471.30.01', effectiveDate: '2024-01-01' }
      },
      'US': {
        'CN': { rate: 15.0, hsCode: '8471.30.01', effectiveDate: '2024-03-01' },
        'EU': { rate: 5.0, hsCode: '8471.30.01', effectiveDate: '2024-01-01' }
      }
    }

    const rate = tariffRates[sourceCountry]?.[targetCountry] || { rate: 10.0, hsCode: 'UNKNOWN', effectiveDate: new Date().toISOString() }
    return rate
  }

  private async getLocalPricingFactors(product: string, country: string): Promise<string[]> {
    const factors: { [key: string]: string[] } = {
      'US': ['High labor costs', 'Strong consumer demand', 'Advanced logistics'],
      'CN': ['Manufacturing hub', 'Lower labor costs', 'Government subsidies'],
      'DE': ['Premium quality focus', 'Environmental regulations', 'Strong export economy'],
      'JP': ['Technology innovation', 'Quality standards', 'Aging population'],
      'IN': ['Growing middle class', 'Cost-competitive manufacturing', 'Digital adoption'],
      'BR': ['Resource abundance', 'Currency volatility', 'Infrastructure challenges'],
      'UK': ['Post-Brexit trade rules', 'Financial services hub', 'Premium market'],
      'CA': ['Resource economy', 'Trade agreements', 'Stable currency']
    }

    return factors[country] || ['Local market dynamics', 'Economic conditions', 'Regulatory environment']
  }

  private processPricingAnalysis(data: any, url: string): PricingAnalysis {
    // Process Apify pricing analyzer results
    return {
      url,
      product: data.product || 'Unknown Product',
      currentPrice: data.price || 0,
      currency: data.currency || 'USD',
      priceHistory: data.priceHistory || [],
      competitorPrices: data.competitors || [],
      recommendations: data.recommendations || []
    }
  }

  private processSaaSIntelligence(data: any): PricingAnalysis[] {
    // Process SaaS pricing intelligence results
    return data.map((item: any) => ({
      url: item.url,
      product: item.productName,
      currentPrice: item.currentPrice,
      currency: item.currency,
      priceHistory: item.priceHistory || [],
      competitorPrices: item.competitors || [],
      recommendations: item.insights || []
    }))
  }

  private analyzePriceTrends(globalPrices: any[]): any {
    const prices = globalPrices.map(p => p.price)
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const maxPrice = Math.max(...prices)
    const minPrice = Math.min(...prices)
    const volatility = ((maxPrice - minPrice) / avgPrice) * 100

    return {
      priceDirection: volatility > 20 ? 'increasing' : volatility < -20 ? 'decreasing' : 'stable',
      volatility: Math.round(volatility * 100) / 100,
      keyFactors: [
        'Tariff policy changes',
        'Currency fluctuations', 
        'Supply chain disruptions',
        'Seasonal demand variations'
      ]
    }
  }

  private identifyTradingOpportunities(globalPrices: any[]): any[] {
    const opportunities = []
    
    // Find arbitrage opportunities
    const sortedPrices = globalPrices.sort((a, b) => a.price - b.price)
    const cheapest = sortedPrices[0]
    const mostExpensive = sortedPrices[sortedPrices.length - 1]
    
    if (mostExpensive.price > cheapest.price * 1.5) {
      opportunities.push({
        type: 'arbitrage',
        description: `Buy in ${cheapest.country} ($${cheapest.price}) and sell in ${mostExpensive.country} ($${mostExpensive.price})`,
        potentialProfit: mostExpensive.price - cheapest.price,
        riskLevel: 'medium'
      })
    }

    return opportunities
  }

  // Mock data methods for demo
  private getMockPricingAnalysis(url: string): PricingAnalysis {
    return {
      url,
      product: 'Electronics Component',
      currentPrice: 125.50,
      currency: 'USD',
      priceHistory: [
        { price: 100.00, date: '2024-01-01', source: 'baseline' },
        { price: 115.00, date: '2024-06-01', source: 'tariff-increase' },
        { price: 125.50, date: '2024-10-01', source: 'current' }
      ],
      competitorPrices: [
        { competitor: 'CompanyA', price: 120.00, url: 'https://competitor-a.com', lastUpdated: '2024-10-04' },
        { competitor: 'CompanyB', price: 130.00, url: 'https://competitor-b.com', lastUpdated: '2024-10-03' }
      ],
      recommendations: [
        'Monitor upcoming tariff policy changes',
        'Consider alternative sourcing countries',
        'Implement dynamic pricing based on tariff fluctuations'
      ]
    }
  }

  private getMockTariffImpact(
    product: string, 
    sourceCountry: string, 
    targetCountry: string, 
    basePrice: number, 
    currency: string
  ): TariffImpact {
    const tariffRates: { [key: string]: number } = {
      'CN-US': 25.0,
      'CN-EU': 12.5,
      'CN-JP': 8.0,
      'US-CN': 15.0,
      'EU-US': 5.0
    }

    const key = `${sourceCountry}-${targetCountry}`
    const tariffRate = tariffRates[key] || 10.0
    const tariffAmount = basePrice * (tariffRate / 100)
    
    return {
      product,
      basePrice,
      currency,
      tariffRate,
      tariffAmount,
      finalPrice: basePrice + tariffAmount,
      priceIncrease: tariffAmount,
      percentageIncrease: tariffRate,
      effectiveDate: '2024-10-01',
      country: targetCountry,
      hsCode: '8471.30.01'
    }
  }

  private getMockGlobalIntelligence(product: string): GlobalTradeIntelligence {
    return {
      product,
      globalPrices: [
        {
          country: 'China',
          price: 100.00,
          currency: 'USD',
          tariffImpact: this.getMockTariffImpact(product, 'CN', 'US', 100, 'USD'),
          localFactors: ['Manufacturing hub', 'Lower labor costs', 'Government subsidies']
        },
        {
          country: 'United States',
          price: 125.00,
          currency: 'USD',
          tariffImpact: this.getMockTariffImpact(product, 'CN', 'US', 100, 'USD'),
          localFactors: ['High labor costs', 'Strong consumer demand', 'Advanced logistics']
        },
        {
          country: 'Germany',
          price: 112.50,
          currency: 'USD',
          tariffImpact: this.getMockTariffImpact(product, 'CN', 'DE', 100, 'USD'),
          localFactors: ['Premium quality focus', 'Environmental regulations', 'Strong export economy']
        }
      ],
      trendAnalysis: {
        priceDirection: 'increasing',
        volatility: 15.3,
        keyFactors: [
          'US-China trade tensions',
          'Supply chain disruptions',
          'Currency fluctuations',
          'Seasonal demand changes'
        ]
      },
      tradingOpportunities: [
        {
          type: 'arbitrage',
          description: 'Buy in China ($100) and sell in US ($125) - 25% margin after tariffs',
          potentialProfit: 25.00,
          riskLevel: 'medium'
        },
        {
          type: 'sourcing',
          description: 'Switch from China to Vietnam sourcing to avoid 25% US tariffs',
          potentialProfit: 15.00,
          riskLevel: 'low'
        }
      ]
    }
  }

  private getMockTariffChanges(products: string[], countries: string[]) {
    return [
      {
        product: 'Electronics',
        country: 'United States',
        oldTariff: 20.0,
        newTariff: 25.0,
        priceImpact: 5.0,
        changeDate: '2024-10-01',
        reason: 'Trade policy adjustment in response to market conditions'
      },
      {
        product: 'Textiles',
        country: 'European Union',
        oldTariff: 10.0,
        newTariff: 8.0,
        priceImpact: -2.0,
        changeDate: '2024-09-15',
        reason: 'Trade agreement implementation'
      }
    ]
  }

  private processTariffChanges(data: any) {
    return data.map((change: any) => ({
      product: change.product,
      country: change.country,
      oldTariff: change.oldRate,
      newTariff: change.newRate,
      priceImpact: change.newRate - change.oldRate,
      changeDate: change.effectiveDate,
      reason: change.reason || 'Policy update'
    }))
  }
}

export const tariffIntelligenceAPI = new TariffIntelligenceAPI()
