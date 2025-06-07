import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Clock, Loader2, Phone, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Hooks for fetching patient data from Cloudflare Worker
import { usePatientAppointments, usePatientMedicalRecords, usePatientProfile } from "@/hooks/usePatientData";

const PatientDashboard = () => {
  // @ts-ignore
  const { user, loading, fetchUser } = useAuth();
  // Fetch patient data from Cloudflare Worker API
  const { data: appointments = [], isLoading: appointmentsLoading } = usePatientAppointments();
  const { data: medicalRecords = [], isLoading: recordsLoading } = usePatientMedicalRecords();
  const { data: profile, isLoading: profileLoading } = usePatientProfile();
  const navigate = useNavigate();

  // ✅ Ensure authentication before loading dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUser(); // Refresh session on load
    } else {
      console.log("No token found, redirecting to login...");
      navigate("/login");
    }
  }, [fetchUser, navigate]);

  if (loading) {
    return <p>Loading...</p>; // Prevent UI flash before authentication check
  }

  if (!user) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
          <p>Please log in to access the patient dashboard.</p>
          <Button asChild className="mt-4">
            <Link to="/login">Login</Link>
          </Button>
        </div>
    );
  }

  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const today = new Date();
    return appointmentDate >= today && apt.status !== "completed";
  });

  const recentRecords = medicalRecords.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-gray-600">Welcome back, {profile?.full_name || user.email}!</p>
        </div>

        <div className="grid gap-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Appointments</p>
                    {appointmentsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                    )}
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Medical Records</p>
                    {recordsLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <p className="text-2xl font-bold">{medicalRecords.length}</p>
                    )}
                  </div>
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Last Visit</p>
                    <p className="text-2xl font-bold">
                      {medicalRecords.length > 0 ? formatDate(medicalRecords[0].record_date) : "N/A"}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading appointments...
                  </div>
              ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <Button asChild className="mt-4">
                      <Link to="/appointments">Schedule Appointment</Link>
                    </Button>
                  </div>
              ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map(appointment => (
                        <div key={appointment.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{appointment.reason || "Appointment"}</h3>
                              <p className="text-sm text-gray-500">
                                {formatDate(appointment.date)} at {formatTime(appointment.time)}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{appointment.status || "scheduled"}</Badge>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
};

export default PatientDashboard;