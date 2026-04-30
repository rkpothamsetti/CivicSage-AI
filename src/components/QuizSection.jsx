import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../lib/constants';
import { generateQuiz } from '../lib/api';
import { trackQuizComplete } from '../lib/analytics';

export default function QuizSection() {
  const [questions, setQuestions] = useState(QUIZ_QUESTIONS.slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const q = questions[current];

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      trackQuizComplete(score + (selected === q.correct ? 1 : 0), questions.length);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const newQ = await generateQuiz('Indian election process');
      if (newQ && newQ.length > 0) {
        setQuestions(newQ);
        setCurrent(0);
        setSelected(null);
        setShowExplanation(false);
        setScore(0);
        setFinished(false);
      }
    } catch (e) {
      console.error('Quiz generation failed:', e);
      setError('Failed to generate quiz. Please try again.');
    }
    setGenerating(false);
  };

  const handleRestart = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrent(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setError(null);
  };

  return (
    <div>
      <div className="section-header">
        <h2 id="quiz-heading">🧠 Election Quiz</h2>
        <p>Test your knowledge about the Indian election process</p>
        <div className="section-divider" aria-hidden="true"></div>
      </div>

      <div className="quiz-container" role="region" aria-labelledby="quiz-heading">
        {finished ? (
          <div className="quiz-card quiz-results" aria-live="polite">
            <h3>Quiz Complete! 🎉</h3>
            <div className="score-big" aria-label={`Score: ${score} out of ${questions.length}`}>
              {score}/{questions.length}
            </div>
            <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
              {score === questions.length ? 'Perfect score! You\'re an election expert! 🏆' :
               score >= questions.length * 0.7 ? 'Great job! You know your elections well! 🌟' :
               score >= questions.length * 0.4 ? 'Good effort! Keep learning! 📚' :
               'Keep exploring to learn more about Indian elections! 💪'}
            </p>
            {error && (
              <p style={{ color: 'var(--accent-coral)', fontSize: '0.85rem', margin: '0.5rem 0' }} role="alert">
                {error}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                id="quiz-restart-btn"
                className="btn-secondary"
                onClick={handleRestart}
                aria-label="Restart quiz with different questions"
              >
                🔄 Try Again
              </button>
              <button
                id="quiz-generate-btn"
                className="quiz-generate-btn"
                onClick={handleGenerate}
                disabled={generating}
                aria-label={generating ? 'Generating new quiz questions...' : 'Generate AI-powered quiz questions'}
              >
                {generating ? '⏳ Generating...' : '✨ AI-Generated Quiz'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-header">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} aria-live="polite">
                Question {current + 1} of {questions.length}
              </span>
              <div className="quiz-score" aria-live="polite">
                Score: <span>{score}</span>
              </div>
            </div>

            <div
              className="quiz-progress"
              role="progressbar"
              aria-valuenow={current + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-label={`Question ${current + 1} of ${questions.length}`}
            >
              <div className="quiz-progress-bar" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="quiz-card">
              <div className="quiz-question-num">Question {current + 1}</div>
              <h3 className="quiz-question" id={`quiz-q-${current}`}>{q.question}</h3>

              <div className="quiz-options" role="radiogroup" aria-labelledby={`quiz-q-${current}`}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    id={`quiz-option-${current}-${i}`}
                    className={`quiz-option ${
                      selected !== null
                        ? i === q.correct ? 'correct' : i === selected ? 'incorrect' : ''
                        : ''
                    }`}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                    role="radio"
                    aria-checked={selected === i}
                    aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="quiz-explanation" role="note" aria-live="polite">
                  💡 {q.explanation}
                </div>
              )}

              {selected !== null && (
                <button
                  id="quiz-next-btn"
                  className="quiz-next-btn"
                  onClick={handleNext}
                  aria-label={current < questions.length - 1 ? 'Go to next question' : 'See final results'}
                >
                  {current < questions.length - 1 ? 'Next Question →' : 'See Results 🏆'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
