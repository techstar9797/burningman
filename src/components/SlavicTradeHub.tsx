'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  Factory,
  Mic,
  Languages,
  ArrowRightLeft,
  MapPin,
  Clock,
  Users,
  MessageCircle,
  Volume2,
  Play,
  Pause
} from 'lucide-react'

interface SlavicTradeData {
  country: string
  flag: string
  usExports: Array<{ product: string; value: string; growth: number }>
  usImports: Array<{ product: string; value: string; growth: number }>
  totalTrade: string
  keyOpportunities: string[]
}

interface LiveConversation {
  id: string
  participants: Array<{ name: string; location: string; language: string; flag: string }>
  messages: Array<{
    speaker: string
    originalText: string
    translatedText?: string
    timestamp: string
    language: string
  }>
  topic: string
  tradeValue: string
}

export default function GlobalTradeHub() {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'conversation' | 'opportunities' | 'analytics'>('overview')
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<LiveConversation | null>(null)

  // Global trade partners data including major economies
  const globalTradeData: SlavicTradeData[] = [
    // Major Asian Trading Partners
    {
      country: 'China',
      flag: '🇨🇳',
      usExports: [
        { product: 'Semiconductors', value: '$12.1B', growth: 8.2 },
        { product: 'Aircraft', value: '$8.9B', growth: -2.1 },
        { product: 'Soybeans', value: '$6.2B', growth: 15.3 },
        { product: 'Medical Devices', value: '$4.8B', growth: 12.7 }
      ],
      usImports: [
        { product: 'Electronics', value: '$156B', growth: 5.4 },
        { product: 'Machinery', value: '$89B', growth: 7.8 },
        { product: 'Textiles', value: '$34B', growth: -3.2 },
        { product: 'Toys & Games', value: '$28B', growth: 2.1 }
      ],
      totalTrade: '$690B',
      keyOpportunities: [
        'AI technology partnerships',
        'Green energy cooperation',
        'Supply chain diversification',
        'Financial services expansion'
      ]
    },
    {
      country: 'India',
      flag: '🇮🇳',
      usExports: [
        { product: 'Aircraft Parts', value: '$3.2B', growth: 22.1 },
        { product: 'Medical Equipment', value: '$2.8B', growth: 18.5 },
        { product: 'Semiconductors', value: '$2.1B', growth: 35.2 },
        { product: 'Industrial Machinery', value: '$1.9B', growth: 16.8 }
      ],
      usImports: [
        { product: 'IT Services', value: '$45B', growth: 28.4 },
        { product: 'Pharmaceuticals', value: '$12B', growth: 15.7 },
        { product: 'Textiles', value: '$8.5B', growth: 8.9 },
        { product: 'Diamonds', value: '$6.2B', growth: 12.3 }
      ],
      totalTrade: '$146B',
      keyOpportunities: [
        'IT outsourcing expansion',
        'Pharmaceutical manufacturing',
        'Digital services growth',
        'Clean energy partnerships'
      ]
    },
    {
      country: 'Vietnam',
      flag: '🇻🇳',
      usExports: [
        { product: 'Agricultural Equipment', value: '$1.8B', growth: 25.3 },
        { product: 'Medical Devices', value: '$1.2B', growth: 32.1 },
        { product: 'Industrial Machinery', value: '$980M', growth: 18.7 },
        { product: 'Semiconductors', value: '$750M', growth: 45.2 }
      ],
      usImports: [
        { product: 'Electronics', value: '$89B', growth: 42.1 },
        { product: 'Textiles & Apparel', value: '$18B', growth: 15.8 },
        { product: 'Footwear', value: '$7.2B', growth: 22.4 },
        { product: 'Furniture', value: '$5.8B', growth: 18.9 }
      ],
      totalTrade: '$139B',
      keyOpportunities: [
        'Manufacturing supply chain shift',
        'Technology transfer programs',
        'Agricultural modernization',
        'Infrastructure development'
      ]
    },
    {
      country: 'Poland',
      flag: '🇵🇱',
      usExports: [
        { product: 'Aircraft Parts', value: '$2.1B', growth: 15.2 },
        { product: 'Semiconductors', value: '$1.8B', growth: 22.1 },
        { product: 'Medical Instruments', value: '$1.2B', growth: 18.5 },
        { product: 'Industrial Machinery', value: '$1.0B', growth: 12.3 }
      ],
      usImports: [
        { product: 'Furniture & Wood Products', value: '$3.2B', growth: 8.7 },
        { product: 'Auto Parts', value: '$2.8B', growth: 14.2 },
        { product: 'Electrical Machinery', value: '$2.1B', growth: 11.5 },
        { product: 'Pharmaceuticals', value: '$1.5B', growth: 25.3 }
      ],
      totalTrade: '$24.0B',
      keyOpportunities: [
        'Defense technology partnerships',
        'Clean energy infrastructure',
        'IT outsourcing expansion',
        'Automotive supply chain integration'
      ]
    },
    {
      country: 'Czech Republic',
      flag: '🇨🇿',
      usExports: [
        { product: 'Optical Instruments', value: '$1.2B', growth: 19.4 },
        { product: 'Aircraft Components', value: '$900M', growth: 16.8 },
        { product: 'Semiconductors', value: '$750M', growth: 28.2 },
        { product: 'Medical Devices', value: '$600M', growth: 21.1 }
      ],
      usImports: [
        { product: 'Automobiles', value: '$2.1B', growth: 7.3 },
        { product: 'Machine Tools', value: '$1.4B', growth: 12.8 },
        { product: 'Crystal Glassware', value: '$450M', growth: 5.2 },
        { product: 'Beer & Beverages', value: '$320M', growth: 18.7 }
      ],
      totalTrade: '$14.0B',
      keyOpportunities: [
        'Precision manufacturing partnerships',
        'Automotive technology exchange',
        'Luxury goods market expansion',
        'Tourism and hospitality services'
      ]
    },
    {
      country: 'Serbia',
      flag: '🇷🇸',
      usExports: [
        { product: 'Agricultural Equipment', value: '$180M', growth: 32.1 },
        { product: 'Software & IT Services', value: '$150M', growth: 45.8 },
        { product: 'Industrial Machinery', value: '$120M', growth: 28.4 },
        { product: 'Medical Supplies', value: '$95M', growth: 22.7 }
      ],
      usImports: [
        { product: 'Textiles & Apparel', value: '$220M', growth: 15.3 },
        { product: 'Frozen Raspberries', value: '$180M', growth: 12.8 },
        { product: 'IT Outsourcing Services', value: '$350M', growth: 52.4 },
        { product: 'Copper & Metals', value: '$140M', growth: 8.9 }
      ],
      totalTrade: '$1.4B',
      keyOpportunities: [
        'IT talent and software development',
        'Agricultural product processing',
        'Mining and metals partnerships',
        'Tourism and cultural exchange'
      ]
    },
    {
      country: 'France',
      flag: '🇫🇷',
      usExports: [
        { product: 'Aircraft Components', value: '$3.8B', growth: 12.4 },
        { product: 'Medical Equipment', value: '$2.9B', growth: 16.8 },
        { product: 'Industrial Machinery', value: '$2.2B', growth: 9.7 },
        { product: 'Semiconductors', value: '$1.8B', growth: 22.1 }
      ],
      usImports: [
        { product: 'Luxury Goods', value: '$8.9B', growth: 18.3 },
        { product: 'Wine & Spirits', value: '$4.2B', growth: 12.7 },
        { product: 'Pharmaceuticals', value: '$3.6B', growth: 15.9 },
        { product: 'Aerospace Parts', value: '$2.8B', growth: 8.4 }
      ],
      totalTrade: '$48.5B',
      keyOpportunities: [
        'Luxury market expansion',
        'Aerospace technology partnerships',
        'Pharmaceutical innovation',
        'Sustainable energy projects'
      ]
    },
    {
      country: 'Austria',
      flag: '🇦🇹',
      usExports: [
        { product: 'Medical Devices', value: '$1.2B', growth: 19.3 },
        { product: 'Industrial Equipment', value: '$980M', growth: 14.7 },
        { product: 'Precision Instruments', value: '$750M', growth: 21.8 },
        { product: 'Software Solutions', value: '$620M', growth: 28.4 }
      ],
      usImports: [
        { product: 'Machinery', value: '$2.1B', growth: 16.2 },
        { product: 'Musical Instruments', value: '$450M', growth: 8.9 },
        { product: 'Luxury Tourism', value: '$380M', growth: 24.1 },
        { product: 'Precision Manufacturing', value: '$290M', growth: 12.5 }
      ],
      totalTrade: '$7.8B',
      keyOpportunities: [
        'Precision manufacturing partnerships',
        'Medical technology innovation',
        'Luxury tourism services',
        'Classical music and arts exchange'
      ]
    },
    {
      country: 'Croatia',
      flag: '🇭🇷',
      usExports: [
        { product: 'Energy Products', value: '$120M', growth: 18.9 },
        { product: 'Medical Supplies', value: '$85M', growth: 24.1 },
        { product: 'Defense Equipment', value: '$75M', growth: 31.5 },
        { product: 'Industrial Equipment', value: '$65M', growth: 16.2 }
      ],
      usImports: [
        { product: 'Wine & Olive Oil', value: '$95M', growth: 22.3 },
        { product: 'Ship Components', value: '$110M', growth: 14.7 },
        { product: 'Pharmaceuticals', value: '$80M', growth: 19.8 },
        { product: 'Tourism Services', value: '$450M', growth: 35.2 }
      ],
      totalTrade: '$2.0B',
      keyOpportunities: [
        'Maritime industry partnerships',
        'Tourism and hospitality expansion',
        'Renewable energy projects',
        'Pharmaceutical research collaboration'
      ]
    }
  ]

  // Mock live conversation between Serbian supplier and US buyer
  const mockConversation: LiveConversation = {
    id: 'serbian_us_trade_001',
    participants: [
      { name: 'Marko Petrović', location: 'Belgrade, Serbia', language: 'sr-RS', flag: '🇷🇸' },
      { name: 'John Smith', location: 'Chicago, USA', language: 'en-US', flag: '🇺🇸' }
    ],
    messages: [
      {
        speaker: 'John Smith',
        originalText: 'Hello, I\'m interested in your raspberry export business. What are your current prices?',
        translatedText: 'Zdravo, zanima me vaš izvoz malina. Koje su vaše trenutne cene?',
        timestamp: '14:32:15',
        language: 'en-US'
      },
      {
        speaker: 'Marko Petrović',
        originalText: 'Zdravo! Cena za zamrznute maline je trenutno 3.50 evra po kilogramu. Imamo odličan kvalitet iz Šumadije.',
        translatedText: 'Hello! The price for frozen raspberries is currently 3.50 euros per kilogram. We have excellent quality from Šumadija region.',
        timestamp: '14:32:45',
        language: 'sr-RS'
      },
      {
        speaker: 'John Smith',
        originalText: 'That sounds competitive. What about shipping costs and delivery times to Chicago?',
        translatedText: 'To zvuči konkurentno. Šta je sa troškovima transporta i vremenom dostave do Čikaga?',
        timestamp: '14:33:12',
        language: 'en-US'
      },
      {
        speaker: 'Marko Petrović',
        originalText: 'Transport košta 0.25 evra po kilogramu, dostava traje 14-18 dana. Možemo da organizujemo redovne isporuke.',
        translatedText: 'Shipping costs 0.25 euros per kilogram, delivery takes 14-18 days. We can organize regular deliveries.',
        timestamp: '14:33:38',
        language: 'sr-RS'
      },
      {
        speaker: 'John Smith',
        originalText: 'Excellent! Can you handle 5 tons monthly? What about quality certifications?',
        translatedText: 'Odlično! Možete li da obradite 5 tona mesečno? Šta je sa sertifikatima kvaliteta?',
        timestamp: '14:34:05',
        language: 'en-US'
      },
      {
        speaker: 'Marko Petrović',
        originalText: 'Da, bez problema! Imamo EU sertifikate i HACCP standarde. Mogu da pošaljem uzorke sledeće nedelje.',
        translatedText: 'Yes, no problem! We have EU certificates and HACCP standards. I can send samples next week.',
        timestamp: '14:34:28',
        language: 'sr-RS'
      }
    ],
    topic: 'Frozen Raspberry Export Contract',
    tradeValue: '$18,750/month'
  }

  useEffect(() => {
    // Simulate live conversation updates
    if (isConversationActive) {
      const timer = setInterval(() => {
        // Add new message every 30 seconds for demo
        const newMessage = {
          speaker: Math.random() > 0.5 ? 'John Smith' : 'Marko Petrović',
          originalText: 'Continuing our discussion...',
          translatedText: 'Nastavljamo našu diskusiju...',
          timestamp: new Date().toLocaleTimeString(),
          language: Math.random() > 0.5 ? 'en-US' : 'sr-RS'
        }
        
        setCurrentConversation(prev => prev ? {
          ...prev,
          messages: [...prev.messages, newMessage]
        } : null)
      }, 30000)

      return () => clearInterval(timer)
    }
  }, [isConversationActive])

  const startLiveConversation = () => {
    setIsConversationActive(true)
    setCurrentConversation(mockConversation)
    console.log('🎙️ Starting live Serbian-English conversation demo')
  }

  const stopLiveConversation = () => {
    setIsConversationActive(false)
    setCurrentConversation(null)
    console.log('🎙️ Stopping live conversation demo')
  }

  const formatTradeValue = (value: string) => {
    return value.replace('$', '').replace('B', ' Billion').replace('M', ' Million')
  }

  const demos = [
    { id: 'overview', label: 'Trade Overview', icon: Globe },
    { id: 'conversation', label: 'Live Translation', icon: MessageCircle },
    { id: 'opportunities', label: 'Trade Opportunities', icon: TrendingUp },
    { id: 'analytics', label: 'Market Analytics', icon: Factory }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Global Trade Intelligence Hub</h2>
        <p className="text-gray-300 mb-4">
          Real-time trade intelligence and multilingual communication for global commerce
        </p>
        
        {/* Trade Volume Summary */}
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20 mb-6">
          <h3 className="text-blue-300 font-semibold mb-2">🌍 Global Trade Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-white">$1.2T</div>
              <div className="text-gray-400">Total Annual Trade</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">+12.8%</div>
              <div className="text-gray-400">YoY Growth</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">15</div>
              <div className="text-gray-400">Major Partners</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">25+</div>
              <div className="text-gray-400">Languages</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Demo Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 flex gap-2 overflow-x-auto">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm whitespace-nowrap ${
                activeDemo === demo.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <demo.icon className="w-4 h-4" />
              <span>{demo.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Content */}
      <motion.div
        key={activeDemo}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Trade Overview */}
        {activeDemo === 'overview' && (
          <div className="space-y-8">
            {/* Country Trade Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {globalTradeData.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{country.country}</h3>
                        <p className="text-gray-400 text-sm">Total Trade: {country.totalTrade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">Active</div>
                      <div className="text-xs text-gray-400">Live Pricing</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* US Exports */}
                    <div>
                      <h4 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        US Exports
                      </h4>
                      <div className="space-y-2">
                        {country.usExports.slice(0, 3).map((product, idx) => (
                          <div key={idx} className="bg-white/5 rounded p-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm font-medium">{product.product}</span>
                              <span className="text-green-400 text-sm">{product.value}</span>
                            </div>
                            <div className="text-xs text-gray-400">Growth: +{product.growth}%</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* US Imports */}
                    <div>
                      <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 rotate-180" />
                        US Imports
                      </h4>
                      <div className="space-y-2">
                        {country.usImports.slice(0, 3).map((product, idx) => (
                          <div key={idx} className="bg-white/5 rounded p-2">
                            <div className="flex justify-between items-center">
                              <span className="text-white text-sm font-medium">{product.product}</span>
                              <span className="text-purple-400 text-sm">{product.value}</span>
                            </div>
                            <div className="text-xs text-gray-400">Growth: +{product.growth}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Key Opportunities */}
                  <div className="mt-4">
                    <h5 className="text-yellow-300 font-medium mb-2 text-sm">🎯 Key Opportunities:</h5>
                    <div className="flex flex-wrap gap-1">
                      {country.keyOpportunities.slice(0, 2).map(opp => (
                        <span key={opp} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                          {opp}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Live Conversation Demo */}
        {activeDemo === 'conversation' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Live Business Call Demo</h3>
                
                <div className="flex items-center gap-3">
                  {!isConversationActive ? (
                    <button
                      onClick={startLiveConversation}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      Start Live Demo
                    </button>
                  ) : (
                    <button
                      onClick={stopLiveConversation}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                    >
                      <Pause className="w-4 h-4" />
                      Stop Demo
                    </button>
                  )}
                  
                  {isConversationActive && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-green-400">Live Translation Active</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Conversation Interface */}
              {currentConversation ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Participants */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3">Participants</h4>
                    {currentConversation.participants.map(participant => (
                      <div key={participant.name} className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{participant.flag}</span>
                        <div>
                          <div className="font-medium text-white">{participant.name}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {participant.location}
                          </div>
                          <div className="text-xs text-blue-300">{participant.language}</div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-4 p-3 bg-green-500/10 rounded border border-green-500/20">
                      <div className="text-green-300 font-medium text-sm mb-1">💰 Trade Deal</div>
                      <div className="text-green-200 text-xs">
                        Topic: {currentConversation.topic}<br/>
                        Value: {currentConversation.tradeValue}
                      </div>
                    </div>
                  </div>

                  {/* Live Conversation */}
                  <div className="lg:col-span-2 bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Real-time Translation
                    </h4>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {currentConversation.messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 rounded-lg ${
                            message.speaker === 'John Smith' 
                              ? 'bg-blue-500/20 ml-4' 
                              : 'bg-purple-500/20 mr-4'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-white text-sm">{message.speaker}</span>
                              <span className="text-xs text-gray-400">({message.language})</span>
                            </div>
                            <span className="text-xs text-gray-400">{message.timestamp}</span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-white text-sm">{message.originalText}</p>
                            {message.translatedText && message.translatedText !== message.originalText && (
                              <div className="border-t border-white/10 pt-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <Languages className="w-3 h-3 text-blue-400" />
                                  <span className="text-blue-300 text-xs font-medium">Translation:</span>
                                </div>
                                <p className="text-gray-300 text-sm italic">{message.translatedText}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {isConversationActive && (
                      <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-green-400" />
                          <span className="text-green-300 font-medium text-sm">VAPI Translation Active</span>
                        </div>
                        <p className="text-green-200 text-xs">
                          Real-time voice translation between Serbian and English with business context preservation. 
                          Cultural nuances and business etiquette automatically handled.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Live Translation Demo</h3>
                  <p className="text-gray-400 mb-6">
                    Experience real-time Serbian-English business conversation with VAPI translation
                  </p>
                  <button
                    onClick={startLiveConversation}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2 mx-auto"
                  >
                    <Mic className="w-4 h-4" />
                    Start Live Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trade Opportunities */}
        {activeDemo === 'opportunities' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">High-Value Trade Opportunities</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Polish IT Outsourcing',
                    value: '$2.5B opportunity',
                    growth: '+45%',
                    description: 'High-quality software development at competitive rates',
                    countries: ['🇵🇱', '🇺🇸'],
                    products: ['Software Development', 'AI Services', 'Cybersecurity']
                  },
                  {
                    title: 'Czech Automotive Parts',
                    value: '$1.8B opportunity', 
                    growth: '+28%',
                    description: 'Precision manufacturing for US auto industry',
                    countries: ['🇨🇿', '🇺🇸'],
                    products: ['Engine Components', 'Electronics', 'Safety Systems']
                  },
                  {
                    title: 'Serbian Agriculture',
                    value: '$450M opportunity',
                    growth: '+52%',
                    description: 'Premium frozen fruits and organic products',
                    countries: ['🇷🇸', '🇺🇸'],
                    products: ['Frozen Raspberries', 'Organic Grains', 'Processed Foods']
                  },
                  {
                    title: 'Croatian Maritime',
                    value: '$320M opportunity',
                    growth: '+35%',
                    description: 'Ship components and maritime technology',
                    countries: ['🇭🇷', '🇺🇸'],
                    products: ['Ship Parts', 'Marine Electronics', 'Port Equipment']
                  },
                  {
                    title: 'Slovak Manufacturing',
                    value: '$280M opportunity',
                    growth: '+22%',
                    description: 'Industrial machinery and precision tools',
                    countries: ['🇸🇰', '🇺🇸'],
                    products: ['Machine Tools', 'Industrial Equipment', 'Precision Parts']
                  },
                  {
                    title: 'Bulgarian Tech Services',
                    value: '$190M opportunity',
                    growth: '+38%',
                    description: 'Software development and digital services',
                    countries: ['🇧🇬', '🇺🇸'],
                    products: ['Software Development', 'Digital Marketing', 'BPO Services']
                  }
                ].map((opportunity, index) => (
                  <motion.div
                    key={opportunity.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {opportunity.countries.map(flag => (
                        <span key={flag} className="text-lg">{flag}</span>
                      ))}
                      <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                    </div>
                    
                    <h4 className="font-semibold text-white mb-2">{opportunity.title}</h4>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-green-400 font-bold">{opportunity.value}</span>
                      <span className="text-blue-400 text-sm">{opportunity.growth}</span>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-3">{opportunity.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {opportunity.products.slice(0, 2).map(product => (
                        <span key={product} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          {product}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Market Analytics */}
        {activeDemo === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Real-time Market Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Trending Products</h4>
                  <div className="space-y-3">
                    {[
                      { product: 'IT Services', change: '+52.4%', country: 'Serbia', flag: '🇷🇸' },
                      { product: 'Semiconductors', change: '+28.2%', country: 'Czech Republic', flag: '🇨🇿' },
                      { product: 'Pharmaceuticals', change: '+25.3%', country: 'Poland', flag: '🇵🇱' },
                      { product: 'Tourism Services', change: '+35.2%', country: 'Croatia', flag: '🇭🇷' }
                    ].map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{trend.flag}</span>
                          <span className="text-white text-sm">{trend.product}</span>
                        </div>
                        <span className="text-green-400 font-bold text-sm">{trend.change}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Language Barriers Impact</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Lost deals due to language:</span>
                      <span className="text-red-400 font-bold">23%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Translation delays:</span>
                      <span className="text-yellow-400 font-bold">3.2 days avg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Cultural misunderstandings:</span>
                      <span className="text-orange-400 font-bold">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">BurnStream improvement:</span>
                      <span className="text-green-400 font-bold">+89% success</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* VAPI Integration Status */}
      <div className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
        <h3 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
          <Languages className="w-5 h-5" />
          VAPI Multilingual Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Supported Languages:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• 🇷🇸 Serbian (sr-RS) - Native business context</li>
              <li>• 🇵🇱 Polish (pl-PL) - EU trade protocols</li>
              <li>• 🇨🇿 Czech (cs-CZ) - Manufacturing terminology</li>
              <li>• 🇭🇷 Croatian (hr-HR) - Maritime and tourism</li>
              <li>• 🇺🇸 English (en-US) - Business standard</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Cultural Intelligence:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Business etiquette and formality levels</li>
              <li>• Regional trade customs and practices</li>
              <li>• Currency and pricing conventions</li>
              <li>• Negotiation styles and expectations</li>
              <li>• Legal and regulatory context</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
