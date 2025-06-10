
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Mock data
const mockAppointments = [
  {
    id: 1,
    patient_id: 'current-user',
    date: '2024-02-15',
    time: '10:00:00',
    reason: 'Annual Checkup',
    status: 'scheduled',
    notes: 'Bring previous test results'
  },
  {
    id: 2,
    patient_id: 'current-user',
    date: '2024-01-20',
    time: '14:30:00', 
    reason: 'Follow-up',
    status: 'completed',
    notes: 'Blood pressure check'
  }
];

const mockMedicalRecords = [
  {
    id: 1,
    patient_id: 'current-user',
    title: 'Annual Physical Exam',
    content: 'Patient appears healthy. Blood pressure normal. Recommend continued exercise routine.',
    record_type: 'examination',
    record_date: '2024-01-20',
    created_by: 'dr-smith'
  },
  {
    id: 2,
    patient_id: 'current-user',
    title: 'Blood Test Results',
    content: 'All blood work came back normal. Cholesterol levels within healthy range.',
    record_type: 'lab_result',
    record_date: '2024-01-15',
    created_by: 'dr-smith'
  }
];

const mockProfile = {
  id: 'current-user',
  full_name: 'John Patient',
  email: 'patient@example.com',
  phone: '+1-555-0123',
  created_at: '2023-06-01'
};

export const usePatientAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patient-appointments', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAppointments;
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMedicalRecords;
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProfile;
    },
    enabled: !!user?.id
  });
};
