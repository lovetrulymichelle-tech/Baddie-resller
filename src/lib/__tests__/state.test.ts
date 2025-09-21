import { stateReducer, initialState, StateAction, AppState, Agent } from '../state';

describe('State Management', () => {
  describe('stateReducer', () => {
    it('should handle SET_CONNECTED action', () => {
      const action: StateAction = { type: 'SET_CONNECTED', payload: true };
      const newState = stateReducer(initialState, action);
      
      expect(newState.isConnected).toBe(true);
      expect(newState).not.toBe(initialState); // Immutability check
    });

    it('should handle SET_AGENT action', () => {
      const agent: Agent = {
        id: 'test-agent',
        name: 'Test Agent',
        personality: 'friendly',
        systemPrompt: 'You are a test agent',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      
      const action: StateAction = { type: 'SET_AGENT', payload: agent };
      const newState = stateReducer(initialState, action);
      
      expect(newState.currentAgent).toEqual(agent);
    });

    it('should handle ADD_MESSAGE action', () => {
      const messagePayload = {
        content: 'Hello, world!',
        sender: 'user' as const
      };
      
      const action: StateAction = { type: 'ADD_MESSAGE', payload: messagePayload };
      const newState = stateReducer(initialState, action);
      
      expect(newState.messages).toHaveLength(1);
      expect(newState.messages[0].content).toBe('Hello, world!');
      expect(newState.messages[0].sender).toBe('user');
      expect(newState.messages[0].id).toBeDefined();
      expect(newState.messages[0].timestamp).toBeDefined();
    });

    it('should handle UPDATE_SETTINGS action', () => {
      const settingsUpdate = { theme: 'light' as const, apiKey: 'test-key' };
      const action: StateAction = { type: 'UPDATE_SETTINGS', payload: settingsUpdate };
      const newState = stateReducer(initialState, action);
      
      expect(newState.settings.theme).toBe('light');
      expect(newState.settings.apiKey).toBe('test-key');
      expect(newState.settings.autoConnect).toBe(initialState.settings.autoConnect); // Unchanged
    });

    it('should handle UPDATE_UI action', () => {
      const uiUpdate = { isModalOpen: true, currentModal: 'settings' };
      const action: StateAction = { type: 'UPDATE_UI', payload: uiUpdate };
      const newState = stateReducer(initialState, action);
      
      expect(newState.ui.isModalOpen).toBe(true);
      expect(newState.ui.currentModal).toBe('settings');
      expect(newState.ui.isRecording).toBe(initialState.ui.isRecording); // Unchanged
    });

    it('should handle CLEAR_MESSAGES action', () => {
      // First add some messages
      const stateWithMessages = stateReducer(initialState, {
        type: 'ADD_MESSAGE',
        payload: { content: 'Test', sender: 'user' }
      });
      
      expect(stateWithMessages.messages).toHaveLength(1);
      
      // Then clear them
      const clearedState = stateReducer(stateWithMessages, { type: 'CLEAR_MESSAGES' });
      expect(clearedState.messages).toHaveLength(0);
    });

    it('should handle RESET_STATE action', () => {
      const modifiedState: AppState = {
        ...initialState,
        isConnected: true,
        messages: [{ id: '1', content: 'test', sender: 'user', timestamp: Date.now() }]
      };
      
      const resetState = stateReducer(modifiedState, { type: 'RESET_STATE' });
      expect(resetState).toEqual(initialState);
    });

    it('should return current state for unknown actions', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' } as never;
      const newState = stateReducer(initialState, unknownAction);
      
      expect(newState).toBe(initialState);
    });

    it('should maintain immutability', () => {
      const action: StateAction = { type: 'SET_CONNECTED', payload: true };
      const newState = stateReducer(initialState, action);
      
      expect(newState).not.toBe(initialState);
      expect(newState.settings).toBe(initialState.settings); // Unchanged objects should be same reference
      expect(newState.ui).toBe(initialState.ui);
    });
  });

  describe('Initial State', () => {
    it('should have correct default values', () => {
      expect(initialState.isConnected).toBe(false);
      expect(initialState.currentAgent).toBeNull();
      expect(initialState.messages).toEqual([]);
      expect(initialState.settings.theme).toBe('dark');
      expect(initialState.settings.autoConnect).toBe(false);
      expect(initialState.ui.faceExpression).toBe('😊');
    });
  });
});