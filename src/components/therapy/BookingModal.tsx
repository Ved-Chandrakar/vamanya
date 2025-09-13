import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sessionsAPI, getAvailableTherapies } from '../../api/mock-api';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import type { BookingFormData, TherapyType } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<BookingFormData>({
    therapyType: 'Abhyanga',
    date: '',
    time: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const selectStyle: React.CSSProperties = {
    padding: '12px 16px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111827',
    minHeight: '48px'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#374151'
  };

  const textareaStyle: React.CSSProperties = {
    ...selectStyle,
    minHeight: '80px',
    resize: 'vertical' as const,
    fontFamily: 'inherit'
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '14px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    marginBottom: '16px'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px'
  };

  const therapyInfoStyle: React.CSSProperties = {
    backgroundColor: '#eff6ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px'
  };

  const therapyDescriptions: Record<TherapyType, string> = {
    'Abhyanga': 'Full body massage with warm oils to promote relaxation and circulation.',
    'Shirodhara': 'Continuous pouring of warm oil on the forehead for deep mental relaxation.',
    'Panchakarma': 'Complete detoxification and rejuvenation therapy program.',
    'Swedana': 'Steam therapy to open pores and eliminate toxins through sweating.',
    'Nasya': 'Nasal administration of medicines to clear respiratory passages.',
    'Basti': 'Medicated enema therapy for colon cleansing and rejuvenation.',
    'Virechana': 'Controlled purgation therapy for eliminating excess Pitta dosha.',
    'Vamana': 'Therapeutic vomiting for removing excess Kapha dosha.',
    'Raktamokshana': 'Blood purification therapy to remove toxins from blood.'
  };

  // Get available time slots (9 AM to 6 PM)
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const validateForm = (): boolean => {
    if (!formData.therapyType) {
      setError('Please select a therapy type');
      return false;
    }

    if (!formData.date) {
      setError('Please select a date');
      return false;
    }

    const selectedDate = new Date(formData.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (selectedDate < tomorrow) {
      setError('Please select a date at least one day in advance');
      return false;
    }

    if (!formData.time) {
      setError('Please select a time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);
    setError('');

    try {
      const response = await sessionsAPI.bookSession({
        ...formData,
        patientId: user.id,
        practitionerId: '2' // Default practitioner in mock data
      });

      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          therapyType: 'Abhyanga',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        setError(response.error || 'Failed to book session');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book New Therapy Session">
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <div style={errorStyle}>{error}</div>}

        {/* Therapy Type Selection */}
        <div>
          <label style={labelStyle}>Therapy Type *</label>
          <select
            style={selectStyle}
            value={formData.therapyType}
            onChange={(e) => handleInputChange('therapyType', e.target.value as TherapyType)}
            required
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            {getAvailableTherapies().map(therapy => (
              <option key={therapy} value={therapy}>{therapy}</option>
            ))}
          </select>
        </div>

        {/* Therapy Info */}
        {formData.therapyType && (
          <div style={therapyInfoStyle}>
            <strong>{formData.therapyType}</strong>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#075985' }}>
              {therapyDescriptions[formData.therapyType]}
            </p>
          </div>
        )}

        {/* Date Selection */}
        <Input
          label="Preferred Date"
          type="date"
          value={formData.date}
          onChange={(value) => handleInputChange('date', value)}
          required
        />

        {/* Time Selection */}
        <div>
          <label style={labelStyle}>Preferred Time *</label>
          <select
            style={selectStyle}
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            required
            onFocus={(e) => {
              e.target.style.borderColor = '#2563eb';
              e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="">Select a time</option>
            {getTimeSlots().map(time => (
              <option key={time} value={time}>
                {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Additional Notes (Optional)</label>
          <textarea
            style={textareaStyle}
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Any specific requirements or concerns..."
            rows={3}
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
            {loading ? 'Booking...' : 'Book Session'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;
