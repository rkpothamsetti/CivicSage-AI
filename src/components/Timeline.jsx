import { useState } from 'react';
import { ELECTION_TIMELINE } from '../lib/constants';

export default function Timeline({ onAskAI }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div className="section-header">
        <h2>⏱️ Election Timeline</h2>
        <p>The 8 phases of the Indian election process — from delimitation to results</p>
        <div className="section-divider"></div>
      </div>

      <div className="timeline">
        {ELECTION_TIMELINE.map((step, i) => (
          <div
            key={step.id}
            className="timeline-step"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div
              className="timeline-node"
              style={{ background: `${step.color}20`, borderColor: step.color }}
            >
              {step.icon}
            </div>

            <div
              className="timeline-card"
              style={{ borderLeftColor: step.color }}
              onClick={() => setExpanded(expanded === step.id ? null : step.id)}
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
                <div className="timeline-details">
                  <ul>
                    {step.keyFacts.map((fact, j) => (
                      <li key={j}>✦ {fact}</li>
                    ))}
                  </ul>
                  <button
                    className="timeline-ask-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAskAI(`Tell me more about the ${step.phase} phase in Indian elections`);
                    }}
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
