// Volume meter worklet
class VolumeMeterWorklet extends AudioWorkletProcessor {
  constructor() {
    super()
    this.volumeSum = 0
    this.sampleCount = 0
    this.updateInterval = 100 // Update every 100 samples
  }

  process(inputs, outputs) {
    const input = inputs[0]
    const output = outputs[0]

    if (input && input.length > 0) {
      const inputChannel = input[0]
      
      // Calculate RMS volume
      for (let i = 0; i < inputChannel.length; i++) {
        const sample = inputChannel[i]
        this.volumeSum += sample * sample
        this.sampleCount++
        
        // Pass through audio
        if (output && output[0]) {
          output[0][i] = sample
        }
      }

      // Send volume update
      if (this.sampleCount >= this.updateInterval) {
        const rms = Math.sqrt(this.volumeSum / this.sampleCount)
        const volume = Math.min(1, rms * 10) // Scale and clamp
        
        this.port.postMessage({
          type: 'volumeUpdate',
          volume: volume
        })
        
        // Reset counters
        this.volumeSum = 0
        this.sampleCount = 0
      }
    }

    return true
  }
}

registerProcessor('vol-meter-worklet', VolumeMeterWorklet)