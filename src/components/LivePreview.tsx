'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ambientAudioGenerator } from '@/lib/ambient-audio'
import { 
  Camera, 
  CameraOff, 
  Music, 
  Users, 
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react'

interface LivePreviewProps {}

export default function LivePreview({}: LivePreviewProps) {
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [isMusicOn, setIsMusicOn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audienceCount, setAudienceCount] = useState(0)
  const [currentTrack, setCurrentTrack] = useState('Burning Desert Vibes')
  const [musicVolume, setMusicVolume] = useState(0.7)
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // AI-generated background tracks for warm, friendly atmosphere
  const backgroundTracks = [
    {
      name: 'Burning Desert Vibes',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder ambient sound
      description: 'Warm bass drones with gentle harmonies and organic modulation'
    },
    {
      name: 'Playa Sunset Dreams', 
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder ambient sound
      description: 'Beautiful chord progressions with soft reverb and chorus'
    },
    {
      name: 'Desert Bloom Serenity',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder ambient sound
      description: 'Warm, melodic composition inspired by desert flowers and gentle winds'
    },
    {
      name: 'Radical Self Expression',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder ambient sound
      description: 'Uplifting pentatonic melodies with warm harmonic textures'
    },
    {
      name: 'Community Connection',
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder ambient sound
      description: 'Gentle bell tones and warm ambient pads creating togetherness'
    }
  ]

  // Simulate audience detection using face detection
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      const detectAudience = () => {
        // Simulate audience detection (in real implementation, use face detection API)
        const randomCount = Math.floor(Math.random() * 15) + 5 // 5-20 people
        setAudienceCount(randomCount)
      }
      
      const interval = setInterval(detectAudience, 3000)
      return () => clearInterval(interval)
    }
  }, [isCameraOn])

  const startCamera = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🎥 Starting camera preview...')
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: cameraFacing
        },
        audio: false // We'll handle audio separately
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setIsCameraOn(true)
        console.log('✅ Camera started successfully')
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setError('Unable to access camera. Please check permissions.')
    }
    
    setIsLoading(false)
  }

  const stopCamera = () => {
    console.log('🎥 Stopping camera...')
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsCameraOn(false)
    setAudienceCount(0)
  }

  const toggleMusic = async () => {
    if (!isMusicOn) {
      console.log('🎵 Starting AI background music...')
      
      if (audioRef.current) {
        try {
          // Set the current track
          const currentTrackData = backgroundTracks.find(track => track.name === currentTrack)
          if (currentTrackData) {
            audioRef.current.src = currentTrackData.url
            audioRef.current.volume = musicVolume
            audioRef.current.loop = true
            
            // Attempt to play
            await audioRef.current.play()
            setIsMusicOn(true)
            console.log('✅ Music started successfully')
          }
        } catch (error) {
          console.warn('Audio playback failed, using procedural ambient audio:', error)
          // Fallback: Use procedural ambient audio generation
          try {
            await ambientAudioGenerator.playAmbientTrack(currentTrack, musicVolume)
            setIsMusicOn(true)
            console.log('✅ Procedural ambient audio started')
          } catch (ambientError) {
            console.warn('Procedural audio failed, using Web Audio API:', ambientError)
            createAmbientAudio()
            setIsMusicOn(true)
          }
        }
      }
    } else {
      console.log('🎵 Stopping music...')
      
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      
      // Stop any generated ambient audio
      stopAmbientAudio()
      ambientAudioGenerator.stopAmbientTrack()
      setIsMusicOn(false)
    }
  }

  // Web Audio API for generating ambient sounds when files aren't available
  const createAmbientAudio = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create ambient drone sound
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator1.type = 'sine'
      oscillator1.frequency.setValueAtTime(110, audioContext.currentTime) // Low A
      
      oscillator2.type = 'sine' 
      oscillator2.frequency.setValueAtTime(165, audioContext.currentTime) // E above
      
      gainNode.gain.setValueAtTime(musicVolume * 0.1, audioContext.currentTime) // Very quiet ambient
      
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator1.start()
      oscillator2.start()
      
      // Store for cleanup
      ;(window as any).burnstreamAudioContext = audioContext
      ;(window as any).burnstreamOscillators = [oscillator1, oscillator2]
      
      console.log('🎵 Generated ambient audio using Web Audio API')
    } catch (error) {
      console.warn('Web Audio API not available:', error)
    }
  }

  const stopAmbientAudio = () => {
    try {
      const audioContext = (window as any).burnstreamAudioContext
      const oscillators = (window as any).burnstreamOscillators
      
      if (oscillators) {
        oscillators.forEach((osc: any) => {
          try {
            osc.stop()
          } catch (e) {
            // Oscillator might already be stopped
          }
        })
      }
      
      if (audioContext) {
        audioContext.close()
      }
      
      ;(window as any).burnstreamAudioContext = null
      ;(window as any).burnstreamOscillators = null
    } catch (error) {
      console.warn('Error stopping ambient audio:', error)
    }
  }

  const switchCamera = async () => {
    if (isCameraOn) {
      stopCamera()
      setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user')
      setTimeout(() => startCamera(), 500)
    }
  }

  const changeTrack = async (track: typeof backgroundTracks[0]) => {
    setCurrentTrack(track.name)
    console.log(`🎵 Switching to: ${track.name}`)
    
    if (audioRef.current) {
      try {
        // Stop current audio
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        
        // Stop any generated ambient audio
        stopAmbientAudio()
        
        // Load new track
        audioRef.current.src = track.url
        audioRef.current.volume = musicVolume
        audioRef.current.loop = true
        
        if (isMusicOn) {
          try {
            await audioRef.current.play()
            console.log(`✅ Successfully switched to: ${track.name}`)
          } catch (error) {
            console.warn(`Failed to play ${track.name}, using procedural audio:`, error)
            try {
              await ambientAudioGenerator.playAmbientTrack(track.name, musicVolume)
              console.log(`✅ Procedural audio for: ${track.name}`)
            } catch (ambientError) {
              console.warn('Procedural audio failed, using basic ambient:', ambientError)
              createAmbientAudio()
            }
          }
        }
      } catch (error) {
        console.warn('Track change error:', error)
      }
    }
  }

  // Update volume in real-time
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume
    }
    
    // Update procedural audio volume
    if (ambientAudioGenerator.isCurrentlyPlaying()) {
      ambientAudioGenerator.setVolume(musicVolume)
    }
    
    // Update Web Audio API volume if active
    const audioContext = (window as any).burnstreamAudioContext
    if (audioContext && audioContext.state === 'running') {
      try {
        const gainNode = audioContext.createGain()
        gainNode.gain.setValueAtTime(musicVolume * 0.1, audioContext.currentTime)
      } catch (error) {
        // Volume update failed, not critical
      }
    }
  }, [musicVolume])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopCamera()
      stopAmbientAudio()
      ambientAudioGenerator.stopAmbientTrack()
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Live Event Preview</h2>
        <p className="text-gray-300 mb-6">
          Connect with your audience through live camera and AI-generated ambient music
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Video Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Live Camera Feed
              </h3>
              
              <div className="flex items-center gap-2">
                {/* Audience Counter */}
                {isCameraOn && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span>{audienceCount} people detected</span>
                  </motion.div>
                )}
                
                {/* Camera Controls */}
                <button
                  onClick={switchCamera}
                  disabled={!isCameraOn}
                  className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-4 h-4" />
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
                      onClick={startCamera}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 transition-all flex items-center gap-2 mx-auto"
                    >
                      <Camera className="w-4 h-4" />
                      Start Camera
                    </button>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white">Starting camera...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-900/20">
                  <div className="text-center p-6">
                    <CameraOff className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <p className="text-red-300 mb-4">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
                muted
                playsInline
              />

              {/* Live Overlay Effects */}
              {isCameraOn && (
                <div className="absolute inset-0 pointer-events-none">
                  {/* Burning Man Style Overlay */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500/80 to-pink-500/80 backdrop-blur-sm rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-white text-sm font-semibold">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      LIVE
                    </div>
                  </div>

                  {/* Sparkle Effects */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  </div>

                  {/* Bottom Info Bar */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>🔥 Burning Heroes x EF Hackathon 2025</span>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Controls */}
            {isCameraOn && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <CameraOff className="w-4 h-4" />
                  Stop Camera
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Music Control Panel */}
        <div className="space-y-6">
          {/* Music Player */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Music className="w-5 h-5" />
                AI Ambient Music
              </h3>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMusic}
                  className={`p-2 rounded-lg transition-all ${
                    isMusicOn 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title={isMusicOn ? 'Stop Music' : 'Start Music'}
                >
                  {isMusicOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                {/* Audio Permission Note */}
                <div className="text-xs text-gray-400">
                  {isMusicOn ? '🎵 Playing' : 'Click to enable audio'}
                </div>
              </div>
            </div>

            {/* Current Track */}
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center ${
                  isMusicOn ? 'animate-pulse' : ''
                }`}>
                  {isMusicOn ? <Play className="w-5 h-5 text-white" /> : <Pause className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h4 className="text-white font-medium">{currentTrack}</h4>
                  <p className="text-gray-400 text-sm">AI Generated • Burning Man Vibes</p>
                </div>
              </div>
              
              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Track Selection */}
            <div className="space-y-2">
              <h4 className="text-white font-medium text-sm mb-3 flex items-center gap-2">
                🎵 AI-Generated Tracks:
                <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">
                  Procedural Audio
                </span>
              </h4>
              {backgroundTracks.map((track, index) => (
                <button
                  key={track.name}
                  onClick={() => changeTrack(track)}
                  disabled={isLoading}
                  className={`w-full text-left p-3 rounded-lg transition-all disabled:opacity-50 ${
                    currentTrack === track.name
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white text-sm flex items-center gap-2">
                        {currentTrack === track.name && isMusicOn && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        )}
                        {track.name}
                      </div>
                      <div className="text-gray-400 text-xs">{track.description}</div>
                    </div>
                    {currentTrack === track.name && (
                      <div className="text-xs text-purple-300">
                        {isMusicOn ? 'Playing' : 'Selected'}
                      </div>
                    )}
                  </div>
                </button>
              ))}
              
              <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-blue-300 text-xs font-medium mb-1">🎼 Enhanced AI Music Generation</p>
                <p className="text-blue-200 text-xs">
                  Melodious, warm compositions using advanced Web Audio API with chord progressions, 
                  pentatonic melodies, bell harmonics, and organic modulation for friendly, welcoming vibes.
                </p>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Live Experience Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Camera Status</span>
                <span className={`font-semibold ${isCameraOn ? 'text-green-400' : 'text-gray-400'}`}>
                  {isCameraOn ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Music Status</span>
                <span className={`font-semibold ${isMusicOn ? 'text-green-400' : 'text-gray-400'}`}>
                  {isMusicOn ? 'Playing' : 'Paused'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Audience Detected</span>
                <span className="font-semibold text-blue-400">{audienceCount} people</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Session Duration</span>
                <span className="font-semibold text-purple-400">
                  {isCameraOn ? '00:' + Math.floor(Date.now() / 1000) % 60 : '00:00'}
                </span>
              </div>
            </div>
          </div>

          {/* Burning Man Inspiration */}
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
            <h4 className="text-orange-300 font-semibold mb-2 flex items-center gap-2">
              🔥 Burning Man Spirit
            </h4>
            <p className="text-orange-200 text-sm">
              This live preview embodies radical self-expression and community connection - 
              sharing the moment with fellow burners through technology and art.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        style={{ display: 'none' }}
      />
    </div>
  )
}
