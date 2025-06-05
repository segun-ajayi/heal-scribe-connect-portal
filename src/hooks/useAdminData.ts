
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminStats = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total patients
      const { count: patientCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'patient');

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { count: todayAppointments } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('date', today);

      // Get total blog posts
      const { count: blogPosts } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Get total publications
      const { count: publications } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true });

      // Get waiting list count
      const { count: waitingList } = await supabase
        .from('waiting_list')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      return {
        totalPatients: patientCount || 0,
        todayAppointments: todayAppointments || 0,
        blogPosts: blogPosts || 0,
        publications: publications || 0,
        waitingList: waitingList || 0
      };
    },
    enabled: !!user && userRole === 'admin'
  });
};

export const useRecentAppointments = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['recent-appointments'],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          profiles!appointments_patient_id_fkey(full_name)
        `)
        .eq('date', today)
        .order('time', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching recent appointments:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user && userRole === 'admin'
  });
};

export const useRecentBlogPosts = () => {
  const { user, userRole } = useAuth();
  
  return useQuery({
    queryKey: ['recent-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent blog posts:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user && userRole === 'admin'
  });
};
