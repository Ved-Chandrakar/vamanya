import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationsAPI } from '../../api/mock-api';
import NotificationList from './NotificationList';
import type { Notification } from '../../types';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const bellContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block'
  };

  const bellButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: '#6b7280',
    transition: 'all 0.2s ease',
    position: 'relative'
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 5px',
    borderRadius: '10px',
    minWidth: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1'
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    border: '1px solid #e5e7eb',
    width: '400px',
    maxHeight: '500px',
    overflow: 'hidden',
    zIndex: 50
  };

  const dropdownHeaderStyle: React.CSSProperties = {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };

  const dropdownTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'transparent',
    zIndex: 40
  };

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications(user.id);
      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await notificationsAPI.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <>
      <div style={bellContainerStyle}>
        <button
          style={bellButtonStyle}
          onClick={toggleDropdown}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#374151';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          🔔
          {unreadCount > 0 && (
            <span style={badgeStyle}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div style={dropdownStyle}>
            <div style={dropdownHeaderStyle}>
              <h3 style={dropdownTitleStyle}>Notifications</h3>
            </div>
            <NotificationList
              notifications={notifications}
              loading={loading}
              onMarkAsRead={handleMarkAsRead}
              onRefresh={loadNotifications}
            />
          </div>
        )}
      </div>

      {showDropdown && <div style={overlayStyle} onClick={closeDropdown} />}
    </>
  );
};

export default NotificationBell;
