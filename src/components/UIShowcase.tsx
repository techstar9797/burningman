'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Palette, Code, Sparkles, Copy, Check } from 'lucide-react'
import { twentyFirstDevAPI, ComponentRequest, UIComponent } from '@/lib/21stdev'

export default function UIShowcase() {
  const [selectedComponent, setSelectedComponent] = useState<UIComponent | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)
  const [availableComponents, setAvailableComponents] = useState<UIComponent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    const components = await twentyFirstDevAPI.getAvailableComponents()
    setAvailableComponents(components)
    if (components.length > 0) {
      setSelectedComponent(components[0])
    }
  }

  const generateCustomComponent = async (request: ComponentRequest) => {
    setIsLoading(true)
    try {
      const component = await twentyFirstDevAPI.generateComponent(request)
      setSelectedComponent(component)
      setAvailableComponents(prev => [component, ...prev])
    } catch (error) {
      console.error('Component generation error:', error)
    }
    setIsLoading(false)
  }

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const quickGenerate = (type: ComponentRequest['type'], purpose: string) => {
    generateCustomComponent({
      type,
      style: 'burning-man',
      purpose,
      colors: ['#ff6b35', '#f7931e', '#ffd700', '#ff1493', '#8a2be2']
    })
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">UI Component Showcase</h2>
        <p className="text-gray-300 mb-6">
          Beautiful, AI-generated components powered by 21st.dev
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Component Library */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Component Library
            </h3>
            
            <div className="space-y-2">
              {availableComponents.map((component, index) => (
                <motion.button
                  key={component.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedComponent(component)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedComponent?.id === component.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30'
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="font-medium text-white">{component.name}</div>
                  <div className="text-sm text-gray-400">{component.category}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Quick Generate */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Generate
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => quickGenerate('button', 'Join the Burn')}
                disabled={isLoading}
                className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
              >
                🔥 Fire Button
              </button>
              
              <button
                onClick={() => quickGenerate('card', 'Community Hub')}
                disabled={isLoading}
                className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                ✨ Magic Card
              </button>
              
              <button
                onClick={() => quickGenerate('input', 'Dream Input')}
                disabled={isLoading}
                className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50"
              >
                🌟 Cosmic Input
              </button>
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="lg:col-span-2 space-y-6">
          {selectedComponent && (
            <>
              {/* Live Preview */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-lg p-8 min-h-[200px] flex items-center justify-center">
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedComponent.code }}
                    className="component-preview"
                  />
                </div>
                <p className="text-gray-400 text-sm mt-3">{selectedComponent.preview}</p>
              </div>

              {/* Code Display */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Component Code
                  </h3>
                  <button
                    onClick={() => copyToClipboard(selectedComponent.code)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{selectedComponent.code}</code>
                  </pre>
                </div>
              </div>

              {/* Component Info */}
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Component Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white ml-2 font-medium">{selectedComponent.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white ml-2 font-medium capitalize">{selectedComponent.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="text-white ml-2 font-medium">{selectedComponent.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Style:</span>
                    <span className="text-white ml-2 font-medium">Burning Man Aesthetic</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!selectedComponent && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 text-center">
              <Palette className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Select a Component</h3>
              <p className="text-gray-400">Choose from the library or generate a custom component</p>
            </div>
          )}
        </div>
      </div>

      {/* 21st.dev Integration Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">21</span>
          </div>
          <div>
            <h4 className="text-white font-semibold">Powered by 21st.dev</h4>
            <p className="text-gray-400 text-sm">AI-generated UI components for the modern web</p>
          </div>
        </div>
        <p className="text-gray-300 text-sm">
          These components are generated using 21st.dev's AI technology, specifically designed for the Burning Man aesthetic. 
          Each component is production-ready and follows modern React/Tailwind CSS best practices.
        </p>
      </div>
    </div>
  )
}
