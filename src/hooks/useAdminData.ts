
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
interface returnData {
  data: object[];
  limit: number;
  total: number;
}

export const useAdminStats = () => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () =>
        authFetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {}),
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

export const useRecentAppointments = (page = 1, scope: string = "future") => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery({
    queryKey: ["recent-appointments", page, scope],
    queryFn: () =>
        authFetch(
            `${import.meta.env.VITE_API_URL}/api/admin/appointments?page=${page}&scope=${scope}`,
            {}
        ),
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

export const useAdminPatientAppointments = (
    page = 1,
    scope: string = "future",
    patient: string | null = null
) => {
  const { user, userRole, authFetch } = useAuth();

  const shouldFetch =
      !!user && !!patient && (userRole === "admin" || userRole === "super_admin");

  return useQuery({
    queryKey: ["recent-appointments", page, scope, patient],
    queryFn: () =>
        authFetch(
            `${import.meta.env.VITE_API_URL}/api/admin/patient/appointments/${patient}?page=${page}&scope=${scope}`,
            {}
        ),
    enabled: shouldFetch,
  });
};

export const useRecentBlogPosts = (page = 1) => {
  const { user, userRole, authFetch } = useAuth();
  
  return useQuery({
    queryKey: ['recent-blog-posts', page],
    queryFn: () =>
        authFetch(
            `${import.meta.env.VITE_API_URL}/api/admin/blogs?page=${page}`, {}),
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};

export const useAdminPatients = (searchQuery, filterStatus) => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery({
    queryKey: ["admin-patients", searchQuery, filterStatus],
    queryFn: () => authFetch(`${import.meta.env.VITE_API_URL}/api/admin/patients?query=${searchQuery}&status=${filterStatus}`,
        {}),
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};
