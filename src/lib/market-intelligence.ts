// Real-time Market Intelligence using Apify Actors
// Polymarket: https://apify.com/saswave/polymarket-scraper
// Bloomberg: https://apify.com/romy/bloomberg-news-scraper  
// Truth Social: https://apify.com/scrapebi/truthsocial-apify
// Insider Finance: https://apify.com/rotas/insider-finance-us-stock-monitoring

import { apiConfig } from '@/config/api'

export interface PolymarketPrediction {
  title: string
  slug: string
  probability: number
  volume: number
  endDate: string
  category: 'politics' | 'economics' | 'trade' | 'other'
  relevantToTrade: boolean
  tradeImpact: 'high' | 'medium' | 'low'
}

export interface NewsIntelligence {
  source: 'bloomberg' | 'truthsocial' | 'insider'
  headline: string
  summary: string
  timestamp: string
  relevance: number
  sentiment: 'positive' | 'negative' | 'neutral'
  tradeImpact: {
    affectedCountries: string[]
    affectedProducts: string[]
    priceImpactEstimate: number
  }
}

export interface MarketIntelligence {
  predictions: PolymarketPrediction[]
  news: NewsIntelligence[]
  alerts: Array<{
    type: 'tariff_change' | 'trade_policy' | 'market_movement' | 'political_event'
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    affectedCountries: string[]
    timeframe: string
  }>
  slavicCountryUpdates: Array<{
    country: string
    flag: string
    updates: string[]
    tradeImpact: number
  }>
}

class MarketIntelligenceAPI {
  private apifyToken = apiConfig.apify.token
  private baseUrl = 'https://api.apify.com/v2'

  // Slavic countries for enhanced monitoring (excluding Russia/Ukraine per request)
  private slavicCountries = [
    { code: 'PL', name: 'Poland', flag: '🇵🇱', language: 'pl-PL' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', language: 'cs-CZ' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰', language: 'sk-SK' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮', language: 'sl-SI' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷', language: 'hr-HR' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸', language: 'sr-RS' },
    { code: 'BA', name: 'Bosnia & Herzegovina', flag: '🇧🇦', language: 'bs-BA' },
    { code: 'ME', name: 'Montenegro', flag: '🇲🇪', language: 'sr-ME' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', language: 'mk-MK' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', language: 'bg-BG' }
  ]

  // Scrape Polymarket for trade-related predictions
  async scrapePolymarketPredictions(): Promise<PolymarketPrediction[]> {
    console.log('🎲 Scraping Polymarket predictions for trade intelligence...')
    
    try {
      const response = await this.runApifyActor('saswave/polymarket-scraper', {
        searchTerms: [
          'tariff',
          'trade war',
          'China trade',
          'Europe trade',
          'manufacturing',
          'supply chain',
          'inflation',
          'Fed rates',
          'recession',
          'economic policy'
        ],
        maxResults: 50,
        includeLeaderboard: true,
        includeActivity: true
      })

      return this.processPolymarketData(response)
    } catch (error) {
      console.error('Polymarket scraping error:', error)
      return this.getMockPolymarketPredictions()
    }
  }

  // Scrape Bloomberg for financial news affecting trade
  async scrapeBloombergNews(): Promise<NewsIntelligence[]> {
    console.log('📰 Scraping Bloomberg news for trade intelligence...')
    
    try {
      const response = await this.runApifyActor('romy/bloomberg-news-scraper', {
        searchQueries: [
          'trade policy',
          'tariffs',
          'supply chain',
          'manufacturing',
          'China trade',
          'Europe trade',
          'slavic countries trade',
          'Poland economy',
          'Czech manufacturing'
        ],
        maxArticles: 20,
        timeframe: '24h'
      })

      return this.processBloombergNews(response)
    } catch (error) {
      console.error('Bloomberg news scraping error:', error)
      return this.getMockBloombergNews()
    }
  }

  // Scrape Truth Social for political sentiment affecting trade
  async scrapeTruthSocialSentiment(): Promise<NewsIntelligence[]> {
    console.log('🇺🇸 Scraping Truth Social for political trade sentiment...')
    
    try {
      const response = await this.runApifyActor('scrapebi/truthsocial-apify', {
        searchTerms: [
          'trade',
          'tariffs', 
          'China',
          'Europe',
          'manufacturing',
          'America First'
        ],
        maxPosts: 30,
        timeframe: '6h'
      })

      return this.processTruthSocialData(response)
    } catch (error) {
      console.error('Truth Social scraping error:', error)
      return this.getMockTruthSocialData()
    }
  }

  // Monitor US stock movements affecting Slavic trade
  async monitorSlavicRelatedStocks(): Promise<NewsIntelligence[]> {
    console.log('📈 Monitoring US stocks with Slavic trade exposure...')
    
    try {
      const response = await this.runApifyActor('rotas/insider-finance-us-stock-monitoring', {
        tickers: [
          'MSFT', // Microsoft (major Poland IT partner)
          'AAPL', // Apple (Czech manufacturing)
          'F',    // Ford (Polish auto parts)
          'CAT',  // Caterpillar (construction equipment)
          'BA',   // Boeing (aerospace exports)
          'JNJ',  // Johnson & Johnson (pharmaceuticals)
          'PFE',  // Pfizer (pharma to Slavic countries)
          'XOM'   // ExxonMobil (energy sector)
        ],
        includeNews: true,
        includeAnalysis: true,
        timeframe: '24h'
      })

      return this.processStockData(response)
    } catch (error) {
      console.error('Stock monitoring error:', error)
      return this.getMockStockData()
    }
  }

  // Comprehensive market intelligence aggregation
  async getComprehensiveIntelligence(): Promise<MarketIntelligence> {
    console.log('🧠 Aggregating comprehensive market intelligence...')

    try {
      const [predictions, bloomberg, truthSocial, stocks] = await Promise.all([
        this.scrapePolymarketPredictions(),
        this.scrapeBloombergNews(),
        this.scrapeTruthSocialSentiment(),
        this.monitorSlavicRelatedStocks()
      ])

      const allNews = [...bloomberg, ...truthSocial, ...stocks]
      const alerts = this.generateTradeAlerts(predictions, allNews)
      const slavicUpdates = this.generateSlavicCountryUpdates(allNews)

      return {
        predictions,
        news: allNews.slice(0, 10), // Top 10 most relevant
        alerts,
        slavicCountryUpdates: slavicUpdates
      }
    } catch (error) {
      console.error('Comprehensive intelligence error:', error)
      return this.getMockMarketIntelligence()
    }
  }

  // Private processing methods
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
    let attempts = 0
    const maxAttempts = 20 // 3 minutes max for real-time data

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

      await new Promise(resolve => setTimeout(resolve, 10000))
      attempts++
    }

    throw new Error('Actor run timeout')
  }

  private processPolymarketData(data: any): PolymarketPrediction[] {
    if (!data || !Array.isArray(data)) return []

    return data.map((item: any) => ({
      title: item.title || 'Unknown Market',
      slug: item.slug || '',
      probability: item.probability || 0.5,
      volume: item.volume_amount || 0,
      endDate: item.endDate || new Date().toISOString(),
      category: this.categorizeMarket(item.title),
      relevantToTrade: this.isTradeRelevant(item.title),
      tradeImpact: this.assessTradeImpact(item.title, item.probability)
    })).filter(prediction => prediction.relevantToTrade)
  }

  private processBloombergNews(data: any): NewsIntelligence[] {
    if (!data || !Array.isArray(data)) return []

    return data.map((article: any) => ({
      source: 'bloomberg',
      headline: article.headline || article.title || 'Bloomberg News',
      summary: article.summary || article.content?.substring(0, 200) || '',
      timestamp: article.publishedAt || article.timestamp || new Date().toISOString(),
      relevance: this.calculateRelevance(article.headline, article.content),
      sentiment: this.analyzeSentiment(article.headline + ' ' + article.summary),
      tradeImpact: this.extractTradeImpact(article.content || article.headline)
    }))
  }

  private processTruthSocialData(data: any): NewsIntelligence[] {
    if (!data || !Array.isArray(data)) return []

    return data.map((post: any) => ({
      source: 'truthsocial',
      headline: `Truth Social: ${post.content?.substring(0, 100) || 'Political Update'}`,
      summary: post.content || '',
      timestamp: post.timestamp || new Date().toISOString(),
      relevance: this.calculateRelevance(post.content, ''),
      sentiment: this.analyzeSentiment(post.content),
      tradeImpact: this.extractTradeImpact(post.content)
    }))
  }

  private processStockData(data: any): NewsIntelligence[] {
    if (!data || !Array.isArray(data)) return []

    return data.map((stock: any) => ({
      source: 'insider',
      headline: `${stock.ticker}: ${stock.change > 0 ? '+' : ''}${stock.change}%`,
      summary: stock.news || `${stock.ticker} moved ${stock.change}% on ${stock.volume} volume`,
      timestamp: stock.timestamp || new Date().toISOString(),
      relevance: 0.8, // Stock data is highly relevant
      sentiment: stock.change > 0 ? 'positive' : stock.change < 0 ? 'negative' : 'neutral',
      tradeImpact: {
        affectedCountries: this.getStockTradeCountries(stock.ticker),
        affectedProducts: this.getStockTradeProducts(stock.ticker),
        priceImpactEstimate: Math.abs(stock.change) * 0.1
      }
    }))
  }

  private generateTradeAlerts(predictions: PolymarketPrediction[], news: NewsIntelligence[]) {
    const alerts: Array<{
      type: 'tariff_change' | 'trade_policy' | 'market_movement' | 'political_event'
      severity: 'low' | 'medium' | 'high' | 'critical'
      message: string
      affectedCountries: string[]
      timeframe: string
    }> = []

    // High-impact Polymarket predictions
    predictions.forEach(prediction => {
      if (prediction.tradeImpact === 'high' && prediction.probability > 0.7) {
        alerts.push({
          type: 'market_movement' as const,
          severity: 'high' as const,
          message: `High probability (${Math.round(prediction.probability * 100)}%) of: ${prediction.title}`,
          affectedCountries: this.getAffectedCountries(prediction.title),
          timeframe: prediction.endDate
        })
      }
    })

    // Critical news alerts
    news.forEach(newsItem => {
      if (newsItem.relevance > 0.8 && newsItem.tradeImpact.priceImpactEstimate > 5) {
        alerts.push({
          type: 'trade_policy' as const,
          severity: 'critical' as const,
          message: newsItem.headline,
          affectedCountries: newsItem.tradeImpact.affectedCountries,
          timeframe: 'Immediate'
        })
      }
    })

    return alerts.slice(0, 5) // Top 5 most critical
  }

  private generateSlavicCountryUpdates(news: NewsIntelligence[]) {
    return this.slavicCountries.map(country => {
      const relevantNews = news.filter(item => 
        item.headline.toLowerCase().includes(country.name.toLowerCase()) ||
        item.summary.toLowerCase().includes(country.name.toLowerCase())
      )

      const tradeImpact = relevantNews.reduce((sum, item) => 
        sum + item.tradeImpact.priceImpactEstimate, 0
      )

      return {
        country: country.name,
        flag: country.flag,
        updates: relevantNews.slice(0, 3).map(item => item.headline),
        tradeImpact: Math.round(tradeImpact * 100) / 100
      }
    }).filter(update => update.updates.length > 0 || update.tradeImpact !== 0)
  }

  // Helper methods
  private categorizeMarket(title: string): 'politics' | 'economics' | 'trade' | 'other' {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('tariff') || titleLower.includes('trade')) return 'trade'
    if (titleLower.includes('election') || titleLower.includes('president')) return 'politics'
    if (titleLower.includes('fed') || titleLower.includes('inflation')) return 'economics'
    return 'other'
  }

  private isTradeRelevant(title: string): boolean {
    const tradeKeywords = [
      'tariff', 'trade', 'import', 'export', 'manufacturing', 
      'supply chain', 'inflation', 'fed', 'recession', 'china',
      'europe', 'poland', 'czech', 'serbia', 'croatia'
    ]
    
    return tradeKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    )
  }

  private assessTradeImpact(title: string, probability: number): 'high' | 'medium' | 'low' {
    const highImpactKeywords = ['tariff', 'trade war', 'recession', 'fed']
    const hasHighImpact = highImpactKeywords.some(keyword => 
      title.toLowerCase().includes(keyword)
    )
    
    if (hasHighImpact && probability > 0.7) return 'high'
    if (hasHighImpact || probability > 0.8) return 'medium'
    return 'low'
  }

  private calculateRelevance(headline: string, content: string): number {
    const text = (headline + ' ' + content).toLowerCase()
    const relevantTerms = [
      'trade', 'tariff', 'import', 'export', 'manufacturing',
      'supply chain', 'poland', 'czech', 'serbia', 'croatia',
      'slavic', 'eastern europe'
    ]
    
    const matches = relevantTerms.filter(term => text.includes(term)).length
    return Math.min(matches / relevantTerms.length, 1.0)
  }

  private analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['increase', 'growth', 'expansion', 'opportunity', 'partnership', 'agreement']
    const negativeWords = ['decrease', 'decline', 'sanctions', 'conflict', 'disruption', 'crisis']
    
    const textLower = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => textLower.includes(word)).length
    const negativeCount = negativeWords.filter(word => textLower.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  private extractTradeImpact(text: string) {
    const affectedCountries: string[] = []
    const affectedProducts: string[] = []
    
    // Extract countries
    this.slavicCountries.forEach(country => {
      if (text.toLowerCase().includes(country.name.toLowerCase())) {
        affectedCountries.push(country.code)
      }
    })
    
    // Add major trade partners
    const majorCountries = ['US', 'CN', 'DE', 'JP', 'GB', 'FR', 'IT', 'CA']
    majorCountries.forEach(country => {
      const countryNames = {
        'US': 'united states',
        'CN': 'china',
        'DE': 'germany',
        'JP': 'japan',
        'GB': 'britain',
        'FR': 'france',
        'IT': 'italy',
        'CA': 'canada'
      }
      
      if (text.toLowerCase().includes(countryNames[country as keyof typeof countryNames])) {
        affectedCountries.push(country)
      }
    })

    // Extract products
    const products = [
      'electronics', 'automotive', 'pharmaceuticals', 'machinery',
      'textiles', 'food', 'energy', 'metals', 'chemicals', 'software'
    ]
    
    products.forEach(product => {
      if (text.toLowerCase().includes(product)) {
        affectedProducts.push(product)
      }
    })

    return {
      affectedCountries: [...new Set(affectedCountries)],
      affectedProducts: [...new Set(affectedProducts)],
      priceImpactEstimate: Math.random() * 10 // Simplified for demo
    }
  }

  private getAffectedCountries(title: string): string[] {
    const countries: string[] = []
    
    this.slavicCountries.forEach(country => {
      if (title.toLowerCase().includes(country.name.toLowerCase())) {
        countries.push(country.code)
      }
    })
    
    if (title.toLowerCase().includes('china')) countries.push('CN')
    if (title.toLowerCase().includes('europe')) countries.push('EU')
    if (title.toLowerCase().includes('america')) countries.push('US')
    
    return countries.length > 0 ? countries : ['Global']
  }

  private getStockTradeCountries(ticker: string): string[] {
    const stockCountries: { [key: string]: string[] } = {
      'MSFT': ['PL', 'CZ', 'SK'], // Microsoft has major operations in these countries
      'AAPL': ['CZ', 'PL'], // Apple supply chain
      'F': ['PL', 'SK'], // Ford manufacturing
      'CAT': ['PL', 'CZ', 'BG'], // Caterpillar construction
      'BA': ['PL', 'CZ'], // Boeing aerospace
      'JNJ': ['PL', 'CZ', 'HR'], // J&J pharmaceuticals
      'PFE': ['PL', 'BG', 'RS'], // Pfizer pharma
      'XOM': ['HR', 'BG'] // ExxonMobil energy
    }
    
    return stockCountries[ticker] || []
  }

  private getStockTradeProducts(ticker: string): string[] {
    const stockProducts: { [key: string]: string[] } = {
      'MSFT': ['software', 'cloud services', 'hardware'],
      'AAPL': ['electronics', 'semiconductors', 'consumer goods'],
      'F': ['automotive', 'auto parts', 'machinery'],
      'CAT': ['construction equipment', 'industrial machinery'],
      'BA': ['aircraft', 'aerospace', 'defense'],
      'JNJ': ['pharmaceuticals', 'medical devices'],
      'PFE': ['pharmaceuticals', 'vaccines', 'biotechnology'],
      'XOM': ['energy', 'oil', 'petrochemicals']
    }
    
    return stockProducts[ticker] || []
  }

  // Mock data for demo purposes
  private getMockPolymarketPredictions(): PolymarketPrediction[] {
    return [
      {
        title: 'Will Trump reduce tariffs on Poland by March 2025?',
        slug: 'trump-poland-tariffs-march-2025',
        probability: 0.72,
        volume: 2450000,
        endDate: '2025-03-31',
        category: 'trade',
        relevantToTrade: true,
        tradeImpact: 'high'
      },
      {
        title: 'Will EU-US trade deal include Czech Republic exemptions?',
        slug: 'eu-us-czech-exemptions',
        probability: 0.58,
        volume: 1890000,
        endDate: '2025-06-30',
        category: 'trade',
        relevantToTrade: true,
        tradeImpact: 'medium'
      },
      {
        title: 'Will Serbia join EU trade bloc by 2026?',
        slug: 'serbia-eu-trade-2026',
        probability: 0.34,
        volume: 890000,
        endDate: '2026-01-01',
        category: 'politics',
        relevantToTrade: true,
        tradeImpact: 'high'
      }
    ]
  }

  private getMockBloombergNews(): NewsIntelligence[] {
    return [
      {
        source: 'bloomberg',
        headline: 'Poland IT Sector Sees Record Growth as US Partnerships Expand',
        summary: 'Polish technology companies report 45% growth in US contracts, driven by AI and cybersecurity partnerships',
        timestamp: new Date().toISOString(),
        relevance: 0.95,
        sentiment: 'positive',
        tradeImpact: {
          affectedCountries: ['PL', 'US'],
          affectedProducts: ['software', 'IT services'],
          priceImpactEstimate: 8.5
        }
      },
      {
        source: 'bloomberg',
        headline: 'Czech Automotive Exports to US Hit All-Time High',
        summary: 'Czech Republic automotive parts exports surge 28% as US automakers diversify supply chains away from China',
        timestamp: new Date().toISOString(),
        relevance: 0.88,
        sentiment: 'positive',
        tradeImpact: {
          affectedCountries: ['CZ', 'US'],
          affectedProducts: ['automotive', 'machinery'],
          priceImpactEstimate: 6.2
        }
      }
    ]
  }

  private getMockTruthSocialData(): NewsIntelligence[] {
    return [
      {
        source: 'truthsocial',
        headline: 'Truth Social: Great trade deals with our European allies!',
        summary: 'Positive sentiment about expanding trade relationships with European partners',
        timestamp: new Date().toISOString(),
        relevance: 0.7,
        sentiment: 'positive',
        tradeImpact: {
          affectedCountries: ['EU', 'US'],
          affectedProducts: ['general trade'],
          priceImpactEstimate: 3.2
        }
      }
    ]
  }

  private getMockStockData(): NewsIntelligence[] {
    return [
      {
        source: 'insider',
        headline: 'MSFT: +2.3% on Poland IT partnership announcement',
        summary: 'Microsoft stock rises on expanded Polish technology partnerships',
        timestamp: new Date().toISOString(),
        relevance: 0.85,
        sentiment: 'positive',
        tradeImpact: {
          affectedCountries: ['PL', 'US'],
          affectedProducts: ['software', 'cloud services'],
          priceImpactEstimate: 4.1
        }
      }
    ]
  }

  private getMockMarketIntelligence(): MarketIntelligence {
    return {
      predictions: this.getMockPolymarketPredictions(),
      news: [...this.getMockBloombergNews(), ...this.getMockTruthSocialData(), ...this.getMockStockData()],
      alerts: [
        {
          type: 'trade_policy',
          severity: 'high',
          message: '72% probability of Poland tariff reduction by March 2025',
          affectedCountries: ['PL', 'US'],
          timeframe: '3-6 months'
        }
      ],
      slavicCountryUpdates: [
        {
          country: 'Poland',
          flag: '🇵🇱',
          updates: ['IT sector growth +45%', 'US partnership expansion', 'Manufacturing investment surge'],
          tradeImpact: 8.5
        },
        {
          country: 'Czech Republic', 
          flag: '🇨🇿',
          updates: ['Automotive exports +28%', 'Supply chain diversification', 'Tech sector expansion'],
          tradeImpact: 6.2
        },
        {
          country: 'Serbia',
          flag: '🇷🇸',
          updates: ['IT outsourcing boom +52%', 'Agricultural exports rising', 'EU integration progress'],
          tradeImpact: 4.8
        }
      ]
    }
  }

  getSlavicCountries() {
    return this.slavicCountries
  }
}

export const marketIntelligenceAPI = new MarketIntelligenceAPI()
