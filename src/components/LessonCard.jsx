const LessonCard = ({ lesson, userProgress, onStartLesson }) => {
  const progress = userProgress[lesson.id] || 0;
  const isCompleted = progress >= 80; // Consider completed if score is 80% or above

  return (
    <div className={`lesson-card ${isCompleted ? 'completed' : ''} fade-in`}>
      <div className="lesson-title">{lesson.title}</div>
      <div className="lesson-description">{lesson.description}</div>
      
      <div className="lesson-progress">
        <span className="progress-text">Progress: {progress}%</span>
      </div>
      
      <div className="lesson-progress-bar">
        <div 
          className="lesson-progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <button 
        className="start-lesson-btn"
        onClick={() => onStartLesson(lesson)}
      >
        {isCompleted ? 'Retake Lesson' : progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
      </button>
    </div>
  );
};

export default LessonCard;
