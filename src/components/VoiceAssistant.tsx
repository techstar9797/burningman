'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Loader, Phone, Users } from 'lucide-react'
import { vapiWebClient, vapiAPI } from '@/lib/vapi'

interface VoiceAssistantProps {}

export default function VoiceAssistant({}: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'speaking' | 'listening'>('idle')
  const [assistant, setAssistant] = useState<any>(null)

  // Mock responses for demo purposes
  const mockResponses: { [key: string]: string } = {
    'sound healing': 'The sound healing session is happening at 2:00 PM in the Meditation Dome, located near the center camp.',
    'food': 'Slavic food including plov, pirozhki, and crepes is being served at the main dining area from 1:00 PM.',
    'schedule': 'Today\'s schedule: 9 AM check-in, 10 AM kickoff, 1 PM lunch, 2 PM sound healing, 5 PM demos, 7 PM awards.',
    'bathroom': 'The nearest restrooms are located behind the main stage area, about 50 meters from here.',
    'wifi': 'The WiFi network is "BurningHeroes2025" with password "hackathon". Connection points are throughout the venue.',
    'mentors': 'Mentors from OpenAI, Anthropic, Google, and Vercel are available in the Mentor Zone until 4 PM.'
  }

  // Initialize VAPI assistant
  useEffect(() => {
    initializeAssistant()
    setupVapiEventListeners()
  }, [])

  const initializeAssistant = async () => {
    try {
      console.log('🎙️ Initializing VAPI Assistant...')
      const createdAssistant = await vapiAPI.createEventAssistant()
      setAssistant(createdAssistant)
      setIsConnected(true)
      console.log('✅ VAPI Assistant ready:', createdAssistant.id)
    } catch (error) {
      console.error('Failed to initialize VAPI assistant:', error)
      // Fallback to demo mode
      setAssistant({ id: 'demo-assistant', name: 'Demo Assistant' })
      setIsConnected(false)
    }
  }

  const setupVapiEventListeners = () => {
    vapiWebClient.onCallStatusChange((status) => {
      console.log('📞 VAPI Call status:', status)
      setCallStatus(status as any)
      
      if (status === 'started') {
        setIsListening(true)
        setCallStatus('connected')
      } else if (status === 'ended') {
        setIsListening(false)
        setCallStatus('idle')
      } else if (status === 'speaking') {
        setCallStatus('speaking')
      } else if (status === 'listening') {
        setCallStatus('listening')
      }
    })
  }

  const handleStartListening = async () => {
    if (!assistant) {
      console.error('No assistant available')
      return
    }

    setIsLoading(true)
    setCallStatus('connecting')
    
    try {
      console.log('📞 Starting VAPI Web call...')
      await vapiWebClient.startCall(assistant.id)
      setIsListening(true)
      setCallStatus('connected')
      setTranscript('Connected! You can now speak with the AI assistant.')
      setResponse('Hello! I\'m your BurnStream event assistant. How can I help you today?')
    } catch (error) {
      console.error('Failed to start VAPI call:', error)
      
      // Fallback to demo mode
      const queries = Object.keys(mockResponses)
      const randomQuery = queries[Math.floor(Math.random() * queries.length)]
      setTimeout(() => {
        setTranscript(`Where is the ${randomQuery}?`)
        setResponse(mockResponses[randomQuery])
        setIsListening(true)
        setCallStatus('connected')
      }, 1500)
    }
    
    setIsLoading(false)
  }

  const handleStopListening = async () => {
    setIsLoading(true)
    
    try {
      console.log('📞 Ending VAPI call...')
      await vapiWebClient.endCall()
    } catch (error) {
      console.error('Failed to end VAPI call:', error)
    }
    
    setIsListening(false)
    setCallStatus('idle')
    setIsLoading(false)
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-4">AI Voice Assistant</h2>
        <p className="text-gray-300 mb-4">
          Real-time AI voice assistant powered by VAPI. Ask about schedule, food, locations, or mentors.
        </p>
        
        {/* Call Status Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-3 h-3 rounded-full ${
            callStatus === 'connected' ? 'bg-green-500 animate-pulse' :
            callStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
            callStatus === 'speaking' ? 'bg-blue-500 animate-pulse' :
            callStatus === 'listening' ? 'bg-purple-500 animate-pulse' :
            'bg-gray-500'
          }`} />
          <span className="text-sm text-gray-400">
            {callStatus === 'connected' ? 'Connected - Ready to chat' :
             callStatus === 'connecting' ? 'Connecting to AI assistant...' :
             callStatus === 'speaking' ? 'AI is speaking...' :
             callStatus === 'listening' ? 'Listening to you...' :
             'Ready to connect'}
          </span>
        </div>
      </motion.div>

      {/* Voice Interface */}
      <div className="max-w-md mx-auto">
        <motion.div
          className={`relative w-48 h-48 mx-auto mb-8 rounded-full flex items-center justify-center cursor-pointer ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
              : 'bg-gradient-to-r from-blue-500 to-purple-500'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isListening ? handleStopListening : handleStartListening}
          animate={isListening ? { 
            boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 20px rgba(239, 68, 68, 0)']
          } : {}}
          transition={isListening ? { 
            duration: 1.5, 
            repeat: Infinity 
          } : {}}
        >
          {isLoading ? (
            <Loader className="w-16 h-16 text-white animate-spin" />
          ) : isListening ? (
            <MicOff className="w-16 h-16 text-white" />
          ) : (
            <Mic className="w-16 h-16 text-white" />
          )}
        </motion.div>

        <p className="text-gray-300 mb-6">
          {isListening ? 'Listening... Click to stop' : 'Click the microphone to start'}
        </p>
      </div>

      {/* Transcript and Response */}
      {transcript && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-4"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">You</span>
            </div>
            <p className="text-gray-300 text-left">{transcript}</p>
          </div>
          
          {response && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <p className="text-white text-left font-medium">{response}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Sample Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Try asking:</h4>
          <ul className="text-gray-300 text-sm space-y-1 text-left">
            <li>• "Where is the sound healing session?"</li>
            <li>• "What's the schedule for today?"</li>
            <li>• "Where can I find food?"</li>
          </ul>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <h4 className="text-white font-semibold mb-2">Also works for:</h4>
          <ul className="text-gray-300 text-sm space-y-1 text-left">
            <li>• Mentor locations and availability</li>
            <li>• WiFi and technical support</li>
            <li>• Restroom and facility locations</li>
          </ul>
        </div>
      </div>

      {/* Integration Info */}
      <div className="mt-8 space-y-4">
        {/* VAPI Connection Status */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`} />
          <span className="text-gray-400">
            {isConnected ? 'Connected to VAPI AI' : 'Demo Mode (VAPI integration ready)'}
          </span>
        </div>

        {/* Omi Integration */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Omi Integration</h4>
              <p className="text-gray-400 text-sm">Connect via your Omi wearable device</p>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• <strong>Direct Connection:</strong> Use your Omi app to call event organizers</p>
            <p>• <strong>AI Assistant:</strong> Get instant answers about the event</p>
            <p>• <strong>Real-time Help:</strong> Connect with human organizers when needed</p>
            <p>• <strong>Hands-free:</strong> Perfect for when you're building and need quick info</p>
          </div>
        </div>

        {/* Phone Integration */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Organizer Hotline</h4>
              <p className="text-gray-400 text-sm">Direct line to event organizers</p>
            </div>
          </div>
          <div className="text-gray-300 text-sm space-y-2">
            <p>• <strong>24/7 AI Support:</strong> Instant answers to common questions</p>
            <p>• <strong>Human Escalation:</strong> Connect with real organizers for complex issues</p>
            <p>• <strong>Emergency Line:</strong> Priority routing for urgent matters</p>
            <p>• <strong>Multi-language:</strong> Support in multiple languages</p>
          </div>
          
          <div className="mt-3 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
            <p className="text-orange-300 text-sm font-medium">🔥 Burning Man Spirit</p>
            <p className="text-orange-200 text-xs mt-1">
              This AI embodies radical inclusion and community support - always here to help fellow burners!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
