import { useState } from 'react';
import PropTypes from 'prop-types';
import { SUPPORTED_LANGUAGES } from '../lib/constants';
import { trackLanguageChange } from '../lib/analytics';

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

  const handleLanguageSelect = (l) => {
    setLang(l.code);
    setShowLang(false);
    trackLanguageChange(l.code, l.name);
  };

  return (
    <header className="header" role="banner" aria-label="CivicSage AI navigation">
      <div
        className="header-logo"
        id="header-logo"
        onClick={() => onTabChange(null)}
        onKeyDown={(e) => e.key === 'Enter' && onTabChange(null)}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
        aria-label="Return to home page"
      >
        <span className="header-logo-icon" aria-hidden="true">🏛️</span>
        <span>CivicSage <span style={{ color: 'var(--accent-violet)' }}>AI</span></span>
      </div>

      <nav className="header-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`header-nav-${item.id}`}
            className={activeTab === item.id ? 'active' : ''}
            onClick={() => onTabChange(item.id)}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <div className="lang-selector">
          <button
            className="lang-btn"
            id="language-selector-btn"
            onClick={() => setShowLang(!showLang)}
            aria-expanded={showLang}
            aria-haspopup="listbox"
            aria-label={`Language selector. Current: ${SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || 'English'}`}
          >
            🌐 {SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || 'English'} ▾
          </button>
          {showLang && (
            <div className="lang-dropdown" role="listbox" aria-label="Select language">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  id={`lang-option-${l.code}`}
                  className={`lang-option ${lang === l.code ? 'active' : ''}`}
                  onClick={() => handleLanguageSelect(l)}
                  role="option"
                  aria-selected={lang === l.code}
                >
                  <span>{l.name}</span>
                  <span style={{ fontSize: '0.75rem' }}>{l.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="powered-badge" aria-label="Powered by Google Gemini">⚡ Powered by Gemini</span>
      </div>
    </header>
  );
}

Header.propTypes = {
  /** Currently active tab identifier, null for home */
  activeTab: PropTypes.string,
  /** Callback when a tab is selected */
  onTabChange: PropTypes.func.isRequired,
};
