// Audio processing worklet
class AudioProcessingWorklet extends AudioWorkletProcessor {
  constructor() {
    super()
    this.bufferSize = 1024
    this.inputBuffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
    this.port.onmessage = this.handleMessage.bind(this)
  }

  process(inputs, outputs) {
    const input = inputs[0]
    const output = outputs[0]

    if (input && input.length > 0) {
      const inputChannel = input[0]
      
      // Process audio data
      for (let i = 0; i < inputChannel.length; i++) {
        // Apply basic noise reduction
        const processedSample = this.applyNoiseReduction(inputChannel[i])
        
        // Store in buffer
        this.inputBuffer[this.bufferIndex] = processedSample
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize
        
        // Output processed sample
        if (output && output[0]) {
          output[0][i] = processedSample
        }
      }

      // Send buffer to main thread when full
      if (this.bufferIndex === 0) {
        this.port.postMessage({
          type: 'audioBuffer',
          data: Array.from(this.inputBuffer)
        })
      }
    }

    return true
  }

  applyNoiseReduction(sample) {
    // Simple noise gate
    const threshold = 0.01
    return Math.abs(sample) < threshold ? 0 : sample
  }

  handleMessage(event) {
    const { type, data } = event.data
    
    switch (type) {
      case 'setBufferSize':
        this.bufferSize = data
        this.inputBuffer = new Float32Array(this.bufferSize)
        this.bufferIndex = 0
        break
      default:
        console.warn('Unknown message type:', type)
    }
  }
}

registerProcessor('audio-processing-worklet', AudioProcessingWorklet)