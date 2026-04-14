import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        const resData = await response.json();
        setData(resData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="center-content"><div className="spinner spinner-lg"></div></div>;

  if (!data || data.totalQuizzes === 0) {
    return (
      <div className="dashboard-layout center-content">
        <h2 className="text-secondary">No Analytics available yet.</h2>
        <p>Take a quiz to see your performance charts here!</p>
      </div>
    );
  }

  // DETAILED QUIZ VIEW
  if (selectedQuiz) {
    return (
      <div className="dashboard-layout" style={{ maxWidth: '800px' }}>
        <button className="btn btn-secondary mb-lg" onClick={() => setSelectedQuiz(null)}>
          <ChevronLeft size={18} /> Back to Dashboard
        </button>

        <h1 className="text-gradient">Quiz Results</h1>
        <p className="text-secondary mb-lg">
          {selectedQuiz.topic} ({selectedQuiz.difficulty}) - {new Date(selectedQuiz.createdAt).toLocaleDateString()}
        </p>

        <div className="glass-card mb-lg" style={{ padding: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{selectedQuiz.score}</div>
            <div className="text-secondary">Total Score</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>{selectedQuiz.correctCount}</div>
            <div className="text-secondary">Correct</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--error)' }}>{selectedQuiz.incorrectCount}</div>
            <div className="text-secondary">Incorrect</div>
          </div>
        </div>

        <h3>Question Breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          {selectedQuiz.answers && selectedQuiz.answers.map((ans, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${ans.isCorrect ? 'var(--success)' : 'var(--error)'}` }}>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <span style={{ marginTop: '2px' }}>
                  {ans.isCorrect ? <CheckCircle size={20} color="var(--success)" /> : <XCircle size={20} color="var(--error)" />}
                </span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.4' }}>{ans.questionText}</h4>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Your Answer</div>
                  <div style={{ color: ans.isCorrect ? 'var(--success)' : 'var(--error)' }}>{ans.chosenAnswer}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <div className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>Correct Answer</div>
                  <div style={{ color: 'var(--success)' }}>{ans.correctAnswer}</div>
                </div>
              </div>

              {ans.explanation && (
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>Explanation: </span>
                  <span style={{ fontSize: '0.9rem' }}>{ans.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }


  // MAIN ANALYTICS DASHBOARD
  const lineChartData = {
    labels: data.recentDates.map(d => new Date(d).toLocaleDateString()),
    datasets: [
      {
        label: 'Recent Scores',
        data: data.recentScores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        fill: true,
      }
    ]
  };

  const doughnutData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [data.passedQuizzes, data.failedQuizzes],
        backgroundColor: ['#10b981', '#ef4444'],
        hoverBackgroundColor: ['#059669', '#dc2626'],
        borderWidth: 0,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#f8fafc' } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, min: 0, max: 10 }
    }
  };

  return (
    <div className="dashboard-layout">
      <h1 className="text-gradient mb-lg">Performance Analytics</h1>
      
      <div className="grid-cards" style={{ marginTop: 0, marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 className="text-secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>Total Quizzes</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>{data.totalQuizzes}</div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 className="text-secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>Average Score</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{data.averageScore.toFixed(1)}</div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 className="text-secondary" style={{ fontSize: '1rem', fontWeight: 500 }}>Pass Rate</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {((data.passedQuizzes / data.totalQuizzes) * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ padding: '2rem', flex: '2 1 500px', height: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Score Progression</h3>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', flex: '1 1 300px', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Pass vs Fail Distribution</h3>
          <div style={{ flex: 1, position: 'relative' }}>
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#f8fafc' } } } }} />
          </div>
        </div>
      </div>
      
      <div className="glass-card mt-lg" style={{ padding: '2rem' }}>
        <h3>Recent Quiz History</h3>
        <p className="text-secondary mb-lg">Click on any quiz to view detailed answers and explanations.</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Date</th>
                <th style={{ padding: '1rem' }}>Topic</th>
                <th style={{ padding: '1rem' }}>Difficulty</th>
                <th style={{ padding: '1rem' }}>Score</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.history.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{item.topic}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{item.difficulty}</td>
                  <td style={{ padding: '1rem' }}>{item.score} / {item.totalQuestions}</td>
                  <td style={{ padding: '1rem', color: item.isPassed ? 'var(--success)' : 'var(--error)' }}>
                    {item.isPassed ? 'Passed' : 'Failed'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => setSelectedQuiz(item)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
