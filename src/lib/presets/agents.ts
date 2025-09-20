// Preset agent configurations
import { Agent } from '../state'
import { SYSTEM_PROMPTS, AGENT_PERSONALITIES } from '../prompts'

export const PRESET_AGENTS: Agent[] = [
  {
    id: 'baddie-assistant',
    name: 'Baddie Assistant',
    personality: AGENT_PERSONALITIES.FRIENDLY,
    systemPrompt: SYSTEM_PROMPTS.DEFAULT,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'reseller-expert',
    name: 'Reseller Expert',
    personality: AGENT_PERSONALITIES.EXPERT,
    systemPrompt: SYSTEM_PROMPTS.RESELLER_EXPERT,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'customer-service-pro',
    name: 'Customer Service Pro',
    personality: AGENT_PERSONALITIES.PROFESSIONAL,
    systemPrompt: SYSTEM_PROMPTS.CUSTOMER_SERVICE,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'marketing-guru',
    name: 'Marketing Guru',
    personality: AGENT_PERSONALITIES.MOTIVATIONAL,
    systemPrompt: SYSTEM_PROMPTS.MARKETING_GURU,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
]

export const getPresetAgent = (id: string): Agent | undefined => {
  return PRESET_AGENTS.find(agent => agent.id === id)
}

export const getRandomPresetAgent = (): Agent => {
  const randomIndex = Math.floor(Math.random() * PRESET_AGENTS.length)
  return PRESET_AGENTS[randomIndex]
}

export const createCustomAgent = (
  name: string,
  personality: string,
  systemPrompt: string
): Agent => {
  return {
    id: `custom-${Date.now()}`,
    name,
    personality,
    systemPrompt,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}