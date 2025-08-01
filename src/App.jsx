import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getUserUID } from './utils';
import LessonCard from './components/LessonCard';
import Quiz from './components/Quiz';
import QuizComplete from './components/QuizComplete';
import DebugPage from './components/DebugPage';
import './App.css';

function App() {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showQuizComplete, setShowQuizComplete] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userUID, setUserUID] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const uid = getUserUID();
    if (!uid) {
      setError('User UID not found in URL. Please access this page with ?uid=YOUR_USER_ID');
      setLoading(false);
      return;
    }
    setUserUID(uid);
    fetchData(uid);
  }, []);

  const fetchData = async (uid) => {
    try {
      setLoading(true);
      
      // First, check if user exists and get user data
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        setError('Access denied. User not found in the system.');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      setUserData(userData);

      // Check if user is admin
      if (userData.admin === true) {
        setShowModeSelection(true);
        setLoading(false);
        return;
      }

      // Fetch lessons
      const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
      const lessonsData = lessonsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Use existing progress or create empty progress object
      const progress = userData.progress || {};

      setLessons(lessonsData);
      setUserProgress(progress);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please check your Firebase configuration or user permissions.');
      setLoading(false);
    }
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    setShowQuizComplete(false);
  };

  const handleModeSelection = async (mode) => {
    if (mode === 'admin') {
      setDebugMode(true);
      setShowModeSelection(false);
    } else {
      // Continue to quiz mode
      setShowModeSelection(false);
      
      // Fetch lessons for quiz mode
      try {
        const lessonsSnapshot = await getDocs(collection(db, 'lessons'));
        const lessonsData = lessonsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setLessons(lessonsData);
        setUserProgress(userData.progress || {});
      } catch (err) {
        console.error('Error fetching lessons:', err);
        setError('Failed to load lessons.');
      }
    }
  };

  const handleQuizComplete = (percentage, score, totalQuestions) => {
    setQuizResults({ percentage, score, totalQuestions });
    setShowQuizComplete(true);
    
    // Update local progress
    setUserProgress(prev => ({
      ...prev,
      [currentLesson.id]: percentage
    }));
  };

  const handleBackToLessons = () => {
    setCurrentLesson(null);
    setShowQuizComplete(false);
    setQuizResults(null);
  };

  const handleReturnHome = () => {
    if (userData?.admin === true) {
      setCurrentLesson(null);
      setShowQuizComplete(false);
      setQuizResults(null);
      setShowModeSelection(true);
      setDebugMode(false);
    } else {
      handleBackToLessons();
    }
  };

  const calculateOverallProgress = () => {
    if (lessons.length === 0) return 0;
    const totalProgress = Object.values(userProgress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(totalProgress / lessons.length);
  };

  if (debugMode) {
    return <DebugPage />;
  }

  if (showModeSelection) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
            </div>
            {userData?.name && (
              <div style={{ color: 'white', fontSize: '1rem' }}>
                Welcome, {userData.name}
              </div>
            )}
          </div>
        </header>
        
        <main className="app-main">
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '600px', 
            margin: '0 auto',
            padding: '3rem 2rem'
          }}>
            <h1 style={{ 
              color: 'var(--primary-blue)', 
              marginBottom: '2rem',
              fontSize: '2.5rem',
              fontWeight: '700'
            }}>
              Choose Your Mode
            </h1>
            
            <div style={{ 
              display: 'grid', 
              gap: '2rem', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              marginTop: '3rem'
            }}>
              <button
                onClick={() => handleModeSelection('quiz')}
                className="mode-selection-btn"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--accent-blue) 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '2rem',
                  borderRadius: '16px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px var(--shadow)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                Start Learning
                <div style={{ fontSize: '0.9rem', fontWeight: '400', marginTop: '0.5rem', opacity: 0.9 }}>
                  Take quizzes and track your progress
                </div>
              </button>
              
              <button
                onClick={() => handleModeSelection('admin')}
                className="mode-selection-btn"
                style={{
                  background: 'linear-gradient(135deg, var(--warning-orange) 0%, #ff9800 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '2rem',
                  borderRadius: '16px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(255, 152, 0, 0.3)'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                Admin Panel
                <div style={{ fontSize: '0.9rem', fontWeight: '400', marginTop: '0.5rem', opacity: 0.9 }}>
                  Manage lessons and content
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div>Loading your learning journey...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            
          </div>
          
          {!currentLesson && (
            <>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
              
              <div style={{ color: 'white', fontSize: '0.9rem' }}>
                Overall Progress: {calculateOverallProgress()}%
              </div>
            </>
          )}

          {userData?.name && (
            <div style={{ color: 'white', fontSize: '1rem' }}>
              Welcome, {userData.name}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {showQuizComplete ? (
          <QuizComplete 
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions}
            percentage={quizResults.percentage}
            onBackToLessons={handleBackToLessons}
            onReturnHome={userData?.admin === true ? handleReturnHome : null}
          />
        ) : currentLesson ? (
          <div>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '2rem',
              color: 'var(--primary-blue)',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              {currentLesson.title}
            </div>
            <Quiz 
              lesson={currentLesson}
              userUID={userUID}
              onComplete={handleQuizComplete}
            />
          </div>
        ) : (
          <div>
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '3rem' 
            }}>
              <h1 style={{ 
                color: 'var(--primary-blue)', 
                marginBottom: '1rem',
                fontSize: '2.5rem',
                fontWeight: '700'
              }}>
                Choose Your Learning Path
              </h1>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Master new topics through interactive quizzes and track your progress along the way.
              </p>
            </div>

            {lessons.length === 0 ? (
              <div className="error">
                No lessons available. Please add lessons to your Firebase database.
              </div>
            ) : (
              <div className="lessons-grid">
                {lessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    userProgress={userProgress}
                    onStartLesson={handleStartLesson}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
