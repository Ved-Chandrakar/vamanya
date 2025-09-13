import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { feedbackAPI } from '../../api/mock-api';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { FeedbackFormData, TherapySession } from '../../types';

interface FeedbackFormProps {
  session: TherapySession;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  session,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 5,
    experience: 'Good',
    symptoms: '',
    painLevel: 5,
    energyLevel: 5,
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const sessionInfoStyle: React.CSSProperties = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '20px'
  };

  const sessionInfoTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: '8px'
  };

  const sessionDetailsStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#075985',
    margin: 0
  };

  const ratingContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  };

  const ratingButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap' as const
  };

  const ratingButtonStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    minWidth: '60px',
    textAlign: 'center'
  };

  const activeRatingButtonStyle: React.CSSProperties = {
    ...ratingButtonStyle,
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
    color: '#ffffff'
  };

  const sliderContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    background: '#e5e7eb',
    outline: 'none',
    WebkitAppearance: 'none' as const
  };

  const sliderValueStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280'
  };

  const textareaStyle: React.CSSProperties = {
    padding: '12px 16px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111827',
    minHeight: '100px',
    resize: 'vertical' as const,
    fontFamily: 'inherit'
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  };

  const experienceOptions = [
    { value: 'Excellent', emoji: '😍', color: '#10b981' },
    { value: 'Very Good', emoji: '😊', color: '#16a34a' },
    { value: 'Good', emoji: '🙂', color: '#65a30d' },
    { value: 'Average', emoji: '😐', color: '#ca8a04' },
    { value: 'Poor', emoji: '😞', color: '#dc2626' }
  ];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const response = await feedbackAPI.submitFeedback(session.id, {
        ...formData,
        patientId: user.id
      });

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FeedbackFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Session Feedback">
      <form onSubmit={handleSubmit} style={formStyle}>
        {/* Session Info */}
        <div style={sessionInfoStyle}>
          <div style={sessionInfoTitleStyle}>
            {session.therapyType} Session
          </div>
          <div style={sessionDetailsStyle}>
            {formatDate(session.date)} • {session.practitionerName}
          </div>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        {/* Overall Rating */}
        <div style={ratingContainerStyle}>
          <label style={labelStyle}>Overall Rating (1-5 stars)</label>
          <div style={ratingButtonsStyle}>
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                type="button"
                style={formData.rating === rating ? activeRatingButtonStyle : ratingButtonStyle}
                onClick={() => handleInputChange('rating', rating)}
              >
                {'⭐'.repeat(rating)}
              </button>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div style={ratingContainerStyle}>
          <label style={labelStyle}>How was your experience?</label>
          <div style={ratingButtonsStyle}>
            {experienceOptions.map(option => (
              <button
                key={option.value}
                type="button"
                style={{
                  ...ratingButtonStyle,
                  ...(formData.experience === option.value ? {
                    borderColor: option.color,
                    backgroundColor: option.color,
                    color: '#ffffff'
                  } : {})
                }}
                onClick={() => handleInputChange('experience', option.value)}
              >
                {option.emoji} {option.value}
              </button>
            ))}
          </div>
        </div>

        {/* Pain Level */}
        <div style={sliderContainerStyle}>
          <label style={labelStyle}>
            Pain Level: {formData.painLevel}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.painLevel || 5}
            onChange={(e) => handleInputChange('painLevel', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <div style={sliderValueStyle}>
            <span>No Pain</span>
            <span>Severe Pain</span>
          </div>
        </div>

        {/* Energy Level */}
        <div style={sliderContainerStyle}>
          <label style={labelStyle}>
            Energy Level: {formData.energyLevel}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={formData.energyLevel || 5}
            onChange={(e) => handleInputChange('energyLevel', parseInt(e.target.value))}
            style={sliderStyle}
          />
          <div style={sliderValueStyle}>
            <span>Very Low</span>
            <span>Very High</span>
          </div>
        </div>

        {/* Symptoms */}
        <Input
          label="Current Symptoms (Optional)"
          type="text"
          value={formData.symptoms || ''}
          onChange={(value) => handleInputChange('symptoms', value)}
          placeholder="e.g., Feeling more relaxed, less joint stiffness..."
        />

        {/* Comments */}
        <div>
          <label style={labelStyle}>Additional Comments (Optional)</label>
          <textarea
            style={textareaStyle}
            value={formData.comments || ''}
            onChange={(e) => handleInputChange('comments', e.target.value)}
            placeholder="Share any additional thoughts about your session, the practitioner, or suggestions for improvement..."
            rows={4}
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={actionsStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackForm;
