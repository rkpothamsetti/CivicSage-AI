import { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ChatAssistant from './components/ChatAssistant';
import Timeline from './components/Timeline';
import ProcessExplorer from './components/ProcessExplorer';
import QuizSection from './components/QuizSection';
import PollingFinder from './components/PollingFinder';
import Footer from './components/Footer';

const TABS = [
  { id: 'chat', label: '💬 AI Chat', icon: '💬' },
  { id: 'timeline', label: '⏱️ Timeline', icon: '⏱️' },
  { id: 'explorer', label: '📖 Explorer', icon: '📖' },
  { id: 'quiz', label: '🧠 Quiz', icon: '🧠' },
  { id: 'finder', label: '📍 Find Booth', icon: '📍' },
];

function App() {
  const [activeTab, setActiveTab] = useState(null);
  const [chatInitialMsg, setChatInitialMsg] = useState('');

  const handleAskAI = (question) => {
    setChatInitialMsg(question);
    setActiveTab('chat');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleExplore = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {!activeTab && (
        <HeroSection
          onStartChat={() => handleExplore('chat')}
          onExploreTimeline={() => handleExplore('timeline')}
        />
      )}

      {activeTab && (
        <>
          <nav className="tab-nav">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="section">
            {activeTab === 'chat' && (
              <ChatAssistant initialMessage={chatInitialMsg} onMessageSent={() => setChatInitialMsg('')} />
            )}
            {activeTab === 'timeline' && <Timeline onAskAI={handleAskAI} />}
            {activeTab === 'explorer' && <ProcessExplorer onAskAI={handleAskAI} />}
            {activeTab === 'quiz' && <QuizSection />}
            {activeTab === 'finder' && <PollingFinder />}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
