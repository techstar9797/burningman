import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Expert finder request:', body)

    const { expertise, location, language, urgency } = body.message?.toolCalls?.[0]?.function?.arguments || {}

    // Mock expert database - in real implementation, integrate with professional networks
    const mockExperts = [
      {
        id: 'expert_1',
        name: 'Dr. Raj Patel',
        expertise: ['Electronics', 'Technology', 'Manufacturing'],
        location: 'Mumbai, India',
        languages: ['hi-IN', 'en-US', 'gu-IN'],
        rating: 4.9,
        responseTime: '< 5 minutes',
        hourlyRate: 25,
        currency: 'USD',
        specialties: ['Local sourcing', 'Quality assessment', 'Supplier networks'],
        availability: 'Available now',
        bio: 'Electronics engineer with 15 years in local manufacturing and global supply chains'
      },
      {
        id: 'expert_2', 
        name: 'Li Wei Chen',
        expertise: ['Manufacturing', 'Textiles', 'Export'],
        location: 'Shenzhen, China',
        languages: ['zh-CN', 'en-US'],
        rating: 4.8,
        responseTime: '< 10 minutes',
        hourlyRate: 30,
        currency: 'USD',
        specialties: ['Factory connections', 'Quality control', 'Logistics'],
        availability: 'Available in 15 minutes',
        bio: 'Manufacturing consultant specializing in electronics and textile production'
      },
      {
        id: 'expert_3',
        name: 'Ahmed Al-Rashid',
        expertise: ['Oil & Gas', 'Energy', 'Commodities'],
        location: 'Dubai, UAE',
        languages: ['ar-SA', 'en-US', 'ar-AE'],
        rating: 4.7,
        responseTime: '< 15 minutes', 
        hourlyRate: 50,
        currency: 'USD',
        specialties: ['Energy markets', 'Commodity trading', 'Regional partnerships'],
        availability: 'Available after 2 PM local time',
        bio: 'Energy sector analyst with deep knowledge of Middle East markets and commodity pricing'
      }
    ]

    // Filter experts by criteria
    const matchingExperts = mockExperts.filter(expert => {
      const expertiseMatch = expert.expertise.some(exp => 
        exp.toLowerCase().includes(expertise?.toLowerCase() || '') ||
        expertise?.toLowerCase().includes(exp.toLowerCase())
      )
      
      const locationMatch = !location || 
        expert.location.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(expert.location.toLowerCase())
        
      const languageMatch = !language ||
        expert.languages.some(lang => lang.startsWith(language))

      return expertiseMatch && locationMatch && languageMatch
    })

    // Sort by urgency and availability
    const sortedExperts = matchingExperts.sort((a, b) => {
      if (urgency === 'high') {
        return a.responseTime.localeCompare(b.responseTime)
      }
      return b.rating - a.rating
    })

    const response = {
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id,
          result: {
            success: true,
            expertsFound: sortedExperts.length,
            experts: sortedExperts.slice(0, 3), // Top 3 matches
            message: sortedExperts.length > 0 
              ? `I found ${sortedExperts.length} local experts who can help you with ${expertise} in ${location}. Here are the top matches:`
              : `No experts found for ${expertise} in ${location}. Let me connect you with our global network or suggest alternatives.`,
            connectionOptions: [
              'Instant voice call with real-time translation',
              'Schedule consultation at convenient time',
              'Text-based consultation with cultural context',
              'Group consultation with multiple experts'
            ],
            estimatedCost: sortedExperts.length > 0 
              ? `$${sortedExperts[0].hourlyRate}-${sortedExperts[Math.min(2, sortedExperts.length-1)].hourlyRate}/hour`
              : 'Free community support available'
          }
        }
      ]
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Expert finder API error:', error)
    return NextResponse.json(
      { error: 'Expert finder failed' },
      { status: 500 }
    )
  }
}
