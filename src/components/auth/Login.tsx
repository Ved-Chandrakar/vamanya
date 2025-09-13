import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../api/mock-api';
import Input from '../common/Input';
import Button from '../common/Button';
import type { LoginFormData } from '../../types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px'
  };

  const formContainerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    width: '100%',
    maxWidth: '400px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: '8px'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '16px',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: '32px'
  };

  const errorMessageStyle: React.CSSProperties = {
    color: '#dc2626',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px'
  };

  const demoCredentialsStyle: React.CSSProperties = {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '24px',
    fontSize: '14px'
  };

  const demoTitleStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#0369a1',
    marginBottom: '8px'
  };

  const demoItemStyle: React.CSSProperties = {
    color: '#075985',
    marginBottom: '4px'
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        login(response.data.user, response.data.token);
      } else {
        setApiError(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setApiError('');
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>AyurSutra</h1>
        <p style={subtitleStyle}>Panchakarma Management System</p>
        
        <form onSubmit={handleSubmit}>
          {apiError && (
            <div style={errorMessageStyle}>
              {apiError}
            </div>
          )}

          <Input
            label="Username"
            type="text"
            value={formData.username}
            onChange={(value) => handleInputChange('username', value)}
            placeholder="Enter your username"
            required
            error={errors.username}
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            required
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div style={demoCredentialsStyle}>
          <div style={demoTitleStyle}>Demo Credentials:</div>
          <div style={demoItemStyle}>Patient: patient1 / password123</div>
          <div style={demoItemStyle}>Practitioner: practitioner1 / password123</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
