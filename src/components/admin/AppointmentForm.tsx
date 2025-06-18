import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft, ChevronRight, Edit, Plus} from "lucide-react";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import PatientProfileForm from "@/components/admin/PatientProfileForm.tsx";


const AppointmentForm = ({ openAppointmentDialog, recentAppointments, formatDate, isAppointmentDialogOpen, setIsAppointmentDialogOpen,
                             editingAppointment, selectedPatient, selectedAppointment, handleSaveAppointment, isLoading, page, setPage}) => {

    const [appointmentForm, setAppointmentForm] = useState({
        patient_id: selectedPatient?.patient_id,
        preferred_date: '',
        preferred_time: '',
        reason: '',
        status: '',
        notes: ''
    });

    useEffect(() => {
        if (selectedAppointment) {
            setAppointmentForm({ ...selectedAppointment });
        }
    }, [selectedAppointment]);

    useEffect(() => {
        if (selectedPatient) {
            setAppointmentForm({ ...selectedPatient });
        }
    }, [selectedPatient]);

    if (!appointmentForm) return null;
    console.log('Recent: ', recentAppointments);
    const total = recentAppointments?.totalAppointments;
    const limit = recentAppointments?.limit;
    const totalPages = Math.ceil(total / limit);

    return (

    <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Appointments</h3>
                <Button onClick={() => openAppointmentDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appointment
                </Button>
            </div>
            {isLoading ? (
                    <p className="text-center py-4">Loading appointments...</p>
                ) : (
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
                        {recentAppointments?.data?.map((appointment) => (
                            <TableRow key={appointment.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{formatDate(appointment.preferred_date)}</p>
                                        <p className="text-sm text-gray-500">{appointment.preferred_time}</p>
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
                    <TableFooter>
                        <tr>
                            <td colSpan={5}>
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                                        className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>

                                    <span className="text-sm text-gray-600 whitespace-nowrap">
            Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
          </span>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                                        className="flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </TableFooter>
                </Table>
            )}


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
                                    value={appointmentForm.preferred_date}
                                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, preferred_date: e.target.value }))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="apt_time">Time*</Label>
                                <Input
                                    id="apt_time"
                                    type="time"
                                    value={appointmentForm.preferred_time}
                                    onChange={(e) => setAppointmentForm(prev => ({ ...prev, preferred_time: e.target.value }))}
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
                            <Button onClick={() => handleSaveAppointment(appointmentForm)} className="flex-1">
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
    )
}

export default AppointmentForm;