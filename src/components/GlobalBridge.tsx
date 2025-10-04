'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Globe, 
  Clock, 
  Users, 
  Zap, 
  MessageCircle, 
  Heart,
  Brain,
  Lightbulb,
  ArrowRight,
  MapPin,
  Moon,
  Sun,
  Coffee,
  Code,
  Search,
  Share2,
  Star
} from 'lucide-react'

interface GlobalParticipant {
  id: string
  name: string
  location: string
  timezone: string
  localTime: string
  status: 'active' | 'helping' | 'researching' | 'creating'
  contribution: string
  expertise: string[]
  avatar: string
}

interface TimezoneBridge {
  timezone: string
  location: string
  localTime: string
  participants: number
  activity: string
  advantage: string
  icon: any
}

export default function GlobalBridge() {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'participants' | 'relay' | 'intelligence'>('overview')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const globalParticipants: GlobalParticipant[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      location: 'Tokyo, Japan',
      timezone: 'JST',
      localTime: '3:15 AM',
      status: 'helping',
      contribution: 'Debugging React components for SF team while they sleep',
      expertise: ['React', 'TypeScript', 'UI/UX'],
      avatar: '🇯🇵'
    },
    {
      id: '2',
      name: 'Marcus Weber',
      location: 'Berlin, Germany', 
      timezone: 'CET',
      localTime: '9:15 PM',
      status: 'researching',
      contribution: 'Researching European AI regulations for the project',
      expertise: ['AI Ethics', 'Legal Tech', 'Policy'],
      avatar: '🇩🇪'
    },
    {
      id: '3',
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      timezone: 'IST', 
      localTime: '12:45 AM',
      status: 'creating',
      contribution: 'Creating social media content to amplify the hackathon',
      expertise: ['Social Media', 'Content', 'Marketing'],
      avatar: '🇮🇳'
    },
    {
      id: '4',
      name: 'Alex Thompson',
      location: 'London, UK',
      timezone: 'GMT',
      localTime: '8:15 PM',
      status: 'active',
      contribution: 'Providing real-time feedback on pitch presentation',
      expertise: ['Business Strategy', 'Pitching', 'Fundraising'],
      avatar: '🇬🇧'
    }
  ]

  const timezoneBridges: TimezoneBridge[] = [
    {
      timezone: 'PST (San Francisco)',
      location: 'Event Location',
      localTime: '12:15 PM',
      participants: 120,
      activity: 'Active Building & Demos',
      advantage: 'High energy, in-person collaboration',
      icon: Sun
    },
    {
      timezone: 'JST (Tokyo)',
      location: 'Asia Pacific',
      localTime: '3:15 AM',
      participants: 45,
      activity: 'Deep Focus Development',
      advantage: 'Night owl productivity, fresh perspective',
      icon: Moon
    },
    {
      timezone: 'CET (Berlin)',
      location: 'Europe',
      localTime: '9:15 PM',
      participants: 67,
      activity: 'Research & Analysis',
      advantage: 'Evening wind-down, thoughtful reflection',
      icon: Coffee
    },
    {
      timezone: 'EST (New York)',
      location: 'East Coast',
      localTime: '3:15 PM',
      participants: 89,
      activity: 'Business Development',
      advantage: 'Peak business hours, networking time',
      icon: Zap
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'helping': return 'bg-blue-500'
      case 'researching': return 'bg-purple-500' 
      case 'creating': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return Users
      case 'helping': return Heart
      case 'researching': return Search
      case 'creating': return Share2
      default: return Globe
    }
  }

  const demos = [
    { id: 'overview', label: 'Global Bridge', icon: Globe },
    { id: 'participants', label: 'Live Participants', icon: Users },
    { id: 'relay', label: 'Timezone Relay', icon: Clock },
    { id: 'intelligence', label: 'Distributed Intel', icon: Brain }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Global Event Bridge</h2>
        <p className="text-gray-300 mb-4">
          Connecting global community to local events - where distance creates connection, not separation
        </p>
        
        {/* Unique Value Proposition */}
        <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20 mb-6">
          <h3 className="text-orange-300 font-semibold mb-2 flex items-center gap-2">
            🌍 Beyond YouTube & Zoom
          </h3>
          <p className="text-orange-200 text-sm">
            We don't just stream events - we bridge communities. Remote participants become active contributors, 
            not passive viewers. Your timezone becomes your superpower.
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
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
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
        {/* Global Bridge Overview */}
        {activeDemo === 'overview' && (
          <div className="space-y-8">
            {/* World Map Visualization */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Live Global Participation
              </h3>
              
              <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('/world-map.svg')] bg-center bg-no-repeat opacity-20"></div>
                
                {/* Animated Connection Lines */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  {timezoneBridges.map((bridge, index) => (
                    <motion.div
                      key={bridge.timezone}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-3 relative">
                        <bridge.icon className="w-8 h-8 text-white" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {bridge.participants}
                        </div>
                      </div>
                      <div className="text-white font-semibold text-sm">{bridge.location}</div>
                      <div className="text-gray-400 text-xs">{bridge.localTime}</div>
                      <div className="text-blue-300 text-xs mt-1">{bridge.activity}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Differentiators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Active Participation</h4>
                <p className="text-gray-300 text-sm">
                  Remote participants don't just watch - they contribute code, research, content, and expertise in real-time.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Context Intelligence</h4>
                <p className="text-gray-300 text-sm">
                  AI bridges cultural and contextual gaps, making remote participation as meaningful as local presence.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-2">Timezone Advantage</h4>
                <p className="text-gray-300 text-sm">
                  Different timezones become strategic advantages - night owls debug while locals sleep, fresh perspectives emerge.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Live Participants */}
        {activeDemo === 'participants' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Global Participants Right Now</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {globalParticipants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{participant.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{participant.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(participant.status)} animate-pulse`} />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{participant.location}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{participant.localTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(getStatusIcon(participant.status), { className: "w-4 h-4 text-blue-400" })}
                        <span className="text-sm font-medium text-blue-300 capitalize">{participant.status}</span>
                      </div>
                      <p className="text-gray-300 text-sm">{participant.contribution}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {participant.expertise.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Live Activity Stream</h3>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', user: 'Sarah Chen', action: 'Fixed critical bug in authentication module', location: 'Tokyo' },
                  { time: '5 min ago', user: 'Marcus Weber', action: 'Shared EU AI compliance research document', location: 'Berlin' },
                  { time: '8 min ago', user: 'Priya Sharma', action: 'Posted hackathon highlight reel on Instagram', location: 'Mumbai' },
                  { time: '12 min ago', user: 'Alex Thompson', action: 'Connected team with London-based VC for feedback', location: 'London' }
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="text-white text-sm">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </div>
                      <div className="text-gray-400 text-xs flex items-center gap-2 mt-1">
                        <span>{activity.time}</span>
                        <span>•</span>
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Timezone Relay */}
        {activeDemo === 'relay' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">24-Hour Development Relay</h3>
              <p className="text-gray-300 text-sm mb-6">
                Watch how the hackathon never stops - as one timezone sleeps, another picks up the work
              </p>
              
              <div className="space-y-4">
                {[
                  { 
                    time: '12:00 PM PST', 
                    location: 'San Francisco', 
                    phase: 'Active Development',
                    description: 'Teams building, mentors available, high energy collaboration',
                    status: 'current'
                  },
                  {
                    time: '3:00 AM JST',
                    location: 'Tokyo',
                    phase: 'Night Owl Debugging',
                    description: 'Deep focus time, debugging complex issues, code optimization',
                    status: 'active'
                  },
                  {
                    time: '9:00 PM CET',
                    location: 'Berlin',
                    phase: 'Research & Documentation',
                    description: 'Evening wind-down time perfect for research and documentation',
                    status: 'active'
                  },
                  {
                    time: '3:00 PM EST',
                    location: 'New York',
                    phase: 'Business Development',
                    description: 'Peak business hours, investor connections, market validation',
                    status: 'active'
                  }
                ].map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`relative p-4 rounded-lg border-l-4 ${
                      phase.status === 'current' 
                        ? 'bg-blue-500/20 border-blue-500' 
                        : 'bg-white/5 border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          phase.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'
                        }`} />
                        <h4 className="font-semibold text-white">{phase.phase}</h4>
                      </div>
                      <div className="text-sm text-gray-400">
                        {phase.time} • {phase.location}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{phase.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Distributed Intelligence */}
        {activeDemo === 'intelligence' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Global Intelligence Network</h3>
              <p className="text-gray-300 text-sm mb-6">
                Remote participants become distributed intelligence, providing research, expertise, and perspectives that locals can't access
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    type: 'Research',
                    icon: Search,
                    title: 'Market Analysis',
                    contributor: 'Marcus (Berlin)',
                    description: 'Researching European AI regulations and compliance requirements',
                    impact: 'High',
                    color: 'purple'
                  },
                  {
                    type: 'Code Review',
                    icon: Code,
                    title: 'Bug Fixes',
                    contributor: 'Sarah (Tokyo)', 
                    description: 'Fixed 3 critical bugs in authentication while SF team sleeps',
                    impact: 'Critical',
                    color: 'red'
                  },
                  {
                    type: 'Content',
                    icon: Share2,
                    title: 'Social Amplification',
                    contributor: 'Priya (Mumbai)',
                    description: 'Created viral content reaching 50K+ people in Asia',
                    impact: 'High',
                    color: 'pink'
                  },
                  {
                    type: 'Networking',
                    icon: Users,
                    title: 'Expert Connections',
                    contributor: 'Alex (London)',
                    description: 'Connected team with 3 potential investors and 2 technical advisors',
                    impact: 'High',
                    color: 'green'
                  },
                  {
                    type: 'Translation',
                    icon: Globe,
                    title: 'Cultural Bridge',
                    contributor: 'Yuki (Osaka)',
                    description: 'Translating Burning Man principles for Japanese audience',
                    impact: 'Medium',
                    color: 'blue'
                  },
                  {
                    type: 'Analysis',
                    icon: Brain,
                    title: 'Data Insights',
                    contributor: 'Raj (Bangalore)',
                    description: 'Analyzed user behavior patterns and provided UX recommendations',
                    impact: 'Medium',
                    color: 'yellow'
                  }
                ].map((intel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-r from-${intel.color}-400 to-${intel.color}-600 rounded-full flex items-center justify-center`}>
                        <intel.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-sm">{intel.title}</h4>
                        <p className="text-gray-400 text-xs">{intel.contributor}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        intel.impact === 'Critical' ? 'bg-red-500/20 text-red-300' :
                        intel.impact === 'High' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {intel.impact}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{intel.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Strategic Advantage Summary */}
      <div className="mt-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
        <h3 className="text-green-300 font-semibold mb-3 flex items-center gap-2">
          <Star className="w-5 h-5" />
          The Unfair Advantage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">What We Enable:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• 24/7 continuous event progress</li>
              <li>• Global expertise on tap</li>
              <li>• Cultural perspective diversity</li>
              <li>• Timezone-optimized contributions</li>
              <li>• Distributed intelligence network</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">Competitive Moat:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Cultural intelligence + AI context bridging</li>
              <li>• Community network effects</li>
              <li>• Timezone arbitrage business model</li>
              <li>• Event-specific intelligence integration</li>
              <li>• Global-local participation bridge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
