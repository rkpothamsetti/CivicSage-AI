export default function HeroSection({ onStartChat, onExploreTimeline }) {
  const floatingIcons = ['🗳️', '📜', '🇮🇳', '⚖️', '🏛️', '✊', '📊', '🗺️'];

  return (
    <section className="hero" id="hero">
      <div className="floating-icons">
        {floatingIcons.map((icon, i) => (
          <span
            key={i}
            className="floating-icon"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              animationDelay: `${i * 2.5}s`,
              animationDuration: `${18 + i * 3}s`,
            }}
          >
            {icon}
          </span>
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-badge">🇮🇳 India's Election Process — Simplified</div>

        <h1>Understand Democracy,<br />One Step at a Time</h1>

        <p>
          Your AI-powered guide to the Indian election process. Explore timelines,
          understand EVMs & VVPATs, test your knowledge, and find your polling booth —
          all in one place.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={onStartChat}>
            💬 Ask the AI Assistant
          </button>
          <button className="btn-secondary" onClick={onExploreTimeline}>
            ⏱️ Explore the Timeline
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">543</div>
            <div className="hero-stat-label">Lok Sabha Seats</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">950M+</div>
            <div className="hero-stat-label">Registered Voters</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">8</div>
            <div className="hero-stat-label">Election Phases</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">28+8</div>
            <div className="hero-stat-label">States & UTs</div>
          </div>
        </div>
      </div>
    </section>
  );
}
