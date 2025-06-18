import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL;


// Fetch patient appointments
const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/patient/appointments`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch appointments");
    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
};

export const usePatientAppointments = () => {
  return useQuery({
    queryKey: ["patientAppointments"],
    queryFn: fetchAppointments,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false, // Avoid unnecessary refetching
  });
};

// Fetch patient medical records
const fetchMedicalRecords = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/patient/medical-records`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch medical records");
    return await response.json();
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return [];
  }
};

export const usePatientMedicalRecords = () => {
  return useQuery({
    queryKey: ["patientMedicalRecords"],
    queryFn: fetchMedicalRecords,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Fetch patient profile
const fetchPatientProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/patient/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch patient profile");
    return await response.json();
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    return null; // Return `null` instead of an empty array for profile data
  }
};

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ["patientProfile"],
    queryFn: fetchPatientProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};