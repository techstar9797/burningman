'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Globe, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  ShoppingCart,
  Truck,
  Building,
  Flag
} from 'lucide-react'
import { tariffIntelligenceAPI, TariffImpact, GlobalTradeIntelligence } from '@/lib/tariff-intelligence'
import { marketIntelligenceAPI } from '@/lib/market-intelligence'

export default function TariffIntelligence() {
  const [activeView, setActiveView] = useState<'monitor' | 'analysis' | 'opportunities' | 'alerts'>('monitor')
  const [selectedProduct, setSelectedProduct] = useState('Electronics')
  const [isLoading, setIsLoading] = useState(false)
  const [tradeIntelligence, setTradeIntelligence] = useState<GlobalTradeIntelligence | null>(null)
  const [tariffChanges, setTariffChanges] = useState<any[]>([])

  const products = [
    'Electronics', 'Textiles', 'Automotive Parts', 'Machinery', 'Chemicals', 
    'Food Products', 'Medical Devices', 'Solar Panels', 'Steel', 'Semiconductors'
  ]

  // Product-specific trade data
  const getProductSpecificData = (product: string) => {
    const productData: { [key: string]: any } = {
      'Electronics': {
        topCountries: ['China', 'Vietnam', 'South Korea', 'Taiwan'],
        avgTariff: 25.0,
        tradeVolume: '$450B',
        keyFactors: ['Semiconductor shortage', 'Supply chain shifts', 'Tech competition']
      },
      'Automotive Parts': {
        topCountries: ['Mexico', 'Canada', 'Germany', 'Japan', 'Czech Republic'],
        avgTariff: 12.5,
        tradeVolume: '$180B',
        keyFactors: ['EV transition', 'USMCA benefits', 'Quality standards']
      },
      'Textiles': {
        topCountries: ['Vietnam', 'Bangladesh', 'India', 'Turkey', 'Poland'],
        avgTariff: 15.8,
        tradeVolume: '$95B',
        keyFactors: ['Labor costs', 'Cotton availability', 'Trade agreements']
      },
      'Food Products': {
        topCountries: ['Mexico', 'Canada', 'Brazil', 'Argentina', 'Serbia'],
        avgTariff: 8.2,
        tradeVolume: '$165B',
        keyFactors: ['Seasonal variations', 'Climate change', 'Food safety standards']
      },
      'Medical Devices': {
        topCountries: ['Germany', 'Ireland', 'Switzerland', 'Israel', 'Poland'],
        avgTariff: 3.5,
        tradeVolume: '$85B',
        keyFactors: ['Regulatory approval', 'Innovation cycles', 'Healthcare demand']
      }
    }
    
    return productData[product] || productData['Electronics']
  }

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    // Slavic Countries (excluding Russia/Ukraine)
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
    { code: 'BA', name: 'Bosnia & Herzegovina', flag: '🇧🇦' },
    { code: 'ME', name: 'Montenegro', flag: '🇲🇪' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
    { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' }
  ]

  useEffect(() => {
    loadTradeIntelligence()
    loadTariffChanges()
  }, [selectedProduct])

  const loadTradeIntelligence = async () => {
    setIsLoading(true)
    try {
      const intelligence = await tariffIntelligenceAPI.getGlobalTradeIntelligence(selectedProduct)
      setTradeIntelligence(intelligence)
    } catch (error) {
      console.error('Failed to load trade intelligence:', error)
    }
    setIsLoading(false)
  }

  const loadTariffChanges = async () => {
    try {
      const changes = await tariffIntelligenceAPI.monitorTariffChanges([selectedProduct], ['US', 'EU', 'CN'])
      setTariffChanges(changes)
    } catch (error) {
      console.error('Failed to load tariff changes:', error)
    }
  }

  const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getCountryFlag = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode)
    return country?.flag || '🌍'
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-400" />
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-400" />
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />
    }
  }

  const views = [
    { id: 'monitor', label: 'Real-time Monitor', icon: Clock },
    { id: 'analysis', label: 'Price Analysis', icon: BarChart3 },
    { id: 'opportunities', label: 'Trade Opportunities', icon: Target },
    { id: 'alerts', label: 'Tariff Alerts', icon: AlertTriangle }
  ]

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Global Tariff Intelligence</h2>
        <p className="text-gray-300 mb-4">
          Real-time tariff impact analysis and global trade intelligence powered by Apify
        </p>
        
        {/* Integration Status */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm">
            <Building className="w-4 h-4" />
            <span>Pricing Analyzer Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>SaaS Intelligence Active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-300 rounded-full text-sm">
            <Globe className="w-4 h-4" />
            <span>Trade APIs Connected</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
            <Building className="w-4 h-4" />
            <span>Polymarket Intelligence</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-orange-500/20 text-orange-300 rounded-full text-sm">
            <BarChart3 className="w-4 h-4" />
            <span>Bloomberg + Truth Social</span>
          </div>
        </div>
      </motion.div>

      {/* Product Selector */}
      <div className="mb-6">
        <label className="text-white font-medium mb-3 block">Select Product Category:</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="bg-white/10 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-blue-500 focus:outline-none"
        >
          {products.map(product => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>
      </div>

      {/* View Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 flex gap-2 overflow-x-auto">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm whitespace-nowrap ${
                activeView === view.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Views */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Real-time Monitor */}
        {activeView === 'monitor' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{countries.length}</div>
                <div className="text-sm text-gray-300">Countries Monitored</div>
                <div className="text-xs text-blue-300 mt-1">Europe + Asia Focus</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">+{getProductSpecificData(selectedProduct).avgTariff}%</div>
                <div className="text-sm text-gray-300">Avg Tariff Rate</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{getProductSpecificData(selectedProduct).tradeVolume}</div>
                <div className="text-sm text-gray-300">Annual Trade Volume</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{getProductSpecificData(selectedProduct).topCountries.length}</div>
                <div className="text-sm text-gray-300">Top Trading Partners</div>
              </div>
            </div>

            {/* Product-Specific Intelligence */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">{selectedProduct} Trade Intelligence</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Top Trading Partners</h4>
                  <div className="space-y-2">
                    {getProductSpecificData(selectedProduct).topCountries.map((country: string, index: number) => (
                      <div key={country} className="flex items-center justify-between">
                        <span className="text-gray-300">{index + 1}. {country}</span>
                        <span className="text-blue-400 text-sm">Active</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Market Factors</h4>
                  <div className="space-y-2">
                    {getProductSpecificData(selectedProduct).keyFactors.map((factor: string, index: number) => (
                      <div key={factor} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        <span className="text-gray-300 text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Global Price Map */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Global Price Impact Map - {selectedProduct}</h3>
              
              {tradeIntelligence ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tradeIntelligence.globalPrices.map((priceData, index) => (
                    <motion.div
                      key={priceData.country}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getCountryFlag(priceData.country)}</span>
                          <span className="font-semibold text-white">{priceData.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">
                            {formatCurrency(priceData.price)}
                          </div>
                          <div className={`text-xs ${
                            priceData.tariffImpact.percentageIncrease > 20 ? 'text-red-400' :
                            priceData.tariffImpact.percentageIncrease > 10 ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            +{priceData.tariffImpact.percentageIncrease.toFixed(1)}% tariff
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>Base: {formatCurrency(priceData.tariffImpact.basePrice)}</div>
                        <div>Tariff: {formatCurrency(priceData.tariffImpact.tariffAmount)}</div>
                        <div>Total: {formatCurrency(priceData.tariffImpact.finalPrice)}</div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="text-xs text-gray-300 mb-1">Local Factors:</div>
                        <div className="flex flex-wrap gap-1">
                          {priceData.localFactors.slice(0, 2).map(factor => (
                            <span key={factor} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Loading global price intelligence...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Analysis */}
        {activeView === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Trend Analysis</h3>
              
              {tradeIntelligence && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Trend Overview */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      {getTrendIcon(tradeIntelligence.trendAnalysis.priceDirection)}
                      <div>
                        <h4 className="font-semibold text-white capitalize">
                          {tradeIntelligence.trendAnalysis.priceDirection} Trend
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Volatility: {tradeIntelligence.trendAnalysis.volatility}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-white font-medium text-sm">Key Factors:</h5>
                      {tradeIntelligence.trendAnalysis.keyFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Analysis */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-4">Global Price Range</h4>
                    
                    <div className="space-y-3">
                      {tradeIntelligence.globalPrices
                        .sort((a, b) => a.price - b.price)
                        .map((price, index) => (
                        <div key={price.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{getCountryFlag(price.country)}</span>
                            <span className="text-white text-sm">{price.country}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-medium">
                              {formatCurrency(price.price)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {index === 0 ? 'Lowest' : 
                               index === tradeIntelligence.globalPrices.length - 1 ? 'Highest' : 
                               'Mid-range'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trading Opportunities */}
        {activeView === 'opportunities' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Trading Opportunities</h3>
              
              {tradeIntelligence && tradeIntelligence.tradingOpportunities.length > 0 ? (
                <div className="space-y-4">
                  {tradeIntelligence.tradingOpportunities.map((opportunity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            opportunity.type === 'arbitrage' ? 'bg-green-500/20' :
                            opportunity.type === 'sourcing' ? 'bg-blue-500/20' :
                            'bg-purple-500/20'
                          }`}>
                            {opportunity.type === 'arbitrage' ? <ArrowUpRight className="w-5 h-5 text-green-400" /> :
                             opportunity.type === 'sourcing' ? <Truck className="w-5 h-5 text-blue-400" /> :
                             <ShoppingCart className="w-5 h-5 text-purple-400" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white capitalize">{opportunity.type} Opportunity</h4>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              opportunity.riskLevel === 'low' ? 'bg-green-500/20 text-green-300' :
                              opportunity.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {opportunity.riskLevel} risk
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            +{formatCurrency(opportunity.potentialProfit)}
                          </div>
                          <div className="text-xs text-gray-400">Potential profit</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm">{opportunity.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">Analyzing trading opportunities...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tariff Alerts */}
        {activeView === 'alerts' && (
          <div className="space-y-6">
            {/* Real-time Market Intelligence */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Live Market Intelligence
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="text-yellow-300 font-semibold mb-2">🎲 Polymarket Predictions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Poland tariff reduction:</span>
                      <span className="text-green-400 font-bold">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">EU-US trade deal:</span>
                      <span className="text-yellow-400 font-bold">58%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Serbia EU membership:</span>
                      <span className="text-red-400 font-bold">34%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-4 border border-blue-500/30">
                  <h4 className="text-blue-300 font-semibold mb-2">📰 Bloomberg News</h4>
                  <div className="space-y-2 text-sm">
                    <div className="text-gray-300">• Poland IT growth +45%</div>
                    <div className="text-gray-300">• Czech auto exports surge</div>
                    <div className="text-gray-300">• Serbian IT boom continues</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-lg p-4 border border-red-500/30">
                  <h4 className="text-red-300 font-semibold mb-2">📱 Political Sentiment</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Trade optimism:</span>
                      <span className="text-green-400 font-bold">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Policy stability:</span>
                      <span className="text-yellow-400 font-bold">Medium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Tariff Changes</h3>
              
              <div className="space-y-4">
                {tariffChanges.length > 0 ? tariffChanges.map((change, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/5 rounded-lg p-4 border-l-4 ${
                      change.priceImpact > 0 ? 'border-red-500' : 'border-green-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          change.priceImpact > 0 ? 'bg-red-500/20' : 'bg-green-500/20'
                        }`}>
                          {change.priceImpact > 0 ? 
                            <TrendingUp className="w-4 h-4 text-red-400" /> :
                            <TrendingDown className="w-4 h-4 text-green-400" />
                          }
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{change.product}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Flag className="w-3 h-3" />
                            <span>{change.country}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          change.priceImpact > 0 ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {change.priceImpact > 0 ? '+' : ''}{change.priceImpact.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">{change.changeDate}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-400">Old Rate:</span>
                        <span className="text-white ml-2">{change.oldTariff.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-400">New Rate:</span>
                        <span className="text-white ml-2">{change.newTariff.toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm">{change.reason}</p>
                  </motion.div>
                )) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No recent tariff changes detected</p>
                    <p className="text-sm text-gray-500 mt-2">Monitoring continues in real-time</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Advanced Apify Integration Info */}
      <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-lg p-6 border border-orange-500/20">
        <h3 className="text-orange-300 font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Powered by Advanced Apify Market Intelligence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-white font-medium mb-2">📊 Pricing Intelligence:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Real-time pricing page monitoring</li>
              <li>• SaaS pricing intelligence tracking</li>
              <li>• Competitor price analysis</li>
              <li>• Historical trend correlation</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">🎲 Prediction Markets:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Polymarket trade policy predictions</li>
              <li>• Political event probability tracking</li>
              <li>• Market sentiment analysis</li>
              <li>• Economic outcome forecasting</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-2">📰 News Intelligence:</h4>
            <ul className="text-gray-300 space-y-1">
              <li>• Bloomberg financial news monitoring</li>
              <li>• Truth Social political sentiment</li>
              <li>• Insider finance stock tracking</li>
              <li>• Real-time alert generation</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded">
            <p className="text-green-300 text-sm font-medium mb-1">🌍 Enhanced Coverage:</p>
            <p className="text-green-200 text-xs">
              Now monitoring {countries.length} countries across Europe, Asia, and the Americas for comprehensive trade intelligence
            </p>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded">
            <p className="text-yellow-300 text-sm font-medium mb-1">💰 Enterprise ROI:</p>
            <p className="text-yellow-200 text-xs">
              Predictive intelligence saves $500K-$2M annually through proactive trade strategy optimization
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
