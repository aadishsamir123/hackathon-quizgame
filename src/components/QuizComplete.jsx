const QuizComplete = ({ score, totalQuestions, percentage, onBackToLessons, onReturnHome }) => {
  const getResultMessage = () => {
    if (percentage >= 80) {
      return {
        title: "🎉 Excellent!",
        message: "You've mastered this topic!",
        color: "var(--success-green)"
      };
    } else if (percentage >= 60) {
      return {
        title: "👍 Good Job!",
        message: "You're making great progress!",
        color: "var(--primary-blue)"
      };
    } else {
      return {
        title: "📚 Keep Learning!",
        message: "Practice makes perfect!",
        color: "var(--warning-orange)"
      };
    }
  };

  const result = getResultMessage();

  return (
    <div className="quiz-container fade-in" style={{ textAlign: 'center' }}>
      <div style={{ 
        fontSize: '4rem', 
        marginBottom: '1rem',
        color: result.color 
      }}>
        {result.title.split(' ')[0]}
      </div>
      
      <h2 style={{ 
        color: result.color, 
        marginBottom: '1rem',
        fontSize: '2rem'
      }}>
        {result.title.substring(2)}
      </h2>
      
      <p style={{ 
        fontSize: '1.2rem', 
        color: 'var(--text-light)', 
        marginBottom: '2rem' 
      }}>
        {result.message}
      </p>
      
      <div style={{ 
        background: 'var(--background-light)', 
        padding: '2rem', 
        borderRadius: '12px', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          color: result.color,
          marginBottom: '0.5rem' 
        }}>
          {percentage}%
        </div>
        <div style={{ color: 'var(--text-light)' }}>
          {score} out of {totalQuestions} correct
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        justifyContent: 'center',
        flexWrap: 'wrap' 
      }}>
        <button 
          className="submit-btn"
          onClick={onBackToLessons}
          style={{ 
            background: `linear-gradient(135deg, ${result.color} 0%, ${result.color}aa 100%)`,
            flex: '1',
            minWidth: '150px',
            maxWidth: '200px'
          }}
        >
          Back to Lessons
        </button>
        
        {onReturnHome && (
          <button 
            className="submit-btn"
            onClick={onReturnHome}
            style={{ 
              background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%)',
              flex: '1',
              minWidth: '150px',
              maxWidth: '200px'
            }}
          >
            Return Home
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComplete;
