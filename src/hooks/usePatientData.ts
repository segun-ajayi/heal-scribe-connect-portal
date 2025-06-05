
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePatientAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patient-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });
};

export const usePatientMedicalRecords = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patient-medical-records', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('patient_id', user.id)
        .order('record_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching medical records:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });
};

export const usePatientProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patient-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id
  });
};
