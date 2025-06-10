
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockStats = {
  totalPatients: 156,
  todayAppointments: 8,
  blogPosts: 12,
  publications: 24,
  waitingList: 5
};

const mockAppointments = [
  {
    id: 1,
    patient_id: 'patient-1',
    time: '09:00:00',
    date: new Date().toISOString().split('T')[0],
    reason: 'Annual Checkup',
    status: 'scheduled'
  },
  {
    id: 2,
    patient_id: 'patient-2', 
    time: '10:30:00',
    date: new Date().toISOString().split('T')[0],
    reason: 'Follow-up',
    status: 'confirmed'
  }
];

const mockBlogPosts = [
  {
    id: 1,
    title: 'Understanding Heart Health',
    created_at: '2024-01-15',
    status: 'published'
  },
  {
    id: 2,
    title: 'Managing Diabetes',
    created_at: '2024-01-10', 
    status: 'draft'
  }
];

export const useAdminStats = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockStats;
    },
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};

export const useRecentAppointments = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['recent-appointments'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAppointments;
    },
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};

export const useRecentBlogPosts = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['recent-blog-posts'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockBlogPosts;
    },
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};
