
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Edit, 
  Plus, 
  Calendar, 
  FileText, 
  Search, 
  Phone, 
  Mail,
  Clock,
  Trash2,
  Eye
} from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([
    {
      id: 'patient-1',
      full_name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      created_at: '2023-06-01',
      last_visit: '2024-01-20'
    },
    {
      id: 'patient-2',
      full_name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0456',
      created_at: '2023-08-15',
      last_visit: '2024-02-10'
    }
  ]);

  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient_id: 'patient-1',
      patient_name: 'John Smith',
      date: '2024-06-15',
      time: '10:00',
      reason: 'Annual Checkup',
      status: 'scheduled',
      notes: 'Patient reports feeling well'
    },
    {
      id: 2,
      patient_id: 'patient-2',
      patient_name: 'Sarah Johnson',
      date: '2024-06-16',
      time: '14:30',
      reason: 'Follow-up',
      status: 'confirmed',
      notes: 'Blood pressure monitoring'
    }
  ]);

  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 1,
      patient_id: 'patient-1',
      patient_name: 'John Smith',
      title: 'Annual Physical Exam',
      content: 'Patient appears healthy. Blood pressure normal. Recommend continued exercise routine.',
      record_type: 'examination',
      record_date: '2024-01-20',
      created_by: 'Dr. Ajayi'
    },
    {
      id: 2,
      patient_id: 'patient-1',
      patient_name: 'John Smith',
      title: 'Blood Test Results',
      content: 'All blood work came back normal. Cholesterol levels within healthy range.',
      record_type: 'lab_result',
      record_date: '2024-01-15',
      created_by: 'Dr. Ajayi'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const [patientForm, setPatientForm] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  const [recordForm, setRecordForm] = useState({
    title: '',
    content: '',
    record_type: 'examination',
    record_date: ''
  });

  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '',
    reason: '',
    status: 'scheduled',
    notes: ''
  });

  const { toast } = useToast();

  const filteredPatients = patients.filter(patient =>
    patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patient_id === patientId);
  };

  const getPatientRecords = (patientId) => {
    return medicalRecords.filter(record => record.patient_id === patientId);
  };

  const handleSavePatient = () => {
    if (!patientForm.full_name || !patientForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPatient) {
      setPatients(patients.map(p => 
        p.id === selectedPatient.id 
          ? { ...p, ...patientForm }
          : p
      ));
      toast({
        title: "Patient Updated",
        description: "Patient information has been successfully updated."
      });
    } else {
      const newPatient = {
        ...patientForm,
        id: `patient-${Date.now()}`,
        created_at: new Date().toISOString().split('T')[0],
        last_visit: null
      };
      setPatients([...patients, newPatient]);
      toast({
        title: "Patient Created",
        description: "New patient has been added successfully."
      });
    }

    setIsPatientDialogOpen(false);
    setSelectedPatient(null);
    setPatientForm({ full_name: '', email: '', phone: '' });
  };

  const handleSaveRecord = () => {
    if (!recordForm.title || !recordForm.content || !selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingRecord) {
      setMedicalRecords(medicalRecords.map(record => 
        record.id === editingRecord.id 
          ? { ...record, ...recordForm }
          : record
      ));
      toast({
        title: "Record Updated",
        description: "Medical record has been successfully updated."
      });
    } else {
      const newRecord = {
        ...recordForm,
        id: Date.now(),
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.full_name,
        created_by: 'Dr. Ajayi'
      };
      setMedicalRecords([...medicalRecords, newRecord]);
      toast({
        title: "Record Created",
        description: "New medical record has been added successfully."
      });
    }

    setIsRecordDialogOpen(false);
    setEditingRecord(null);
    setRecordForm({
      title: '',
      content: '',
      record_type: 'examination',
      record_date: ''
    });
  };

  const handleSaveAppointment = () => {
    if (!appointmentForm.date || !appointmentForm.time || !selectedPatient) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (editingAppointment) {
      setAppointments(appointments.map(apt => 
        apt.id === editingAppointment.id 
          ? { ...apt, ...appointmentForm }
          : apt
      ));
      toast({
        title: "Appointment Updated",
        description: "Appointment has been successfully updated."
      });
    } else {
      const newAppointment = {
        ...appointmentForm,
        id: Date.now(),
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.full_name
      };
      setAppointments([...appointments, newAppointment]);
      toast({
        title: "Appointment Created",
        description: "New appointment has been scheduled successfully."
      });
    }

    setIsAppointmentDialogOpen(false);
    setEditingAppointment(null);
    setAppointmentForm({
      date: '',
      time: '',
      reason: '',
      status: 'scheduled',
      notes: ''
    });
  };

  const openPatientDialog = (patient = null) => {
    setSelectedPatient(patient);
    setPatientForm(patient ? {
      full_name: patient.full_name,
      email: patient.email,
      phone: patient.phone || ''
    } : { full_name: '', email: '', phone: '' });
    setIsPatientDialogOpen(true);
  };

  const openRecordDialog = (record = null) => {
    setEditingRecord(record);
    setRecordForm(record ? {
      title: record.title,
      content: record.content,
      record_type: record.record_type,
      record_date: record.record_date
    } : {
      title: '',
      content: '',
      record_type: 'examination',
      record_date: ''
    });
    setIsRecordDialogOpen(true);
  };

  const openAppointmentDialog = (appointment = null) => {
    setEditingAppointment(appointment);
    setAppointmentForm(appointment ? {
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes
    } : {
      date: '',
      time: '',
      reason: '',
      status: 'scheduled',
      notes: ''
    });
    setIsAppointmentDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <Button onClick={() => openPatientDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Patient List</CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Member Since</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{patient.full_name}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {patient.email}
                        </div>
                        {patient.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {patient.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(patient.created_at)}</TableCell>
                    <TableCell>
                      {patient.last_visit ? formatDate(patient.last_visit) : 'No visits yet'}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openPatientDialog(patient)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle>Patient Details: {selectedPatient.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="appointments">Appointments</TabsTrigger>
                  <TabsTrigger value="records">Medical Records</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Appointments</h3>
                    <Button onClick={() => openAppointmentDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Appointment
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPatientAppointments(selectedPatient.id).map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{formatDate(appointment.date)}</p>
                              <p className="text-sm text-gray-500">{appointment.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.reason}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{appointment.status}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{appointment.notes}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openAppointmentDialog(appointment)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="records" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Medical Records</h3>
                    <Button onClick={() => openRecordDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Record
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getPatientRecords(selectedPatient.id).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.record_type}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(record.record_date)}</TableCell>
                          <TableCell className="max-w-xs truncate">{record.content}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openRecordDialog(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Full Name</label>
                        <p className="font-semibold">{selectedPatient.full_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Patient ID</label>
                        <p className="text-sm text-gray-600">{selectedPatient.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Member Since</label>
                        <p>{formatDate(selectedPatient.created_at)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Email</label>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <p>{selectedPatient.email}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Phone</label>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <p>{selectedPatient.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Last Visit</label>
                        <p>{selectedPatient.last_visit ? formatDate(selectedPatient.last_visit) : 'No visits yet'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Patient Dialog */}
        <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name*</Label>
                <Input
                  id="full_name"
                  value={patientForm.full_name}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSavePatient} className="flex-1">
                  {selectedPatient ? 'Update' : 'Create'} Patient
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsPatientDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Medical Record Dialog */}
        <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? 'Edit Medical Record' : 'Add Medical Record'}
                {selectedPatient && ` - ${selectedPatient.full_name}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="record_title">Title*</Label>
                <Input
                  id="record_title"
                  value={recordForm.title}
                  onChange={(e) => setRecordForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter record title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="record_type">Type*</Label>
                  <Select 
                    value={recordForm.record_type} 
                    onValueChange={(value) => setRecordForm(prev => ({ ...prev, record_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="examination">Examination</SelectItem>
                      <SelectItem value="lab_result">Lab Result</SelectItem>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="record_date">Date*</Label>
                  <Input
                    id="record_date"
                    type="date"
                    value={recordForm.record_date}
                    onChange={(e) => setRecordForm(prev => ({ ...prev, record_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="record_content">Content*</Label>
                <Textarea
                  id="record_content"
                  value={recordForm.content}
                  onChange={(e) => setRecordForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter detailed record content..."
                  rows={6}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveRecord} className="flex-1">
                  {editingRecord ? 'Update' : 'Create'} Record
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRecordDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Appointment Dialog */}
        <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAppointment ? 'Edit Appointment' : 'Add Appointment'}
                {selectedPatient && ` - ${selectedPatient.full_name}`}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="apt_date">Date*</Label>
                  <Input
                    id="apt_date"
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="apt_time">Time*</Label>
                  <Input
                    id="apt_time"
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="apt_reason">Reason</Label>
                <Input
                  id="apt_reason"
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Reason for visit"
                />
              </div>
              <div>
                <Label htmlFor="apt_status">Status</Label>
                <Select 
                  value={appointmentForm.status} 
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
                <Label htmlFor="apt_notes">Notes</Label>
                <Textarea
                  id="apt_notes"
                  value={appointmentForm.notes}
                  onChange={(e) => setAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveAppointment} className="flex-1">
                  {editingAppointment ? 'Update' : 'Create'} Appointment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAppointmentDialogOpen(false)}
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

export default PatientManagement;
