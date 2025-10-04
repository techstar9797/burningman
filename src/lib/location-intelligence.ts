// Location Intelligence using Apify Google Maps Integration
// https://console.apify.com/actors/nwua9Gu5YrADL7ZDj/input

import { apiConfig } from '@/config/api'

export interface LocationData {
  city: string
  country: string
  countryCode: string
  region: string
  coordinates: {
    latitude: number
    longitude: number
  }
  timezone: string
  primaryLanguage: string
  secondaryLanguages: string[]
  currency: string
  businessHours: {
    open: string
    close: string
    timezone: string
  }
  localCustoms: string[]
  tradingPartners: string[]
}

export interface BusinessLocation {
  name: string
  address: string
  phoneNumber: string
  category: string
  rating: number
  reviews: number
  priceLevel: number
  coordinates: {
    latitude: number
    longitude: number
  }
  businessHours: any
  website?: string
  languages: string[]
}

export interface LocationIntelligence {
  userLocation: LocationData
  nearbyBusinesses: BusinessLocation[]
  marketContext: {
    economicActivity: string
    majorIndustries: string[]
    tradingOpportunities: string[]
    culturalNotes: string[]
  }
  communicationContext: {
    preferredLanguages: string[]
    businessEtiquette: string[]
    negotiationStyle: string
    timeOrientation: string
  }
}

class LocationIntelligenceAPI {
  private apifyToken = apiConfig.apify.token
  private baseUrl = 'https://api.apify.com/v2'
  private googleMapsActorId = 'nwua9Gu5YrADL7ZDj'

  // Get location data from coordinates or address
  async getLocationIntelligence(
    query: string | { latitude: number; longitude: number }
  ): Promise<LocationIntelligence> {
    console.log('🗺️ Getting location intelligence for:', query)

    try {
      // Use Apify Google Maps actor to get location data
      const locationData = await this.runGoogleMapsActor(query)
      const processedLocation = this.processLocationData(locationData)
      
      // Get nearby businesses for local context
      const businesses = await this.findLocalBusinesses(processedLocation.coordinates)
      
      // Generate market and communication context
      const marketContext = this.generateMarketContext(processedLocation)
      const communicationContext = this.generateCommunicationContext(processedLocation)

      return {
        userLocation: processedLocation,
        nearbyBusinesses: businesses,
        marketContext,
        communicationContext
      }
    } catch (error) {
      console.error('Location intelligence error:', error)
      return this.getMockLocationIntelligence(query)
    }
  }

  // Get user location from browser geolocation
  async getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported')
        resolve(null)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          console.log('📍 User location obtained:', coords)
          resolve(coords)
        },
        (error) => {
          console.warn('Geolocation error:', error)
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      )
    })
  }

  // Find local businesses for price intelligence
  async findLocalBusinesses(
    location: { latitude: number; longitude: number },
    category: string = 'restaurant'
  ): Promise<BusinessLocation[]> {
    console.log('🏪 Finding local businesses near:', location)

    try {
      const response = await this.runGoogleMapsActor({
        latitude: location.latitude,
        longitude: location.longitude,
        searchQuery: category,
        maxResults: 20
      })

      return this.processBusinessData(response)
    } catch (error) {
      console.error('Local business search error:', error)
      return this.getMockBusinesses(location, category)
    }
  }

  // Get location context for voice calls
  async getCallLocationContext(
    callerLocation: string,
    targetLocation: string
  ): Promise<{
    timezoneDifference: number
    culturalContext: string[]
    businessEtiquette: string[]
    communicationTips: string[]
    optimalCallTimes: string[]
  }> {
    console.log('📞 Getting call context between:', callerLocation, 'and', targetLocation)

    try {
      const [callerData, targetData] = await Promise.all([
        this.getLocationIntelligence(callerLocation),
        this.getLocationIntelligence(targetLocation)
      ])

      return this.generateCallContext(callerData, targetData)
    } catch (error) {
      console.error('Call context error:', error)
      return this.getMockCallContext(callerLocation, targetLocation)
    }
  }

  // Private helper methods
  private async runGoogleMapsActor(input: any): Promise<any> {
    const payload = {
      searchStringsArray: typeof input === 'string' ? [input] : [`${input.latitude},${input.longitude}`],
      maxCrawledPlacesPerSearch: 20,
      language: 'en',
      maxReviews: 5,
      maxImages: 3,
      exportPlaceUrls: false,
      additionalInfo: true,
      includeHistogram: false,
      includeOpeningHours: true,
      includePeopleAlsoSearch: false,
      maxAutomaticZoomOut: 2
    }

    const response = await fetch(`${this.baseUrl}/acts/${this.googleMapsActorId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apifyToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Google Maps actor failed: ${response.status}`)
    }

    const runInfo = await response.json()
    return await this.waitForCompletion(runInfo.data.id)
  }

  private async waitForCompletion(runId: string): Promise<any> {
    let attempts = 0
    const maxAttempts = 20

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

  private processLocationData(data: any): LocationData {
    // Process Google Maps data to extract location intelligence
    const firstResult = Array.isArray(data) ? data[0] : data
    
    if (!firstResult) {
      throw new Error('No location data found')
    }

    return {
      city: firstResult.city || 'Unknown City',
      country: firstResult.country || 'Unknown Country',
      countryCode: this.getCountryCode(firstResult.country),
      region: firstResult.region || firstResult.state || 'Unknown Region',
      coordinates: {
        latitude: firstResult.location?.lat || 0,
        longitude: firstResult.location?.lng || 0
      },
      timezone: this.getTimezone(firstResult.country),
      primaryLanguage: this.getPrimaryLanguage(firstResult.country),
      secondaryLanguages: this.getSecondaryLanguages(firstResult.country),
      currency: this.getCurrency(firstResult.country),
      businessHours: this.getBusinessHours(firstResult.country),
      localCustoms: this.getLocalCustoms(firstResult.country),
      tradingPartners: this.getTradingPartners(firstResult.country)
    }
  }

  private processBusinessData(data: any): BusinessLocation[] {
    if (!Array.isArray(data)) return []

    return data.map((business: any) => ({
      name: business.title || business.name || 'Unknown Business',
      address: business.address || 'Address not available',
      phoneNumber: business.phoneNumber || business.phone || '',
      category: business.categoryName || business.category || 'General',
      rating: business.totalScore || business.rating || 0,
      reviews: business.reviewsCount || business.reviews || 0,
      priceLevel: business.priceLevel || 2,
      coordinates: {
        latitude: business.location?.lat || 0,
        longitude: business.location?.lng || 0
      },
      businessHours: business.openingHours || {},
      website: business.website || business.url,
      languages: this.detectBusinessLanguages(business.address, business.country)
    })).filter(business => business.name !== 'Unknown Business')
  }

  private generateMarketContext(location: LocationData) {
    const marketContexts: { [key: string]: any } = {
      'Serbia': {
        economicActivity: 'Emerging market with strong IT and agricultural sectors',
        majorIndustries: ['Information Technology', 'Agriculture', 'Manufacturing', 'Tourism'],
        tradingOpportunities: ['IT outsourcing', 'Agricultural exports', 'Tourism services'],
        culturalNotes: ['Relationship-focused business culture', 'Hospitality important', 'Trust-building essential']
      },
      'China': {
        economicActivity: 'World\'s second-largest economy and manufacturing hub',
        majorIndustries: ['Manufacturing', 'Technology', 'Electronics', 'Textiles'],
        tradingOpportunities: ['Manufacturing partnerships', 'Technology transfer', 'Supply chain integration'],
        culturalNotes: ['Hierarchy respect important', 'Long-term relationship focus', 'Face-saving crucial']
      },
      'India': {
        economicActivity: 'Fast-growing service economy with strong IT sector',
        majorIndustries: ['Information Technology', 'Pharmaceuticals', 'Textiles', 'Chemicals'],
        tradingOpportunities: ['IT services', 'Pharmaceutical manufacturing', 'Digital transformation'],
        culturalNotes: ['Relationship-oriented', 'Respect for seniority', 'Family business traditions']
      },
      'Vietnam': {
        economicActivity: 'Rapidly industrializing with strong manufacturing growth',
        majorIndustries: ['Electronics', 'Textiles', 'Agriculture', 'Tourism'],
        tradingOpportunities: ['Manufacturing relocation', 'Electronics assembly', 'Agricultural exports'],
        culturalNotes: ['Collective decision making', 'Respect for authority', 'Patience in negotiations']
      }
    }

    return marketContexts[location.country] || {
      economicActivity: 'Diverse economic activity',
      majorIndustries: ['Services', 'Manufacturing', 'Agriculture'],
      tradingOpportunities: ['General trade', 'Service partnerships'],
      culturalNotes: ['Professional business culture', 'Respectful communication']
    }
  }

  private generateCommunicationContext(location: LocationData) {
    const commContexts: { [key: string]: any } = {
      'Serbia': {
        preferredLanguages: ['sr-RS', 'en-US'],
        businessEtiquette: ['Warm greetings', 'Coffee culture important', 'Personal relationships matter'],
        negotiationStyle: 'Relationship-based with patience for trust building',
        timeOrientation: 'Flexible time approach, relationship over schedule'
      },
      'China': {
        preferredLanguages: ['zh-CN', 'en-US'],
        businessEtiquette: ['Formal greetings', 'Business card ceremony', 'Hierarchy respect'],
        negotiationStyle: 'Indirect communication, consensus building, face-saving',
        timeOrientation: 'Long-term perspective, patience for relationship development'
      },
      'India': {
        preferredLanguages: ['hi-IN', 'en-US'],
        businessEtiquette: ['Namaste greetings', 'Respect for elders', 'Family inquiries'],
        negotiationStyle: 'Relationship-focused, consensus-seeking, win-win approach',
        timeOrientation: 'Flexible time, relationship building over punctuality'
      },
      'Vietnam': {
        preferredLanguages: ['vi-VN', 'en-US'],
        businessEtiquette: ['Formal respect', 'Group decision making', 'Authority deference'],
        negotiationStyle: 'Patient, collective consultation, harmony preservation',
        timeOrientation: 'Process-oriented, thorough discussion preferred'
      }
    }

    return commContexts[location.country] || {
      preferredLanguages: [location.primaryLanguage, 'en-US'],
      businessEtiquette: ['Professional courtesy', 'Respectful communication'],
      negotiationStyle: 'Direct but respectful communication',
      timeOrientation: 'Time-conscious with flexibility for relationship building'
    }
  }

  private generateCallContext(callerData: LocationIntelligence, targetData: LocationIntelligence) {
    const callerTz = this.getTimezoneOffset(callerData.userLocation.timezone)
    const targetTz = this.getTimezoneOffset(targetData.userLocation.timezone)
    const timezoneDifference = targetTz - callerTz

    return {
      timezoneDifference,
      culturalContext: [
        `Caller from ${callerData.userLocation.city}, ${callerData.userLocation.country}`,
        `Target in ${targetData.userLocation.city}, ${targetData.userLocation.country}`,
        `Cultural bridge: ${callerData.communicationContext.negotiationStyle} ↔ ${targetData.communicationContext.negotiationStyle}`
      ],
      businessEtiquette: [
        ...callerData.communicationContext.businessEtiquette.slice(0, 2),
        ...targetData.communicationContext.businessEtiquette.slice(0, 2)
      ],
      communicationTips: [
        `Caller prefers: ${callerData.communicationContext.timeOrientation}`,
        `Target expects: ${targetData.communicationContext.timeOrientation}`,
        'Allow extra time for cultural context and relationship building'
      ],
      optimalCallTimes: this.calculateOptimalCallTimes(timezoneDifference)
    }
  }

  // Helper methods
  private getCountryCode(country: string): string {
    const countryCodes: { [key: string]: string } = {
      'Serbia': 'RS', 'China': 'CN', 'India': 'IN', 'Vietnam': 'VN',
      'Poland': 'PL', 'Czech Republic': 'CZ', 'Croatia': 'HR',
      'United States': 'US', 'Germany': 'DE', 'France': 'FR'
    }
    return countryCodes[country] || 'XX'
  }

  private getTimezone(country: string): string {
    const timezones: { [key: string]: string } = {
      'Serbia': 'Europe/Belgrade',
      'China': 'Asia/Shanghai', 
      'India': 'Asia/Kolkata',
      'Vietnam': 'Asia/Ho_Chi_Minh',
      'Poland': 'Europe/Warsaw',
      'Czech Republic': 'Europe/Prague',
      'United States': 'America/New_York'
    }
    return timezones[country] || 'UTC'
  }

  private getPrimaryLanguage(country: string): string {
    const languages: { [key: string]: string } = {
      'Serbia': 'sr-RS',
      'China': 'zh-CN',
      'India': 'hi-IN', 
      'Vietnam': 'vi-VN',
      'Poland': 'pl-PL',
      'Czech Republic': 'cs-CZ',
      'Croatia': 'hr-HR',
      'United States': 'en-US'
    }
    return languages[country] || 'en-US'
  }

  private getSecondaryLanguages(country: string): string[] {
    const secondaryLangs: { [key: string]: string[] } = {
      'Serbia': ['en-US', 'de-DE', 'ru-RU'],
      'China': ['en-US', 'ja-JP', 'ko-KR'],
      'India': ['en-US', 'bn-IN', 'te-IN'],
      'Vietnam': ['en-US', 'fr-FR', 'zh-CN'],
      'Poland': ['en-US', 'de-DE', 'ru-RU'],
      'Czech Republic': ['en-US', 'de-DE', 'sk-SK']
    }
    return secondaryLangs[country] || ['en-US']
  }

  private getCurrency(country: string): string {
    const currencies: { [key: string]: string } = {
      'Serbia': 'RSD', 'China': 'CNY', 'India': 'INR', 'Vietnam': 'VND',
      'Poland': 'PLN', 'Czech Republic': 'CZK', 'Croatia': 'HRK',
      'United States': 'USD'
    }
    return currencies[country] || 'USD'
  }

  private getBusinessHours(country: string) {
    const businessHours: { [key: string]: any } = {
      'Serbia': { open: '09:00', close: '17:00', timezone: 'Europe/Belgrade' },
      'China': { open: '09:00', close: '18:00', timezone: 'Asia/Shanghai' },
      'India': { open: '10:00', close: '19:00', timezone: 'Asia/Kolkata' },
      'Vietnam': { open: '08:00', close: '17:00', timezone: 'Asia/Ho_Chi_Minh' },
      'United States': { open: '09:00', close: '17:00', timezone: 'America/New_York' }
    }
    return businessHours[country] || { open: '09:00', close: '17:00', timezone: 'UTC' }
  }

  private getLocalCustoms(country: string): string[] {
    const customs: { [key: string]: string[] } = {
      'Serbia': ['Coffee meetings common', 'Hospitality culture', 'Personal relationship focus'],
      'China': ['Business card etiquette', 'Gift giving customs', 'Guanxi relationships'],
      'India': ['Namaste greetings', 'Respect for elders', 'Family business traditions'],
      'Vietnam': ['Formal respect', 'Collective decision making', 'Patience valued'],
      'Poland': ['Punctuality important', 'Formal business style', 'Quality focus']
    }
    return customs[country] || ['Professional courtesy', 'Respectful communication']
  }

  private getTradingPartners(country: string): string[] {
    const partners: { [key: string]: string[] } = {
      'Serbia': ['Germany', 'Italy', 'Bosnia', 'Russia', 'China', 'United States'],
      'China': ['United States', 'Japan', 'South Korea', 'Germany', 'Australia'],
      'India': ['United States', 'China', 'UAE', 'Saudi Arabia', 'Singapore'],
      'Vietnam': ['China', 'United States', 'Japan', 'South Korea', 'Thailand'],
      'Poland': ['Germany', 'Czech Republic', 'United Kingdom', 'United States', 'France']
    }
    return partners[country] || ['United States', 'European Union', 'China']
  }

  private detectBusinessLanguages(address: string, country: string): string[] {
    const baseLanguages = [this.getPrimaryLanguage(country)]
    
    // Add English for international businesses
    if (!baseLanguages.includes('en-US')) {
      baseLanguages.push('en-US')
    }
    
    // Add regional languages based on location
    const regionalLangs = this.getSecondaryLanguages(country)
    return [...new Set([...baseLanguages, ...regionalLangs.slice(0, 2)])]
  }

  private getTimezoneOffset(timezone: string): number {
    // Simplified timezone offset calculation
    const offsets: { [key: string]: number } = {
      'Europe/Belgrade': 1,
      'Asia/Shanghai': 8,
      'Asia/Kolkata': 5.5,
      'Asia/Ho_Chi_Minh': 7,
      'Europe/Warsaw': 1,
      'America/New_York': -5
    }
    return offsets[timezone] || 0
  }

  private calculateOptimalCallTimes(timezoneDiff: number): string[] {
    const optimalHours = []
    
    // Find overlapping business hours
    for (let hour = 9; hour <= 17; hour++) {
      const targetHour = hour + timezoneDiff
      if (targetHour >= 9 && targetHour <= 17) {
        optimalHours.push(`${hour}:00 - ${hour + 1}:00`)
      }
    }
    
    return optimalHours.length > 0 ? optimalHours : ['Schedule outside business hours with advance notice']
  }

  // Mock data for demo
  private getMockLocationIntelligence(query: any): LocationIntelligence {
    return {
      userLocation: {
        city: 'Belgrade',
        country: 'Serbia',
        countryCode: 'RS',
        region: 'Central Serbia',
        coordinates: { latitude: 44.7866, longitude: 20.4489 },
        timezone: 'Europe/Belgrade',
        primaryLanguage: 'sr-RS',
        secondaryLanguages: ['en-US', 'de-DE'],
        currency: 'RSD',
        businessHours: { open: '09:00', close: '17:00', timezone: 'Europe/Belgrade' },
        localCustoms: ['Coffee culture', 'Hospitality focus', 'Relationship building'],
        tradingPartners: ['Germany', 'Italy', 'China', 'United States']
      },
      nearbyBusinesses: this.getMockBusinesses({ latitude: 44.7866, longitude: 20.4489 }, 'restaurant'),
      marketContext: {
        economicActivity: 'Emerging market with strong IT and agricultural sectors',
        majorIndustries: ['Information Technology', 'Agriculture', 'Manufacturing'],
        tradingOpportunities: ['IT outsourcing', 'Agricultural exports', 'Tourism'],
        culturalNotes: ['Relationship-focused', 'Hospitality culture', 'Trust important']
      },
      communicationContext: {
        preferredLanguages: ['sr-RS', 'en-US'],
        businessEtiquette: ['Warm greetings', 'Coffee meetings', 'Personal relationships'],
        negotiationStyle: 'Relationship-based with trust building',
        timeOrientation: 'Flexible time, relationship over schedule'
      }
    }
  }

  private getMockBusinesses(location: any, category: string): BusinessLocation[] {
    return [
      {
        name: 'Raspberry Export Co.',
        address: 'Bulevar Oslobođenja 123, Novi Sad, Serbia',
        phoneNumber: '+381 21 123 456',
        category: 'Agricultural Export',
        rating: 4.8,
        reviews: 127,
        priceLevel: 2,
        coordinates: { latitude: 45.2671, longitude: 19.8335 },
        businessHours: {},
        languages: ['sr-RS', 'en-US', 'de-DE']
      }
    ]
  }

  private getMockCallContext(caller: string, target: string) {
    return {
      timezoneDifference: 7, // Example: Belgrade to Chicago
      culturalContext: [`Caller from ${caller}`, `Target in ${target}`, 'Cross-cultural business communication'],
      businessEtiquette: ['Warm greetings', 'Relationship focus', 'Professional courtesy'],
      communicationTips: ['Allow time for relationship building', 'Respect cultural differences'],
      optimalCallTimes: ['15:00 - 17:00', '20:00 - 22:00']
    }
  }
}

export const locationIntelligenceAPI = new LocationIntelligenceAPI()
