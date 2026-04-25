# 🏛️ CivicSage AI — Indian Election Process Assistant

An AI-powered interactive assistant that helps citizens understand the Indian election process, timelines, and procedures in an engaging, conversational, and visually rich way.

**Built for PromptWars Virtual — Challenge Two: Civic Education**

## 🎯 Problem Statement

The election process in India is complex, involving multiple phases, institutions, and legal frameworks. Many citizens, especially first-time voters, find it difficult to understand how elections work. **CivicSage AI** bridges this gap by providing an interactive, AI-driven platform that breaks down electoral procedures into digestible, conversational explanations.

## ✨ Features

### 💬 AI Chat Assistant
- Conversational AI powered by **Google Gemini 2.0 Flash**
- Real-time streaming responses with markdown formatting
- Grounded in factual ECI (Election Commission of India) data
- Non-partisan — focuses purely on education
- Session-based conversation history

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
- Google Maps Embed integration
- Search by area, city, or PIN code
- Direct links to official ECI voter services

### 🌐 Multilingual Support
- Language selector with 12 Indian languages
- Translation powered by Google Gemini

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| AI Engine | Google Gemini 2.0 Flash (`@google/genai`) |
| Maps | Google Maps Embed API |
| Security | Helmet.js, CORS, Rate Limiting |
| Deployment | Google Cloud Run (Docker) |
| Styling | Custom CSS (Glassmorphism, Dark Theme) |

## 🔧 Google Services Used

1. **Google Gemini API** — AI chat, quiz generation, translation
2. **Google Cloud Run** — Production deployment
3. **Google Maps Embed API** — Polling station finder
4. **`@google/genai` SDK** — Official Google AI SDK
5. **Google Cloud Secret Manager** — API key security (production)

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
│   ├── index.js          # Express API server
│   ├── gemini.js          # Gemini API wrapper
│   └── electionData.js    # Election knowledge base & system prompt
├── src/
│   ├── App.jsx            # Main app with tab navigation
│   ├── index.css           # Design system
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ChatAssistant.jsx
│   │   ├── Timeline.jsx
│   │   ├── ProcessExplorer.jsx
│   │   ├── QuizSection.jsx
│   │   ├── PollingFinder.jsx
│   │   └── Footer.jsx
│   └── lib/
│       ├── constants.js
│       └── api.js
├── Dockerfile
├── vite.config.js
└── package.json
```

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
