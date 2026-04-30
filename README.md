# 🏛️ CivicSage AI — Indian Election Process Assistant

An AI-powered interactive assistant that helps citizens understand the Indian election process, timelines, and procedures in an engaging, conversational, and visually rich way.

**Built for PromptWars Virtual — Challenge Two: Civic Education**

🌐 **Live Demo:** [https://civicsage-ai-32834998077.us-central1.run.app](https://civicsage-ai-32834998077.us-central1.run.app)

## 🎯 Chosen Vertical

**Civic Education** — Making the Indian electoral process accessible and understandable to every citizen through AI-powered interactive learning.

## 🎯 Problem Statement

The election process in India is complex, involving multiple phases, institutions, and legal frameworks. Many citizens, especially first-time voters, find it difficult to understand how elections work. **CivicSage AI** bridges this gap by providing an interactive, AI-driven platform that breaks down electoral procedures into digestible, conversational explanations.

## 💡 Approach & Logic

### Design Philosophy
CivicSage AI is designed as a **smart, dynamic assistant** that adapts to user context:

1. **Conversational AI**: Uses Google Gemini 2.0 Flash with a deeply contextualized system prompt containing comprehensive ECI data, constitutional articles, and election procedures. The AI maintains session-based conversation history for contextual follow-up questions.

2. **Multi-Modal Learning**: Users can learn through 5 different modes:
   - **AI Chat**: Free-form Q&A with streaming responses
   - **Visual Timeline**: 8-phase election process visualization
   - **Process Explorer**: Topic-based card browsing
   - **Interactive Quiz**: Test knowledge with AI-generated questions
   - **Polling Finder**: Google Maps integration for booth discovery

3. **Logical Decision Making**:
   - The AI is grounded in factual ECI data to prevent hallucinations
   - Non-partisan guardrails prevent political bias
   - Fallback mechanisms (chat → single-turn) ensure reliability
   - Input validation and rate limiting protect against abuse

4. **Google Services Integration**: Deep use of 6+ Google services for AI, maps, analytics, logging, deployment, and security

### Architecture
```
┌─────────────────────────────────────────────┐
│              React Frontend (Vite)           │
│  ┌─────────┬──────────┬────────┬──────────┐ │
│  │ AI Chat │ Timeline │  Quiz  │  Finder  │ │
│  └────┬────┴─────┬────┴────┬───┴────┬─────┘ │
│       │          │         │        │        │
│  ┌────▼──────────▼─────────▼────────▼─────┐ │
│  │         API Client (SSE Streaming)      │ │
│  │      + Google Analytics (gtag.js)       │ │
│  └─────────────────┬──────────────────────┘ │
└────────────────────┼────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────┐
│          Express.js Backend (Node 20)        │
│  ┌──────────────────────────────────────┐   │
│  │  Security: Helmet + CORS + Rate Limit │   │
│  │  Performance: Compression + Caching   │   │
│  │  Logging: Google Cloud Logging        │   │
│  └──────────────────────────────────────┘   │
│  ┌──────────┬────────────┬────────────────┐ │
│  │ /api/chat│ /api/quiz  │ /api/translate  │ │
│  │ (SSE)    │ (JSON)     │ (JSON)          │ │
│  └────┬─────┴─────┬──────┴────────┬───────┘ │
│       └───────────┼───────────────┘          │
│              ┌────▼─────┐                    │
│              │ Gemini   │                    │
│              │ 2.0 Flash│                    │
│              └──────────┘                    │
└──────────────────────────────────────────────┘
                     │
              Google Cloud Run
```

## ✨ Features

### 💬 AI Chat Assistant
- Conversational AI powered by **Google Gemini 2.0 Flash**
- Real-time SSE streaming responses with markdown formatting
- Grounded in factual ECI (Election Commission of India) data
- Non-partisan — focuses purely on education
- Session-based conversation history with automatic cleanup

### ⏱️ Interactive Election Timeline
- Visual 8-phase timeline from Delimitation to Results
- Expandable cards with key facts and durations
- "Ask AI" button on each phase for deeper exploration

### 📖 Process Explorer
- Card-based topic browser (Voter Registration, EVMs, VVPAT, etc.)
- Click any topic to get AI-powered detailed explanations

### 🧠 Election Quiz
- Multiple-choice questions about Indian elections
- Pre-built + AI-generated quiz questions via Gemini
- Score tracking, explanations, and results

### 📍 Polling Station Finder
- Google Maps Embed API integration
- Search by area, city, or PIN code
- Direct links to official ECI voter services

### 🌐 Multilingual Support
- Language selector with 12 Indian languages
- Translation powered by Google Gemini

### ♿ Accessibility
- ARIA roles and labels on all interactive elements
- Keyboard navigation support throughout
- Skip navigation link
- Live regions for dynamic content updates
- Semantic HTML5 structure

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Backend | Node.js 20 + Express 5 |
| AI Engine | Google Gemini 2.0 Flash (`@google/genai`) |
| Maps | Google Maps Embed API |
| Analytics | Google Analytics 4 (gtag.js) |
| Logging | Google Cloud Logging (structured JSON) |
| Security | Helmet.js, CORS, Rate Limiting, CSP |
| Performance | Compression, Code Splitting, Lazy Loading |
| Testing | Vitest + React Testing Library + Supertest |
| Deployment | Google Cloud Run (Docker) |
| Styling | Custom CSS (Glassmorphism, Dark Theme) |

## 🔧 Google Services Used

1. **Google Gemini API** (`@google/genai`) — AI chat, quiz generation, translation, and contextual responses
2. **Google Cloud Run** — Production deployment with auto-scaling and HTTPS
3. **Google Maps Embed API** — Polling station finder with search functionality
4. **Google Analytics 4** (gtag.js) — User interaction tracking (chat, quiz, navigation, searches)
5. **Google Cloud Logging** — Structured JSON logging for request tracking, error monitoring, and event analytics
6. **Google Cloud Secret Manager** — API key security in production environment
7. **Google Fonts** — Inter and Outfit typefaces for premium typography

## 🧪 Testing

The project includes comprehensive tests using **Vitest** and **React Testing Library**:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage
- **Server Tests**: Gemini API wrapper (mocked SDK), Express API endpoint validation
- **Component Tests**: All 8 React components with rendering, interaction, and state tests
- **API Client Tests**: Fetch mocking for quiz generation and translation
- **Integration Tests**: Full API request/response validation with supertest

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd civicsage-ai

# Install dependencies
npm install

# Set your Gemini API key
# Windows PowerShell:
$env:GEMINI_API_KEY="your-api-key-here"
# Linux/Mac:
export GEMINI_API_KEY="your-api-key-here"

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` with the API server on port `3001`.

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t civicsage-ai .
docker run -p 8080:8080 -e GEMINI_API_KEY=your-key civicsage-ai
```

### Deploy to Google Cloud Run
```bash
gcloud run deploy civicsage-ai \
  --source . \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY=your-key \
  --allow-unauthenticated
```

## 📁 Project Structure
```
├── server/
│   ├── index.js              # Express API server with logging & compression
│   ├── gemini.js             # Gemini API wrapper with validation
│   ├── electionData.js       # Election knowledge base & system prompt
│   └── googleServices.js     # Google Cloud Logging & config management
├── src/
│   ├── App.jsx               # Main app with lazy-loaded tabs
│   ├── main.jsx              # Entry point with ErrorBoundary
│   ├── index.css             # Design system & responsive styles
│   ├── components/
│   │   ├── Header.jsx        # Navigation with language selector
│   │   ├── HeroSection.jsx   # Landing page with stats
│   │   ├── ChatAssistant.jsx # AI chat with SSE streaming
│   │   ├── Timeline.jsx      # 8-phase election timeline
│   │   ├── ProcessExplorer.jsx # Topic card browser
│   │   ├── QuizSection.jsx   # Interactive quiz engine
│   │   ├── PollingFinder.jsx # Google Maps polling finder
│   │   ├── ErrorBoundary.jsx # Graceful error handling
│   │   └── Footer.jsx        # Site footer with disclaimer
│   └── lib/
│       ├── api.js            # API client with SSE parser
│       ├── analytics.js      # Google Analytics event tracking
│       └── constants.js      # Shared election data exports
├── tests/
│   ├── setup.js              # Global test setup
│   ├── server/
│   │   ├── gemini.test.js    # Gemini wrapper unit tests
│   │   └── api.test.js       # API integration tests
│   ├── components/
│   │   ├── App.test.jsx      # App navigation tests
│   │   ├── Header.test.jsx   # Header & language tests
│   │   ├── HeroSection.test.jsx # Hero CTA tests
│   │   ├── Timeline.test.jsx # Timeline interaction tests
│   │   ├── QuizSection.test.jsx # Quiz flow tests
│   │   ├── ProcessExplorer.test.jsx # Topic card tests
│   │   └── PollingFinder.test.jsx # Finder UI tests
│   └── lib/
│       └── api.test.js       # API client tests
├── vitest.config.js          # Test configuration
├── Dockerfile                # Multi-stage Docker build
├── vite.config.js            # Vite + code splitting
└── package.json
```

## ⚠️ Assumptions

1. **API Key Management**: The Gemini API key is provided via environment variable. In production on Cloud Run, it uses Google Cloud Secret Manager.
2. **Maps API Key**: The Google Maps Embed API key is served from the backend `/api/config` endpoint to avoid hardcoding in client-side code.
3. **Multilingual Translation**: Uses Gemini for translation as a cost-effective alternative to Google Cloud Translation API. For production at scale, Cloud Translation API would be preferred.
4. **Session Management**: Chat sessions are stored in-memory with 30-minute TTL. For production at scale, a Redis/Memorystore backend would be used.
5. **Analytics**: Google Analytics 4 measurement ID should be configured per environment. The default placeholder is used for development.

## 📜 Data Sources

All election process information is sourced from:
- [Election Commission of India (ECI)](https://eci.gov.in)
- Constitution of India (Articles 324-329)
- Representation of the People Act, 1951
- [SVEEP Program](https://ecisveep.eci.gov.in)

## ⚠️ Disclaimer

This application is for **educational purposes only**. It does not endorse any political party, candidate, or ideology. Always refer to official Election Commission of India sources for authoritative information.

## 📄 License

MIT License
