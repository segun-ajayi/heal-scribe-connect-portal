
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';
import { useRecentAppointments } from "@/hooks/useAdminData.ts";
import { PaginationControls } from '@/components/ui/PaginationControls';
import {useAuth} from "@/contexts/AuthContext.tsx";

const AppointmentManagement = () => {
  const [page, setPage] = useState(1);

  const { user, userRole, authFetch } = useAuth();

  const { data: recentAppointments = undefined, isLoading: appointmentsLoading } = useRecentAppointments(page);


  const total = recentAppointments?.total;
  const limit = recentAppointments?.limit;
  const totalPages = Math.ceil(total / limit);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time: '',
    reason: '',
    status: 'scheduled',
    notes: ''
  });

  const { toast } = useToast();

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    console.log(appointmentId, newStatus, '  :dsdsdsf');
    try {

      await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/status`, {
        method: "POST",
        body: JSON.stringify({
          status: newStatus,
          id: appointmentId
        })
      });

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}.`
      });
    } catch (e) {
      console.log("Status update failed", e)
      toast({
        title: "Status Update Failed",
        description: `Appointment status update failed.`
      });
    }

  };

  const handleDeleteAppointment = (appointmentId: number) => {

    
    toast({
      title: "Appointment Deleted",
      description: "The appointment has been removed from the schedule."
    });
  };

  const handleSaveAppointment = async () => {
    console.log('Apppopoopo: ', appointmentForm)
    if (!appointmentForm.preferred_date || !appointmentForm.preferred_time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    const odo = {
      appointment_id: editingAppointment.id,
      ...appointmentForm
    };

    if (editingAppointment) {
      try {
        try {
          await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/`, {
            method: "PUT",
            body: JSON.stringify(odo)
          });

          toast({
            title: "Appointment updated successfully",
            description: "Appointment has been successfully updated."
          });
        } catch (error) {
          console.log('Error updating appointment', error);
          toast({
            title: "Failed to update appointment",
            description: "Appointment update failed!.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while updating!.",
          variant: "destructive"
        });
      }

      toast({
        title: "Appointment Updated",
        description: "The appointment has been successfully updated."
      });
    } else {


      toast({
        title: "Appointment Created",
        description: "New appointment has been scheduled."
      });
    }

    setIsDialogOpen(false);
    setEditingAppointment(null);
    setAppointmentForm({
      patientName: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
      reason: '',
      status: 'scheduled',
      notes: ''
    });
  };

  const openEditDialog = (appointment) => {
    setEditingAppointment(appointment);
    setAppointmentForm(appointment);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingAppointment(null);
    setAppointmentForm({
      patientName: '',
      email: '',
      phone: '',
      preferred_date: '',
      preferred_time: '',
      reason: '',
      status: 'scheduled',
      notes: ''
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const todayAppointments = recentAppointments?.data?.filter(apt => apt.preferred_date === new Date().toISOString().split('T')[0]);
  const upcomingAppointments = recentAppointments?.data?.filter(apt => new Date(apt.preferred_date) > new Date());
  const pendingAppointments = recentAppointments?.data?.filter(apt => apt.status === 'pending');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          <Button onClick={openNewDialog}>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold">{todayAppointments?.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold">{upcomingAppointments?.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{pendingAppointments?.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{recentAppointments?.data?.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments?.data?.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{appointment.full_name}</p>
                          {appointment.reason && (
                            <p className="text-xs text-gray-500">{appointment.reason}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{appointment.email}</p>
                        <p className="text-sm text-gray-500">{appointment.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{appointment.preferred_date}</p>
                        <p className="text-sm text-gray-500">{appointment.preferred_time}</p>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.priority}</TableCell>
                    <TableCell>
                      <Select 
                        value={appointment.status || ""}
                        onValueChange={(value) => handleStatusChange(appointment.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue>
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(appointment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <tr>
                  <td colSpan={999}>
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      onPageChange={(newPage) => setPage(newPage)}
                      isLoading={appointmentsLoading}
                    />
                  </td>
                </tr>
              </TableFooter>
            </Table>
            
            {recentAppointments?.data?.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit/Create Appointment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date*</Label>
                  <Input
                    id="date"
                    type="date"
                    value={appointmentForm.preferred_date || ""}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time*</Label>
                  <Input
                    id="time"
                    type="time"
                    value={appointmentForm.preferred_time || ""}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={appointmentForm.reason || ""}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Reason for visit"
                />
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={appointmentForm.status || ""}
                  onValueChange={(value) => setAppointmentForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={appointmentForm.notes || ""}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleSaveAppointment} className="flex-1">
                  {editingAppointment ? 'Update' : 'Create'} Appointment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AppointmentManagement;
