// State management for the application
import { generateId } from './utils'

export interface AppState {
  isConnected: boolean
  currentAgent: Agent | null
  messages: Message[]
  settings: UserSettings
  ui: UIState
}

export interface Agent {
  id: string
  name: string
  personality: string
  systemPrompt: string
  createdAt: number
  updatedAt: number
}

export interface Message {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: number
}

export interface UserSettings {
  apiKey: string
  theme: 'light' | 'dark'
  autoConnect: boolean
  language: string
}

export interface UIState {
  isModalOpen: boolean
  currentModal: string | null
  isRecording: boolean
  faceExpression: string
}

// Initial state
export const initialState: AppState = {
  isConnected: false,
  currentAgent: null,
  messages: [],
  settings: {
    apiKey: '',
    theme: 'dark',
    autoConnect: false,
    language: 'en'
  },
  ui: {
    isModalOpen: false,
    currentModal: null,
    isRecording: false,
    faceExpression: '😊'
  }
}

// State actions
export type StateAction = 
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'SET_AGENT'; payload: Agent | null }
  | { type: 'ADD_MESSAGE'; payload: Omit<Message, 'id' | 'timestamp'> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'UPDATE_UI'; payload: Partial<UIState> }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'RESET_STATE' }

// State reducer
export const stateReducer = (state: AppState, action: StateAction): AppState => {
  switch (action.type) {
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload }
    
    case 'SET_AGENT':
      return { ...state, currentAgent: action.payload }
    
    case 'ADD_MESSAGE':
      const newMessage: Message = {
        ...action.payload,
        id: generateId(),
        timestamp: Date.now()
      }
      return { ...state, messages: [...state.messages, newMessage] }
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      }
    
    case 'UPDATE_UI':
      return { 
        ...state, 
        ui: { ...state.ui, ...action.payload } 
      }
    
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] }
    
    case 'RESET_STATE':
      return initialState
    
    default:
      return state
  }
}