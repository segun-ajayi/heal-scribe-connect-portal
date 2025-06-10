import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Calendar, AlertCircle } from 'lucide-react';

const WaitingListManagement = () => {
  const [waitingList, setWaitingList] = useState([
    {
      id: 1,
      patientName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      requestedDate: '2024-02-15',
      reason: 'Annual Checkup',
      priority: 'normal',
      addedAt: '2024-01-20',
      status: 'waiting'
    },
    {
      id: 2,
      patientName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      requestedDate: '2024-02-10',
      reason: 'Follow-up consultation',
      priority: 'high',
      addedAt: '2024-01-18',
      status: 'waiting'
    },
    {
      id: 3,
      patientName: 'Mike Davis',
      email: 'mike.davis@email.com',
      phone: '+1-555-0789',
      requestedDate: '2024-02-20',
      reason: 'Urgent consultation',
      priority: 'urgent',
      addedAt: '2024-01-22',
      status: 'waiting'
    }
  ]);

  const { toast } = useToast();

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

  const activeRequests = waitingList.filter(patient => patient.status === 'waiting');
  const approvedRequests = waitingList.filter(patient => patient.status === 'approved');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Waiting List Management</h1>
        </div>

        {/* Waiting list content would go here */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Waiting list management functionality coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WaitingListManagement;
