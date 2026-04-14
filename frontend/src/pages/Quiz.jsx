import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const Quiz = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const topic = searchParams.get('topic');
  const difficulty = searchParams.get('difficulty');

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes default
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // stores result object if finished
  const [error, setError] = useState('');

  // Fetch Questions
  useEffect(() => {
    if (!topic || !difficulty) {
      navigate('/');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch(`http://localhost:5000/api/quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [topic, difficulty, navigate]);

  // Submit Handler
  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    
    let correctCount = 0;
    
    // Build answers
    const answers = questions.map((q, idx) => {
      const isCorrect = selectedAnswers[idx] === q.correctAnswer;
      if (isCorrect) correctCount += 1;
      return {
        questionText: q.text,
        chosenAnswer: selectedAnswers[idx] || 'Not answered',
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect
      };
    });

    const incorrectCount = questions.length - correctCount;
    const score = correctCount; // Using 1 pt per question for simplicity
    const isPassed = (correctCount / questions.length) >= 0.5;

    const payload = {
      topic,
      difficulty,
      score,
      totalQuestions: questions.length,
      correctCount,
      incorrectCount,
      answers
    };

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch('http://localhost:5000/api/analytics/result', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResult({ ...payload, isPassed });
    } catch (err) {
      console.error(err);
      alert('Error submitting results');
    } finally {
      setSubmitting(false);
    }
  }, [submitting, questions, selectedAnswers, topic, difficulty]);

  // Timer
  useEffect(() => {
    if (loading || result || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time is up
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, result, submitting, handleSubmit]);


  if (loading) return <div className="center-content"><div className="spinner spinner-lg"></div></div>;
  if (error) return <div className="center-content"><p className="error-msg">{error}</p></div>;
  if (!questions.length) return <div className="center-content"><p>No questions found.</p></div>;

  // View: Result Summary
  if (result) {
    return (
      <div className="dashboard-layout center-content">
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '3rem', textAlign: 'center' }}>
          {result.isPassed ? (
            <CheckCircle size={64} className="text-accent-primary" style={{ margin: '0 auto 1rem', color: 'var(--success)' }} />
          ) : (
            <XCircle size={64} style={{ margin: '0 auto 1rem', color: 'var(--error)' }} />
          )}
          <h1 className="text-gradient">{result.isPassed ? 'Congratulations!' : 'Keep Practicing'}</h1>
          <p className="text-secondary text-lg" style={{ marginBottom: '2rem' }}>
            You scored {result.correctCount} out of {result.totalQuestions} in {topic} ({difficulty}).
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem 2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{result.correctCount}</div>
              <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Correct</div>
            </div>
            <div style={{ padding: '1rem 2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--error)' }}>{result.incorrectCount}</div>
              <div className="text-secondary" style={{ fontSize: '0.8rem' }}>Incorrect</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => navigate('/analytics')}>View Analytics</button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  // View: Active Quiz
  const question = questions[currentIdx];
  const progressPercent = ((currentIdx) / questions.length) * 100;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOptionSelect = (opt) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="dashboard-layout" style={{ maxWidth: '800px' }}>
      <div className="flex-between" style={{ marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{topic} <span className="text-secondary" style={{ fontSize: '1rem', fontWeight: 400 }}>({difficulty})</span></h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 60 ? 'var(--error)' : 'var(--text-primary)', fontWeight: 'bold' }}>
          <Clock size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p className="text-secondary" style={{ marginBottom: '2rem', fontSize: '0.9rem', textAlign: 'right' }}>
        Question {currentIdx + 1} of {questions.length}
      </p>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          {currentIdx + 1}. {question.text}
        </h3>

        <div>
          {question.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${selectedAnswers[currentIdx] === opt ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(opt)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  border: `2px solid ${selectedAnswers[currentIdx] === opt ? 'var(--accent-primary)' : 'var(--text-secondary)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {selectedAnswers[currentIdx] === opt && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />}
                </div>
                <span>{opt}</span>
              </div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setCurrentIdx(prev => prev - 1)} 
            disabled={currentIdx === 0}
          >
            Previous
          </button>
          <button 
            className={`btn ${currentIdx === questions.length - 1 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleNext}
            disabled={!selectedAnswers[currentIdx]}
            style={currentIdx === questions.length - 1 ? { background: 'var(--success)' } : {}}
          >
            {submitting ? <div className="spinner"></div> : (currentIdx === questions.length - 1 ? 'Submit Quiz' : 'Next Question')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
