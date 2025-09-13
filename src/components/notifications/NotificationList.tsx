import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { Notification } from '../../types';

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (notificationId: string) => void;
  onRefresh: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkAsRead,
  onRefresh
}) => {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);

  const listContainerStyle: React.CSSProperties = {
    maxHeight: '400px',
    overflowY: 'auto'
  };

  const notificationItemStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  const unreadNotificationStyle: React.CSSProperties = {
    ...notificationItemStyle,
    backgroundColor: '#eff6ff',
    borderLeft: '3px solid #2563eb'
  };

  const notificationHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    flex: 1,
    marginRight: '8px'
  };

  const typeIconStyle: React.CSSProperties = {
    fontSize: '16px',
    marginRight: '8px'
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    fontWeight: '500',
    flexShrink: 0
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 8px 0',
    lineHeight: '1.4'
  };

  const unreadBadgeStyle: React.CSSProperties = {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    marginLeft: '8px'
  };

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 20px',
    color: '#6b7280'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px 20px',
    color: '#6b7280'
  };

  const refreshButtonStyle: React.CSSProperties = {
    padding: '12px 20px',
    borderTop: '1px solid #f3f4f6',
    backgroundColor: '#f9fafb'
  };

  const contentModalStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#374151'
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return '⏰';
      case 'alert':
        return '⚠️';
      case 'precaution':
        return '🔔';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowContentModal(true);
    
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  const handleCloseModal = () => {
    setShowContentModal(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <div style={loadingStyle}>
        <div>Loading notifications...</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <>
        <div style={emptyStateStyle}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔔</div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
            No notifications
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            You're all caught up!
          </div>
        </div>
        <div style={refreshButtonStyle}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            style={{ width: '100%' }}
          >
            Refresh
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div style={listContainerStyle}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={notification.isRead ? notificationItemStyle : unreadNotificationStyle}
            onClick={() => handleNotificationClick(notification)}
            onMouseEnter={(e) => {
              if (notification.isRead) {
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (notification.isRead) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={notificationHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                <span style={typeIconStyle}>
                  {getTypeIcon(notification.type)}
                </span>
                <h4 style={titleStyle}>
                  {notification.title}
                  {!notification.isRead && (
                    <span style={unreadBadgeStyle}>NEW</span>
                  )}
                </h4>
              </div>
              <span style={timestampStyle}>
                {formatTimestamp(notification.createdAt)}
              </span>
            </div>
            
            <p style={descriptionStyle}>
              {notification.description}
            </p>
          </div>
        ))}
      </div>

      <div style={refreshButtonStyle}>
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          style={{ width: '100%' }}
        >
          Refresh Notifications
        </Button>
      </div>

      {/* Content Modal */}
      {showContentModal && selectedNotification && (
        <Modal
          isOpen={showContentModal}
          onClose={handleCloseModal}
          title={selectedNotification.title}
        >
          <div style={contentModalStyle}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              <span style={{ marginRight: '8px' }}>
                {getTypeIcon(selectedNotification.type)}
              </span>
              <span style={{ textTransform: 'capitalize' }}>
                {selectedNotification.type}
              </span>
              <span style={{ marginLeft: 'auto' }}>
                {formatTimestamp(selectedNotification.createdAt)}
              </span>
            </div>
            
            <div style={{ whiteSpace: 'pre-line' }}>
              {selectedNotification.content}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default NotificationList;
