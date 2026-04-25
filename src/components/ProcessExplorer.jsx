import { PROCESS_TOPICS } from '../lib/constants';

export default function ProcessExplorer({ onAskAI }) {
  return (
    <div>
      <div className="section-header">
        <h2>📖 Process Explorer</h2>
        <p>Explore key topics about the Indian electoral system</p>
        <div className="section-divider"></div>
      </div>

      <div className="process-grid">
        {PROCESS_TOPICS.map((topic) => (
          <div
            key={topic.id}
            className="process-card"
            style={{ '--card-color': topic.color }}
            onClick={() => onAskAI(`Explain ${topic.title} in the Indian election process in detail`)}
          >
            <div className="process-icon">{topic.icon}</div>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <button className="process-learn-btn">
              Learn more →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
