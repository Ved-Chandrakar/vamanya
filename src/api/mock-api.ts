// Mock API for Panchakarma Management Software
import type { 
  User, 
  TherapySession, 
  Notification, 
  Feedback, 
  TherapyPlan, 
  ProgressData,
  AuthResponse,
  ApiResponse,
  LoginFormData,
  BookingFormData,
  FeedbackFormData,
  TherapyType,
  SessionStatus
} from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'patient1',
    email: 'patient1@example.com',
    role: 'patient',
    firstName: 'Arjun',
    lastName: 'Sharma',
    phone: '+91-9876543210',
    dateOfBirth: '1985-03-15'
  },
  {
    id: '2',
    username: 'practitioner1',
    email: 'practitioner1@example.com',
    role: 'practitioner',
    firstName: 'Dr. Priya',
    lastName: 'Mehta',
    phone: '+91-9876543211'
  }
];

const mockSessions: TherapySession[] = [
  {
    id: '1',
    patientId: '1',
    practitionerId: '2',
    therapyType: 'Abhyanga',
    date: '2025-09-12',
    startTime: '10:00',
    endTime: '11:00',
    status: 'scheduled',
    notes: 'First session for stress relief',
    precautions: ['Avoid heavy meals 2 hours before', 'Wear comfortable clothing'],
    patientName: 'Arjun Sharma',
    practitionerName: 'Dr. Priya Mehta'
  },
  {
    id: '2',
    patientId: '1',
    practitionerId: '2',
    therapyType: 'Shirodhara',
    date: '2025-09-15',
    startTime: '14:00',
    endTime: '15:30',
    status: 'confirmed',
    notes: 'Follow-up session for mental relaxation',
    precautions: ['Empty stomach', 'Remove contact lenses'],
    patientName: 'Arjun Sharma',
    practitionerName: 'Dr. Priya Mehta'
  },
  {
    id: '3',
    patientId: '1',
    practitionerId: '2',
    therapyType: 'Panchakarma',
    date: '2025-09-08',
    startTime: '09:00',
    endTime: '11:00',
    status: 'completed',
    notes: 'Detoxification therapy completed successfully',
    patientName: 'Arjun Sharma',
    practitionerName: 'Dr. Priya Mehta'
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    title: 'Pre-procedure Precautions for Abhyanga',
    description: 'Important guidelines for your upcoming Abhyanga session',
    content: 'Please follow these precautions: 1. Avoid heavy meals 2 hours before the session. 2. Wear comfortable, loose clothing. 3. Arrive 10 minutes early for consultation.',
    type: 'precaution',
    isRead: false,
    createdAt: '2025-09-10T08:00:00Z',
    sessionId: '1'
  },
  {
    id: '2',
    userId: '1',
    title: 'Session Reminder',
    description: 'Your Shirodhara session is tomorrow',
    content: 'This is a reminder for your Shirodhara session scheduled for tomorrow at 2:00 PM.',
    type: 'reminder',
    isRead: true,
    createdAt: '2025-09-09T10:00:00Z',
    sessionId: '2'
  },
  {
    id: '3',
    userId: '1',
    title: 'Feedback Request',
    description: 'Please provide feedback for your completed session',
    content: 'We would appreciate your feedback on the Panchakarma session you completed on September 8th.',
    type: 'info',
    isRead: false,
    createdAt: '2025-09-09T16:00:00Z',
    sessionId: '3'
  }
];

const mockFeedback: Feedback[] = [
  {
    id: '1',
    sessionId: '3',
    patientId: '1',
    rating: 5,
    experience: 'Excellent',
    symptoms: 'Reduced stress and better sleep',
    painLevel: 2,
    energyLevel: 8,
    comments: 'The therapist was very professional and the session was very relaxing.',
    createdAt: '2025-09-08T17:00:00Z'
  }
];

const mockTherapyPlan: TherapyPlan = {
  id: '1',
  patientId: '1',
  name: 'Stress Relief and Detoxification Program',
  description: 'A comprehensive 8-session program combining various Panchakarma therapies for stress relief and body detoxification.',
  totalSessions: 8,
  completedSessions: 1,
  startDate: '2025-09-01',
  endDate: '2025-10-01',
  therapyTypes: ['Abhyanga', 'Shirodhara', 'Panchakarma', 'Swedana'],
  status: 'active'
};

const mockProgressData: ProgressData[] = [
  { date: '2025-09-01', painScore: 7, energyLevel: 4, overallWellbeing: 5 },
  { date: '2025-09-03', painScore: 6, energyLevel: 5, overallWellbeing: 6 },
  { date: '2025-09-05', painScore: 5, energyLevel: 6, overallWellbeing: 6 },
  { date: '2025-09-08', painScore: 3, energyLevel: 7, overallWellbeing: 8 },
  { date: '2025-09-10', painScore: 2, energyLevel: 8, overallWellbeing: 8 }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication API
export const authAPI = {
  login: async (credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
    await delay(1000);
    
    const user = mockUsers.find(u => u.username === credentials.username);
    if (!user || credentials.password !== 'password123') {
      return {
        success: false,
        data: {} as AuthResponse,
        error: 'Invalid credentials'
      };
    }

    return {
      success: true,
      data: {
        user,
        token: 'mock-jwt-token-' + user.id,
        expiresIn: 3600
      }
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(500);
    return {
      success: true,
      data: null
    };
  }
};

// Sessions API
export const sessionsAPI = {
  getSessions: async (userId: string, role: 'patient' | 'practitioner'): Promise<ApiResponse<TherapySession[]>> => {
    await delay(800);
    
    let filteredSessions = mockSessions;
    if (role === 'patient') {
      filteredSessions = mockSessions.filter(s => s.patientId === userId);
    } else {
      filteredSessions = mockSessions.filter(s => s.practitionerId === userId);
    }

    return {
      success: true,
      data: filteredSessions
    };
  },

  bookSession: async (bookingData: BookingFormData & { patientId: string; practitionerId: string }): Promise<ApiResponse<TherapySession>> => {
    await delay(1000);
    
    const newSession: TherapySession = {
      id: Date.now().toString(),
      patientId: bookingData.patientId,
      practitionerId: bookingData.practitionerId,
      therapyType: bookingData.therapyType,
      date: bookingData.date,
      startTime: bookingData.time,
      endTime: new Date(new Date(`${bookingData.date}T${bookingData.time}`).getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: 'scheduled',
      notes: bookingData.notes,
      patientName: 'Arjun Sharma',
      practitionerName: 'Dr. Priya Mehta'
    };

    mockSessions.push(newSession);

    return {
      success: true,
      data: newSession
    };
  },

  updateSessionStatus: async (sessionId: string, status: SessionStatus): Promise<ApiResponse<TherapySession>> => {
    await delay(600);
    
    const session = mockSessions.find(s => s.id === sessionId);
    if (!session) {
      return {
        success: false,
        data: {} as TherapySession,
        error: 'Session not found'
      };
    }

    session.status = status;

    return {
      success: true,
      data: session
    };
  }
};

// Notifications API
export const notificationsAPI = {
  getNotifications: async (userId: string): Promise<ApiResponse<Notification[]>> => {
    await delay(600);
    
    const userNotifications = mockNotifications.filter(n => n.userId === userId);
    
    return {
      success: true,
      data: userNotifications
    };
  },

  markAsRead: async (notificationId: string): Promise<ApiResponse<Notification>> => {
    await delay(300);
    
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (!notification) {
      return {
        success: false,
        data: {} as Notification,
        error: 'Notification not found'
      };
    }

    notification.isRead = true;

    return {
      success: true,
      data: notification
    };
  }
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: async (sessionId: string, feedbackData: FeedbackFormData & { patientId: string }): Promise<ApiResponse<Feedback>> => {
    await delay(800);
    
    const newFeedback: Feedback = {
      id: Date.now().toString(),
      sessionId,
      patientId: feedbackData.patientId,
      rating: feedbackData.rating,
      experience: feedbackData.experience,
      symptoms: feedbackData.symptoms,
      painLevel: feedbackData.painLevel,
      energyLevel: feedbackData.energyLevel,
      comments: feedbackData.comments,
      createdAt: new Date().toISOString()
    };

    mockFeedback.push(newFeedback);

    return {
      success: true,
      data: newFeedback
    };
  },

  getFeedback: async (practitionerId: string): Promise<ApiResponse<Feedback[]>> => {
    await delay(600);
    
    // In a real API, this would filter by sessions managed by the practitioner
    // For now, we ignore the practitionerId parameter in mock implementation
    console.log('Fetching feedback for practitioner:', practitionerId);
    return {
      success: true,
      data: mockFeedback
    };
  }
};

// Progress API
export const progressAPI = {
  getTherapyPlan: async (patientId: string): Promise<ApiResponse<TherapyPlan>> => {
    await delay(500);
    
    // For now, we ignore the patientId parameter in mock implementation
    console.log('Fetching therapy plan for patient:', patientId);
    return {
      success: true,
      data: mockTherapyPlan
    };
  },

  getProgressData: async (patientId: string): Promise<ApiResponse<ProgressData[]>> => {
    await delay(700);
    
    // For now, we ignore the patientId parameter in mock implementation
    console.log('Fetching progress data for patient:', patientId);
    return {
      success: true,
      data: mockProgressData
    };
  }
};

// Available therapies
export const getAvailableTherapies = (): TherapyType[] => {
  return [
    'Abhyanga',
    'Shirodhara',
    'Panchakarma',
    'Swedana',
    'Nasya',
    'Basti',
    'Virechana',
    'Vamana',
    'Raktamokshana'
  ];
};
