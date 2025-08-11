
import {useQuery} from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';


interface Appointment {
  id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  patient_id?: string;
  appointment_type?: string;
  preferred_date?: string;
  preferred_time?: string;
  reason?: string;
  medical_history?: string;
  current_medications?: string;
  insurance_provider?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  notes?: string;
  priority?: string;
  status?: string;
  created_at?: string;
}


interface PaginatedAppointmentResponse {
  data?: Appointment[];
  page?: number;
  limit?: number;
  total?: number;
  success?: boolean;
}

interface statsData {
  totalAppointments?: number;
  todayAppointments?: number;
  blogPosts?: number;
  publications?: number;
  waitingList?: number;
}

interface stats {
  data?: statsData;
  success?: boolean;
}

interface patientsData {
  data: {
    address?: string;
    allergies?: string;
    blood_type?: string;
    dob?: string;
    email?: string;
    full_name?: string;
    gender?: string;
    join_date?: string;
    last_visit?: string;
    medical_conditions?: string;
    nok?: string;
    nok_phone?: string;
    patient_id?: string;
    phone?: string;
    role?: string;
    user_id?: number;
  }[];
  limit?: number;
  page?: number;
  totalPatients?: number;
  success?: boolean;
}

interface blogData {
  data: {
    id?: number;
    title?: string;
    excerpt?: string;
    content?: string;
    author?: string;
    date?: string;
    readTime?: number;
    category?: string;
    currentRating?: string;
    totalRatings?: string;
    comments?: number;
    status?: string;
    scheduledFor?: string;
    publishedAt?: string;
    created_at?: string;
  }[];
  limit?: number;
  page?: number;
  total?: number;
  success?: boolean;
}

interface publications {
  data?: {
    id?: number;
    title?: string;
    abstract?: string;
    content?: string;
    authors?: string;
    journal?: string;
    url?: string;
    doi?: string;
    keywords?: string;
    category_id?: number;
    category?: string;
    published_at?: string;
    created_at?: string;
    updated_at?: string;
  }[];
  categories?: {
    id?: string;
    name?: string;
    slug?: string;
    type?: string;
  }[];
  limit?: number;
  page?: number;
  total?: number;
  success?: boolean;
}

interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'link' | 'button';
  page: string;
  section: string;
  label: string;
  value: string;
  alt?: string;
  href?: string;
}



export const useAdminStats = () => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery<stats>({
    queryKey: ["admin-stats"],
    queryFn: () =>
        authFetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {}),
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

export const useRecentAppointments = (page = 1, scope: string = "future") => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery<PaginatedAppointmentResponse>({
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

export const useRecentBlogPosts = (page = 1, category: string = 'all', author: string = 'all') => {
  const { user, userRole, authFetch } = useAuth();
  
  return useQuery<blogData>({
    queryKey: ['recent-blog-posts', page, category, author],
    queryFn: () =>
        authFetch(
            `${import.meta.env.VITE_API_URL}/api/admin/blogs?page=${page}&category=${category}&author=${author}`, {}),
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};

export const useMyPublications = (page = 1, category: string = 'all', refreshKey:number = 0) => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery<publications>({
    queryKey: ['my-publications', page, category, refreshKey],
    queryFn: () =>
        authFetch(
            `${import.meta.env.VITE_API_URL}/api/admin/publications?page=${page}&category=${category}`, {}),
    enabled: !!user && (userRole === 'admin' || userRole === 'super_admin')
  });
};

export const useAdminPatients = (searchQuery, filterStatus) => {
  const { user, userRole, authFetch } = useAuth();

  return useQuery<patientsData>({
    queryKey: ["admin-patients", searchQuery, filterStatus],
    queryFn: () => authFetch(`${import.meta.env.VITE_API_URL}/api/admin/patients?query=${searchQuery}&status=${filterStatus}`,
        {}),
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

