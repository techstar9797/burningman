import { apiConfig } from '@/config/api'

export interface UIComponent {
  id: string
  name: string
  type: 'button' | 'card' | 'input' | 'modal' | 'navigation'
  code: string
  preview: string
  category: string
}

export interface ComponentRequest {
  type: 'button' | 'card' | 'input' | 'modal' | 'navigation'
  style: 'modern' | 'glassmorphism' | 'neon' | 'minimal' | 'burning-man'
  purpose: string
  colors?: string[]
}

class TwentyFirstDevAPI {
  private credits = apiConfig.twentyFirstDev.credits

  async generateComponent(request: ComponentRequest): Promise<UIComponent> {
    try {
      // For demo, we'll return pre-made components that match the Burning Man aesthetic
      return this.getPrebuiltComponent(request)
    } catch (error) {
      console.error('21st.dev API error:', error)
      return this.getPrebuiltComponent(request)
    }
  }

  async getAvailableComponents(): Promise<UIComponent[]> {
    return [
      {
        id: 'burning-button',
        name: 'Burning Button',
        type: 'button',
        code: `
<button className="group relative px-8 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25">
  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
  <span className="relative z-10 text-white font-bold tracking-wide">
    🔥 Burn Bright
  </span>
</button>`,
        preview: 'A fiery button with burning animation effects',
        category: 'Interactive'
      },
      {
        id: 'playa-card',
        name: 'Playa Card',
        type: 'card',
        code: `
<div className="group relative bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-indigo-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-white/10">
  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
  <div className="relative z-10">
    <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">✨</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">Desert Magic</h3>
    <p className="text-gray-300">Experience the transformative power of community and creativity</p>
  </div>
</div>`,
        preview: 'A mystical card with desert-inspired gradients',
        category: 'Layout'
      },
      {
        id: 'dust-storm-input',
        name: 'Dust Storm Input',
        type: 'input',
        code: `
<div className="relative">
  <input 
    type="text" 
    placeholder="Enter your vision..."
    className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-orange-500/30 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
  />
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-pulse"></div>
  </div>
</div>`,
        preview: 'An input field with desert storm aesthetics',
        category: 'Form'
      }
    ]
  }

  private getPrebuiltComponent(request: ComponentRequest): UIComponent {
    const components: Record<string, UIComponent> = {
      button: {
        id: 'ai-burn-button',
        name: 'AI Burn Button',
        type: 'button',
        code: `
<button className="group relative px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  <span className="relative z-10 text-white font-semibold flex items-center gap-2">
    <span className="animate-pulse">🔥</span>
    ${request.purpose || 'Create Magic'}
  </span>
</button>`,
        preview: 'A magical button with AI-powered burning effects',
        category: 'Interactive'
      },
      card: {
        id: 'community-card',
        name: 'Community Card',
        type: 'card',
        code: `
<div className="group relative bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:scale-102 hover:bg-white/5">
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
  <div className="relative z-10">
    <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
      <span className="text-2xl">🌟</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">${request.purpose || 'Community Connection'}</h3>
    <p className="text-gray-300">Building bridges between creators, dreamers, and innovators</p>
  </div>
</div>`,
        preview: 'A community-focused card with interactive hover effects',
        category: 'Layout'
      },
      input: {
        id: 'cosmic-input',
        name: 'Cosmic Input',
        type: 'input',
        code: `
<div className="relative">
  <input 
    type="text" 
    placeholder="${request.purpose || 'Enter your vision...'}"
    className="w-full px-4 py-3 bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
  />
  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-pulse"></div>
  </div>
</div>`,
        preview: 'A cosmic input field with purple energy',
        category: 'Form'
      },
      modal: {
        id: 'dream-modal',
        name: 'Dream Modal',
        type: 'modal',
        code: `
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-4">${request.purpose || 'Dream Modal'}</h3>
    <p className="text-gray-300 mb-6">Experience the magic of the playa in this ethereal modal window.</p>
    <div className="flex gap-3">
      <button className="flex-1 py-2 px-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 transition-all">
        Accept
      </button>
      <button className="flex-1 py-2 px-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
        Cancel
      </button>
    </div>
  </div>
</div>`,
        preview: 'A dreamy modal with Burning Man aesthetics',
        category: 'Overlay'
      },
      navigation: {
        id: 'fire-nav',
        name: 'Fire Navigation',
        type: 'navigation',
        code: `
<nav className="bg-black/20 backdrop-blur-lg border-b border-orange-500/20">
  <div className="container mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <div className="text-2xl font-bold text-white">🔥 ${request.purpose || 'FireNav'}</div>
      <div className="flex space-x-6">
        <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Home</a>
        <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">About</a>
        <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors">Contact</a>
      </div>
    </div>
  </div>
</nav>`,
        preview: 'A fiery navigation bar with burning aesthetics',
        category: 'Navigation'
      }
    }

    return components[request.type] || components.button
  }

  getRemainingCredits(): number {
    return this.credits
  }

  useCredits(amount: number): boolean {
    if (this.credits >= amount) {
      this.credits -= amount
      return true
    }
    return false
  }
}

export const twentyFirstDevAPI = new TwentyFirstDevAPI()
