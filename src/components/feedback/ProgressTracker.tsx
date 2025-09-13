import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { progressAPI } from '../../api/mock-api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { TherapyPlan, ProgressData } from '../../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const [therapyPlan, setTherapyPlan] = useState<TherapyPlan | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'details'>('overview');

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827'
  };

  const tabButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginRight: '8px',
    transition: 'all 0.2s ease'
  };

  const activeTabButtonStyle: React.CSSProperties = {
    ...tabButtonStyle,
    backgroundColor: '#2563eb',
    color: '#ffffff'
  };

  const progressBarContainerStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px'
  };

  const progressBarHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const progressBarTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  };

  const progressPercentageStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563eb'
  };

  const progressBarStyle: React.CSSProperties = {
    width: '100%',
    height: '12px',
    backgroundColor: '#e5e7eb',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '12px'
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    transition: 'width 0.8s ease'
  };

  const progressDetailsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#6b7280'
  };

  const chartContainerStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px'
  };

  const chartTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
    textAlign: 'center'
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '8px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  };

  const loadProgressData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [planResponse, dataResponse] = await Promise.all([
        progressAPI.getTherapyPlan(user.id),
        progressAPI.getProgressData(user.id)
      ]);

      if (planResponse.success) {
        setTherapyPlan(planResponse.data);
      }

      if (dataResponse.success) {
        setProgressData(dataResponse.data);
      }
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgressData();
  }, [loadProgressData]);

  const getProgressPercentage = () => {
    if (!therapyPlan) return 0;
    return Math.round((therapyPlan.completedSessions / therapyPlan.totalSessions) * 100);
  };

  const getLatestMetrics = () => {
    if (progressData.length === 0) return null;
    return progressData[progressData.length - 1];
  };

  const getImprovementStats = () => {
    if (progressData.length < 2) return null;

    const first = progressData[0];
    const latest = progressData[progressData.length - 1];

    return {
      painImprovement: first.painScore - latest.painScore,
      energyImprovement: latest.energyLevel - first.energyLevel,
      wellbeingImprovement: latest.overallWellbeing - first.overallWellbeing
    };
  };

  // Chart data for line graph
  const getLineChartData = () => {
    const labels = progressData.map(d => 
      new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    return {
      labels,
      datasets: [
        {
          label: 'Pain Level (Lower is better)',
          data: progressData.map(d => d.painScore),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          tension: 0.3
        },
        {
          label: 'Energy Level',
          data: progressData.map(d => d.energyLevel),
          borderColor: '#16a34a',
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          tension: 0.3
        },
        {
          label: 'Overall Wellbeing',
          data: progressData.map(d => d.overallWellbeing),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          tension: 0.3
        }
      ]
    };
  };

  // Chart data for bar graph (latest metrics)
  const getBarChartData = () => {
    const latest = getLatestMetrics();
    if (!latest) return null;

    return {
      labels: ['Pain Level', 'Energy Level', 'Overall Wellbeing'],
      datasets: [
        {
          label: 'Current Scores',
          data: [
            10 - latest.painScore, // Invert pain score for better visualization
            latest.energyLevel,
            latest.overallWellbeing
          ],
          backgroundColor: [
            'rgba(220, 38, 38, 0.8)',
            'rgba(22, 163, 74, 0.8)',
            'rgba(37, 99, 235, 0.8)'
          ],
          borderColor: [
            '#dc2626',
            '#16a34a',
            '#2563eb'
          ],
          borderWidth: 2
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div>Loading your progress data...</div>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();
  const latestMetrics = getLatestMetrics();
  const improvementStats = getImprovementStats();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Progress Tracking</h1>
        <div>
          <button
            style={activeView === 'overview' ? activeTabButtonStyle : tabButtonStyle}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </button>
          <button
            style={activeView === 'details' ? activeTabButtonStyle : tabButtonStyle}
            onClick={() => setActiveView('details')}
          >
            Detailed Charts
          </button>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Therapy Plan Progress */}
          {therapyPlan && (
            <div style={progressBarContainerStyle}>
              <div style={progressBarHeaderStyle}>
                <h2 style={progressBarTitleStyle}>{therapyPlan.name}</h2>
                <span style={progressPercentageStyle}>{progressPercentage}%</span>
              </div>
              
              <div style={progressBarStyle}>
                <div 
                  style={{ ...progressFillStyle, width: `${progressPercentage}%` }}
                />
              </div>
              
              <div style={progressDetailsStyle}>
                <span>{therapyPlan.completedSessions} of {therapyPlan.totalSessions} sessions completed</span>
                <span>{therapyPlan.totalSessions - therapyPlan.completedSessions} sessions remaining</span>
              </div>
            </div>
          )}

          {/* Current Stats */}
          {latestMetrics && (
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={{ ...statNumberStyle, color: '#dc2626' }}>
                  {latestMetrics.painScore}/10
                </div>
                <div style={statLabelStyle}>Current Pain Level</div>
              </div>
              <div style={statCardStyle}>
                <div style={{ ...statNumberStyle, color: '#16a34a' }}>
                  {latestMetrics.energyLevel}/10
                </div>
                <div style={statLabelStyle}>Energy Level</div>
              </div>
              <div style={statCardStyle}>
                <div style={{ ...statNumberStyle, color: '#2563eb' }}>
                  {latestMetrics.overallWellbeing}/10
                </div>
                <div style={statLabelStyle}>Overall Wellbeing</div>
              </div>
              {improvementStats && (
                <div style={statCardStyle}>
                  <div style={{ 
                    ...statNumberStyle, 
                    color: improvementStats.wellbeingImprovement > 0 ? '#16a34a' : '#dc2626' 
                  }}>
                    {improvementStats.wellbeingImprovement > 0 ? '+' : ''}{improvementStats.wellbeingImprovement}
                  </div>
                  <div style={statLabelStyle}>Overall Improvement</div>
                </div>
              )}
            </div>
          )}

          {/* Quick Chart Overview */}
          {progressData.length > 0 && getBarChartData() && (
            <div style={chartContainerStyle}>
              <h3 style={chartTitleStyle}>Current Health Metrics</h3>
              <Bar data={getBarChartData()!} options={chartOptions} />
            </div>
          )}
        </>
      )}

      {activeView === 'details' && progressData.length > 0 && (
        <div style={chartContainerStyle}>
          <h3 style={chartTitleStyle}>Progress Over Time</h3>
          <Line data={getLineChartData()} options={chartOptions} />
        </div>
      )}

      {progressData.length === 0 && (
        <div style={loadingStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3>No progress data available</h3>
          <p>Complete some therapy sessions to start tracking your progress.</p>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
