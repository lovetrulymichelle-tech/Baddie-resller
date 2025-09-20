// Audio streaming functionality
export class AudioStreamer {
  private audioContext: AudioContext | null = null
  private gainNode: GainNode | null = null
  private analyser: AnalyserNode | null = null

  async initialize(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
      this.analyser = this.audioContext.createAnalyser()
      
      this.analyser.fftSize = 256
      this.gainNode.connect(this.analyser)
      this.analyser.connect(this.audioContext.destination)
    } catch (error) {
      console.error('Error initializing audio streamer:', error)
      throw new Error('Failed to initialize audio streaming')
    }
  }

  async playAudioBlob(audioBlob: Blob): Promise<void> {
    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio streamer not initialized')
    }

    try {
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
      
      const source = this.audioContext.createBufferSource()
      source.buffer = audioBuffer
      source.connect(this.gainNode)
      
      source.start()
    } catch (error) {
      console.error('Error playing audio:', error)
      throw new Error('Failed to play audio')
    }
  }

  getVolumeLevel(): number {
    if (!this.analyser) return 0

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(dataArray)
    
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
    return average / 255
  }

  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.gainNode = null
    this.analyser = null
  }
}