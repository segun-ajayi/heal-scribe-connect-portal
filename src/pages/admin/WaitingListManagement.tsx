import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Calendar, AlertCircle, Check, X, CalendarPlus } from 'lucide-react';

const WaitingListManagement = () => {
  const [waitingList, setWaitingList] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    time: '',
    notes: ''
  });

  const { toast } = useToast();

  // Load waiting list from localStorage on component mount
  useEffect(() => {
    const savedWaitingList = JSON.parse(localStorage.getItem('waitingList') || '[]');
    setWaitingList(savedWaitingList);
  }, []);

  // Save waiting list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waitingList', JSON.stringify(waitingList));
  }, [waitingList]);

  const handleApprove = (patientId: number) => {
    setWaitingList(waitingList.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'approved' }
        : patient
    ));
    
    toast({
      title: "Appointment Approved",
      description: "Patient has been notified and appointment has been scheduled."
    });
  };

  const handleReject = (patientId: number) => {
    setWaitingList(waitingList.filter(patient => patient.id !== patientId));
    
    toast({
      title: "Request Rejected",
      description: "Patient has been notified about the rejection."
    });
  };

  const handleSchedule = (patientId: number) => {
    if (!scheduleData.date || !scheduleData.time) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for the appointment.",
        variant: "destructive"
      });
      return;
    }

    // Add to appointments (in a real app, this would be API calls)
    const patient = waitingList.find(p => p.id === patientId);
    if (patient) {
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const newAppointment = {
        id: Date.now(),
        patientName: patient.patientName,
        email: patient.email,
        phone: patient.phone,
        date: scheduleData.date,
        time: scheduleData.time,
        reason: patient.reason,
        status: 'scheduled',
        notes: scheduleData.notes
      };
      
      const updatedAppointments = [...existingAppointments, newAppointment];
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }

    setWaitingList(waitingList.map(patient => 
      patient.id === patientId 
        ? { ...patient, status: 'scheduled' }
        : patient
    ));
    
    toast({
      title: "Appointment Scheduled",
      description: `Appointment scheduled for ${scheduleData.date} at ${scheduleData.time}.`
    });
    
    setScheduleData({ date: '', time: '', notes: '' });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeRequests = waitingList.filter(patient => patient.status === 'waiting');
  const approvedRequests = waitingList.filter(patient => patient.status === 'approved');
  const scheduledRequests = waitingList.filter(patient => patient.status === 'scheduled');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Waiting List Management</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Waiting</p>
                  <p className="text-2xl font-bold">{activeRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Check className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{approvedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold">{scheduledRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold">
                    {waitingList.filter(p => p.priority === 'urgent').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waiting List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Waiting List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Requested Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingList.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{patient.patientName}</p>
                          <p className="text-sm text-gray-500">Added: {patient.addedAt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{patient.email}</p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{patient.requestedDate}</TableCell>
                    <TableCell>{patient.reason}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(patient.priority)}>
                        {patient.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {patient.status === 'waiting' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(patient.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm">
                                  <CalendarPlus className="h-4 w-4 mr-1" />
                                  Schedule
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule Appointment for {patient.patientName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                      id="date"
                                      type="date"
                                      value={scheduleData.date}
                                      onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                      id="time"
                                      type="time"
                                      value={scheduleData.time}
                                      onChange={(e) => setScheduleData(prev => ({ ...prev, time: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="notes">Notes (Optional)</Label>
                                    <Textarea
                                      id="notes"
                                      value={scheduleData.notes}
                                      onChange={(e) => setScheduleData(prev => ({ ...prev, notes: e.target.value }))}
                                      placeholder="Any additional notes for the appointment..."
                                    />
                                  </div>
                                  <Button 
                                    onClick={() => handleSchedule(patient.id)}
                                    className="w-full"
                                  >
                                    Schedule Appointment
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(patient.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {waitingList.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No patients in waiting list.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WaitingListManagement;
