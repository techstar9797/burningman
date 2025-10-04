'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Mic, 
  DollarSign, 
  MapPin, 
  Users, 
  TrendingUp,
  Languages,
  Gift,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Phone,
  MessageSquare
} from 'lucide-react'
import { globalTranslationService, PriceIntelligence, TranslationResult } from '@/lib/translation'

interface LivePriceData {
  product: string
  prices: Array<{
    location: string
    price: number
    currency: string
    timestamp: string
    contributor: string
    verified: boolean
    incentiveEarned: number
  }>
}

export default function GlobalMarketplace() {
  const [activeDemo, setActiveDemo] = useState<'translation' | 'prices' | 'incentives' | 'live'>('translation')
  const [isListening, setIsListening] = useState(false)
  const [currentTranslation, setCurrentTranslation] = useState<TranslationResult | null>(null)
  const [priceIntelligence, setPriceIntelligence] = useState<PriceIntelligence[]>([])
  const [totalEarnings, setTotalEarnings] = useState(0)
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const supportedLanguages = globalTranslationService.getSupportedLanguages()

  const livePriceData: LivePriceData[] = [
    {
      product: 'Rice (1kg)',
      prices: [
        { location: 'Mumbai, India', price: 45, currency: 'INR', timestamp: '2 min ago', contributor: 'Raj K.', verified: true, incentiveEarned: 0.45 },
        { location: 'Bangkok, Thailand', price: 25, currency: 'THB', timestamp: '5 min ago', contributor: 'Somchai P.', verified: true, incentiveEarned: 0.75 },
        { location: 'Lagos, Nigeria', price: 800, currency: 'NGN', timestamp: '8 min ago', contributor: 'Adebayo O.', verified: false, incentiveEarned: 0.50 },
        { location: 'Mexico City, Mexico', price: 22, currency: 'MXN', timestamp: '12 min ago', contributor: 'Maria G.', verified: true, incentiveEarned: 0.85 }
      ]
    },
    {
      product: 'Gasoline (1L)',
      prices: [
        { location: 'Berlin, Germany', price: 1.65, currency: 'EUR', timestamp: '1 min ago', contributor: 'Klaus M.', verified: true, incentiveEarned: 1.00 },
        { location: 'Tokyo, Japan', price: 160, currency: 'JPY', timestamp: '3 min ago', contributor: 'Yuki S.', verified: true, incentiveEarned: 1.00 },
        { location: 'São Paulo, Brazil', price: 5.80, currency: 'BRL', timestamp: '6 min ago', contributor: 'Carlos R.', verified: true, incentiveEarned: 0.90 },
        { location: 'Dubai, UAE', price: 2.1, currency: 'AED', timestamp: '15 min ago', contributor: 'Ahmed A.', verified: true, incentiveEarned: 0.95 }
      ]
    },
    {
      product: 'Coffee (1 cup)',
      prices: [
        { location: 'New York, USA', price: 4.50, currency: 'USD', timestamp: '30 sec ago', contributor: 'John D.', verified: true, incentiveEarned: 1.00 },
        { location: 'London, UK', price: 3.80, currency: 'GBP', timestamp: '4 min ago', contributor: 'Emma W.', verified: true, incentiveEarned: 1.00 },
        { location: 'Istanbul, Turkey', price: 15, currency: 'TRY', timestamp: '7 min ago', contributor: 'Mehmet K.', verified: false, incentiveEarned: 0.60 },
        { location: 'Seoul, South Korea', price: 4200, currency: 'KRW', timestamp: '10 min ago', contributor: 'Min-jun L.', verified: true, incentiveEarned: 0.95 }
      ]
    }
  ]

  useEffect(() => {
    // Calculate total earnings
    const total = livePriceData.reduce((sum, product) => 
      sum + product.prices.reduce((productSum, price) => productSum + price.incentiveEarned, 0), 0
    )
    setTotalEarnings(total)
  }, [])

  const handleVoiceTranslation = async () => {
    setIsListening(true)
    
    // Simulate voice input and translation
    setTimeout(async () => {
      const demoTexts = [
        { text: 'The price of bread here is 2 euros', lang: 'en' },
        { text: 'El arroz cuesta 50 pesos aquí', lang: 'es' },
        { text: '这里的苹果5块钱一斤', lang: 'zh' },
        { text: 'यहाँ चाय 10 रुपए में मिलती है', lang: 'hi' }
      ]
      
      const randomDemo = demoTexts[Math.floor(Math.random() * demoTexts.length)]
      
      const translation = await globalTranslationService.translateVoiceText(
        randomDemo.text,
        {
          sourceLanguage: randomDemo.lang,
          targetLanguage: selectedLanguage,
          region: 'US'
        }
      )
      
      setCurrentTranslation(translation)
      setIsListening(false)

      // Extract price intelligence
      const priceInfo = await globalTranslationService.extractPriceIntelligence(
        randomDemo.text,
        'Novi Sad, Serbia',
        randomDemo.lang
      )
      
      if (priceInfo) {
        // Update location to actual Slavic city
        priceInfo.location = 'Novi Sad, Serbia'
        setPriceIntelligence(prev => [priceInfo, ...prev.slice(0, 4)])
      }
    }, 2000)
  }

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'INR': '₹', 
      'CNY': '¥', 'KRW': '₩', 'BRL': 'R$', 'THB': '฿', 'AED': 'د.إ',
      'TRY': '₺', 'NGN': '₦', 'MXN': '$'
    }
    
    return `${symbols[currency] || currency} ${amount.toLocaleString()}`
  }

  const demos = [
    { id: 'translation', label: 'Real-time Translation', icon: Languages },
    { id: 'prices', label: 'Global Price Intel', icon: TrendingUp },
    { id: 'incentives', label: 'Earn Rewards', icon: Gift },
    { id: 'live', label: 'Live Marketplace', icon: ShoppingCart }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Global Voice Marketplace</h2>
        <p className="text-gray-300 mb-4">
          Break language barriers and discover real-time prices worldwide through voice
        </p>
        
        {/* Revolutionary Value Proposition */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/20 mb-6">
          <h3 className="text-green-300 font-semibold mb-2 flex items-center gap-2">
            🌍 Revolutionary Global Commerce
          </h3>
          <p className="text-green-200 text-sm">
            Talk to a shopkeeper in Mumbai while sitting in New York. Get real-time prices in any language. 
            Earn money by sharing local price intelligence. The world becomes your marketplace.
          </p>
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
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
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
        {/* Real-time Translation */}
        {activeDemo === 'translation' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Languages className="w-5 h-5" />
                Voice Translation Demo
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Input */}
                <div>
                  <div className="bg-white/5 rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white">Speak in Any Language</h4>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-white/10 text-white rounded px-3 py-1 text-sm"
                      >
                        {supportedLanguages.slice(0, 8).map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="text-center">
                      <motion.button
                        onClick={handleVoiceTranslation}
                        disabled={isListening}
                        className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
                          isListening 
                            ? 'bg-red-500 animate-pulse' 
                            : 'bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105'
                        } transition-all`}
                        whileHover={{ scale: isListening ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mic className="w-8 h-8 text-white" />
                      </motion.button>
                      
                      <p className="text-gray-300 text-sm">
                        {isListening ? 'Listening and translating...' : 'Click to start speaking'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Supported Languages Grid */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h5 className="text-white font-medium mb-3">Supported Languages</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {supportedLanguages.slice(0, 8).map(lang => (
                        <div key={lang.code} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-gray-300">{lang.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">+50 more languages supported</p>
                  </div>
                </div>

                {/* Translation Results */}
                <div>
                  <div className="bg-white/5 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">Live Translation</h4>
                    
                    {currentTranslation ? (
                      <div className="space-y-4">
                        <div className="bg-blue-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span className="text-blue-300 font-medium">Original ({currentTranslation.sourceLanguage.toUpperCase()})</span>
                          </div>
                          <p className="text-white">{currentTranslation.originalText}</p>
                        </div>
                        
                        <div className="flex justify-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        
                        <div className="bg-green-500/20 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Languages className="w-4 h-4 text-green-400" />
                            <span className="text-green-300 font-medium">Translated ({currentTranslation.targetLanguage.toUpperCase()})</span>
                            <span className="text-xs text-gray-400">({Math.round(currentTranslation.confidence * 100)}% confidence)</span>
                          </div>
                          <p className="text-white">{currentTranslation.translatedText}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Languages className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">Click the microphone to see live translation</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Price Intelligence */}
        {activeDemo === 'prices' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Global Price Intelligence</h3>
              
              <div className="space-y-6">
                {livePriceData.map((product, index) => (
                  <motion.div
                    key={product.product}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        {product.product}
                      </h4>
                      <span className="text-sm text-gray-400">{product.prices.length} locations</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.prices.map((price, priceIndex) => (
                        <div key={priceIndex} className="bg-white/5 rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3 text-blue-400" />
                              <span className="text-white text-sm font-medium">{price.location}</span>
                              {price.verified && <CheckCircle className="w-3 h-3 text-green-400" />}
                            </div>
                            <span className="text-green-400 font-bold">
                              {formatCurrency(price.price, price.currency)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>by {price.contributor}</span>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{price.timestamp}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-purple-300">
                              Earned: ${price.incentiveEarned.toFixed(2)}
                            </span>
                            {!price.verified && (
                              <span className="text-xs text-yellow-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Pending verification
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Incentive System */}
        {activeDemo === 'incentives' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white">${totalEarnings.toFixed(2)}</div>
                <div className="text-gray-300">Total Earned Today</div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 text-center">
                <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white">12</div>
                <div className="text-gray-300">Price Reports Shared</div>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 text-center">
                <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white">4.9</div>
                <div className="text-gray-300">Accuracy Rating</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">How to Earn Money</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="text-white font-medium">Share Local Prices</h4>
                      <p className="text-gray-300 text-sm">Use voice to report prices you see at local shops</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="text-white font-medium">Get Verified</h4>
                      <p className="text-gray-300 text-sm">Other users or AI verify your price reports</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="text-white font-medium">Earn Rewards</h4>
                      <p className="text-gray-300 text-sm">Receive $0.10-$1.00 per verified price report</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-3">Earning Potential</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Basic price report:</span>
                      <span className="text-green-400">$0.10 - $0.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Detailed with photo:</span>
                      <span className="text-green-400">$0.50 - $1.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Trending product:</span>
                      <span className="text-green-400">$1.00 - $2.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">High accuracy bonus:</span>
                      <span className="text-green-400">+25%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded">
                    <p className="text-green-300 text-sm font-medium">
                      💡 Active contributors earn $50-200/month sharing local prices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Marketplace */}
        {activeDemo === 'live' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Global Marketplace</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Live Calls */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Active Voice Calls
                  </h4>
                  
                  <div className="space-y-3">
                    {[
                      { caller: 'Sarah (New York)', callee: 'Raj (Mumbai)', topic: 'Electronics prices', duration: '2:34' },
                      { caller: 'Carlos (Mexico City)', callee: 'Li Wei (Beijing)', topic: 'Food ingredients', duration: '5:12' },
                      { caller: 'Emma (London)', callee: 'Yuki (Tokyo)', topic: 'Fashion items', duration: '1:45' }
                    ].map((call, index) => (
                      <div key={index} className="bg-white/5 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white text-sm font-medium">{call.caller} ↔ {call.callee}</div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-400 text-xs">{call.duration}</span>
                          </div>
                        </div>
                        <div className="text-gray-300 text-xs">{call.topic}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Recent Price Intelligence
                  </h4>
                  
                  <div className="space-y-3">
                    {priceIntelligence.length > 0 ? priceIntelligence.map((intel, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 rounded p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-sm font-medium">{intel.product}</span>
                          <span className="text-green-400 font-bold">
                            {formatCurrency(intel.price, intel.currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{intel.location}</span>
                          <span className="text-purple-300">+${intel.incentiveEarned.toFixed(2)}</span>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-4">
                        <MessageSquare className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Use voice translation to see price intelligence</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Integration Status */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Powered by Advanced AI
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Translation Technology:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Google Translate API integration</li>
              <li>• 100+ languages and dialects supported</li>
              <li>• Real-time voice-to-voice translation</li>
              <li>• Cultural context preservation</li>
              <li>• Regional accent recognition</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">VAPI Voice Platform:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Sub-600ms response times</li>
              <li>• Natural conversation flow</li>
              <li>• Multilingual voice synthesis</li>
              <li>• Phone system integration</li>
              <li>• Global call routing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
