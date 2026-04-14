import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Award, BarChart2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch('http://localhost:5000/api/quiz/topics', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const data = await response.json();
        setTopics(data);
      } catch (err) {
        console.error('Error fetching topics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleStartQuiz = (topic, difficulty) => {
    navigate(`/quiz?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}`);
  };

  return (
    <div className="dashboard-layout">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="text-gradient">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-secondary">Ready to test your engineering knowledge today?</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: 'var(--accent-primary)' }}>
            <Award size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Skill Level</h3>
            <p className="text-secondary">Intermediate</p>
          </div>
        </div>
        
        <div className="glass-card" style={{ flex: 1, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={() => navigate('/analytics')} role="button">
          <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%', color: 'var(--accent-secondary)' }}>
            <BarChart2 size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>View Analytics</h3>
            <p className="text-secondary">Check your past performances</p>
          </div>
        </div>
      </div>

      <h2>Available Subjects</h2>
      {loading ? (
        <div className="center-content">
          <div className="spinner"></div>
        </div>
      ) : topics.length === 0 ? (
        <p className="text-secondary">No topics available at the moment.</p>
      ) : (
        <div className="grid-cards">
          {topics.map((topic) => (
            <div key={topic} className="glass-card glass-card-hover" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <BookOpen className="text-accent-primary" size={24} />
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{topic}</h3>
              </div>
              <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Test your knowledge in {topic} with exactly 10 questions.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary w-full" 
                  style={{ borderColor: 'rgba(16, 185, 129, 0.5)' }}
                  onClick={() => handleStartQuiz(topic, 'easy')}
                >
                  Easy Level
                </button>
                <button 
                  className="btn btn-secondary w-full" 
                  style={{ borderColor: 'rgba(245, 158, 11, 0.5)' }}
                  onClick={() => handleStartQuiz(topic, 'medium')}
                >
                  Medium Level
                </button>
                <button 
                  className="btn btn-secondary w-full" 
                  style={{ borderColor: 'rgba(239, 68, 68, 0.5)' }}
                  onClick={() => handleStartQuiz(topic, 'hard')}
                >
                  Hard Level
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
