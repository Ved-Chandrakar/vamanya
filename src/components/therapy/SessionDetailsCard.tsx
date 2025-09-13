import React from 'react';
import Button from '../common/Button';
import type { TherapySession, SessionStatus } from '../../types';

interface SessionDetailsCardProps {
  session: TherapySession;
  onClick?: () => void;
  showFullDetails?: boolean;
  onStatusChange?: (sessionId: string, status: SessionStatus) => void;
}

const SessionDetailsCard: React.FC<SessionDetailsCardProps> = ({
  session,
  onClick,
  showFullDetails = false,
  onStatusChange
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '20px',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    position: 'relative'
  };

  const hoverCardStyle: React.CSSProperties = {
    ...cardStyle,
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const therapyTypeStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827'
  };

  const statusColors = {
    scheduled: '#f59e0b',
    confirmed: '#2563eb',
    completed: '#16a34a',
    cancelled: '#dc2626',
    rescheduled: '#8b5cf6'
  };

  const statusStyle: React.CSSProperties = {
    backgroundColor: statusColors[session.status],
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '12px',
    textTransform: 'capitalize'
  };

  const detailRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#6b7280'
  };

  const iconStyle: React.CSSProperties = {
    marginRight: '8px',
    fontSize: '16px'
  };

  const notesStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    marginTop: '16px',
    borderLeft: '3px solid #2563eb'
  };

  const precautionsStyle: React.CSSProperties = {
    backgroundColor: '#fef3c7',
    padding: '12px',
    borderRadius: '8px',
    marginTop: '16px',
    borderLeft: '3px solid #f59e0b'
  };

  const precautionsTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#92400e',
    marginBottom: '8px'
  };

  const precautionsListStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#92400e',
    listStyle: 'none',
    padding: 0,
    margin: 0
  };

  const precautionItemStyle: React.CSSProperties = {
    marginBottom: '4px',
    paddingLeft: '16px',
    position: 'relative'
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginTop: '16px'
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div
      style={isHovered && onClick ? hoverCardStyle : cardStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <h3 style={therapyTypeStyle}>{session.therapyType}</h3>
        <span style={statusStyle}>{session.status}</span>
      </div>

      <div style={detailRowStyle}>
        <span style={iconStyle}>📅</span>
        <span>{formatDate(session.date)}</span>
      </div>

      <div style={detailRowStyle}>
        <span style={iconStyle}>⏰</span>
        <span>{formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
      </div>

      <div style={detailRowStyle}>
        <span style={iconStyle}>👨‍⚕️</span>
        <span>{session.practitionerName || 'Dr. Priya Mehta'}</span>
      </div>

      {showFullDetails && (
        <>
          <div style={detailRowStyle}>
            <span style={iconStyle}>👤</span>
            <span>{session.patientName || 'Arjun Sharma'}</span>
          </div>

          {session.notes && (
            <div style={notesStyle}>
              <strong>Notes:</strong> {session.notes}
            </div>
          )}

          {session.precautions && session.precautions.length > 0 && (
            <div style={precautionsStyle}>
              <div style={precautionsTitleStyle}>⚠️ Pre-session Precautions:</div>
              <ul style={precautionsListStyle}>
                {session.precautions.map((precaution, index) => (
                  <li key={index} style={precautionItemStyle}>
                    • {precaution}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {onStatusChange && session.status === 'scheduled' && (
            <div style={actionsStyle}>
              <Button
                variant="success"
                size="sm"
                onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                  e?.stopPropagation();
                  onStatusChange(session.id, 'confirmed');
                }}
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                  e?.stopPropagation();
                  onStatusChange(session.id, 'rescheduled');
                }}
              >
                Reschedule
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={(e?: React.MouseEvent<HTMLButtonElement>) => {
                  e?.stopPropagation();
                  onStatusChange(session.id, 'cancelled');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionDetailsCard;
