import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import TherapyCalendar from '../therapy/TherapyCalendar';
import PractitionerDashboard from '../therapy/PractitionerDashboard';
import NotificationBell from '../notifications/NotificationBell';
import ProgressTracker from '../feedback/ProgressTracker';
import FeedbackView from '../feedback/FeedbackView';

type DashboardView = 'overview' | 'schedule' | 'progress' | 'feedback' | 'notifications';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb'
  };

  const sidebarStyle: React.CSSProperties = {
    width: sidebarOpen ? '280px' : '80px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #e5e7eb',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
  };

  const sidebarHeaderStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb',
    display: sidebarOpen ? 'block' : 'none'
  };

  const toggleButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '20px',
    color: '#6b7280'
  };

  const userInfoStyle: React.CSSProperties = {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    display: sidebarOpen ? 'block' : 'none'
  };

  const userNameStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px'
  };

  const userRoleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'capitalize'
  };

  const navigationStyle: React.CSSProperties = {
    flex: 1,
    padding: '20px 0'
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500'
  };

  const activeNavItemStyle: React.CSSProperties = {
    ...navItemStyle,
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    borderRight: '3px solid #2563eb'
  };

  const navIconStyle: React.CSSProperties = {
    fontSize: '18px',
    marginRight: sidebarOpen ? '12px' : '0',
    minWidth: '18px',
    textAlign: 'center'
  };

  const navTextStyle: React.CSSProperties = {
    display: sidebarOpen ? 'block' : 'none'
  };

  const mainContentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '20px 32px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  };

  const headerTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize'
  };

  const headerActionsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    padding: '32px',
    overflow: 'auto'
  };

  const welcomeCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    marginBottom: '32px'
  };

  const welcomeTitleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px'
  };

  const welcomeSubtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    marginBottom: '24px'
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const statNumberStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: '8px'
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500'
  };

  const getNavigationItems = () => {
    const commonItems = [
      { id: 'overview', label: 'Overview', icon: '🏠' },
      { id: 'schedule', label: 'Schedule', icon: '📅' },
      { id: 'notifications', label: 'Notifications', icon: '🔔' }
    ];

    const patientItems = [
      { id: 'progress', label: 'My Progress', icon: '📈' },
      { id: 'feedback', label: 'Feedback', icon: '💬' }
    ];

    const practitionerItems = [
      { id: 'patients', label: 'Patients', icon: '👥' },
      { id: 'feedback', label: 'Patient Feedback', icon: '💬' }
    ];

    return user?.role === 'patient' 
      ? [...commonItems, ...patientItems]
      : [...commonItems, ...practitionerItems];
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div>
            <div style={welcomeCardStyle}>
              <h1 style={welcomeTitleStyle}>
                Welcome back, {user?.firstName}!
              </h1>
              <p style={welcomeSubtitleStyle}>
                {user?.role === 'patient' 
                  ? 'Track your wellness journey and manage your therapy sessions'
                  : 'Manage your patients and their therapy schedules'}
              </p>
            </div>
            
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={statNumberStyle}>5</div>
                <div style={statLabelStyle}>
                  {user?.role === 'patient' ? 'Upcoming Sessions' : 'Today\'s Appointments'}
                </div>
              </div>
              <div style={statCardStyle}>
                <div style={statNumberStyle}>12</div>
                <div style={statLabelStyle}>
                  {user?.role === 'patient' ? 'Completed Sessions' : 'Total Patients'}
                </div>
              </div>
              <div style={statCardStyle}>
                <div style={statNumberStyle}>3</div>
                <div style={statLabelStyle}>Unread Notifications</div>
              </div>
              {user?.role === 'patient' && (
                <div style={statCardStyle}>
                  <div style={statNumberStyle}>85%</div>
                  <div style={statLabelStyle}>Progress Score</div>
                </div>
              )}
            </div>
          </div>
        );
      case 'schedule':
        return user?.role === 'patient' ? <TherapyCalendar /> : <PractitionerDashboard />;
      case 'progress':
        return <ProgressTracker />;
      case 'feedback':
        return user?.role === 'patient' ? 
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Your Feedback History</h2>
            <p>View and manage your session feedback</p>
          </div> : 
          <FeedbackView />;
      case 'notifications':
        return (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Notifications</h2>
            <NotificationBell />
            <p>Your notifications will appear here</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <span style={logoStyle}>AyurSutra</span>
          <button
            style={toggleButtonStyle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div style={userInfoStyle}>
          <div style={userNameStyle}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={userRoleStyle}>{user?.role}</div>
        </div>

        <nav style={navigationStyle}>
          {getNavigationItems().map((item) => (
            <div
              key={item.id}
              style={activeView === item.id ? activeNavItemStyle : navItemStyle}
              onClick={() => setActiveView(item.id as DashboardView)}
              onMouseEnter={(e) => {
                if (activeView !== item.id) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={navIconStyle}>{item.icon}</span>
              <span style={navTextStyle}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '20px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            style={{ width: '100%' }}
          >
            {sidebarOpen ? 'Sign Out' : '↗'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h1 style={headerTitleStyle}>
            {getNavigationItems().find(item => item.id === activeView)?.label || 'Dashboard'}
          </h1>
          <div style={headerActionsStyle}>
            <NotificationBell />
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <div style={contentStyle}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
