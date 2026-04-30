import PropTypes from 'prop-types';

export default function HeroSection({ onStartChat, onExploreTimeline }) {
  const floatingIcons = ['🗳️', '📜', '🇮🇳', '⚖️', '🏛️', '✊', '📊', '🗺️'];

  return (
    <section className="hero" id="hero" aria-label="Welcome section">
      <div className="floating-icons" aria-hidden="true">
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
        <div className="hero-badge" aria-label="India's Election Process Simplified">🇮🇳 India's Election Process — Simplified</div>

        <h1>Understand Democracy,<br />One Step at a Time</h1>

        <p>
          Your AI-powered guide to the Indian election process. Explore timelines,
          understand EVMs &amp; VVPATs, test your knowledge, and find your polling booth —
          all in one place.
        </p>

        <div className="hero-buttons">
          <button
            id="hero-start-chat"
            className="btn-primary"
            onClick={onStartChat}
            aria-label="Start a conversation with the AI Election Assistant"
          >
            💬 Ask the AI Assistant
          </button>
          <button
            id="hero-explore-timeline"
            className="btn-secondary"
            onClick={onExploreTimeline}
            aria-label="Explore the 8 phases of the election timeline"
          >
            ⏱️ Explore the Timeline
          </button>
        </div>

        <div className="hero-stats" role="list" aria-label="Key election statistics">
          <div className="hero-stat" role="listitem">
            <div className="hero-stat-value">543</div>
            <div className="hero-stat-label">Lok Sabha Seats</div>
          </div>
          <div className="hero-stat" role="listitem">
            <div className="hero-stat-value">950M+</div>
            <div className="hero-stat-label">Registered Voters</div>
          </div>
          <div className="hero-stat" role="listitem">
            <div className="hero-stat-value">8</div>
            <div className="hero-stat-label">Election Phases</div>
          </div>
          <div className="hero-stat" role="listitem">
            <div className="hero-stat-value">28+8</div>
            <div className="hero-stat-label">States &amp; UTs</div>
          </div>
        </div>
      </div>
    </section>
  );
}

HeroSection.propTypes = {
  /** Callback when user clicks the "Ask AI" CTA button */
  onStartChat: PropTypes.func.isRequired,
  /** Callback when user clicks the "Explore Timeline" CTA button */
  onExploreTimeline: PropTypes.func.isRequired,
};
