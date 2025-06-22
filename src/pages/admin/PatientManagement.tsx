
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    User,
    Edit,
    Plus,
    Search,
    Phone,
    Mail,
    Eye
} from 'lucide-react';
import {useAdminPatientAppointments, useAdminPatients, useRecentAppointments} from "@/hooks/useAdminData.ts";
import { useAuth } from '@/contexts/AuthContext';
import PatientProfileForm from "@/components/admin/forms/PatientProfileForm.tsx";
import AppointmentForm from "@/components/admin/forms/AppointmentForm.tsx";
import PatientRecords from "@/components/admin/PatientRecords.tsx";


const PatientManagement = () => {
    const [page, setPage] = useState(1);
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

    const { data: recentAppointments = [], isLoading: appointmentsLoading } = useAdminPatientAppointments(page, 'all', selectedPatient?.patient_id);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
    const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);


    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const { data: patients, isLoading, isError } = useAdminPatients(searchQuery, filterStatus);
    console.log(patients);
    const { user, userRole, authFetch } = useAuth();


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

    const { toast } = useToast();

    const filteredPatients = patients?.data?.filter(patient =>
        patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(patient.patient_id).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getPatientRecords = (patientId) => {
        return medicalRecords?.filter(record => record.patient_id === patientId);
    };

    const handleSavePatient = async () => {
        if (!patientForm.full_name || !patientForm.email) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        try {

            try {
                await authFetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/profile`,
                    {
                        method: "POST",
                        body: JSON.stringify(patientForm),
                    }
                );

                toast({
                    title: "Account created successfully",
                    description: "Patient account has been successfully created.",
                });

                setIsPatientDialogOpen(false);
                setSelectedPatient(null);
                setPatientForm({ full_name: "", email: "", phone: "" });
                window.location.reload();

            } catch (error) {
                toast({
                    title: "Failed to update profile",
                    description: error?.message || "Profile update failed!",
                    variant: "destructive",
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
    };

    const handleSaveProfile = async (patient) => {
        try {
            try {
                const response = await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/profiles/${selectedPatient.user_id}`, {
                    method: "PUT",
                    body: JSON.stringify(patient)
                });

                toast({
                    title: "Profile updated successfully",
                    description: "Profile has been successfully updated."
                });
            } catch (error) {
                console.log('Profile create failed', error);
                toast({
                    title: "Failed to update profile",
                    description: "Profile update failed!.",
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

    const handleSaveAppointment = async (appointmentForm) => {

        if (!appointmentForm.preferred_date || !appointmentForm.preferred_time || !selectedPatient) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }
        console.log(editingAppointment);

        const odo = {
            patient_id: selectedPatient.patient_id,
            ...appointmentForm
        };

        if(editingAppointment) {
            const odoEditting = {
                patient_id: selectedPatient.patient_id,
                appointment_id: editingAppointment.id,
                ...appointmentForm
            };
            try {
                try {
                    await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/`, {
                        method: "PUT",
                        body: JSON.stringify(odoEditting)
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
        } else {
            try {
                try{
                    await authFetch(`${import.meta.env.VITE_API_URL}/api/admin/appointments/`, {
                        method: "POST",
                        body: JSON.stringify(odo)
                    });

                    toast({
                        title: "Appointment created successfully",
                        description: "Appointment has been successfully updated."
                    });
                } catch (error) {
                    toast({
                        title: "Failed to created appointment",
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
        }

        setIsAppointmentDialogOpen(false);
        setEditingAppointment(null);
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
        setSelectedAppointment(appointment ? {
            preferred_date: appointment.preferred_date,
            preferred_time: appointment.preferred_time,
            reason: appointment.reason,
            status: appointment.status,
            notes: appointment.notes,
            appointment_id: appointment.id
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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-sm"
                            />
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-3 py-2">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <p className="text-center py-4">Loading patients...</p>
                        ) : isError ? (
                            <p className="text-center text-red-500 py-4">Error fetching patients.</p>
                        ) : (
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
                                    {patients?.data?.slice(0, 5).map((patient) => (
                                        <TableRow key={patient.user_id}>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-2 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium">{patient.full_name}</p>
                                                        <p className="text-sm text-gray-500">ID: {patient.patient_id}</p>
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
                                            <TableCell>{formatDate(patient.join_date)}</TableCell>
                                            <TableCell>
                                                {patient.last_visit ? formatDate(patient.last_visit) : 'No appointment yet'}
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
                        )}
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
                                    <AppointmentForm
                                        openAppointmentDialog ={openAppointmentDialog}
                                        recentAppointments = {recentAppointments}
                                        formatDate = {formatDate}
                                        isAppointmentDialogOpen = {isAppointmentDialogOpen}
                                        setIsAppointmentDialogOpen = {setIsAppointmentDialogOpen}
                                        editingAppointment = {editingAppointment}
                                        selectedPatient = {selectedPatient}
                                        selectedAppointment = {selectedAppointment}
                                        handleSaveAppointment = {handleSaveAppointment}
                                        isLoading={appointmentsLoading}
                                        page={page}
                                        setPage={setPage}
                                    />
                                </TabsContent>

                                <TabsContent value="records" className="space-y-4">
                                    <PatientRecords
                                        openRecordDialog={openRecordDialog}
                                        getPatientRecords={getPatientRecords}
                                        selectedPatient={selectedPatient}
                                        formatDate={formatDate}
                                        isRecordDialogOpen={isRecordDialogOpen}
                                        setIsRecordDialogOpen={setIsRecordDialogOpen}
                                        editingRecord={editingRecord}
                                        handleSaveRecord={handleSaveRecord}
                                    />
                                </TabsContent>

                                <TabsContent value="profile" className="space-y-4">
                                    <PatientProfileForm
                                        selectedPatient={selectedPatient}
                                        phone={user.phone}
                                        userRole={userRole}
                                        onSave={handleSaveProfile} // <- this function gets the profileForm state
                                        formatDate={formatDate}
                                    />
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


                {/* Appointment Dialog */}

            </div>
        </AdminLayout>
    );
};

export default PatientManagement;