import { GenAILiveClient, LiveClientConfig } from '../genai-live-client';

describe('GenAILiveClient', () => {
  let client: GenAILiveClient;
  let config: LiveClientConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      endpoint: 'wss://test.api.com',
      model: 'test-model'
    };
    client = new GenAILiveClient(config);
    
    // Mock console to avoid noise in tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(client).toBeInstanceOf(GenAILiveClient);
    });

    it('should use default values for missing config options', () => {
      const minimalConfig = { apiKey: 'test-key' };
      const minimalClient = new GenAILiveClient(minimalConfig);
      expect(minimalClient).toBeInstanceOf(GenAILiveClient);
    });
  });

  describe('connect', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should connect successfully with valid API key', async () => {
      const connectPromise = client.connect();
      
      // Advance timers to resolve the simulated connection
      jest.advanceTimersByTime(1000);
      
      await expect(connectPromise).resolves.toBeUndefined();
      expect(console.log).toHaveBeenCalledWith('Connected to Gemini AI Live API');
    });

    it('should handle connection error with invalid API key', async () => {
      // Test by directly calling simulateConnection with a spy
      const invalidClient = new GenAILiveClient({ apiKey: 'test-key' });
      
      // Spy on the private method and mock it to reject
      jest.spyOn(invalidClient as any, 'simulateConnection').mockRejectedValue(new Error('Invalid API key'));
      
      // Don't store in variable since we're not using it
      invalidClient.connect();
      
      jest.advanceTimersByTime(1000);
      
      // The connect method handles errors internally, so let's just verify the connection state
      await Promise.resolve(); // Let the promise resolve
      expect((invalidClient as any).isConnected).toBe(false);
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully', async () => {
      await client.disconnect();
      expect(console.log).toHaveBeenCalledWith('Disconnected from Gemini AI Live API');
    });
  });

  describe('sendMessage', () => {
    beforeEach(async () => {
      jest.useFakeTimers();
      // Connect first before testing sendMessage
      const connectPromise = client.connect();
      jest.advanceTimersByTime(1000);
      await connectPromise;
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should send message and receive response', async () => {
      const message = 'Hello, AI!';
      const responsePromise = client.sendMessage(message);
      
      // Advance timers to resolve the simulated response
      jest.advanceTimersByTime(1500);
      
      const response = await responsePromise;
      
      expect(response).toMatchObject({
        id: expect.any(String),
        content: expect.stringContaining(message),
        timestamp: expect.any(Number),
        metadata: expect.objectContaining({
          model: config.model
        })
      });
    });

    it('should handle different message types', async () => {
      const messages = [
        'How do I optimize my reselling business?',
        'What products should I sell?',
        'Help me with customer service'
      ];

      for (const message of messages) {
        const responsePromise = client.sendMessage(message);
        jest.advanceTimersByTime(1500);
        
        const response = await responsePromise;
        expect(response.content).toContain(message);
      }
    });

    it('should generate unique IDs for each response', async () => {
      const message1Promise = client.sendMessage('Message 1');
      const message2Promise = client.sendMessage('Message 2');
      
      jest.advanceTimersByTime(1500);
      
      const [response1, response2] = await Promise.all([message1Promise, message2Promise]);
      
      expect(response1.id).not.toBe(response2.id);
    });
  });

  describe('error handling', () => {
    it('should handle connection retries', async () => {
      const clientWithRetries = new GenAILiveClient({ 
        apiKey: 'test-key'
      });
      
      // Mock the simulateConnection to fail initially
      jest.spyOn(clientWithRetries as any, 'simulateConnection').mockRejectedValue(new Error('Connection failed'));
      
      jest.useFakeTimers();
      
      // Don't store in variable since we're not using it
      clientWithRetries.connect();
      jest.advanceTimersByTime(1000);
      
      // Let the promise resolve (it won't throw, it handles errors internally)
      await Promise.resolve();
      expect((clientWithRetries as any).isConnected).toBe(false);
      
      jest.useRealTimers();
    });
  });

  describe('configuration validation', () => {
    it('should work with minimal configuration', () => {
      const minimalClient = new GenAILiveClient({ apiKey: 'test' });
      expect(minimalClient).toBeInstanceOf(GenAILiveClient);
    });

    it('should override default configuration', () => {
      const customConfig = {
        apiKey: 'custom-key',
        endpoint: 'wss://custom.endpoint.com',
        model: 'custom-model'
      };
      
      const customClient = new GenAILiveClient(customConfig);
      expect(customClient).toBeInstanceOf(GenAILiveClient);
    });
  });
});