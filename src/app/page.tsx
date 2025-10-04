'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, Video, Globe, Sparkles, Users, Calendar, Palette, Camera, UserPlus, Languages, TrendingUp, Flag, Zap } from 'lucide-react'
import VoiceAssistant from '@/components/VoiceAssistant'
import EventDashboard from '@/components/EventDashboard'
import VideoGenerator from '@/components/VideoGenerator'
import EventInsights from '@/components/EventInsights'
import UIShowcase from '@/components/UIShowcase'
import LivePreview from '@/components/LivePreview'
import CommunityBuilder from '@/components/CommunityBuilder'
import GlobalMarketplace from '@/components/GlobalMarketplace'
import TariffIntelligence from '@/components/TariffIntelligence'
import GlobalTradeHub from '@/components/SlavicTradeHub'
import LiveVapiDemo from '@/components/LiveVapiDemo'
import LiveApifyDemo from '@/components/LiveApifyDemo'
import RealTimeTranslation from '@/components/RealTimeTranslation'
import LocationAwareTranslation from '@/components/LocationAwareTranslation'
import LiveTradeInterpreter from '@/components/LiveTradeInterpreter'
import LiveCommunicationHub from '@/components/LiveCommunicationHub'
import RealVapiCall from '@/components/RealVapiCall'
import RealApifyExtraction from '@/components/RealApifyExtraction'
import OmiDirectIntegration from '@/components/OmiDirectIntegration'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Event Dashboard', icon: Calendar },
    { id: 'voice', label: 'Voice Assistant', icon: Mic },
    { id: 'live-vapi', label: 'Real VAPI Call', icon: Languages },
    { id: 'live-apify', label: 'Real Apify Data', icon: Zap },
    { id: 'video', label: 'Video Generator', icon: Video },
    { id: 'insights', label: 'Event Insights', icon: Globe },
    { id: 'community', label: 'Community Builder', icon: UserPlus },
    { id: 'marketplace', label: 'Global Marketplace', icon: Languages },
    { id: 'global-trade', label: 'Global Trade Hub', icon: Flag },
    { id: 'tariffs', label: 'Tariff Intelligence', icon: TrendingUp },
    { id: 'live', label: 'Live Communication', icon: Camera },
    { id: 'ui', label: 'UI Components', icon: Palette }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-violet-500/20" />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Burning Man Global Marketplace
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              AI-powered voice marketplace that overcomes language barriers and enables informed decisions 
              in rapidly changing geopolitics and tariffs. Built for the Burning Man spirit of radical inclusion and global connection.
            </p>
            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Languages className="w-5 h-5" />
                <span>Voice AI Translation</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Geopolitical Intelligence</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>Global Marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Radical Inclusion</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 min-h-[500px]"
        >
          {activeTab === 'dashboard' && <EventDashboard />}
          {activeTab === 'voice' && <VoiceAssistant />}
          {activeTab === 'live-vapi' && <RealVapiCall />}
          {activeTab === 'live-apify' && <RealApifyExtraction />}
          {activeTab === 'video' && <VideoGenerator />}
          {activeTab === 'insights' && <EventInsights />}
          {activeTab === 'community' && <CommunityBuilder />}
          {activeTab === 'marketplace' && <GlobalMarketplace />}
          {activeTab === 'global-trade' && <GlobalTradeHub />}
          {activeTab === 'tariffs' && <TariffIntelligence />}
          {activeTab === 'live' && <LiveCommunicationHub />}
          {activeTab === 'ui' && <UIShowcase />}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>Built with ❤️ for Burning Heroes x EF Hackathon 2025</p>
        <p className="text-sm mt-2">AI-powered global marketplace breaking language barriers in international trade</p>
        <p className="text-xs mt-1">Powered by VAPI, Apify, Higgsfield, Google Maps, and advanced geopolitical intelligence</p>
      </div>
    </div>
  )
}