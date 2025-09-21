# Baddie Reseller - AI-Powered Refiller App

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap, Build, and Test the Repository
- Install dependencies: `npm install` -- takes ~9 seconds. NEVER CANCEL.
- Build the application: `npm run build` -- takes ~3-4 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run linting: `npm run lint` -- takes ~1-2 seconds. WILL FAIL with 8 TypeScript warnings (exit code 1). This is expected behavior due to `--max-warnings 0` setting.
- Start development server: `npm run dev` -- starts instantly, runs on http://localhost:5173/
- Preview production build: `npm run preview` -- serves the built application

### Development Environment Requirements
- Node.js >= 16.0.0 (currently running v20.19.5)
- npm 10.8.2 or higher
- Modern browser with Chrome >= 88, Firefox >= 78, Safari >= 14, or Edge >= 88
- Web Audio API support required for audio recording features

### Building and Running
1. **ALWAYS run the bootstrap steps first before making any code changes**
2. **Development mode**: 
   - Run `npm run dev`
   - Application will be available at http://localhost:5173/
   - Hot reloading is enabled via Vite
3. **Production build**:
   - Run `npm run build`
   - Built files will be in `dist/` directory
   - Test production build with `npm run preview`

## Validation

### Manual Testing Scenarios
**ALWAYS test these scenarios after making changes to ensure functionality works correctly:**

1. **Basic UI Interaction**:
   - Load http://localhost:5173/ and verify the page displays correctly
   - Click "Connect" button - status should change from "idle" to "connected"
   - Click face expression buttons (Happy, Sleepy, Thinking, Cool) - face emoji should change and button should show active state
   - Click "Disconnect" - status should return to "idle"

2. **Audio Features** (if making audio-related changes):
   - Click "Start Recording" when connected - button should become active
   - Test that microphone access works in supported browsers
   - Verify that volume meter and audio worklets function properly

3. **Component Features**:
   - Test Header buttons (Edit Agent, Import Agent, Settings)
   - Test Keynote Companion "Start Presentation" button
   - Verify all modals and overlays work correctly

### Linting and Code Quality
- **ALWAYS run `npm run lint` before committing changes**
- The linting WILL FAIL (exit code 1) with 8 TypeScript warnings for `any` types - this is expected
- Maximum warnings is set to 0, so the process exits with failure but this is the current acceptable baseline
- Do not add NEW warnings beyond the existing 8 warnings
- Current acceptable baseline: 8 TypeScript warnings for `any` usage in audio and utility files

### Build Validation
- Run `npm run build` to ensure TypeScript compilation succeeds
- Verify that `dist/` directory is created with proper assets
- Test the production build with `npm run preview`

## Common Tasks

### Repository Structure
```
/home/runner/work/Baddie-resller/Baddie-resller/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── components/             # React components
│   │   ├── demo/              # Demo components (BasicFace, KeynoteCompanion)
│   │   ├── console/           # Control components
│   │   └── *.tsx              # Header, Modal, Settings, etc.
│   ├── contexts/              # React contexts (LiveAPIContext)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── audio-*.ts         # Audio handling and streaming
│   │   ├── constants.ts       # Application constants
│   │   ├── genai-live-client.ts # AI client integration
│   │   ├── prompts.ts         # AI prompts and templates
│   │   ├── state.ts           # State management
│   │   ├── utils.ts           # Utility functions
│   │   └── worklets/          # Audio worklets
│   └── index.tsx              # Application entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── eslint.config.js           # ESLint configuration
└── index.html                 # HTML template
```

### Key Technologies
- **Frontend**: React 18 with TypeScript
- **Build System**: Vite 5.x for fast development and building
- **AI Integration**: Gemini AI Live API for real-time interaction
- **Audio**: Web Audio API with AudioWorklets for voice recording
- **Styling**: CSS3 with custom animations and gradients

### Common File Modifications
- **Adding new AI prompts**: Edit `src/lib/prompts.ts`
- **Modifying face expressions**: Edit `src/lib/constants.ts` and `src/components/demo/basic-face/`
- **Audio features**: Edit files in `src/lib/audio-*.ts` and `src/lib/worklets/`
- **State management**: Edit `src/lib/state.ts`
- **UI components**: Edit files in `src/components/`

### Frequently Used Commands
```bash
# Install dependencies (run once after clone)
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

### Timing Expectations
- `npm install`: ~9 seconds
- `npm run build`: ~3-4 seconds (NEVER CANCEL - set timeout to 60+ seconds)
- `npm run lint`: ~1-2 seconds
- `npm run dev`: Starts immediately, hot reload is instant
- `npm run preview`: Starts immediately after build

### Troubleshooting
1. **ESLint configuration missing**: Fixed - `eslint.config.js` is now present
2. **TypeScript warnings**: Expected - 8 warnings for `any` types are acceptable
3. **Build failures**: Usually due to TypeScript errors - check console output
4. **Development server issues**: Try different port with `npm run dev -- --port 3000`
5. **Audio not working**: Requires HTTPS in production, works on localhost in development

### Working with AI Features
- The app integrates with Gemini AI Live API for real-time voice interaction
- Audio recording requires microphone permissions
- Face expressions change based on AI responses and user interaction
- Agent personalities and prompts are configurable in `src/lib/prompts.ts`

### Architecture Notes
- Uses React Context for state management (LiveAPIContext)
- Audio processing handled by custom AudioWorklets
- Real-time AI communication through WebSocket-like connection
- Modular component structure for easy feature addition
- TypeScript provides type safety throughout the application

## Known Issues
- **ESLint fails with 8 warnings**: `npm run lint` exits with code 1 due to `--max-warnings 0` setting. This is the current acceptable baseline.
- Some npm dependencies have security warnings - acceptable for development
- Audio features require modern browser with Web Audio API support
- TypeScript version 5.9.2 shows compatibility warning with @typescript-eslint but functions correctly

Always validate your changes by running the complete build process and testing the application manually before committing.