import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sessionsAPI } from '../../api/mock-api';
import Button from '../common/Button';
import Modal from '../common/Modal';
import BookingModal from './BookingModal';
import SessionDetailsCard from './SessionDetailsCard';
import type { TherapySession } from '../../types';

const TherapyCalendar: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827'
  };

  const calendarGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
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

  const emptyIconStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '16px'
  };

  const loadSessions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await sessionsAPI.getSessions(user.id, user.role);
      if (response.success) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleSessionClick = (session: TherapySession) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const handleBookingSuccess = () => {
    loadSessions(); // Refresh sessions after booking
  };

  const getSessionsByStatus = () => {
    const upcoming = sessions.filter(s => 
      s.status === 'scheduled' || s.status === 'confirmed'
    );
    const completed = sessions.filter(s => s.status === 'completed');
    const cancelled = sessions.filter(s => s.status === 'cancelled');

    return { upcoming, completed, cancelled };
  };

  const renderSessionGroup = (title: string, sessionList: TherapySession[], color: string) => {
    if (sessionList.length === 0) return null;

    const groupStyle: React.CSSProperties = {
      marginBottom: '32px'
    };

    const groupHeaderStyle: React.CSSProperties = {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    const badgeStyle: React.CSSProperties = {
      backgroundColor: color,
      color: '#ffffff',
      fontSize: '12px',
      fontWeight: '600',
      padding: '4px 8px',
      borderRadius: '12px'
    };

    return (
      <div style={groupStyle}>
        <div style={groupHeaderStyle}>
          {title}
          <span style={badgeStyle}>{sessionList.length}</span>
        </div>
        <div style={calendarGridStyle}>
          {sessionList.map(session => (
            <SessionDetailsCard
              key={session.id}
              session={session}
              onClick={() => handleSessionClick(session)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div>Loading your therapy sessions...</div>
        </div>
      </div>
    );
  }

  const { upcoming, completed, cancelled } = getSessionsByStatus();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {user?.role === 'patient' ? 'My Therapy Sessions' : 'Patient Sessions'}
        </h2>
        {user?.role === 'patient' && (
          <Button
            variant="primary"
            onClick={() => setShowBookingModal(true)}
          >
            Book New Session
          </Button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>📅</div>
          <h3>No therapy sessions found</h3>
          <p>
            {user?.role === 'patient' 
              ? 'Book your first therapy session to get started on your wellness journey.'
              : 'No patient sessions are currently scheduled.'}
          </p>
          {user?.role === 'patient' && (
            <Button
              variant="primary"
              onClick={() => setShowBookingModal(true)}
              style={{ marginTop: '16px' }}
            >
              Book Your First Session
            </Button>
          )}
        </div>
      ) : (
        <>
          {renderSessionGroup('Upcoming Sessions', upcoming, '#2563eb')}
          {renderSessionGroup('Completed Sessions', completed, '#16a34a')}
          {renderSessionGroup('Cancelled Sessions', cancelled, '#dc2626')}
        </>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Session Details Modal */}
      {showDetailsModal && selectedSession && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Session Details"
        >
          <SessionDetailsCard
            session={selectedSession}
            showFullDetails
          />
        </Modal>
      )}
    </div>
  );
};

export default TherapyCalendar;
