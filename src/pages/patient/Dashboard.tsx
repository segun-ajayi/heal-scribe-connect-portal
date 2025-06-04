
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, User, Clock, Phone, Mail } from 'lucide-react';

const PatientDashboard = () => {
  const [appointments] = useState([
    {
      id: 1,
      date: '2024-02-15',
      time: '10:00 AM',
      type: 'Follow-up Consultation',
      status: 'confirmed',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: 2,
      date: '2024-01-20',
      time: '2:30 PM',
      type: 'Annual Checkup',
      status: 'completed',
      doctor: 'Dr. Sarah Johnson'
    }
  ]);

  const [medicalRecords] = useState([
    {
      id: 1,
      date: '2024-01-20',
      type: 'Annual Checkup',
      diagnosis: 'Routine examination - All normal',
      prescription: 'Vitamin D supplement, daily multivitamin',
      notes: 'Patient in good health. Continue current lifestyle habits.'
    },
    {
      id: 2,
      date: '2023-12-10',
      type: 'Blood Work',
      diagnosis: 'Cholesterol slightly elevated',
      prescription: 'Atorvastatin 20mg daily',
      notes: 'Recommend dietary changes and regular exercise.'
    }
  ]);

  const [profile] = useState({
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    dateOfBirth: '1985-06-15',
    bloodType: 'O+',
    allergies: 'Penicillin',
    emergencyContact: 'Jane Smith - +1-555-0456'
  });

  const upcomingAppointments = appointments.filter(apt => apt.status === 'confirmed');
  const recentRecords = medicalRecords.slice(0, 3);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome back, {profile.name}</p>
      </div>

      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
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
                  <p className="text-2xl font-bold">{medicalRecords.length}</p>
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
                  <p className="text-2xl font-bold">Jan 20</p>
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
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No upcoming appointments</p>
                <Button className="mt-4">Schedule Appointment</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{appointment.type}</h3>
                        <p className="text-gray-600">with {appointment.doctor}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Medical Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{record.type}</h3>
                      <p className="text-sm text-gray-500">{record.date}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </div>
                    <div>
                      <strong>Prescription:</strong> {record.prescription}
                    </div>
                    <div>
                      <strong>Notes:</strong> {record.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="font-semibold">{profile.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p>{profile.dateOfBirth}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Blood Type</label>
                  <p>{profile.bloodType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Allergies</label>
                  <p className="text-red-600">{profile.allergies}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <p>{profile.email}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <p>{profile.phone}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                  <p>{profile.emergencyContact}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
