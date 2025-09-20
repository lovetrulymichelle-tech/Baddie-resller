// AudioWorklet registry for advanced audio processing
export class AudioWorkletRegistry {
  private static instance: AudioWorkletRegistry
  private registeredWorklets: Set<string> = new Set()

  static getInstance(): AudioWorkletRegistry {
    if (!AudioWorkletRegistry.instance) {
      AudioWorkletRegistry.instance = new AudioWorkletRegistry()
    }
    return AudioWorkletRegistry.instance
  }

  async registerWorklet(context: AudioContext, name: string, moduleUrl: string): Promise<void> {
    if (this.registeredWorklets.has(name)) {
      return // Already registered
    }

    try {
      await context.audioWorklet.addModule(moduleUrl)
      this.registeredWorklets.add(name)
      console.log(`AudioWorklet '${name}' registered successfully`)
    } catch (error) {
      console.error(`Failed to register AudioWorklet '${name}':`, error)
      throw error
    }
  }

  isRegistered(name: string): boolean {
    return this.registeredWorklets.has(name)
  }

  getRegisteredWorklets(): string[] {
    return Array.from(this.registeredWorklets)
  }

  unregister(name: string): void {
    this.registeredWorklets.delete(name)
  }

  clear(): void {
    this.registeredWorklets.clear()
  }
}

// Utility function to create worklet nodes
export const createWorkletNode = (
  context: AudioContext, 
  name: string, 
  options?: AudioWorkletNodeOptions
): AudioWorkletNode | null => {
  const registry = AudioWorkletRegistry.getInstance()
  
  if (!registry.isRegistered(name)) {
    console.warn(`AudioWorklet '${name}' not registered`)
    return null
  }

  try {
    return new AudioWorkletNode(context, name, options)
  } catch (error) {
    console.error(`Failed to create AudioWorkletNode '${name}':`, error)
    return null
  }
}