'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Heart, 
  MessageCircle, 
  Share2, 
  Globe, 
  BarChart3,
  Users,
  Zap,
  Loader
} from 'lucide-react'
import { apifyAPI, EventIntelligence, SocialMediaInsight } from '@/lib/apify'

export default function EventInsights() {
  const [intelligence, setIntelligence] = useState<EventIntelligence | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    loadEventIntelligence()
  }, [])

  const loadEventIntelligence = async () => {
    setIsLoading(true)
    try {
      const data = await apifyAPI.scrapeEventMentions('Burning Heroes Hackathon')
      setIntelligence(data)
    } catch (error) {
      console.error('Failed to load event intelligence:', error)
    }
    setIsLoading(false)
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 80) return 'text-green-400'
    if (sentiment >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSentimentBg = (sentiment: number) => {
    if (sentiment >= 80) return 'bg-green-500/20'
    if (sentiment >= 60) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return '🐦'
      case 'instagram': return '📸'
      case 'linkedin': return '💼'
      case 'facebook': return '👥'
      default: return '🌐'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Analyzing event buzz across social media...</p>
          <p className="text-sm text-gray-500 mt-2">Powered by Apify web intelligence</p>
        </div>
      </div>
    )
  }

  if (!intelligence) {
    return (
      <div className="text-center py-12">
        <Globe className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Event Intelligence</h3>
        <p className="text-gray-400 mb-4">Real-time social media monitoring and analytics</p>
        <button
          onClick={loadEventIntelligence}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Load Intelligence
        </button>
      </div>
    )
  }

  const filteredInsights = selectedPlatform === 'all' 
    ? intelligence.socialInsights 
    : intelligence.socialInsights.filter(insight => 
        insight.platform.toLowerCase() === selectedPlatform.toLowerCase()
      )

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Event Intelligence</h2>
        <p className="text-gray-300 mb-6">
          Real-time social media monitoring powered by Apify web scraping
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{intelligence.totalMentions.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Total Mentions</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Heart className={`w-8 h-8 mx-auto mb-2 ${getSentimentColor(intelligence.overallSentiment)}`} />
          <div className={`text-2xl font-bold ${getSentimentColor(intelligence.overallSentiment)}`}>
            {intelligence.overallSentiment}%
          </div>
          <div className="text-sm text-gray-300">Positive Sentiment</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{intelligence.socialInsights.length}</div>
          <div className="text-sm text-gray-300">Platforms</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
        >
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{intelligence.trendingTopics.length}</div>
          <div className="text-sm text-gray-300">Trending Topics</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Social Media Insights */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Social Media Insights
            </h3>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-white/10 text-white rounded-lg px-3 py-1 text-sm border border-white/20"
            >
              <option value="all">All Platforms</option>
              {intelligence.socialInsights.map(insight => (
                <option key={insight.platform} value={insight.platform.toLowerCase()}>
                  {insight.platform}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.platform}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getPlatformIcon(insight.platform)}</span>
                    <span className="font-semibold text-white">{insight.platform}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentBg(
                    insight.sentiment === 'positive' ? 85 : insight.sentiment === 'negative' ? 25 : 50
                  )}`}>
                    {insight.sentiment}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Mentions:</span>
                    <span className="text-white ml-2 font-semibold">{insight.mentions}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Engagement:</span>
                    <span className="text-white ml-2 font-semibold">{insight.engagement}</span>
                  </div>
                </div>

                {/* Top Posts */}
                {insight.topPosts.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">Top Post:</p>
                    <div className="bg-white/5 rounded p-2">
                      <p className="text-sm text-gray-300 mb-1">"{insight.topPosts[0].content}"</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>@{insight.topPosts[0].author}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {insight.topPosts[0].likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {insight.topPosts[0].shares}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending Topics & Competitor Analysis */}
        <div className="space-y-6">
          {/* Trending Topics */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {intelligence.trendingTopics.map((topic, index) => (
                <motion.span
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30"
                >
                  {topic}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Competitor Analysis */}
          {intelligence.competitorAnalysis.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Competitor Analysis
              </h3>
              <div className="space-y-3">
                {intelligence.competitorAnalysis.map((competitor, index) => (
                  <motion.div
                    key={competitor.eventName}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <span className="text-white font-medium">{competitor.eventName}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 text-sm">{competitor.mentions} mentions</span>
                      <span className={`text-sm font-medium ${getSentimentColor(competitor.sentiment)}`}>
                        {competitor.sentiment}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={loadEventIntelligence}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Refreshing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Globe className="w-4 h-4" />
                Refresh Intelligence
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
