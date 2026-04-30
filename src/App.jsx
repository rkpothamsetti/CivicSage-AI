import { useState, lazy, Suspense, useCallback } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import { trackTabChange } from './lib/analytics';

// Lazy-load tab content for code-splitting
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
const Timeline = lazy(() => import('./components/Timeline'));
const ProcessExplorer = lazy(() => import('./components/ProcessExplorer'));
const QuizSection = lazy(() => import('./components/QuizSection'));
const PollingFinder = lazy(() => import('./components/PollingFinder'));

const TABS = [
  { id: 'chat', label: '💬 AI Chat', icon: '💬' },
  { id: 'timeline', label: '⏱️ Timeline', icon: '⏱️' },
  { id: 'explorer', label: '📖 Explorer', icon: '📖' },
  { id: 'quiz', label: '🧠 Quiz', icon: '🧠' },
  { id: 'finder', label: '📍 Find Booth', icon: '📍' },
];

/** Loading fallback for lazy-loaded components */
function TabLoading() {
  return (
    <div className="section" role="status" aria-label="Loading content">
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <div className="loading-spinner" aria-hidden="true" />
      </div>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</p>
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [chatInitialMsg, setChatInitialMsg] = useState('');

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    trackTabChange(tabId);
  }, []);

  const handleAskAI = useCallback((question) => {
    setChatInitialMsg(question);
    setActiveTab('chat');
    trackTabChange('chat');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, []);

  const handleExplore = useCallback((tab) => {
    setActiveTab(tab);
    trackTabChange(tab);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      <a href="#main-content" className="skip-link" id="skip-nav">
        Skip to main content
      </a>

      <Header activeTab={activeTab} onTabChange={handleTabChange} />

      <main id="main-content" role="main">
        {!activeTab && (
          <HeroSection
            onStartChat={() => handleExplore('chat')}
            onExploreTimeline={() => handleExplore('timeline')}
          />
        )}

        {activeTab && (
          <>
            <nav className="tab-nav" role="tablist" aria-label="Feature navigation">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div
              className="section"
              id={`panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              <Suspense fallback={<TabLoading />}>
                {activeTab === 'chat' && (
                  <ChatAssistant initialMessage={chatInitialMsg} onMessageSent={() => setChatInitialMsg('')} />
                )}
                {activeTab === 'timeline' && <Timeline onAskAI={handleAskAI} />}
                {activeTab === 'explorer' && <ProcessExplorer onAskAI={handleAskAI} />}
                {activeTab === 'quiz' && <QuizSection />}
                {activeTab === 'finder' && <PollingFinder />}
              </Suspense>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
