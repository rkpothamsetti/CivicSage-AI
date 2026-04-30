import { useState } from 'react';
import PropTypes from 'prop-types';
import { ELECTION_TIMELINE } from '../lib/constants';
import { trackTimelineExpand } from '../lib/analytics';

export default function Timeline({ onAskAI }) {
  const [expanded, setExpanded] = useState(null);

  const handleToggle = (step) => {
    const newVal = expanded === step.id ? null : step.id;
    setExpanded(newVal);
    if (newVal) trackTimelineExpand(step.phase);
  };

  return (
    <div>
      <div className="section-header">
        <h2 id="timeline-heading">⏱️ Election Timeline</h2>
        <p>The 8 phases of the Indian election process — from delimitation to results</p>
        <div className="section-divider" aria-hidden="true"></div>
      </div>

      <div className="timeline" role="list" aria-labelledby="timeline-heading">
        {ELECTION_TIMELINE.map((step, i) => (
          <div
            key={step.id}
            className="timeline-step"
            style={{ animationDelay: `${i * 0.1}s` }}
            role="listitem"
          >
            <div
              className="timeline-node"
              style={{ background: `${step.color}20`, borderColor: step.color }}
              aria-hidden="true"
            >
              {step.icon}
            </div>

            <div
              className="timeline-card"
              id={`timeline-card-${step.id}`}
              style={{ borderLeftColor: step.color }}
              onClick={() => handleToggle(step)}
              onKeyDown={(e) => e.key === 'Enter' && handleToggle(step)}
              role="button"
              tabIndex={0}
              aria-expanded={expanded === step.id}
              aria-label={`Phase ${step.id}: ${step.phase} - ${step.title}. Click to ${expanded === step.id ? 'collapse' : 'expand'} details.`}
            >
              <div className="timeline-card-header">
                <span className="timeline-phase" style={{ color: step.color }}>
                  Phase {step.id}: {step.phase}
                </span>
                <span className="timeline-duration">{step.duration}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>

              {expanded === step.id && (
                <div className="timeline-details" aria-label={`Key facts about ${step.phase}`}>
                  <ul>
                    {step.keyFacts.map((fact, j) => (
                      <li key={j}>✦ {fact}</li>
                    ))}
                  </ul>
                  <button
                    id={`timeline-ask-${step.id}`}
                    className="timeline-ask-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAI(`Tell me more about the ${step.phase} phase in Indian elections`);
                    }}
                    aria-label={`Ask AI about the ${step.phase} phase`}
                  >
                    💬 Ask AI about this phase
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Timeline.propTypes = {
  /** Callback when user wants to ask AI about a timeline phase */
  onAskAI: PropTypes.func.isRequired,
};
