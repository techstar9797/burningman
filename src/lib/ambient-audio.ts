// Ambient Audio Generation for Live Preview
// Creates procedural ambient sounds for Burning Man atmosphere

export class AmbientAudioGenerator {
  private audioContext: AudioContext | null = null
  private isPlaying = false
  private gainNode: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private noiseBuffer: AudioBuffer | null = null

  async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.gainNode.connect(this.audioContext.destination)
      
      // Create noise buffer for ambient texture
      await this.createNoiseBuffer()
      
      console.log('✅ Audio context initialized')
    } catch (error) {
      console.error('Audio context initialization failed:', error)
      throw error
    }
  }

  async createNoiseBuffer(): Promise<void> {
    if (!this.audioContext) return

    const bufferSize = this.audioContext.sampleRate * 2 // 2 seconds of noise
    this.noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const output = this.noiseBuffer.getChannelData(0)

    // Generate pink noise (more natural than white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05
      b6 = white * 0.115926
    }
  }

  async playAmbientTrack(trackName: string, volume: number = 0.3): Promise<void> {
    if (!this.audioContext) {
      await this.initializeAudioContext()
    }

    if (!this.audioContext || this.isPlaying) return

    try {
      // Clear any existing oscillators
      this.stopAmbientTrack()

      this.isPlaying = true
      
      // Set volume
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      }

      // Generate track based on name
      switch (trackName) {
        case 'Burning Desert Vibes':
          await this.createDesertVibes()
          break
        case 'Playa Sunset Dreams':
          await this.createSunsetDreams()
          break
        case 'Desert Bloom Serenity':
          await this.createDesertBloomSerenity()
          break
        case 'Radical Self Expression':
          await this.createSelfExpression()
          break
        case 'Community Connection':
          await this.createCommunityConnection()
          break
        default:
          await this.createDesertVibes()
      }

      console.log(`🎵 Playing ambient track: ${trackName}`)
    } catch (error) {
      console.error('Ambient track playback failed:', error)
      this.isPlaying = false
    }
  }

  stopAmbientTrack(): void {
    if (!this.isPlaying) return

    // Stop all oscillators
    this.oscillators.forEach(osc => {
      try {
        osc.stop()
      } catch (error) {
        // Oscillator might already be stopped
      }
    })

    // Clear any timers
    if ((this as any).chordTimer) {
      clearInterval((this as any).chordTimer)
      ;(this as any).chordTimer = null
    }
    
    if ((this as any).melodyTimer) {
      clearInterval((this as any).melodyTimer)
      ;(this as any).melodyTimer = null
    }
    
    if ((this as any).arpeggioTimer) {
      clearInterval((this as any).arpeggioTimer)
      ;(this as any).arpeggioTimer = null
    }

    this.oscillators = []
    this.isPlaying = false
    
    console.log('🎵 Ambient track stopped with all timers cleared')
  }

  setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }

  // Track generators - Enhanced for warm, melodious vibes
  private async createDesertVibes(): Promise<void> {
    if (!this.audioContext || !this.gainNode) return

    // Warm bass foundation with gentle movement
    const bass = this.audioContext.createOscillator()
    bass.type = 'sine'
    bass.frequency.setValueAtTime(55, this.audioContext.currentTime) // Low A
    
    // Add gentle frequency modulation for warmth
    const bassLFO = this.audioContext.createOscillator()
    bassLFO.type = 'sine'
    bassLFO.frequency.setValueAtTime(0.1, this.audioContext.currentTime) // Very slow modulation
    
    const bassModGain = this.audioContext.createGain()
    bassModGain.gain.setValueAtTime(2, this.audioContext.currentTime) // Subtle modulation depth
    
    bassLFO.connect(bassModGain)
    bassModGain.connect(bass.frequency)
    
    const bassGain = this.audioContext.createGain()
    bassGain.gain.setValueAtTime(0.08, this.audioContext.currentTime)
    
    bass.connect(bassGain)
    bassGain.connect(this.gainNode)
    bass.start()
    bassLFO.start()

    // Warm pad harmonies - perfect fifths and major sevenths
    const harmonies = [82.5, 110, 165, 196] // A, A, E, G (warm chord)
    
    harmonies.forEach((freq, index) => {
      const harmonic = this.audioContext!.createOscillator()
      harmonic.type = 'sawtooth'
      harmonic.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
      
      // Soft low-pass filter for warmth
      const filter = this.audioContext!.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800 + (index * 200), this.audioContext!.currentTime)
      filter.Q.setValueAtTime(1, this.audioContext!.currentTime)
      
      const harmonicGain = this.audioContext!.createGain()
      harmonicGain.gain.setValueAtTime(0.03 / (index + 1), this.audioContext!.currentTime)
      
      // Add gentle tremolo for organic feel
      const tremolo = this.audioContext!.createOscillator()
      tremolo.type = 'sine'
      tremolo.frequency.setValueAtTime(3 + (index * 0.5), this.audioContext!.currentTime)
      
      const tremoloGain = this.audioContext!.createGain()
      tremoloGain.gain.setValueAtTime(0.3, this.audioContext!.currentTime)
      
      tremolo.connect(tremoloGain)
      tremoloGain.connect(harmonicGain.gain)
      
      harmonic.connect(filter)
      filter.connect(harmonicGain)
      harmonicGain.connect(this.gainNode!)
      
      harmonic.start()
      tremolo.start()
      
      this.oscillators.push(harmonic, tremolo)
    })

    this.oscillators.push(bass, bassLFO)
  }

  private async createDesertBloomSerenity(): Promise<void> {
    if (!this.audioContext || !this.gainNode) return

    // Inspired by warm, melodic desert themes - original composition
    // Gentle arpeggio pattern with warm harmonies
    const scale = [220, 246.94, 277.18, 329.63, 369.99, 415.30] // A major pentatonic + 6th
    let noteIndex = 0
    let direction = 1

    const createArpeggio = () => {
      const freq = scale[noteIndex]
      
      // Main melody note with warm tone
      const melody = this.audioContext!.createOscillator()
      melody.type = 'triangle'
      melody.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
      
      // Warm harmonic (perfect fifth)
      const harmony = this.audioContext!.createOscillator()
      harmony.type = 'sine'
      harmony.frequency.setValueAtTime(freq * 1.5, this.audioContext!.currentTime)
      
      // Soft pad underneath (octave below)
      const pad = this.audioContext!.createOscillator()
      pad.type = 'sawtooth'
      pad.frequency.setValueAtTime(freq * 0.5, this.audioContext!.currentTime)
      
      // Warm filtering for all voices
      const melodyFilter = this.audioContext!.createBiquadFilter()
      melodyFilter.type = 'lowpass'
      melodyFilter.frequency.setValueAtTime(1500, this.audioContext!.currentTime)
      melodyFilter.Q.setValueAtTime(0.8, this.audioContext!.currentTime)
      
      const padFilter = this.audioContext!.createBiquadFilter()
      padFilter.type = 'lowpass'
      padFilter.frequency.setValueAtTime(400, this.audioContext!.currentTime)
      
      // Gentle envelopes
      const melodyGain = this.audioContext!.createGain()
      melodyGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
      melodyGain.gain.linearRampToValueAtTime(0.08, this.audioContext!.currentTime + 0.2)
      melodyGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 2.5)
      
      const harmonyGain = this.audioContext!.createGain()
      harmonyGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
      harmonyGain.gain.linearRampToValueAtTime(0.04, this.audioContext!.currentTime + 0.3)
      harmonyGain.gain.exponentialRampToValueAtTime(0.005, this.audioContext!.currentTime + 3)
      
      const padGain = this.audioContext!.createGain()
      padGain.gain.setValueAtTime(0.015, this.audioContext!.currentTime)
      
      // Beautiful reverb using multiple delays
      const delay1 = this.audioContext!.createDelay()
      delay1.delayTime.setValueAtTime(0.2, this.audioContext!.currentTime)
      
      const delay2 = this.audioContext!.createDelay()
      delay2.delayTime.setValueAtTime(0.4, this.audioContext!.currentTime)
      
      const delay3 = this.audioContext!.createDelay()
      delay3.delayTime.setValueAtTime(0.6, this.audioContext!.currentTime)
      
      const delayGain1 = this.audioContext!.createGain()
      delayGain1.gain.setValueAtTime(0.25, this.audioContext!.currentTime)
      
      const delayGain2 = this.audioContext!.createGain()
      delayGain2.gain.setValueAtTime(0.15, this.audioContext!.currentTime)
      
      const delayGain3 = this.audioContext!.createGain()
      delayGain3.gain.setValueAtTime(0.08, this.audioContext!.currentTime)
      
      // Connect the audio graph
      melody.connect(melodyFilter)
      melodyFilter.connect(melodyGain)
      melodyGain.connect(this.gainNode!)
      
      harmony.connect(harmonyGain)
      harmonyGain.connect(this.gainNode!)
      
      pad.connect(padFilter)
      padFilter.connect(padGain)
      padGain.connect(this.gainNode!)
      
      // Add reverb to melody
      melodyGain.connect(delay1)
      delay1.connect(delayGain1)
      delayGain1.connect(this.gainNode!)
      delayGain1.connect(delay2)
      delay2.connect(delayGain2)
      delayGain2.connect(this.gainNode!)
      delayGain2.connect(delay3)
      delay3.connect(delayGain3)
      delayGain3.connect(this.gainNode!)
      
      melody.start()
      harmony.start()
      pad.start()
      
      // Stop notes gracefully
      melody.stop(this.audioContext!.currentTime + 3)
      harmony.stop(this.audioContext!.currentTime + 3.5)
      // Pad continues for warmth
      
      this.oscillators.push(melody, harmony)
      
      // Move through scale in a flowing pattern
      if (direction === 1 && noteIndex >= scale.length - 1) {
        direction = -1
      } else if (direction === -1 && noteIndex <= 0) {
        direction = 1
      }
      noteIndex += direction
    }

    // Start the arpeggio
    createArpeggio()
    
    // Continue the flowing pattern every 2.5 seconds
    const arpeggioTimer = setInterval(createArpeggio, 2500)
    ;(this as any).arpeggioTimer = arpeggioTimer
  }

  private async createSunsetDreams(): Promise<void> {
    if (!this.audioContext || !this.gainNode) return

    // Beautiful major 7th chord progression - very warm and friendly
    const chordProgression = [
      [220, 277.18, 329.63, 415.30], // A major 7
      [246.94, 311.13, 369.99, 466.16], // B minor 7
      [261.63, 329.63, 392.00, 493.88], // C major 7
      [196.00, 246.94, 293.66, 369.99]  // G major 7
    ]

    let chordIndex = 0

    const playChord = () => {
      // Stop previous chord
      this.oscillators.forEach(osc => {
        try { osc.stop() } catch (e) { /* ignore */ }
      })
      this.oscillators = []

      const currentChord = chordProgression[chordIndex % chordProgression.length]
      
      currentChord.forEach((freq, noteIndex) => {
        const osc = this.audioContext!.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
        
        // Warm filter
        const filter = this.audioContext!.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(1200, this.audioContext!.currentTime)
        filter.Q.setValueAtTime(0.7, this.audioContext!.currentTime)
        
        // Gentle attack and release
        const envelope = this.audioContext!.createGain()
        envelope.gain.setValueAtTime(0, this.audioContext!.currentTime)
        envelope.gain.linearRampToValueAtTime(0.04 / (noteIndex + 1), this.audioContext!.currentTime + 2)
        envelope.gain.linearRampToValueAtTime(0.02 / (noteIndex + 1), this.audioContext!.currentTime + 6)
        
        // Add subtle chorus effect
        const delay = this.audioContext!.createDelay()
        delay.delayTime.setValueAtTime(0.02 + (noteIndex * 0.005), this.audioContext!.currentTime)
        
        const delayGain = this.audioContext!.createGain()
        delayGain.gain.setValueAtTime(0.2, this.audioContext!.currentTime)
        
        osc.connect(filter)
        filter.connect(envelope)
        envelope.connect(this.gainNode!)
        
        // Chorus path
        envelope.connect(delay)
        delay.connect(delayGain)
        delayGain.connect(this.gainNode!)
        
        osc.start()
        
        this.oscillators.push(osc)
      })

      chordIndex++
    }

    // Play initial chord
    playChord()
    
    // Change chord every 8 seconds for gentle progression
    const chordTimer = setInterval(playChord, 8000)
    
    // Store timer for cleanup
    ;(this as any).chordTimer = chordTimer
  }

  private async createSelfExpression(): Promise<void> {
    if (!this.audioContext || !this.gainNode) return

    // Uplifting pentatonic melody with warm harmonies
    const pentatonicScale = [220, 247, 277, 330, 370, 440] // A pentatonic - very friendly
    let noteIndex = 0

    const createMelodyNote = () => {
      const freq = pentatonicScale[noteIndex % pentatonicScale.length]
      
      // Main melody note
      const melody = this.audioContext!.createOscillator()
      melody.type = 'triangle' // Warmer than sine
      melody.frequency.setValueAtTime(freq, this.audioContext!.currentTime)
      
      // Harmony note (perfect fifth)
      const harmony = this.audioContext!.createOscillator()
      harmony.type = 'sine'
      harmony.frequency.setValueAtTime(freq * 1.5, this.audioContext!.currentTime)
      
      // Warm reverb-like delay
      const delay1 = this.audioContext!.createDelay()
      delay1.delayTime.setValueAtTime(0.3, this.audioContext!.currentTime)
      
      const delay2 = this.audioContext!.createDelay()
      delay2.delayTime.setValueAtTime(0.6, this.audioContext!.currentTime)
      
      const delayGain1 = this.audioContext!.createGain()
      delayGain1.gain.setValueAtTime(0.3, this.audioContext!.currentTime)
      
      const delayGain2 = this.audioContext!.createGain()
      delayGain2.gain.setValueAtTime(0.15, this.audioContext!.currentTime)
      
      // Envelope for natural note attack/decay
      const melodyGain = this.audioContext!.createGain()
      melodyGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
      melodyGain.gain.linearRampToValueAtTime(0.06, this.audioContext!.currentTime + 0.1)
      melodyGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 2)
      
      const harmonyGain = this.audioContext!.createGain()
      harmonyGain.gain.setValueAtTime(0, this.audioContext!.currentTime)
      harmonyGain.gain.linearRampToValueAtTime(0.03, this.audioContext!.currentTime + 0.2)
      harmonyGain.gain.exponentialRampToValueAtTime(0.005, this.audioContext!.currentTime + 3)
      
      // Connect everything
      melody.connect(melodyGain)
      harmony.connect(harmonyGain)
      
      melodyGain.connect(this.gainNode!)
      harmonyGain.connect(this.gainNode!)
      
      // Add reverb
      melodyGain.connect(delay1)
      delay1.connect(delayGain1)
      delayGain1.connect(this.gainNode!)
      delayGain1.connect(delay2)
      delay2.connect(delayGain2)
      delayGain2.connect(this.gainNode!)
      
      melody.start()
      harmony.start()
      
      // Stop notes after they fade
      melody.stop(this.audioContext!.currentTime + 4)
      harmony.stop(this.audioContext!.currentTime + 4)
      
      noteIndex++
    }

    // Play first note
    createMelodyNote()
    
    // Continue playing notes every 3 seconds
    const melodyTimer = setInterval(createMelodyNote, 3000)
    ;(this as any).melodyTimer = melodyTimer
  }

  private async createCommunityConnection(): Promise<void> {
    if (!this.audioContext || !this.gainNode) return

    // Warm bell-like tones that create a sense of togetherness
    const bellFrequencies = [220, 330, 440, 550, 660] // Pentatonic bells
    let bellIndex = 0

    const createBell = () => {
      const freq = bellFrequencies[bellIndex % bellFrequencies.length]
      
      // Bell-like sound using multiple harmonics
      const harmonics = [1, 2.76, 5.40, 8.93] // Bell harmonic ratios
      
      harmonics.forEach((ratio, harmonicIndex) => {
        const osc = this.audioContext!.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq * ratio, this.audioContext!.currentTime)
        
        // Bell envelope - quick attack, long decay
        const envelope = this.audioContext!.createGain()
        envelope.gain.setValueAtTime(0, this.audioContext!.currentTime)
        envelope.gain.linearRampToValueAtTime(0.1 / (harmonicIndex + 1), this.audioContext!.currentTime + 0.01)
        envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 6)
        
        // Warm filter
        const filter = this.audioContext!.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2000 - (harmonicIndex * 300), this.audioContext!.currentTime)
        
        osc.connect(filter)
        filter.connect(envelope)
        envelope.connect(this.gainNode!)
        
        osc.start()
        osc.stop(this.audioContext!.currentTime + 8)
        
        this.oscillators.push(osc)
      })
      
      bellIndex++
    }

    // Play first bell
    createBell()
    
    // Ring bells every 4-7 seconds (random for organic feel)
    const scheduleNextBell = () => {
      const nextDelay = 4000 + Math.random() * 3000 // 4-7 seconds
      setTimeout(() => {
        if (this.isPlaying) {
          createBell()
          scheduleNextBell()
        }
      }, nextDelay)
    }
    
    scheduleNextBell()

    // Add subtle ambient pad underneath
    const pad = this.audioContext.createOscillator()
    pad.type = 'sawtooth'
    pad.frequency.setValueAtTime(55, this.audioContext.currentTime) // Low A
    
    const padFilter = this.audioContext.createBiquadFilter()
    padFilter.type = 'lowpass'
    padFilter.frequency.setValueAtTime(300, this.audioContext.currentTime)
    
    const padGain = this.audioContext.createGain()
    padGain.gain.setValueAtTime(0.02, this.audioContext.currentTime)
    
    pad.connect(padFilter)
    padFilter.connect(padGain)
    padGain.connect(this.gainNode)
    pad.start()
    
    this.oscillators.push(pad)
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying
  }

  getCurrentTrack(): string {
    return this.isPlaying ? 'Playing ambient audio' : 'Stopped'
  }
}

export const ambientAudioGenerator = new AmbientAudioGenerator()
