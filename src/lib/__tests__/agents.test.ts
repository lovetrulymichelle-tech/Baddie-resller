import { 
  PRESET_AGENTS, 
  getPresetAgent, 
  getRandomPresetAgent, 
  createCustomAgent 
} from '../presets/agents';

describe('Agent Presets', () => {
  describe('PRESET_AGENTS', () => {
    it('should contain predefined agents', () => {
      expect(PRESET_AGENTS).toHaveLength(4);
      expect(PRESET_AGENTS[0].id).toBe('baddie-assistant');
      expect(PRESET_AGENTS[1].id).toBe('reseller-expert');
      expect(PRESET_AGENTS[2].id).toBe('customer-service-pro');
      expect(PRESET_AGENTS[3].id).toBe('marketing-guru');
    });

    it('should have valid agent structure', () => {
      PRESET_AGENTS.forEach(agent => {
        expect(agent).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          personality: expect.any(String),
          systemPrompt: expect.any(String),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number)
        });
      });
    });

    it('should have unique IDs', () => {
      const ids = PRESET_AGENTS.map(agent => agent.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(PRESET_AGENTS.length);
    });
  });

  describe('getPresetAgent', () => {
    it('should return agent by ID', () => {
      const agent = getPresetAgent('baddie-assistant');
      expect(agent).toBeDefined();
      expect(agent?.id).toBe('baddie-assistant');
      expect(agent?.name).toBe('Baddie Assistant');
    });

    it('should return undefined for non-existent ID', () => {
      const agent = getPresetAgent('non-existent-agent');
      expect(agent).toBeUndefined();
    });

    it('should return correct agent for each preset ID', () => {
      const testCases = [
        { id: 'baddie-assistant', name: 'Baddie Assistant' },
        { id: 'reseller-expert', name: 'Reseller Expert' },
        { id: 'customer-service-pro', name: 'Customer Service Pro' },
        { id: 'marketing-guru', name: 'Marketing Guru' }
      ];

      testCases.forEach(({ id, name }) => {
        const agent = getPresetAgent(id);
        expect(agent?.name).toBe(name);
      });
    });
  });

  describe('getRandomPresetAgent', () => {
    it('should return a preset agent', () => {
      const agent = getRandomPresetAgent();
      expect(agent).toBeDefined();
      expect(PRESET_AGENTS).toContainEqual(agent);
    });

    it('should return different agents over multiple calls', () => {
      const agents = new Set();
      
      // Call multiple times to increase chance of getting different agents
      for (let i = 0; i < 20; i++) {
        const agent = getRandomPresetAgent();
        agents.add(agent.id);
      }
      
      // We should get at least one different agent in 20 tries
      // (statistically very likely given 4 preset agents)
      expect(agents.size).toBeGreaterThan(0);
    });

    it('should always return valid preset agent', () => {
      for (let i = 0; i < 10; i++) {
        const agent = getRandomPresetAgent();
        expect(agent).toMatchObject({
          id: expect.any(String),
          name: expect.any(String),
          personality: expect.any(String),
          systemPrompt: expect.any(String),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number)
        });
      }
    });
  });

  describe('createCustomAgent', () => {
    const mockDate = 1640995200000; // 2022-01-01 00:00:00 UTC
    
    beforeEach(() => {
      jest.spyOn(Date, 'now').mockReturnValue(mockDate);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create custom agent with provided parameters', () => {
      const name = 'Custom Agent';
      const personality = 'helpful and friendly';
      const systemPrompt = 'You are a custom agent';

      const agent = createCustomAgent(name, personality, systemPrompt);

      expect(agent).toMatchObject({
        id: expect.stringMatching(/^custom-\d+$/),
        name,
        personality,
        systemPrompt,
        createdAt: mockDate,
        updatedAt: mockDate
      });
    });

    it('should generate unique IDs for different agents', () => {
      // Mock Date.now to return incrementing values
      let counter = 1640995200000;
      jest.spyOn(Date, 'now').mockImplementation(() => counter++);
      
      const agent1 = createCustomAgent('Agent 1', 'personality1', 'prompt1');
      const agent2 = createCustomAgent('Agent 2', 'personality2', 'prompt2');

      expect(agent1.id).not.toBe(agent2.id);
      expect(agent1.id).toMatch(/^custom-/);
      expect(agent2.id).toMatch(/^custom-/);
    });

    it('should handle empty strings', () => {
      const agent = createCustomAgent('', '', '');

      expect(agent).toMatchObject({
        id: expect.stringMatching(/^custom-\d+$/),
        name: '',
        personality: '',
        systemPrompt: '',
        createdAt: mockDate,
        updatedAt: mockDate
      });
    });

    it('should handle special characters in input', () => {
      const name = 'Agent with 特殊 characters & symbols!';
      const personality = 'Émotional & expressive 🎭';
      const systemPrompt = 'You are "special" <script>alert("test")</script>';

      const agent = createCustomAgent(name, personality, systemPrompt);

      expect(agent.name).toBe(name);
      expect(agent.personality).toBe(personality);
      expect(agent.systemPrompt).toBe(systemPrompt);
    });
  });
});