import React from 'react';
import type { InputProps } from '../../types';

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error
}) => {
  const containerStyle: React.CSSProperties = {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#374151',
    display: 'flex',
    alignItems: 'center'
  };

  const inputStyle: React.CSSProperties = {
    padding: '12px 16px',
    border: error ? '2px solid #dc2626' : '2px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    backgroundColor: '#ffffff',
    color: '#111827',
    minHeight: '48px'
  };

  const errorStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '4px',
    fontWeight: '500'
  };

  const requiredStyle: React.CSSProperties = {
    color: '#dc2626',
    marginLeft: '4px'
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={(e) => {
          e.target.style.borderColor = '#2563eb';
          e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#dc2626' : '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
};

export default Input;
