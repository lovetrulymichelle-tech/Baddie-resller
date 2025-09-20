// Application constants
export const APP_CONFIG = {
  name: 'Baddie Reseller',
  version: '1.0.0',
  apiVersion: 'v1',
  maxRetries: 3,
  connectionTimeout: 10000
}

export const AUDIO_CONFIG = {
  sampleRate: 16000,
  channels: 1,
  bufferSize: 1024,
  maxRecordingTime: 300000 // 5 minutes
}

export const API_ENDPOINTS = {
  connect: '/api/connect',
  disconnect: '/api/disconnect',
  sendMessage: '/api/message',
  getAgents: '/api/agents',
  saveAgent: '/api/agents/save',
  importAgent: '/api/agents/import'
}

export const UI_CONSTANTS = {
  modalZIndex: 1000,
  headerHeight: 60,
  sidebarWidth: 250,
  animations: {
    fadeIn: 'fadeIn 0.3s ease-in',
    slideIn: 'slideIn 0.3s ease-out',
    bounce: 'bounce 0.5s ease-in-out'
  }
}

export const FACE_EXPRESSIONS = {
  HAPPY: '😊',
  SAD: '😢',
  THINKING: '🤔',
  SLEEPING: '😴',
  COOL: '😎',
  EXCITED: '🤩',
  NEUTRAL: '😐',
  CONFUSED: '😕',
  LAUGHING: '😂',
  WINKING: '😉'
} as const

export type FaceExpression = typeof FACE_EXPRESSIONS[keyof typeof FACE_EXPRESSIONS]