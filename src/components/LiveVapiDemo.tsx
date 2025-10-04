'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Languages, 
  Globe,
  Users,
  Phone,
  MessageCircle,
  Zap,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'

interface VapiCall {
  id: string
  status: 'idle' | 'connecting' | 'connected' | 'speaking' | 'listening' | 'ended'
  language: string
  participant?: {
    name: string
    location: string
    language: string
    flag: string
  }
}

export default function LiveVapiDemo() {
  const [vapiCall, setVapiCall] = useState<VapiCall>({ id: '', status: 'idle', language: 'en-US' })
  const [selectedLanguage, setSelectedLanguage] = useState('sr-RS') // Serbian for demo
  const [isInitialized, setIsInitialized] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [translation, setTranslation] = useState('')
  const [error, setError] = useState<string | null>(null)

  // VAPI Web SDK reference
  const vapiRef = useRef<any>(null)

  const supportedLanguages = [
    { code: 'sr-RS', name: 'Serbian', nativeName: 'Српски', flag: '🇷🇸', location: 'Belgrade, Serbia' },
    { code: 'pl-PL', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', location: 'Warsaw, Poland' },
    { code: 'cs-CZ', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', location: 'Prague, Czech Republic' },
    { code: 'hr-HR', name: 'Croatian', nativeName: 'Hrvatski', flag: '🇭🇷', location: 'Zagreb, Croatia' },
    { code: 'bg-BG', name: 'Bulgarian', nativeName: 'Български', flag: '🇧🇬', location: 'Sofia, Bulgaria' },
    { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸', location: 'Chicago, USA' }
  ]

  // Initialize VAPI Web SDK
  useEffect(() => {
    initializeVapi()
  }, [])

  const initializeVapi = async () => {
    try {
      console.log('🎙️ Initializing VAPI Web SDK...')
      
      // Dynamic import of VAPI Web SDK
      const VapiSDK = await import('@vapi-ai/web')
      
      // Use demo public key for hackathon
      const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || 'demo-key-for-hackathon'
      
      vapiRef.current = new VapiSDK.default(publicKey)
      
      // Set up event listeners
      vapiRef.current.on('call-start', () => {
        console.log('📞 VAPI call started')
        setVapiCall(prev => ({ ...prev, status: 'connected' }))
      })

      vapiRef.current.on('call-end', () => {
        console.log('📞 VAPI call ended')
        setVapiCall(prev => ({ ...prev, status: 'ended' }))
      })

      vapiRef.current.on('speech-start', () => {
        console.log('🗣️ Speech detected')
        setVapiCall(prev => ({ ...prev, status: 'speaking' }))
      })

      vapiRef.current.on('speech-end', () => {
        console.log('👂 Listening for speech')
        setVapiCall(prev => ({ ...prev, status: 'listening' }))
      })

      vapiRef.current.on('message', (message: any) => {
        console.log('💬 VAPI message:', message)
        if (message.type === 'transcript') {
          setTranscript(message.transcript)
        }
        if (message.type === 'function-call' && message.functionCall?.name === 'translate_realtime') {
          setTranslation(message.functionCall.result)
        }
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('❌ VAPI error:', error)
        setError(`VAPI Error: ${error?.message || 'Connection failed - using demo mode'}`)
      })

      setIsInitialized(true)
      console.log('✅ VAPI Web SDK initialized successfully')
      
    } catch (error) {
      console.error('VAPI initialization failed:', error)
      setError('VAPI SDK not available - using demo mode')
      setIsInitialized(false)
      // Start demo mode automatically
      setTimeout(() => {
        setError(null)
        console.log('🎭 Switching to demo mode automatically')
      }, 2000)
    }
  }

  const startMultilingualCall = async () => {
    if (!isInitialized || !vapiRef.current) {
      console.warn('VAPI not initialized, starting demo mode...')
      startDemoMode()
      return
    }

    try {
      setVapiCall(prev => ({ ...prev, status: 'connecting' }))
      setError(null)

      // Create multilingual assistant configuration
      const assistantConfig = {
        model: {
          provider: 'openai',
          model: 'gpt-4',
          temperature: 0.7,
          systemMessage: `You are a multilingual trade assistant specializing in Serbian-English business communication. 

You help facilitate trade conversations between Serbian suppliers and US buyers. Key capabilities:
- Understand Serbian business culture and etiquette
- Translate not just words but business context
- Provide cultural guidance for negotiations
- Help with price discussions and trade terms

Current conversation context:
- Serbian participant: Supplier in ${getCurrentLocation()}
- US participant: Buyer in Chicago, USA
- Product: Agricultural exports (raspberries, grains)
- Goal: Facilitate clear, culturally-aware business communication

Always be professional, culturally sensitive, and helpful in bridging communication gaps.`
        },
        voice: {
          provider: 'elevenlabs',
          voiceId: 'pNInz6obpgDQGcFmaJgB' // Multilingual capable voice
        },
        firstMessage: getLocalizedGreeting(),
        functions: [
          {
            name: 'translate_realtime',
            description: 'Translate between Serbian and English with cultural context',
            parameters: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                sourceLanguage: { type: 'string' },
                targetLanguage: { type: 'string' },
                culturalContext: { type: 'string' }
              },
              required: ['text', 'targetLanguage']
            }
          }
        ]
      }

      // Start VAPI call with multilingual assistant
      await vapiRef.current.start(assistantConfig)
      
      console.log('✅ Multilingual VAPI call started')
      
    } catch (error) {
      console.error('Failed to start VAPI call:', error)
      setError(`Failed to connect: ${error}`)
      startDemoMode()
    }
  }

  const endCall = async () => {
    if (vapiRef.current && vapiCall.status !== 'idle') {
      try {
        await vapiRef.current.stop()
        console.log('📞 VAPI call ended')
      } catch (error) {
        console.error('Error ending call:', error)
      }
    }
    
    setVapiCall({ id: '', status: 'idle', language: 'en-US' })
    setTranscript('')
    setTranslation('')
  }

  const startDemoMode = () => {
    console.log('🎭 Starting demo mode with simulated multilingual conversation...')
    
    setVapiCall(prev => ({ ...prev, status: 'connecting' }))
    
    // Simulate connection process
    setTimeout(() => {
      setVapiCall(prev => ({ 
        ...prev, 
        status: 'connected',
        participant: {
          name: 'Marko Petrović',
          location: 'Novi Sad, Serbia', 
          language: 'sr-RS',
          flag: '🇷🇸'
        }
      }))
      
      // Simulate conversation
      simulateMultilingualConversation()
    }, 2000)
  }

  const simulateMultilingualConversation = () => {
    const conversationSteps = [
      {
        transcript: 'Zdravo! Zanima me izvoz malina u Ameriku.',
        translation: 'Hello! I\'m interested in exporting raspberries to America.',
        delay: 3000
      },
      {
        transcript: 'What are your current prices for frozen raspberries?',
        translation: 'Koje su vaše trenutne cene za zamrznute maline?',
        delay: 6000
      },
      {
        transcript: 'Cena je 3.50 evra po kilogramu, izvrsnog kvaliteta iz Šumadije.',
        translation: 'The price is 3.50 euros per kilogram, excellent quality from Šumadija region.',
        delay: 9000
      },
      {
        transcript: 'That sounds very competitive. Can you handle 5 tons monthly?',
        translation: 'To zvuči veoma konkurentno. Možete li da obradite 5 tona mesečno?',
        delay: 12000
      }
    ]

    conversationSteps.forEach(step => {
      setTimeout(() => {
        setTranscript(step.transcript)
        setTranslation(step.translation)
        setVapiCall(prev => ({ ...prev, status: 'speaking' }))
        
        // Switch back to listening after speaking
        setTimeout(() => {
          setVapiCall(prev => ({ ...prev, status: 'listening' }))
        }, 2000)
      }, step.delay)
    })
  }

  const getCurrentLocation = () => {
    const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage)
    return selectedLang?.location || 'Belgrade, Serbia'
  }

  const getLocalizedGreeting = () => {
    switch (selectedLanguage) {
      case 'sr-RS': return 'Zdravo! Ja sam vaš asistent za trgovinu. Kako mogu da vam pomognem?'
      case 'pl-PL': return 'Cześć! Jestem Twoim asystentem handlowym. Jak mogę Ci pomóc?'
      case 'cs-CZ': return 'Ahoj! Jsem váš obchodní asistent. Jak vám mohu pomoci?'
      case 'hr-HR': return 'Pozdrav! Ja sam vaš trgovinski asistent. Kako vam mogu pomoći?'
      case 'bg-BG': return 'Здравейте! Аз съм вашият търговски асистент. Как мога да ви помогна?'
      default: return 'Hello! I\'m your trade assistant. How can I help you today?'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'connecting': return 'bg-yellow-500 animate-pulse'
      case 'speaking': return 'bg-blue-500 animate-pulse'
      case 'listening': return 'bg-purple-500 animate-pulse'
      case 'ended': return 'bg-gray-500'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Live VAPI Multilingual Demo</h2>
        <p className="text-gray-300 mb-6">
          Real-time voice translation between Serbian suppliers and US buyers
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* VAPI Call Interface */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">VAPI Voice Call</h3>
            <div className={`px-3 py-1 rounded-full text-sm ${
              isInitialized ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {isInitialized ? 'SDK Ready' : 'Demo Mode'}
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6">
            <label className="text-white font-medium mb-3 block">Select Participant Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={vapiCall.status !== 'idle'}
              className="w-full bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-blue-500 focus:outline-none disabled:opacity-50"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-400 mt-2">
              Participant location: {getCurrentLocation()}
            </p>
          </div>

          {/* Call Controls */}
          <div className="text-center mb-6">
            <motion.button
              onClick={vapiCall.status === 'idle' ? startMultilingualCall : endCall}
              disabled={vapiCall.status === 'connecting'}
              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                vapiCall.status === 'idle' 
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:scale-105'
                  : vapiCall.status === 'connecting'
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500 hover:scale-105'
              }`}
              whileHover={{ scale: vapiCall.status === 'connecting' ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {vapiCall.status === 'connecting' ? (
                <Loader className="w-8 h-8 text-white animate-spin" />
              ) : vapiCall.status === 'idle' ? (
                <Phone className="w-8 h-8 text-white" />
              ) : (
                <MicOff className="w-8 h-8 text-white" />
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(vapiCall.status)}`} />
              <span className="text-white font-medium capitalize">
                {vapiCall.status === 'idle' ? 'Ready to Connect' :
                 vapiCall.status === 'connecting' ? 'Connecting to VAPI...' :
                 vapiCall.status === 'connected' ? 'Connected - Ready to Talk' :
                 vapiCall.status === 'speaking' ? 'AI Speaking...' :
                 vapiCall.status === 'listening' ? 'Listening...' :
                 'Call Ended'}
              </span>
            </div>

            {error && (
              <div className="bg-red-500/20 text-red-300 rounded-lg p-3 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}
          </div>

          {/* Call Participant Info */}
          {vapiCall.participant && (
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <h4 className="text-white font-medium mb-3">Connected Participant</h4>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{vapiCall.participant.flag}</span>
                <div>
                  <div className="text-white font-medium">{vapiCall.participant.name}</div>
                  <div className="text-gray-400 text-sm">{vapiCall.participant.location}</div>
                  <div className="text-blue-300 text-sm">{vapiCall.participant.language}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Translation Display */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Real-time Translation
          </h3>

          {transcript ? (
            <div className="space-y-4">
              {/* Original Speech */}
              <div className="bg-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">Original Speech</span>
                  <span className="text-xs text-gray-400">({selectedLanguage})</span>
                </div>
                <p className="text-white">{transcript}</p>
              </div>

              {/* Translation */}
              {translation && (
                <div className="bg-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-medium">Live Translation</span>
                    <span className="text-xs text-gray-400">(en-US)</span>
                  </div>
                  <p className="text-white">{translation}</p>
                </div>
              )}

              {/* Cultural Context */}
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">Cultural Context</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Serbian business culture values personal relationships and trust-building. 
                  Take time for small talk before discussing prices. Direct negotiation is acceptable but maintain respect.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Start a call to see live translation</p>
              <p className="text-sm text-gray-500">VAPI will provide real-time Serbian-English translation</p>
            </div>
          )}
        </div>
      </div>

      {/* VAPI Integration Status */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
        <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          VAPI Multilingual Integration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">Real-time Capabilities:</h4>
            <ul className="text-gray-300 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Sub-600ms voice response times
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Natural conversation flow
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Cultural context preservation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Business terminology accuracy
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Supported Features:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Serbian (sr-RS) native business context</li>
              <li>• Polish (pl-PL) EU trade protocols</li>
              <li>• Czech (cs-CZ) manufacturing terminology</li>
              <li>• Croatian (hr-HR) maritime and tourism</li>
              <li>• Bulgarian (bg-BG) agricultural exports</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded">
          <p className="text-green-300 text-sm font-medium">
            🎯 Demo Impact: Real VAPI integration ready - just add your API keys for full functionality!
          </p>
        </div>
      </div>
    </div>
  )
}
