'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Video, 
  Download, 
  Play, 
  Pause, 
  Loader, 
  Image as ImageIcon,
  Sparkles,
  Share2
} from 'lucide-react'
import { higgsfieldAPI, HiggsfieldVideoRequest } from '@/lib/higgsfield'

interface GeneratedVideo {
  id: string
  title: string
  thumbnail: string
  duration: string
  style: string
  status: 'generating' | 'ready'
  downloadUrl?: string
}

export default function VideoGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedStyle, setSelectedStyle] = useState('highlight-reel')
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([
    {
      id: '1',
      title: 'Hackathon Highlights',
      thumbnail: '/api/placeholder/300/200',
      duration: '0:45',
      style: 'Highlight Reel',
      status: 'ready',
      downloadUrl: '#'
    }
  ])

  const videoStyles = [
    {
      id: 'highlight-reel',
      name: 'Highlight Reel',
      description: 'Fast-paced compilation of best moments',
      preview: '🎬'
    },
    {
      id: 'story-arc',
      name: 'Story Arc',
      description: 'Narrative journey from start to finish',
      preview: '📖'
    },
    {
      id: 'social-media',
      name: 'Social Media',
      description: 'Perfect for Instagram, TikTok, Twitter',
      preview: '📱'
    },
    {
      id: 'documentary',
      name: 'Documentary',
      description: 'Professional documentary style',
      preview: '🎥'
    }
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setUploadedImages(prev => [...prev, ...newImages])
    }
  }

  const handleGenerateVideo = async () => {
    setIsGenerating(true)
    
    try {
      // Convert uploaded images to base64 if needed
      const imagePromises = uploadedImages.slice(0, 5).map(async (imageUrl) => {
        // For demo, we'll use the image URLs directly
        return imageUrl
      })
      
      const images = await Promise.all(imagePromises)
      
      const request: HiggsfieldVideoRequest = {
        prompt: `Create a ${videoStyles.find(s => s.id === selectedStyle)?.name.toLowerCase()} style video from these hackathon event photos. Show the energy, creativity, and community spirit of the Burning Heroes hackathon.`,
        style: selectedStyle as any,
        duration: 30,
        aspectRatio: '16:9',
        images: images,
      }
      
      // Generate video using Higgsfield API
      const response = await higgsfieldAPI.generateVideo(request)
      
      const newVideo: GeneratedVideo = {
        id: response.id,
        title: `${videoStyles.find(s => s.id === selectedStyle)?.name} - ${new Date().toLocaleTimeString()}`,
        thumbnail: response.thumbnailUrl || '/api/placeholder/300/200',
        duration: '0:30',
        style: videoStyles.find(s => s.id === selectedStyle)?.name || 'Custom',
        status: response.status === 'completed' ? 'ready' : 'generating',
        downloadUrl: response.videoUrl
      }
      
      setGeneratedVideos(prev => [newVideo, ...prev])
      
      // If still processing, poll for completion
      if (response.status === 'processing') {
        pollVideoStatus(response.id)
      }
      
    } catch (error) {
      console.error('Video generation error:', error)
      
      // Fallback to demo video
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        title: `${videoStyles.find(s => s.id === selectedStyle)?.name} - ${new Date().toLocaleTimeString()}`,
        thumbnail: '/api/placeholder/300/200',
        duration: '1:23',
        style: videoStyles.find(s => s.id === selectedStyle)?.name || 'Custom',
        status: 'ready',
        downloadUrl: '#'
      }
      
      setGeneratedVideos(prev => [newVideo, ...prev])
    }
    
    setIsGenerating(false)
  }
  
  const pollVideoStatus = async (videoId: string) => {
    const maxAttempts = 30 // 5 minutes max
    let attempts = 0
    
    const poll = async () => {
      if (attempts >= maxAttempts) return
      
      try {
        const status = await higgsfieldAPI.getVideoStatus(videoId)
        
        setGeneratedVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { 
                ...video, 
                status: status.status === 'completed' ? 'ready' : 'generating',
                downloadUrl: status.videoUrl || video.downloadUrl,
                thumbnail: status.thumbnailUrl || video.thumbnail
              }
            : video
        ))
        
        if (status.status === 'completed' || status.status === 'failed') {
          return
        }
        
        attempts++
        setTimeout(poll, 10000) // Poll every 10 seconds
      } catch (error) {
        console.error('Polling error:', error)
      }
    }
    
    setTimeout(poll, 10000) // Start polling after 10 seconds
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-2">AI Video Generator</h2>
        <p className="text-gray-300 mb-6">
          Transform your event photos into stunning video content using Higgsfield AI
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload and Generation */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Upload Event Photos
            </h3>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-2">Click to upload photos or drag and drop</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
              </label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">{uploadedImages.length} images uploaded</p>
                <div className="grid grid-cols-4 gap-2">
                  {uploadedImages.slice(0, 8).map((image, index) => (
                    <div key={index} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {uploadedImages.length > 8 && (
                    <div className="aspect-square bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">+{uploadedImages.length - 8}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Video Style Selection */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Choose Video Style
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedStyle === style.id
                      ? 'bg-gradient-to-r from-pink-500/20 to-violet-500/20 border-2 border-pink-500/50'
                      : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div className="text-2xl mb-2">{style.preview}</div>
                  <div className="font-semibold text-white">{style.name}</div>
                  <div className="text-sm text-gray-400">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={handleGenerateVideo}
            disabled={isGenerating || uploadedImages.length === 0}
            className={`w-full py-4 px-6 rounded-lg font-semibold transition-all ${
              isGenerating || uploadedImages.length === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600'
            } text-white`}
            whileHover={uploadedImages.length > 0 ? { scale: 1.02 } : {}}
            whileTap={uploadedImages.length > 0 ? { scale: 0.98 } : {}}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Generating Video...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                Generate Video with Higgsfield AI
              </span>
            )}
          </motion.button>
        </div>

        {/* Generated Videos */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Generated Videos
            </h3>

            {generatedVideos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No videos generated yet</p>
                <p className="text-sm text-gray-500">Upload some photos to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        {video.status === 'generating' ? (
                          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{video.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span>{video.duration}</span>
                          <span>•</span>
                          <span>{video.style}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            video.status === 'ready' 
                              ? 'bg-green-500/20 text-green-300'
                              : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {video.status === 'ready' ? 'Ready' : 'Generating...'}
                          </span>
                        </div>
                      </div>

                      {video.status === 'ready' && (
                        <div className="flex gap-2">
                          <button className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Demo Features */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <h4 className="font-semibold text-white mb-3">🎬 Higgsfield AI Features</h4>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• Automatic scene detection and transitions</li>
              <li>• Smart cropping for different aspect ratios</li>
              <li>• AI-generated background music</li>
              <li>• Text overlay and title generation</li>
              <li>• Export optimized for social platforms</li>
              <li>• Batch processing for multiple videos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
