import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sessionsAPI } from '../../api/mock-api';
import SessionDetailsCard from './SessionDetailsCard';
import type { TherapySession, SessionStatus } from '../../types';

const PractitionerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

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

  const datePickerStyle: React.CSSProperties = {
    padding: '8px 12px',
    border: '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111827'
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #e5e7eb'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '4px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const sessionsGridStyle: React.CSSProperties = {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
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

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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
  }, [loadSessions, selectedDate]);

  const handleStatusChange = async (sessionId: string, status: SessionStatus) => {
    try {
      const response = await sessionsAPI.updateSessionStatus(sessionId, status);
      if (response.success) {
        setSessions(prev => 
          prev.map(session => 
            session.id === sessionId 
              ? { ...session, status } 
              : session
          )
        );
      }
    } catch (error) {
      console.error('Failed to update session status:', error);
    }
  };

  const getSessionsForDate = (date: string) => {
    return sessions.filter(session => session.date === date);
  };

  const getTodaysSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date === today);
  };

  const getUpcomingSessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return sessions.filter(session => session.date > today);
  };

  const getSessionStats = () => {
    const today = getTodaysSessions();
    const upcoming = getUpcomingSessions();
    const pending = sessions.filter(s => s.status === 'scheduled');
    const completed = sessions.filter(s => s.status === 'completed');

    return {
      today: today.length,
      upcoming: upcoming.length,
      pending: pending.length,
      completed: completed.length
    };
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div>Loading patient sessions...</div>
        </div>
      </div>
    );
  }

  const selectedDateSessions = getSessionsForDate(selectedDate);
  const todaysSessions = getTodaysSessions();
  const stats = getSessionStats();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Practitioner Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            View Date:
          </label>
          <input
            type="date"
            style={datePickerStyle}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
      </div>

      {/* Statistics */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.today}</div>
          <div style={statLabelStyle}>Today's Sessions</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.upcoming}</div>
          <div style={statLabelStyle}>Upcoming Sessions</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.pending}</div>
          <div style={statLabelStyle}>Pending Confirmations</div>
        </div>
        <div style={statCardStyle}>
          <div style={statNumberStyle}>{stats.completed}</div>
          <div style={statLabelStyle}>Completed Sessions</div>
        </div>
      </div>

      {/* Today's Schedule - Always shown */}
      {todaysSessions.length > 0 && (
        <>
          <h2 style={sectionTitleStyle}>
            📅 Today's Schedule ({todaysSessions.length} sessions)
          </h2>
          <div style={sessionsGridStyle}>
            {todaysSessions.map(session => (
              <SessionDetailsCard
                key={session.id}
                session={session}
                showFullDetails={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </>
      )}

      {/* Selected Date Sessions */}
      {selectedDate !== new Date().toISOString().split('T')[0] && (
        <>
          <h2 style={sectionTitleStyle}>
            📋 Schedule for {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          
          {selectedDateSessions.length === 0 ? (
            <div style={emptyStateStyle}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📅</div>
              <h3>No sessions scheduled</h3>
              <p>No therapy sessions are scheduled for this date.</p>
            </div>
          ) : (
            <div style={sessionsGridStyle}>
              {selectedDateSessions.map(session => (
                <SessionDetailsCard
                  key={session.id}
                  session={session}
                  showFullDetails={true}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty state when no sessions at all */}
      {sessions.length === 0 && (
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <h3>No patient sessions</h3>
          <p>You don't have any patient sessions scheduled yet.</p>
        </div>
      )}
    </div>
  );
};

export default PractitionerDashboard;
