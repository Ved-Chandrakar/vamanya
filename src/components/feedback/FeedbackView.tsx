import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { feedbackAPI } from '../../api/mock-api';
import type { Feedback } from '../../types';

const FeedbackView: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280'
  };

  const feedbackListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const feedbackCardStyle: React.CSSProperties = {
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    backgroundColor: '#f9fafb',
    transition: 'all 0.2s ease'
  };

  const feedbackHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const ratingStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f59e0b'
  };

  const dateStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280'
  };

  const experienceStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px'
  };

  const metricsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  };

  const metricCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  };

  const metricValueStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '4px'
  };

  const metricLabelStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const commentsStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.5',
    border: '1px solid #e5e7eb',
    marginTop: '12px'
  };

  const symptomsStyle: React.CSSProperties = {
    backgroundColor: '#ecfdf5',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#065f46',
    lineHeight: '1.5',
    border: '1px solid #a7f3d0',
    marginTop: '12px'
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px',
    color: '#6b7280'
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#f3f4f6',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '4px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const loadFeedback = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await feedbackAPI.getFeedback(user.id);
      if (response.success) {
        setFeedbacks(response.data);
      }
    } catch (error) {
      console.error('Failed to load feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };

  const getAveragePainLevel = () => {
    const feedbacksWithPain = feedbacks.filter(f => f.painLevel !== undefined);
    if (feedbacksWithPain.length === 0) return 0;
    const total = feedbacksWithPain.reduce((sum, feedback) => sum + (feedback.painLevel || 0), 0);
    return (total / feedbacksWithPain.length).toFixed(1);
  };

  const getAverageEnergyLevel = () => {
    const feedbacksWithEnergy = feedbacks.filter(f => f.energyLevel !== undefined);
    if (feedbacksWithEnergy.length === 0) return 0;
    const total = feedbacksWithEnergy.reduce((sum, feedback) => sum + (feedback.energyLevel || 0), 0);
    return (total / feedbacksWithEnergy.length).toFixed(1);
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'Excellent': return '#10b981';
      case 'Very Good': return '#16a34a';
      case 'Good': return '#65a30d';
      case 'Average': return '#ca8a04';
      case 'Poor': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div>Loading patient feedback...</div>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Patient Feedback</h1>
          <p style={subtitleStyle}>View feedback from your patients</p>
        </div>
        
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <h3>No feedback received yet</h3>
          <p>Patient feedback will appear here after they complete their sessions.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Patient Feedback</h1>
        <p style={subtitleStyle}>
          {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} received
        </p>
      </div>

      {/* Summary Statistics */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{getAverageRating()}</div>
          <div style={statLabelStyle}>Average Rating</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{getAveragePainLevel()}</div>
          <div style={statLabelStyle}>Avg Pain Level</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{getAverageEnergyLevel()}</div>
          <div style={statLabelStyle}>Avg Energy Level</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{feedbacks.length}</div>
          <div style={statLabelStyle}>Total Feedback</div>
        </div>
      </div>

      {/* Feedback List */}
      <div style={feedbackListStyle}>
        {feedbacks.map((feedback) => (
          <div key={feedback.id} style={feedbackCardStyle}>
            <div style={feedbackHeaderStyle}>
              <div style={ratingStyle}>
                {renderStars(feedback.rating)}
              </div>
              <div style={dateStyle}>
                {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div 
              style={{ 
                ...experienceStyle, 
                color: getExperienceColor(feedback.experience) 
              }}
            >
              {feedback.experience} Experience
            </div>

            <div style={metricsGridStyle}>
              <div style={metricCardStyle}>
                <div style={{ ...metricValueStyle, color: '#dc2626' }}>
                  {feedback.painLevel || 'N/A'}
                </div>
                <div style={metricLabelStyle}>Pain Level</div>
              </div>
              <div style={metricCardStyle}>
                <div style={{ ...metricValueStyle, color: '#16a34a' }}>
                  {feedback.energyLevel || 'N/A'}
                </div>
                <div style={metricLabelStyle}>Energy Level</div>
              </div>
            </div>

            {feedback.symptoms && (
              <div style={symptomsStyle}>
                <strong>Symptoms: </strong>
                {feedback.symptoms}
              </div>
            )}

            {feedback.comments && (
              <div style={commentsStyle}>
                <strong>Comments: </strong>
                {feedback.comments}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackView;
