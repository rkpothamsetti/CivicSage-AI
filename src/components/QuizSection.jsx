import { useState } from 'react';
import { QUIZ_QUESTIONS } from '../lib/constants';
import { generateQuiz } from '../lib/api';

export default function QuizSection() {
  const [questions, setQuestions] = useState(QUIZ_QUESTIONS.slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const [generating, setGenerating] = useState(false);

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
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
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
  };

  return (
    <div>
      <div className="section-header">
        <h2>🧠 Election Quiz</h2>
        <p>Test your knowledge about the Indian election process</p>
        <div className="section-divider"></div>
      </div>

      <div className="quiz-container">
        {finished ? (
          <div className="quiz-card quiz-results">
            <h3>Quiz Complete! 🎉</h3>
            <div className="score-big">{score}/{questions.length}</div>
            <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
              {score === questions.length ? 'Perfect score! You\'re an election expert! 🏆' :
               score >= questions.length * 0.7 ? 'Great job! You know your elections well! 🌟' :
               score >= questions.length * 0.4 ? 'Good effort! Keep learning! 📚' :
               'Keep exploring to learn more about Indian elections! 💪'}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn-secondary" onClick={handleRestart}>🔄 Try Again</button>
              <button className="quiz-generate-btn" onClick={handleGenerate} disabled={generating}>
                {generating ? '⏳ Generating...' : '✨ AI-Generated Quiz'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="quiz-header">
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Question {current + 1} of {questions.length}
              </span>
              <div className="quiz-score">
                Score: <span>{score}</span>
              </div>
            </div>

            <div className="quiz-progress">
              <div className="quiz-progress-bar" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>

            <div className="quiz-card">
              <div className="quiz-question-num">Question {current + 1}</div>
              <h3 className="quiz-question">{q.question}</h3>

              <div className="quiz-options">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`quiz-option ${
                      selected !== null
                        ? i === q.correct ? 'correct' : i === selected ? 'incorrect' : ''
                        : ''
                    }`}
                    onClick={() => handleSelect(i)}
                    disabled={selected !== null}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                ))}
              </div>

              {showExplanation && (
                <div className="quiz-explanation">
                  💡 {q.explanation}
                </div>
              )}

              {selected !== null && (
                <button className="quiz-next-btn" onClick={handleNext}>
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
