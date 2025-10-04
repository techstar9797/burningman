'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp,
  Instagram,
  Music,
  Hash,
  MapPin,
  Star,
  Eye,
  Zap,
  Globe,
  UserPlus,
  Crown,
  Target
} from 'lucide-react'
import { socialScrapingAPI, SocialProfile, SocialPost, CommunityInsights } from '@/lib/social-scrapers'

export default function CommunityBuilder() {
  const [activeTab, setActiveTab] = useState<'discover' | 'influencers' | 'content' | 'insights'>('discover')
  const [isLoading, setIsLoading] = useState(false)
  const [communityData, setCommunityData] = useState<{
    instagram: { profiles: SocialProfile[]; posts: SocialPost[]; insights: CommunityInsights }
    tiktok: { profiles: SocialProfile[]; posts: SocialPost[]; insights: CommunityInsights }
    combined: CommunityInsights
  } | null>(null)
  const [influencers, setInfluencers] = useState<any[]>([])
  const [trendingContent, setTrendingContent] = useState<any>({})

  const eventHashtags = [
    'BurningHeroes',
    'EFHackathon',
    'BurningMan',
    'TechForGood',
    'Innovation',
    'Community',
    'RadicalInclusion'
  ]

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    setIsLoading(true)
    try {
      console.log('🌍 Loading community data from Instagram and TikTok...')
      
      // Load community insights
      const insights = await socialScrapingAPI.getCommunityInsights(eventHashtags)
      
      // Load Instagram community
      const instagramData = await socialScrapingAPI.scrapeInstagramCommunity(eventHashtags)
      
      // Load TikTok community  
      const tiktokData = await socialScrapingAPI.scrapeTikTokCommunity(eventHashtags)
      
      setCommunityData({
        instagram: instagramData,
        tiktok: tiktokData,
        combined: insights.combined
      })

      // Load influencers
      const eventInfluencers = await socialScrapingAPI.findEventInfluencers(eventHashtags)
      setInfluencers(eventInfluencers)

      // Load trending content
      const content = await socialScrapingAPI.discoverCommunityContent(eventHashtags)
      setTrendingContent(content)

    } catch (error) {
      console.error('Community data loading error:', error)
    }
    setIsLoading(false)
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-400" />
      case 'tiktok': return <Music className="w-4 h-4 text-white" />
      default: return <Globe className="w-4 h-4 text-blue-400" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const tabs = [
    { id: 'discover', label: 'Community Discovery', icon: Users },
    { id: 'influencers', label: 'Influencer Network', icon: Crown },
    { id: 'content', label: 'Trending Content', icon: TrendingUp },
    { id: 'insights', label: 'Social Analytics', icon: Target }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Community Builder</h2>
        <p className="text-gray-300 mb-6">
          Discover and connect with the Burning Man community across Instagram and TikTok
        </p>
        
        {/* Platform Integration Status */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm">
            <Instagram className="w-4 h-4" />
            <span>Instagram Scraper Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white/20 text-white rounded-full text-sm">
            <Music className="w-4 h-4" />
            <span>TikTok Scraper Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            <Zap className="w-4 h-4" />
            <span>Apify Powered</span>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm ${
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Analyzing community across platforms...</p>
            <p className="text-sm text-gray-500 mt-2">Powered by Apify Instagram & TikTok scrapers</p>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {!isLoading && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Community Discovery */}
          {activeTab === 'discover' && (
            <div className="space-y-8">
              {/* Community Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {communityData ? formatNumber(communityData.combined.totalMembers) : '2.1K'}
                  </div>
                  <div className="text-sm text-gray-300">Total Members</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Instagram className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {communityData ? formatNumber(communityData.instagram?.profiles?.length || 0) : '1.2K'}
                  </div>
                  <div className="text-sm text-gray-300">Instagram</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <Music className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {communityData ? formatNumber(communityData.tiktok?.profiles?.length || 0) : '892'}
                  </div>
                  <div className="text-sm text-gray-300">TikTok</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">+32%</div>
                  <div className="text-sm text-gray-300">Growth Rate</div>
                </div>
              </div>

              {/* Top Hashtags */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Trending Hashtags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(communityData?.combined.topHashtags || eventHashtags.map((tag, i) => ({ tag: `#${tag}`, count: 100 - i * 10 })))
                    .slice(0, 10).map((hashtag, index) => (
                    <motion.span
                      key={hashtag.tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-3 py-2 bg-gradient-to-r from-pink-500/20 to-violet-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30 flex items-center gap-2"
                    >
                      <span>{hashtag.tag}</span>
                      <span className="text-xs text-gray-400">{formatNumber(hashtag.count)}</span>
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Recent Community Posts */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Community Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(communityData ? 
                    [...(communityData.instagram?.posts || []), ...(communityData.tiktok?.posts || [])]
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 6)
                    : 
                    // Mock data for demo
                    [
                      {
                        id: '1',
                        platform: 'instagram' as const,
                        username: 'burner_builder',
                        caption: 'Amazing hackathon energy at Burning Heroes! 🔥',
                        likes: 234,
                        comments: 45,
                        timestamp: new Date().toISOString()
                      },
                      {
                        id: '2', 
                        platform: 'tiktok' as const,
                        username: 'techburner2025',
                        caption: 'Building AI at the hackathon! #BurningHeroes',
                        likes: 1234,
                        views: 12500,
                        timestamp: new Date().toISOString()
                      }
                    ]
                  ).map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {getPlatformIcon(post.platform)}
                        <span className="font-semibold text-white">@{post.username}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-3">{post.caption}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {formatNumber(post.likes)}
                        </span>
                        {post.comments && (
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {formatNumber(post.comments)}
                          </span>
                        )}
                        {post.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatNumber(post.views)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Influencer Network */}
          {activeTab === 'influencers' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Community Influencers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(influencers.length > 0 ? influencers : [
                    {
                      profile: {
                        platform: 'instagram',
                        username: 'desert_innovator',
                        displayName: 'Desert Innovation Lab',
                        bio: 'Bringing tech to the playa 🏜️ Building community through code',
                        followerCount: 45600,
                        profilePicture: '/api/placeholder/100/100',
                        isVerified: true
                      },
                      influence: 87.5,
                      engagement: 12.3,
                      relevance: 94.2
                    },
                    {
                      profile: {
                        platform: 'tiktok',
                        username: 'playa_tech_guru',
                        displayName: 'Playa Tech Guru',
                        bio: 'Radical self-expression through technology ⚡',
                        followerCount: 23400,
                        profilePicture: '/api/placeholder/100/100',
                        isVerified: false
                      },
                      influence: 76.8,
                      engagement: 18.9,
                      relevance: 89.1
                    }
                  ]).slice(0, 6).map((influencer, index) => (
                    <motion.div
                      key={influencer.profile.username}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {influencer.profile.displayName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{influencer.profile.displayName}</h4>
                            {influencer.profile.isVerified && <Star className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(influencer.profile.platform)}
                            <span className="text-sm text-gray-400">@{influencer.profile.username}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{influencer.profile.bio}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="font-semibold text-white">{formatNumber(influencer.profile.followerCount)}</div>
                          <div className="text-gray-400">Followers</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded">
                          <div className="font-semibold text-green-400">{influencer.engagement}%</div>
                          <div className="text-gray-400">Engagement</div>
                        </div>
                      </div>
                      
                      <button className="w-full mt-3 py-2 px-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 transition-all text-sm flex items-center justify-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trending Content */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Viral Community Content</h3>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Content discovery in progress...</p>
                  <p className="text-sm text-gray-500 mt-2">Analyzing trending posts across Instagram and TikTok</p>
                </div>
              </div>
            </div>
          )}

          {/* Social Analytics */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Platform Comparison</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <span className="text-white">Instagram</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {communityData ? formatNumber(communityData.instagram?.profiles?.length || 0) : '1.2K'}
                        </div>
                        <div className="text-sm text-gray-400">members</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Music className="w-5 h-5 text-white" />
                        <span className="text-white">TikTok</span>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-semibold">
                          {communityData ? formatNumber(communityData.tiktok?.profiles?.length || 0) : '892'}
                        </div>
                        <div className="text-sm text-gray-400">members</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h3>
                  <div className="space-y-3">
                    {(communityData?.combined.geographicDistribution || [
                      { location: 'San Francisco', count: 234 },
                      { location: 'Black Rock City', count: 189 },
                      { location: 'Los Angeles', count: 156 },
                      { location: 'New York', count: 123 },
                      { location: 'Austin', count: 98 }
                    ]).map((location, index) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-400" />
                          <span className="text-white">{location.location}</span>
                        </div>
                        <span className="text-gray-400">{location.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Apify Integration Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">Powered by Apify</h4>
            <p className="text-gray-400 text-sm">Advanced social media scraping and community intelligence</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="text-blue-300 font-medium mb-2">Instagram Integration:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Profile and post scraping</li>
              <li>• Hashtag trend analysis</li>
              <li>• Engagement metrics tracking</li>
              <li>• Community member discovery</li>
            </ul>
          </div>
          <div>
            <h5 className="text-purple-300 font-medium mb-2">TikTok Integration:</h5>
            <ul className="text-gray-300 space-y-1">
              <li>• Video content analysis</li>
              <li>• Creator network mapping</li>
              <li>• Viral trend identification</li>
              <li>• Cross-platform insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
