import { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../lib/constants';

export default function Header({ activeTab, onTabChange }) {
  const [lang, setLang] = useState('en');
  const [showLang, setShowLang] = useState(false);

  const navItems = [
    { id: 'chat', label: 'AI Chat' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'quiz', label: 'Quiz' },
    { id: 'finder', label: 'Find Booth' },
  ];

  return (
    <header className="header">
      <div className="header-logo" onClick={() => onTabChange(null)} style={{ cursor: 'pointer' }}>
        <span className="header-logo-icon">🏛️</span>
        <span>CivicSage <span style={{ color: 'var(--accent-violet)' }}>AI</span></span>
      </div>

      <nav className="header-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={activeTab === item.id ? 'active' : ''}
            onClick={() => onTabChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="lang-selector">
          <button className="lang-btn" onClick={() => setShowLang(!showLang)}>
            🌐 {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || 'English'} ▾
          </button>
          {showLang && (
            <div className="lang-dropdown">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => { setLang(l.code); setShowLang(false); }}
                >
                  <span>{l.name}</span>
                  <span style={{ fontSize: '0.75rem' }}>{l.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="powered-badge">⚡ Powered by Gemini</span>
      </div>
    </header>
  );
}
