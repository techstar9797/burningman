'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Globe, 
  Languages, 
  Clock,
  Users,
  Building,
  Phone,
  Zap,
  CheckCircle,
  Loader,
  Navigation
} from 'lucide-react'
import { locationIntelligenceAPI, LocationIntelligence } from '@/lib/location-intelligence'

export default function LocationAwareTranslation() {
  const [userLocation, setUserLocation] = useState<LocationIntelligence | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [selectedBusinessLocation, setSelectedBusinessLocation] = useState<string>('')
  const [callContext, setCallContext] = useState<any>(null)
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  useEffect(() => {
    checkLocationPermission()
  }, [])

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied')
      return
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' })
      setLocationPermission(permission.state as any)
      
      if (permission.state === 'granted') {
        await getUserLocationIntelligence()
      }
    } catch (error) {
      console.warn('Permission check failed:', error)
      setLocationPermission('unknown')
    }
  }

  const getUserLocationIntelligence = async () => {
    setIsLoadingLocation(true)
    
    try {
      console.log('📍 Getting user location...')
      const coords = await locationIntelligenceAPI.getUserLocation()
      
      if (coords) {
        console.log('🗺️ Getting location intelligence...')
        const intelligence = await locationIntelligenceAPI.getLocationIntelligence(coords)
        setUserLocation(intelligence)
        console.log('✅ Location intelligence loaded:', intelligence.userLocation.city)
      } else {
        // Use demo location
        const demoIntelligence = await locationIntelligenceAPI.getLocationIntelligence('Belgrade, Serbia')
        setUserLocation(demoIntelligence)
        console.log('🎭 Using demo location: Belgrade, Serbia')
      }
    } catch (error) {
      console.error('Location intelligence failed:', error)
      // Fallback to demo data
      const demoIntelligence = await locationIntelligenceAPI.getLocationIntelligence('Belgrade, Serbia')
      setUserLocation(demoIntelligence)
    }
    
    setIsLoadingLocation(false)
  }

  const calculateCallContext = async (targetLocation: string) => {
    if (!userLocation) return

    try {
      console.log('📞 Calculating call context...')
      const context = await locationIntelligenceAPI.getCallLocationContext(
        `${userLocation.userLocation.city}, ${userLocation.userLocation.country}`,
        targetLocation
      )
      setCallContext(context)
    } catch (error) {
      console.error('Call context calculation failed:', error)
    }
  }

  const formatTimezoneDiff = (hours: number): string => {
    if (hours === 0) return 'Same timezone'
    const direction = hours > 0 ? 'ahead' : 'behind'
    return `${Math.abs(hours)} hours ${direction}`
  }

  const getLocationFlag = (country: string): string => {
    const flags: { [key: string]: string } = {
      'Serbia': '🇷🇸', 'China': '🇨🇳', 'India': '🇮🇳', 'Vietnam': '🇻🇳',
      'Poland': '🇵🇱', 'Czech Republic': '🇨🇿', 'Croatia': '🇭🇷',
      'United States': '🇺🇸', 'Germany': '🇩🇪', 'France': '🇫🇷'
    }
    return flags[country] || '🌍'
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Location-Aware Translation</h2>
        <p className="text-gray-300 mb-6">
          AI-powered translation with location intelligence and cultural context
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Location Intelligence */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Your Location Intelligence</h3>
            
            {locationPermission !== 'granted' && (
              <button
                onClick={getUserLocationIntelligence}
                disabled={isLoadingLocation}
                className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingLocation ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {isLoadingLocation ? 'Loading...' : 'Get Location'}
              </button>
            )}
          </div>

          {userLocation ? (
            <div className="space-y-4">
              {/* Location Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{getLocationFlag(userLocation.userLocation.country)}</span>
                  <div>
                    <h4 className="font-semibold text-white">
                      {userLocation.userLocation.city}, {userLocation.userLocation.country}
                    </h4>
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{userLocation.userLocation.region}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Primary Language:</span>
                    <div className="text-white font-medium">{userLocation.userLocation.primaryLanguage}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Currency:</span>
                    <div className="text-white font-medium">{userLocation.userLocation.currency}</div>
                  </div>
                  <div>
                    <span className="text-gray-400">Business Hours:</span>
                    <div className="text-white font-medium">
                      {userLocation.userLocation.businessHours.open} - {userLocation.userLocation.businessHours.close}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Timezone:</span>
                    <div className="text-white font-medium">{userLocation.userLocation.timezone}</div>
                  </div>
                </div>
              </div>

              {/* Cultural Context */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Cultural Context
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400 text-sm">Business Style:</span>
                    <p className="text-gray-300 text-sm">{userLocation.communicationContext.negotiationStyle}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Local Customs:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {userLocation.userLocation.localCustoms.slice(0, 3).map(custom => (
                        <span key={custom} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                          {custom}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nearby Businesses */}
              {userLocation.nearbyBusinesses.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Local Business Intelligence
                  </h4>
                  <div className="space-y-2">
                    {userLocation.nearbyBusinesses.slice(0, 3).map((business, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                        <div>
                          <div className="text-white text-sm font-medium">{business.name}</div>
                          <div className="text-gray-400 text-xs">{business.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 text-sm">★ {business.rating}</div>
                          <div className="text-gray-400 text-xs">{business.reviews} reviews</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : isLoadingLocation ? (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Getting location intelligence...</p>
              <p className="text-sm text-gray-500 mt-2">Powered by Google Maps + Apify</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Location access needed for intelligent translation</p>
              <button
                onClick={getUserLocationIntelligence}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Enable Location Intelligence
              </button>
            </div>
          )}
        </div>

        {/* Call Context Calculator */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Cross-Cultural Call Context</h3>
          
          <div className="mb-6">
            <label className="text-white font-medium mb-3 block">Target Business Location:</label>
            <select
              value={selectedBusinessLocation}
              onChange={(e) => {
                setSelectedBusinessLocation(e.target.value)
                if (e.target.value) {
                  calculateCallContext(e.target.value)
                }
              }}
              className="w-full bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20"
            >
              <option value="">Select target location</option>
              <option value="Chicago, United States">🇺🇸 Chicago, United States</option>
              <option value="Shanghai, China">🇨🇳 Shanghai, China</option>
              <option value="Mumbai, India">🇮🇳 Mumbai, India</option>
              <option value="Ho Chi Minh City, Vietnam">🇻🇳 Ho Chi Minh City, Vietnam</option>
              <option value="Warsaw, Poland">🇵🇱 Warsaw, Poland</option>
              <option value="Prague, Czech Republic">🇨🇿 Prague, Czech Republic</option>
            </select>
          </div>

          {callContext ? (
            <div className="space-y-4">
              {/* Timezone Information */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Timing Intelligence
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time Difference:</span>
                    <span className="text-blue-400 font-medium">
                      {formatTimezoneDiff(callContext.timezoneDifference)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Optimal Call Times:</span>
                    <div className="mt-1">
                      {callContext.optimalCallTimes.slice(0, 2).map((time: string, index: number) => (
                        <span key={index} className="inline-block px-2 py-1 bg-green-500/20 text-green-300 rounded mr-2 text-xs">
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cultural Bridge */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Cultural Intelligence
                </h4>
                <div className="space-y-2">
                  {callContext.culturalContext.map((context: string, index: number) => (
                    <div key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span>{context}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Communication Tips */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4" />
                  Communication Tips
                </h4>
                <div className="space-y-2">
                  {callContext.communicationTips.map((tip: string, index: number) => (
                    <div key={index} className="text-gray-300 text-sm flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Etiquette */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-3">Business Etiquette</h4>
                <div className="flex flex-wrap gap-1">
                  {callContext.businessEtiquette.slice(0, 4).map((etiquette: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                      {etiquette}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : selectedBusinessLocation ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Calculating cultural context...</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Select a target location to see call context</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Intelligence Status */}
      <div className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
        <h3 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Google Maps + Apify Location Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">✅ Location Features:</h4>
            <ul className="text-gray-300 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Real-time location detection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Cultural context intelligence
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Business hours optimization
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-400" />
                Local business discovery
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">🎯 Intelligence Sources:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Google Maps API via Apify actor</li>
              <li>• Cultural intelligence database</li>
              <li>• Timezone and business hour data</li>
              <li>• Local business and market context</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded">
          <p className="text-blue-300 text-sm font-medium">
            🗺️ Powered by Apify Google Maps Actor: Real-time location intelligence for global business communication
          </p>
        </div>
      </div>
    </div>
  )
}
