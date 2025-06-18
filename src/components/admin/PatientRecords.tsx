import {Button} from "@/components/ui/button.tsx";
import {Edit, Plus} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

const PatientRecords = ({openRecordDialog, getPatientRecords, selectedPatient,
                            formatDate, isRecordDialogOpen, setIsRecordDialogOpen, editingRecord, handleSaveRecord }) => {

    const [recordForm, setRecordForm] = useState(null);

    useEffect(() => {
        if (selectedPatient) {
            setRecordForm({ ...selectedPatient });
        }
    }, [selectedPatient]);

    if (!recordForm) return null;

    return (<div>
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
                        <Button onClick={handleSaveRecord(recordForm)} className="flex-1">
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
    </div>);
}

export default PatientRecords;