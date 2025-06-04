
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Clock, User, Phone, Mail, CheckCircle, X } from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Waiting List Management</h1>
        <p className="text-gray-600 mt-2">Manage patient appointment requests and waiting list</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Requests ({activeRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {activeRequests.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                          <Badge className={getPriorityColor(patient.priority)}>
                            {patient.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {patient.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {patient.phone}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p><strong>Requested Date:</strong> {patient.requestedDate}</p>
                            <p><strong>Added to list:</strong> {patient.addedAt}</p>
                            <p><strong>Reason:</strong> {patient.reason}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(patient.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReject(patient.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {approvedRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Recently Approved ({approvedRequests.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvedRequests.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-3 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{patient.patientName}</h4>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WaitingListManagement;
