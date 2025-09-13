// Core type definitions for Panchakarma Management Software

export type UserRole = 'patient' | 'practitioner';

export type SessionStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

export type TherapyType = 
  | 'Abhyanga' 
  | 'Shirodhara' 
  | 'Panchakarma' 
  | 'Swedana' 
  | 'Nasya' 
  | 'Basti' 
  | 'Virechana' 
  | 'Vamana' 
  | 'Raktamokshana';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: string;
}

export interface TherapySession {
  id: string;
  patientId: string;
  practitionerId: string;
  therapyType: TherapyType;
  date: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  notes?: string;
  precautions?: string[];
  patientName?: string;
  practitionerName?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  type: 'reminder' | 'alert' | 'info' | 'precaution';
  isRead: boolean;
  createdAt: string;
  sessionId?: string;
}

export interface Feedback {
  id: string;
  sessionId: string;
  patientId: string;
  rating: number; // 1-5 scale
  experience: string;
  symptoms?: string;
  painLevel?: number; // 1-10 scale
  energyLevel?: number; // 1-10 scale
  comments?: string;
  createdAt: string;
}

export interface TherapyPlan {
  id: string;
  patientId: string;
  name: string;
  description: string;
  totalSessions: number;
  completedSessions: number;
  startDate: string;
  endDate: string;
  therapyTypes: TherapyType[];
  status: 'active' | 'completed' | 'paused';
}

export interface ProgressData {
  date: string;
  painScore: number;
  energyLevel: number;
  overallWellbeing: number;
}

// Form interfaces
export interface LoginFormData {
  username: string;
  password: string;
}

export interface BookingFormData {
  therapyType: TherapyType;
  date: string;
  time: string;
  notes?: string;
}

export interface FeedbackFormData {
  rating: number;
  experience: string;
  symptoms?: string;
  painLevel?: number;
  energyLevel?: number;
  comments?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

// Component props interfaces
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

export interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  data?: Record<string, unknown>;
}
