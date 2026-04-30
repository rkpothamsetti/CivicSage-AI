export default function Footer() {
  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <p>
        <strong>🏛️ CivicSage AI</strong> — Interactive Indian Election Process Assistant
      </p>
      <p>
        Built for <a href="https://promptwars.in" target="_blank" rel="noopener noreferrer">PromptWars Virtual</a> — Challenge Two: Civic Education
      </p>
      <p>
        Powered by <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer">Google Gemini</a> •
        Deployed on <a href="https://cloud.google.com/run" target="_blank" rel="noopener noreferrer">Google Cloud Run</a>
      </p>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Built for PromptWars Challenge Two: Solving the Civic Education Problem Statement.
      </p>
      <div className="footer-disclaimer" role="note">
        ⚠️ This application is for <strong>educational purposes only</strong>. Information is based on
        publicly available data from the Election Commission of India. Always refer to official
        ECI sources (<a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">eci.gov.in</a>)
        for authoritative information.
      </div>
    </footer>
  );
}
