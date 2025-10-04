'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Coffee, 
  Utensils, 
  Music,
  Award,
  Wifi,
  Heart
} from 'lucide-react'

export default function EventDashboard() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })

  const events = [
    {
      id: '1',
      title: 'Check-in & Tea Ceremony',
      time: '9:00 AM',
      location: 'Main Entrance',
      status: 'completed',
      icon: Coffee,
      description: 'Welcome to Burning Heroes! Start your day with a mindful tea ceremony.'
    },
    {
      id: '2', 
      title: 'Kickoff & Team Formation',
      time: '10:00 AM',
      location: 'Main Stage',
      status: 'completed',
      icon: Users,
      description: 'Meet fellow builders, form teams, and get ready to create something amazing.'
    },
    {
      id: '3',
      title: 'Build Time & Mentor Sessions',
      time: '10:30 AM - 5:00 PM',
      location: 'Throughout Venue',
      status: 'active',
      icon: Clock,
      description: 'Time to build! Mentors from top companies are available to help.'
    },
    {
      id: '4',
      title: 'Slavic Food Lunch',
      time: '1:00 PM',
      location: 'Dining Area',
      status: 'upcoming',
      icon: Utensils,
      description: 'Enjoy delicious plov, pirozhki, crepes and fresh vegetables.'
    },
    {
      id: '5',
      title: 'Sound Healing Meditation',
      time: '2:00 - 3:00 PM',
      location: 'Meditation Dome',
      status: 'upcoming',
      icon: Music,
      description: 'Recharge your mind and body with sound healing and breathwork.'
    },
    {
      id: '6',
      title: 'Final Demos & Judging',
      time: '5:00 - 7:00 PM',
      location: 'Demo Stage',
      status: 'upcoming',
      icon: Award,
      description: 'Show off your creation and compete for amazing prizes!'
    }
  ]

  const stats = [
    { label: 'Registered Hackers', value: '120+', icon: Users },
    { label: 'Mentors Available', value: '15', icon: Heart },
    { label: 'Prize Categories', value: '5', icon: Award },
    { label: 'Hours to Build', value: '6.5', icon: Clock }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'active': return 'bg-blue-500 animate-pulse'
      case 'upcoming': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'active': return 'Happening Now'
      case 'upcoming': return 'Coming Up'
      default: return 'Scheduled'
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Event Dashboard</h2>
        <p className="text-gray-300 mb-6">
          Current time: <span className="font-semibold text-blue-400">{currentTime}</span> • 
          Burning Heroes x EF Hackathon 2025
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
          >
            <stat.icon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </h3>
          <div className="space-y-3">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 backdrop-blur-sm rounded-lg p-4 cursor-pointer transition-all hover:bg-white/10 ${
                  selectedEvent === event.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.status)}`} />
                  <event.icon className="w-5 h-5 text-blue-400" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <span className="text-sm text-gray-400">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        event.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                        event.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {getStatusText(event.status)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedEvent === event.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-white/10"
                  >
                    <p className="text-gray-300 text-sm">{event.description}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Quick Info
          </h3>
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">WiFi Access</h4>
              <p className="text-gray-300 text-sm mb-2">Network: <span className="text-blue-400 font-mono">BurningHeroes2025</span></p>
              <p className="text-gray-300 text-sm">Password: <span className="text-blue-400 font-mono">hackathon</span></p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Mentor Availability</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• OpenAI, Anthropic mentors: Until 4 PM</li>
                <li>• Google, Vercel experts: All day</li>
                <li>• 21st.dev, Rork teams: 11 AM - 3 PM</li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Prize Categories</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>🏆 Overall Winner</li>
                <li>🎙️ Voice Track (Vapi)</li>
                <li>🎬 VideoGen Track (Higgsfield)</li>
                <li>🕷️ Web Scraping (Apify)</li>
                <li>⭐ Special Varg.ai Prize</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-pink-500/20 to-violet-500/20 backdrop-blur-sm rounded-lg p-4 border border-pink-500/20">
              <h4 className="font-semibold text-white mb-2">🔥 Burning Man Spirit</h4>
              <p className="text-gray-300 text-sm">
                Remember: This is about self-expression, community, and creating art through code. 
                Let your creativity burn bright!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
