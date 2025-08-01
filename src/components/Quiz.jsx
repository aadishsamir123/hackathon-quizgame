import { useState, useEffect } from 'react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

const Quiz = ({ lesson, userUID, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hearts, setHearts] = useState(3);

  const questions = lesson.questions || [];
  const totalQuestions = questions.length;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setHearts(hearts - 1);
    }

    // Show result for 1.5 seconds
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion + 1 < totalQuestions && hearts > 0) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz completed or no hearts left
        completeQuiz();
      }
    }, 1500);
  };

  const completeQuiz = async () => {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    
    try {
      // Update user progress in Firebase
      const userRef = doc(db, 'users', userUID);
      await updateDoc(userRef, {
        [`progress.${lesson.id}`]: percentage,
        totalScore: increment(finalScore),
        lessonsCompleted: increment(1)
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }

    onComplete(percentage, finalScore, totalQuestions);
  };

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="error">No questions available for this lesson.</div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="quiz-container fade-in">
      {/* Progress Bar */}
      <div className="progress-bar" style={{ marginBottom: '2rem' }}>
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Hearts */}
      <div className="hearts" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
        {[...Array(3)].map((_, i) => (
          <span 
            key={i} 
            className={`heart ${i >= hearts ? 'empty' : ''}`}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Question Counter */}
      <div className="question-counter">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>

      {/* Question */}
      <div className="question">
        {question.question}
      </div>

      {/* Answers */}
      <div className="answers-grid">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`answer-btn ${
              selectedAnswer === index ? 'selected' : ''
            } ${
              showResult
                ? index === question.correctAnswer
                  ? 'correct'
                  : selectedAnswer === index
                  ? 'incorrect'
                  : ''
                : ''
            }`}
            onClick={() => !showResult && handleAnswerSelect(index)}
            disabled={showResult}
          >
            {answer}
          </button>
        ))}
      </div>

      {/* Submit Button */}
      {!showResult && (
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
        >
          Submit Answer
        </button>
      )}

      {/* Result Message */}
      {showResult && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          {selectedAnswer === question.correctAnswer ? (
            <div style={{ color: 'var(--success-green)', fontSize: '1.2rem', fontWeight: '600' }}>
              ✅ Correct!
            </div>
          ) : (
            <div style={{ color: 'var(--error-red)', fontSize: '1.2rem', fontWeight: '600' }}>
              ❌ Incorrect. The correct answer was: {question.answers[question.correctAnswer]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
