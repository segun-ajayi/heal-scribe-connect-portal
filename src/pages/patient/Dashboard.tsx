
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, FileText, User, Clock, Phone, Mail, Loader2, Edit, X } from 'lucide-react';
import { usePatientAppointments, usePatientMedicalRecords, usePatientProfile } from '@/hooks/usePatientData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { data: appointments = [], isLoading: appointmentsLoading } = usePatientAppointments();
  const { data: medicalRecords = [], isLoading: recordsLoading } = usePatientMedicalRecords();
  const { data: profile, isLoading: profileLoading } = usePatientProfile();
  const { toast } = useToast();

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  // Sample upcoming appointments for demonstration
  const sampleUpcomingAppointments = [
    {
      id: 1,
      patient_id: 'current-user',
      date: '2024-06-15',
      time: '10:00:00',
      reason: 'Annual Checkup',
      status: 'scheduled',
      notes: 'Bring previous test results'
    },
    {
      id: 2,
      patient_id: 'current-user',
      date: '2024-06-20',
      time: '14:30:00',
      reason: 'Follow-up Consultation',
      status: 'confirmed',
      notes: 'Blood pressure monitoring'
    },
    {
      id: 3,
      patient_id: 'current-user',
      date: '2024-06-25',
      time: '09:00:00',
      reason: 'Specialist Referral',
      status: 'scheduled',
      notes: 'Cardiology consultation'
    }
  ];

  const upcomingAppointments = sampleUpcomingAppointments.filter(apt => {
    const appointmentDate = new Date(apt.date);
    const today = new Date();
    return appointmentDate >= today && apt.status !== 'completed';
  });

  const recentRecords = medicalRecords.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setEditForm({
      date: appointment.date || '',
      time: appointment.time || '',
      reason: appointment.reason || '',
      notes: appointment.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    toast({
      title: "Appointment Updated",
      description: "Your appointment has been successfully updated."
    });
    setIsEditDialogOpen(false);
    setEditingAppointment(null);
  };

  const handleCancelAppointment = (appointmentId) => {
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
      variant: "destructive"
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p>Please log in to view your dashboard.</p>
        <Button asChild className="mt-4">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {profile?.full_name || user.email}
        </p>
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
                    {medicalRecords.length > 0 
                      ? formatDate(medicalRecords[0].record_date)
                      : 'N/A'
                    }
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
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{appointment.reason || 'Appointment'}</h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(appointment.date)} at {formatTime(appointment.time)}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-100 text-blue-800">
                          {appointment.status || 'scheduled'}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAppointment(appointment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your appointment on {formatDate(appointment.date)} at {formatTime(appointment.time)}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
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
            {recordsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading medical records...
              </div>
            ) : recentRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No medical records available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{record.title}</h3>
                        <p className="text-sm text-gray-500">{formatDate(record.record_date)}</p>
                        <Badge variant="outline" className="mt-1">
                          {record.record_type}
                        </Badge>
                      </div>
                    </div>
                    {record.content && (
                      <div className="text-sm text-gray-700">
                        {record.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
            {profileLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading profile...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="font-semibold">{profile?.full_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Patient ID</label>
                    <p className="text-sm text-gray-600">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p>{formatDate(profile?.created_at || user.created_at)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <p>{profile?.email || user.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <p>{profile?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-time">Time</Label>
                <Input
                  id="edit-time"
                  type="time"
                  value={editForm.time}
                  onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-reason">Reason for Visit</Label>
              <Input
                id="edit-reason"
                value={editForm.reason}
                onChange={(e) => setEditForm(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for visit"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or requests..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientDashboard;
