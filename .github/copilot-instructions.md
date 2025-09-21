# Baddie Reseller - AI-Powered Refiller App

Baddie Reseller is a React 18 + TypeScript + Vite application designed to help digital entrepreneurs and resellers automate product refilling, listings, and operations using AI-powered agents with voice interaction capabilities.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Dependencies
- Install dependencies: `npm install` -- takes ~8 seconds. Dependencies are already validated and work correctly.
- **CRITICAL**: `package-lock.json` file is essential for reproducible builds. Without it, npm install may fail with TypeScript/React type errors.
- **Node.js Requirements**: Node.js v20.19.5 and npm v10.8.2 are confirmed working. Use Node.js v16+ minimum.
- **Timeout guidance**: Set bash command timeouts to 300+ seconds for npm install, 180+ seconds for builds

### Build Process
- **Build for production**: `npm run build` -- takes ~3 seconds. NEVER CANCEL. Uses TypeScript compilation followed by Vite bundling.
  - Output: `dist/` directory with optimized assets (~150KB JavaScript bundle)
  - Build is very fast and reliable
  - **Timeout recommendation**: Set timeout to 60+ seconds for safety, although builds complete in ~3 seconds
- **Development server**: `npm run dev` -- starts in ~200ms on http://localhost:5173
  - Hot reload enabled for rapid development
  - Always use this for testing changes during development
- **Preview build**: `npm run preview` -- serves production build on http://localhost:4173

### Linting and Code Quality
- **ESLint**: `npm run lint` -- ESLint configuration is missing but dependencies are installed
  - **Important**: Create `.eslintrc.json` first or the lint command will fail
  - Current issue: "ESLint couldn't find a configuration file"
  - All TypeScript ESLint packages are installed in `node_modules/@typescript-eslint/`
- **TypeScript checking**: Runs automatically during build via `tsc` command
- **Code formatting**: No formatter configured (Prettier not installed)

## Validation Scenarios

### Manual Testing Requirements
**ALWAYS test these scenarios after making any changes to ensure functionality:**

1. **Connection Flow**:
   - Open application in browser (http://localhost:5173)
   - Click "Connect" button - should change status to "connected" and face to "thinking" (🤔)
   - Recording and Generate Response buttons should become enabled

2. **Face Expression System**:
   - Click facial expression buttons (Happy, Sleepy, Thinking, Cool)
   - Face should change to corresponding emoji (😊, 😴, 🤔, 😎)
   - Selected button should appear active/highlighted

3. **Settings Modal**:
   - Click "Settings" button to open modal
   - Verify API Key input field, Theme dropdown (Dark/Light), Auto-connect checkbox
   - Modal should close when clicking X button
   - Face may change expression when opening/closing settings

4. **Application Launch**:
   - Page should load with title "Baddie Reseller - AI-Powered Refiller App"
   - Main interface shows: Header with action buttons, face display, control buttons, keynote companion section
   - No console errors should appear (React DevTools warning is normal)

### Build Validation
- **Always run these commands before committing changes**:
  - `npm run build` -- must complete successfully in ~3 seconds
  - `npm run dev` and manually test at least one complete user scenario
  - No TypeScript compilation errors should occur

## Repository Structure

### Key Directories and Files
```
/src/
├── App.tsx                    # Main application component with LiveAPIProvider
├── index.tsx                  # React root rendering
├── index.css                  # Global styles (dark theme by default)
├── components/                # React components
│   ├── Header.tsx            # Main header with action buttons
│   ├── Modal.tsx             # Reusable modal component
│   ├── UserSettings.tsx      # Settings modal content
│   ├── AgentEdit.tsx         # Agent editing interface
│   ├── AgentImport.tsx       # Agent import functionality
│   ├── demo/                 # Demo components
│   │   ├── basic-face/       # Face expression display system
│   │   └── keynote-companion/ # Presentation features
│   └── console/              # Control interfaces
│       └── control-tray/     # Main control buttons
├── contexts/
│   └── LiveAPIContext.tsx    # AI API connection state management
├── hooks/                    # Custom React hooks
│   ├── demo/                 # UI interaction hooks (tilt, face, hover)
│   └── media/                # Audio and API communication hooks
├── lib/                      # Core utilities and services
│   ├── constants.ts          # App configuration and UI constants
│   ├── state.ts              # TypeScript interfaces for app state
│   ├── utils.ts              # Utility functions (debounce, throttle, etc.)
│   ├── prompts.ts            # AI agent prompts and personalities
│   ├── genai-live-client.ts  # Simulated AI service client
│   ├── audio-*.ts            # Audio recording and streaming
│   ├── presets/agents.ts     # Predefined AI agent configurations
│   └── worklets/             # Audio processing worklets (.js files)
└── metadata.json             # Project metadata and configuration
```

### Important Implementation Details
- **Total codebase**: ~921 lines of TypeScript/React code
- **State management**: React Context (LiveAPIContext) + local component state
- **Styling**: CSS modules with CSS custom properties
- **AI Integration**: Simulated Gemini AI Live API (currently mock responses)
- **Audio features**: Web Audio API with AudioWorklets for voice processing
- **Build system**: Vite with TypeScript compilation

## Common Tasks

### Development Workflow
1. **Start development**: `npm run dev`
2. **Make changes**: Edit files in `src/`
3. **Test changes**: Navigate to http://localhost:5173 and test user scenarios
4. **Validate build**: `npm run build` (should complete in ~3 seconds)
5. **Deploy preview**: `npm run preview` to test production build

### Adding New Features
- **New components**: Add to appropriate subdirectory in `src/components/`
- **New hooks**: Add to `src/hooks/` (demo/ for UI, media/ for API features)
- **New utilities**: Add to `src/lib/utils.ts` or create new file in `src/lib/`
- **State changes**: Update interfaces in `src/lib/state.ts`
- **AI agents**: Add to `src/lib/presets/agents.ts`

### Configuration Files Reference
- `package.json`: Dependencies and npm scripts
- `vite.config.ts`: Build configuration (React plugin, root, publicDir)
- `tsconfig.json`: TypeScript configuration (React JSX, strict mode)
- `index.html`: HTML entry point with app title
- `.gitignore`: Excludes `node_modules/`, `dist/`, environment files

### Package.json Scripts
```json
{
  "dev": "vite",                    // Development server
  "build": "tsc && vite build",     // Production build
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"         // Preview production build
}
```

## Troubleshooting

### Common Issues
- **ESLint config missing**: Run `npm init @eslint/config` or create `.eslintrc.json` manually
- **Build failures**: Usually TypeScript errors - check console output for specific issues
- **React type errors on fresh clone**: Ensure `package-lock.json` exists before running `npm install`
- **Port conflicts**: Dev server uses :5173, preview uses :4173
- **Audio features**: May require HTTPS in production for microphone access

### Known Working Configuration
- **Node.js**: v20.19.5 (minimum v16.0.0 required)
- **npm**: v10.8.2
- **Browser compatibility**: Chrome >= 88, Firefox >= 78, Safari >= 14, Edge >= 88
- **Development**: All major features work in development mode
- **Build time**: Consistently fast (~3 seconds for full build)

### Dependencies Status
- **React**: 18.2.0 (working)
- **TypeScript**: 5.2.2 (working)  
- **Vite**: 5.2.0 (working)
- **ESLint**: 8.57.1 (working, needs configuration)
- **All @typescript-eslint packages**: Installed and available

**Always build and exercise your changes manually via the browser testing scenarios above.**