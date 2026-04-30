import PropTypes from 'prop-types';
import { PROCESS_TOPICS } from '../lib/constants';
import { trackTopicExplored } from '../lib/analytics';

export default function ProcessExplorer({ onAskAI }) {
  const handleTopicClick = (topic) => {
    trackTopicExplored(topic.title);
    onAskAI(`Explain ${topic.title} in the Indian election process in detail`);
  };

  return (
    <div>
      <div className="section-header">
        <h2 id="explorer-heading">📖 Process Explorer</h2>
        <p>Explore key topics about the Indian electoral system</p>
        <div className="section-divider" aria-hidden="true"></div>
      </div>

      <div className="process-grid" role="list" aria-labelledby="explorer-heading">
        {PROCESS_TOPICS.map((topic) => (
          <div
            key={topic.id}
            id={`topic-card-${topic.id}`}
            className="process-card"
            style={{ '--card-color': topic.color }}
            onClick={() => handleTopicClick(topic)}
            onKeyDown={(e) => e.key === 'Enter' && handleTopicClick(topic)}
            role="listitem"
            tabIndex={0}
            aria-label={`Learn about ${topic.title}: ${topic.description}`}
          >
            <div className="process-icon" aria-hidden="true">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <button
              className="process-learn-btn"
              tabIndex={-1}
              aria-hidden="true"
            >
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

ProcessExplorer.propTypes = {
  /** Callback when user clicks a topic to ask AI about it */
  onAskAI: PropTypes.func.isRequired,
};
