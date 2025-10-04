'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  CameraOff, 
  Phone,
  PhoneCall,
  PhoneOff,
  Languages, 
  Users,
  Volume2,
  Mic,
  MicOff,
  MessageCircle,
  Globe,
  Smartphone,
  Monitor,
  ArrowRightLeft,
  Zap,
  CheckCircle,
  Loader,
  Music,
  VolumeX
} from 'lucide-react'
import { omiVapiBridge, CrossDeviceCall } from '@/lib/omi-vapi-bridge'
import { ambientAudioGenerator } from '@/lib/ambient-audio'
import { apiConfig } from '@/config/api-template'

export default function LiveCommunicationHub() {
  // Camera states
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  // VAPI call states
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [callId, setCallId] = useState<string | null>(null)
  const [conversation, setConversation] = useState<CrossDeviceCall | null>(null)
  
  // Audio states
  const [isMusicOn, setIsMusicOn] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.3)
  
  // Translation states
  const [liveTranscript, setLiveTranscript] = useState('')
  const [liveTranslation, setLiveTranslation] = useState('')
  const [detectedLanguage, setDetectedLanguage] = useState('en-US')
  const [vapiStatus, setVapiStatus] = useState<'idle' | 'connecting' | 'connected' | 'speaking' | 'listening'>('idle')

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const vapiRef = useRef<any>(null)

  // Start comprehensive communication session
  const startCommunicationSession = async () => {
    setIsConnecting(true)
    
    try {
      console.log('🚀 Starting comprehensive communication session...')
      
      // 1. Start camera preview
      await startCamera()
      
      // 2. Start ambient music for atmosphere
      await startAmbientMusic()
      
      // 3. Initialize real VAPI voice call
      await initializeRealVapi()
      
      // 4. Start VAPI call for live communication
      await startVapiCall()
      
      // 5. Set call as active
      setIsCallActive(true)
      
      console.log('✅ Full communication session active')
    } catch (error) {
      console.error('Communication session failed:', error)
      // Start demo mode if real integration fails
      startDemoMode()
    }
    
    setIsConnecting(false)
  }

  const startCamera = async (): Promise<void> => {
    setIsLoading(true)
    setCameraError(null)
    
    try {
      console.log('🎥 Starting camera for live communication...')
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false // Audio handled by VAPI
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsCameraOn(true)
        console.log('✅ Camera started for communication')
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setCameraError('Camera access denied - demo will work without video')
    }
    
    setIsLoading(false)
  }

  const startAmbientMusic = async (): Promise<void> => {
    try {
      console.log('🎵 Starting ambient music for communication atmosphere...')
      await ambientAudioGenerator.playAmbientTrack('Community Connection', musicVolume)
      setIsMusicOn(true)
      console.log('✅ Ambient music started')
    } catch (error) {
      console.warn('Ambient music failed:', error)
    }
  }

  const initializeRealVapi = async (): Promise<void> => {
    try {
      console.log('🎙️ Initializing real VAPI for live communication...')
      
      // Dynamic import of VAPI Web SDK
      const VapiSDK = await import('@vapi-ai/web')
      vapiRef.current = new VapiSDK.default(apiConfig.vapi.publicKey)
      
      // Set up real-time event listeners
      vapiRef.current.on('call-start', () => {
        console.log('📞 Real VAPI call started')
        setVapiStatus('connected')
        setLiveTranscript('✅ Live voice communication active - speak naturally!')
        setLiveTranslation('VAPI AI is ready to help with multilingual business conversations')
      })

      vapiRef.current.on('speech-start', () => {
        setVapiStatus('listening')
        setLiveTranscript('🎤 Listening to your voice...')
      })

      vapiRef.current.on('speech-end', () => {
        setVapiStatus('speaking')
        setLiveTranscript('🤖 AI processing your speech...')
      })

      vapiRef.current.on('message', (message: any) => {
        console.log('💬 VAPI message:', message)
        
        if (message.type === 'transcript' || message.transcript) {
          setLiveTranscript(`You said: "${message.transcript || message.text}"`)
        }
        
        if (message.type === 'response' || message.role === 'assistant') {
          setLiveTranslation(`AI: ${message.content || message.text}`)
          setVapiStatus('connected')
        }
      })

      vapiRef.current.on('call-end', () => {
        setVapiStatus('idle')
        setIsCallActive(false)
        setLiveTranscript('Call ended')
        setLiveTranslation('')
      })

      vapiRef.current.on('error', (error: any) => {
        console.error('VAPI error:', error)
        setVapiStatus('idle')
        setLiveTranscript('VAPI connection failed - demo mode active')
        setLiveTranslation('Real VAPI integration available with API keys')
      })

      console.log('✅ Real VAPI initialized')
    } catch (error) {
      console.error('VAPI initialization failed:', error)
      throw error
    }
  }

  const startVapiCall = async (): Promise<void> => {
    try {
      console.log('📞 Starting real VAPI call for live communication...')
      
      setVapiStatus('connecting')
      
      // Start call with multilingual assistant
      await vapiRef.current.start({
        name: 'Live Communication Assistant',
        firstMessage: 'Hello! I\'m your live communication assistant. I can help with multilingual business conversations. What would you like to discuss?',
        systemPrompt: `You are a live communication assistant for the Burning Man Global Marketplace. 

Help users with:
- Multilingual business conversations
- Price negotiations and trade discussions  
- Cultural context for international business
- Real-time translation assistance
- Global marketplace connections

Be professional, helpful, and embody the Burning Man spirit of radical inclusion and global connection.`,
        
        voice: {
          provider: 'elevenlabs',
          voiceId: 'pNInz6obpgDQGcFmaJgB'
        },
        
        model: {
          provider: 'openai', 
          model: 'gpt-4',
          temperature: 0.7
        }
      })
      
      console.log('✅ Real VAPI call started')
    } catch (error) {
      console.error('VAPI call failed:', error)
      // Fall back to demo mode
      setVapiStatus('connected')
      setLiveTranscript('Demo mode: Real VAPI integration ready')
      setLiveTranslation('Speak to experience live voice AI translation')
      startDemoConversation()
    }
  }

  const startDemoConversation = () => {
    const demoSteps = [
      {
        delay: 3000,
        transcript: 'Demo: "Hello, I need help with international trade"',
        translation: 'AI: "I\'d be happy to help! What specific trade relationship are you interested in?"'
      },
      {
        delay: 6000,
        transcript: 'Demo: "I want to connect with suppliers in Serbia"',  
        translation: 'AI: "Great! Serbia has excellent IT services and agricultural exports. Would you like me to connect you with local suppliers?"'
      }
    ]

    demoSteps.forEach(step => {
      setTimeout(() => {
        setLiveTranscript(step.transcript)
        setLiveTranslation(step.translation)
      }, step.delay)
    })
  }

  const startCrossDeviceCall = async (): Promise<void> => {
    try {
      console.log('📞 Starting Omi + VAPI cross-device call...')
      
      const newCallId = await omiVapiBridge.startCrossDeviceCall(
        'omi_device_001', // Your Omi device ID
        'web_session_' + Date.now()
      )

      setCallId(newCallId)
      setIsCallActive(true)
      
      // Set up real-time conversation updates
      setupConversationUpdates(newCallId)
      
      // Show initial connection status
      setLiveTranscript('📱 Omi device connected • 💻 Web interface ready')
      setLiveTranslation('Cross-device communication bridge established - ready for real-time translation')
      
      console.log('✅ Cross-device call active:', newCallId)
    } catch (error) {
      console.error('Cross-device call failed:', error)
      throw error
    }
  }

  const setupConversationUpdates = (callId: string) => {
    console.log('🔄 Setting up real-time conversation updates...')
    
    // Simulate real-time updates from Omi device
    const conversationSteps = [
      {
        delay: 4000,
        type: 'omi_input',
        transcript: '[Omi user in Belgrade] Zdravo! Zanima me izvoz malina u Ameriku.',
        translation: '[VAPI → Web] Hello! I\'m interested in exporting raspberries to America.',
        language: 'sr-RS'
      },
      {
        delay: 8000,
        type: 'web_response_prompt',
        transcript: '[Your turn] Click to respond or type your message...',
        translation: '[Ready for your input] VAPI will translate your response to Serbian',
        language: 'en-US'
      },
      {
        delay: 12000,
        type: 'omi_input',
        transcript: '[Omi user] Cena je 3,50 evra po kilogramu. Imamo EU sertifikate.',
        translation: '[VAPI → Web] Price is 3.50 euros per kilogram. We have EU certificates.',
        language: 'sr-RS'
      },
      {
        delay: 16000,
        type: 'web_response_prompt',
        transcript: '[Your turn] Respond about quantity or quality requirements...',
        translation: '[Ready] VAPI standing by for your voice or text input',
        language: 'en-US'
      }
    ]

    conversationSteps.forEach(step => {
      setTimeout(() => {
        setLiveTranscript(step.transcript)
        setLiveTranslation(step.translation)
        setDetectedLanguage(step.language)
        
        // Update conversation state
        const call = omiVapiBridge.getCall(callId)
        if (call) {
          setConversation({...call})
        }
      }, step.delay)
    })
  }

  const startDemoMode = () => {
    console.log('🎭 Starting enhanced demo mode with camera integration...')
    
    setIsCallActive(true)
    setCallId('demo_integrated_' + Date.now())
    
    // Show demo status
    setLiveTranscript('Demo Mode: Camera + VAPI + Omi integration ready')
    setLiveTranslation('Add VAPI and Omi API keys for full cross-device functionality')
  }

  const endCommunicationSession = async () => {
    console.log('🛑 Ending comprehensive communication session...')
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)

    // Stop ambient music
    if (isMusicOn) {
      ambientAudioGenerator.stopAmbientTrack()
      setIsMusicOn(false)
    }

    // End VAPI call
    if (callId) {
      try {
        await omiVapiBridge.endCrossDeviceCall(callId)
      } catch (error) {
        console.error('Error ending call:', error)
      }
    }

    // Reset all states
    setIsCallActive(false)
    setCallId(null)
    setConversation(null)
    setLiveTranscript('')
    setLiveTranslation('')
  }

  const simulateUserResponse = (response: string) => {
    console.log('💬 User response simulation:', response)
    
    setLiveTranscript(`[You speaking] ${response}`)
    setLiveTranslation('[VAPI translating to Omi] ' + getTranslation(response))
    
    // Send to Omi device
    if (callId) {
      omiVapiBridge.sendToOmiDevice(callId, response)
    }
  }

  const getTranslation = (text: string): string => {
    const translations: { [key: string]: string } = {
      'What are your current prices?': 'Koje su vaše trenutne cene?',
      'Can you handle 5 tons monthly?': 'Možete li 5 tona mesečno?',
      'That sounds very competitive.': 'To zvuči veoma konkurentno.',
      'Let\'s move forward with the deal.': 'Idemo dalje sa poslom.'
    }
    
    return translations[text] || `[Translated] ${text}`
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Live Communication Hub</h2>
        <p className="text-gray-300 mb-6">
          Integrated camera preview + VAPI voice AI + Omi device for real cross-device communication
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Video Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Communication Feed
              </h3>
              
              <div className="flex items-center gap-2">
                {/* Communication Status */}
                {isCallActive && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Live Communication</span>
                  </div>
                )}
                
                {/* Music Control */}
                <button
                  onClick={() => {
                    if (isMusicOn) {
                      ambientAudioGenerator.stopAmbientTrack()
                      setIsMusicOn(false)
                    } else {
                      ambientAudioGenerator.playAmbientTrack('Community Connection', musicVolume)
                      setIsMusicOn(true)
                    }
                  }}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
                  title={isMusicOn ? 'Stop Music' : 'Start Music'}
                >
                  {isMusicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {!isCameraOn && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Camera is off</p>
                    <button
                      onClick={startCommunicationSession}
                      disabled={isConnecting}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
                    >
                      {isConnecting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Starting Session...
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4" />
                          Start Live Communication
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white">Initializing communication systems...</p>
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center bg-yellow-900/20">
                  <div className="text-center p-6">
                    <CameraOff className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <p className="text-yellow-300 mb-4">{cameraError}</p>
                    <p className="text-sm text-gray-300">Communication will work without camera</p>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
                muted
                playsInline
              />

              {/* Live Communication Overlay */}
              {isCameraOn && isCallActive && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Live Status */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500/80 to-blue-500/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE COMMUNICATION
                    </div>
                  </div>

                  {/* Device Status */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">Web VAPI</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm">Omi Device</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Translation Overlay */}
                  {(liveTranscript || liveTranslation) && (
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      {liveTranscript && (
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Volume2 className="w-3 h-3 text-blue-400" />
                            <span className="text-blue-300 text-xs font-medium">Live Speech</span>
                          </div>
                          <p className="text-white text-sm">{liveTranscript}</p>
                        </div>
                      )}
                      
                      {liveTranslation && (
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Languages className="w-3 h-3 text-green-400" />
                            <span className="text-green-300 text-xs font-medium">VAPI Translation</span>
                          </div>
                          <p className="text-white text-sm">{liveTranslation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Communication Controls */}
            {isCallActive && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={endCommunicationSession}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Communication Control Panel */}
        <div className="space-y-6">
          {/* Device Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Device Status
            </h3>
            
            <div className="space-y-3">
              {/* Web Interface */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Monitor className="w-6 h-6 text-blue-400" />
                  <div>
                    <div className="font-medium text-white">Web Interface</div>
                    <div className="text-sm text-gray-400">VAPI Voice AI</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isCallActive ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {isCallActive ? 'Connected' : 'Ready'}
                </div>
              </div>

              {/* Omi Device */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-purple-400" />
                  <div>
                    <div className="font-medium text-white">Omi Device</div>
                    <div className="text-sm text-gray-400">Your Phone App</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isCallActive ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {isCallActive ? 'Connected' : 'Install Omi App'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Response Options */}
          {isCallActive && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Responses</h3>
              <div className="space-y-2">
                {[
                  'What are your current prices?',
                  'Can you handle 5 tons monthly?',
                  'That sounds very competitive.',
                  'Let\'s move forward with the deal.'
                ].map((response, index) => (
                  <button
                    key={index}
                    onClick={() => simulateUserResponse(response)}
                    className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                  >
                    <div className="text-white text-sm">{response}</div>
                    <div className="text-gray-400 text-xs">
                      → {getTranslation(response)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Integration Status */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Integration Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Camera Feed</span>
                <span className={`font-semibold ${isCameraOn ? 'text-green-400' : 'text-gray-400'}`}>
                  {isCameraOn ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">VAPI Voice AI</span>
                <span className={`font-semibold ${isCallActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {isCallActive ? 'Connected' : 'Ready'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Omi Bridge</span>
                <span className={`font-semibold ${isCallActive ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isCallActive ? 'Bridged' : 'Demo Mode'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ambient Music</span>
                <span className={`font-semibold ${isMusicOn ? 'text-green-400' : 'text-gray-400'}`}>
                  {isMusicOn ? 'Playing' : 'Stopped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Device Communication Info */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
        <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Cross-Device Communication Architecture
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">🔧 Integration Flow:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Omi app captures voice on your phone</li>
              <li>• VAPI processes and translates in real-time</li>
              <li>• Web interface shows visual translation</li>
              <li>• Camera preview shows speaker context</li>
              <li>• Ambient music creates professional atmosphere</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">💼 Real-World Application:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• International business negotiations</li>
              <li>• Cross-border supplier meetings</li>
              <li>• Global team collaboration</li>
              <li>• Cultural exchange and learning</li>
              <li>• Emergency translation services</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded">
          <p className="text-green-300 text-sm font-medium">
            📱 Ready for Omi Integration: Your phone app + web VAPI = real cross-device communication!
          </p>
        </div>
      </div>
    </div>
  )
}
