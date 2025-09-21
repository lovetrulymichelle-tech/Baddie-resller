import '@testing-library/jest-dom';

// Mock Audio APIs that are not available in jsdom
Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    createGain: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      gain: { value: 1 }
    })),
    createAnalyser: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      fftSize: 256,
      frequencyBinCount: 128,
      getByteFrequencyData: jest.fn(),
      getByteTimeDomainData: jest.fn()
    })),
    createScriptProcessor: jest.fn(() => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      onaudioprocess: null
    })),
    destination: {},
    sampleRate: 44100,
    close: jest.fn(),
    resume: jest.fn()
  }))
});

Object.defineProperty(window, 'webkitAudioContext', {
  writable: true,
  value: window.AudioContext
});

// Mock MediaDevices API
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn().mockResolvedValue({
      getTracks: jest.fn(() => []),
      getAudioTracks: jest.fn(() => []),
      getVideoTracks: jest.fn(() => []),
      addTrack: jest.fn(),
      removeTrack: jest.fn(),
      clone: jest.fn()
    })
  }
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};