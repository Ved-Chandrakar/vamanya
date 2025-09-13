import React from 'react';
import type { ButtonProps } from '../../types';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  size = 'md',
  style = {}
}) => {
  const baseStyles: React.CSSProperties = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    textDecoration: 'none',
    opacity: disabled ? 0.6 : 1
  };

  const sizeStyles = {
    sm: {
      padding: '6px 12px',
      fontSize: '12px',
      minHeight: '32px'
    },
    md: {
      padding: '10px 20px',
      fontSize: '14px',
      minHeight: '40px'
    },
    lg: {
      padding: '14px 28px',
      fontSize: '16px',
      minHeight: '48px'
    }
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#2563eb',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)',
      ':hover': {
        backgroundColor: '#1d4ed8'
      }
    },
    secondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db',
      ':hover': {
        backgroundColor: '#e5e7eb'
      }
    },
    danger: {
      backgroundColor: '#dc2626',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
      ':hover': {
        backgroundColor: '#b91c1c'
      }
    },
    success: {
      backgroundColor: '#16a34a',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
      ':hover': {
        backgroundColor: '#15803d'
      }
    }
  };

  const buttonStyle: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...style
  };

  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
      style={buttonStyle}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#1d4ed8';
        } else if (!disabled && variant === 'secondary') {
          e.currentTarget.style.backgroundColor = '#e5e7eb';
        } else if (!disabled && variant === 'danger') {
          e.currentTarget.style.backgroundColor = '#b91c1c';
        } else if (!disabled && variant === 'success') {
          e.currentTarget.style.backgroundColor = '#15803d';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && variant === 'primary') {
          e.currentTarget.style.backgroundColor = '#2563eb';
        } else if (!disabled && variant === 'secondary') {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        } else if (!disabled && variant === 'danger') {
          e.currentTarget.style.backgroundColor = '#dc2626';
        } else if (!disabled && variant === 'success') {
          e.currentTarget.style.backgroundColor = '#16a34a';
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
