
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const usePatientAppointments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-appointments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const response = await fetch(
          `https://iyawo-website-worker.mortalerror.workers.dev/patient/appointments`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
      );

      if (!response.ok) throw new Error("Failed to fetch appointments");

      return response.json();
    },
    enabled: !!user?.id,
  });
};

export const usePatientMedicalRecords = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-medical-records", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const response = await fetch(
          `https://iyawo-website-worker.mortalerror.workers.dev/patient/medical-records`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
      );

      if (!response.ok) throw new Error("Failed to fetch medical records");

      return response.json();
    },
    enabled: !!user?.id,
  });
};

export const usePatientProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["patient-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const response = await fetch(
          `https://iyawo-website-worker.mortalerror.workers.dev/patient/profile`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
      );

      if (!response.ok) throw new Error("Failed to fetch profile");

      return response.json();
    },
    enabled: !!user?.id,
  });
};
