import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Calendar, Clock, Plus, Edit, Trash2, LogOut, Eye, Settings, Filter, X } from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  duration: number; // duration in minutes
  isAvailable: boolean;
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
  appointmentNotes?: string;
  medicalHistory?: string;
  currentMedications?: string;
  reasonForVisit?: string;
}

const AppointmentManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "2025-01-10",
      time: "09:00",
      duration: 30,
      isAvailable: false,
      patientName: "John Doe",
      patientEmail: "john@email.com",
      patientPhone: "+234 801 234 5678",
      appointmentNotes: "Follow-up consultation for previous surgery",
      medicalHistory: "Previous appendectomy in 2022, hypertension",
      currentMedications: "Lisinopril 10mg daily, Aspirin 81mg daily",
      reasonForVisit: "Post-operative follow-up and general check-up"
    },
    {
      id: "2",
      date: "2025-01-10",
      time: "10:00",
      duration: 30,
      isAvailable: true
    },
    {
      id: "3",
      date: "2025-01-11",
      time: "14:00",
      duration: 60,
      isAvailable: true
    }
  ]);

  const [defaultDuration, setDefaultDuration] = useState(30);
  const [newSlot, setNewSlot] = useState({
    date: "",
    time: "",
    duration: defaultDuration
  });
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [viewingSlot, setViewingSlot] = useState<TimeSlot | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [filterDate, setFilterDate] = useState("");
  
  // Calculate pagination
  const filteredTimeSlots = filterDate 
    ? timeSlots.filter(slot => slot.date === filterDate)
    : timeSlots;

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(filteredTimeSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSlots = filteredTimeSlots.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  const handleDateFilter = (date: string) => {
    setFilterDate(date);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setFilterDate("");
    setCurrentPage(1);
  };

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.time) {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        date: newSlot.date,
        time: newSlot.time,
        duration: newSlot.duration,
        isAvailable: true
      };
      setTimeSlots([...timeSlots, slot]);
      setNewSlot({ date: "", time: "", duration: defaultDuration });
    }
  };

  const handleEditSlot = (slot: TimeSlot) => {
    setEditingSlot(slot);
  };

  const handleUpdateSlot = () => {
    if (editingSlot) {
      setTimeSlots(timeSlots.map(slot => 
        slot.id === editingSlot.id ? editingSlot : slot
      ));
      setEditingSlot(null);
    }
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    // Adjust current page if necessary
    const newTotalPages = Math.ceil((timeSlots.length - 1) / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
              <p className="text-gray-600">Manage availability and appointments</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </CardTitle>
            <CardDescription>
              Configure default appointment settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultDuration">Default Appointment Duration</Label>
                <Select 
                  value={defaultDuration.toString()} 
                  onValueChange={(value) => setDefaultDuration(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Time Slot */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Available Time Slot</span>
            </CardTitle>
            <CardDescription>
              Create new time slots for patient appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSlot.time}
                  onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={newSlot.duration.toString()} 
                  onValueChange={(value) => setNewSlot({ ...newSlot, duration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleAddSlot}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Add Time Slot
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Time Slots & Appointments</span>
            </CardTitle>
            <CardDescription>
              Manage your availability and view booked appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Date Filter */}
            <div className="mb-6 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <Label htmlFor="filter-date">Filter by Date:</Label>
              </div>
              <Input
                id="filter-date"
                type="date"
                value={filterDate}
                onChange={(e) => handleDateFilter(e.target.value)}
                className="w-auto"
              />
              {filterDate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilter}
                  className="flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </Button>
              )}
              <div className="text-sm text-gray-600">
                Showing {filteredTimeSlots.length} of {timeSlots.length} slots
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSlots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {filterDate ? "No appointments found for the selected date" : "No time slots available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentSlots.map((slot) => (
                    <TableRow key={slot.id}>
                      <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                      <TableCell className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{slot.time}</span>
                      </TableCell>
                      <TableCell>{formatDuration(slot.duration)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={slot.isAvailable ? "default" : "secondary"}
                          className={slot.isAvailable ? "bg-green-500" : "bg-red-500"}
                        >
                          {slot.isAvailable ? "Available" : "Booked"}
                        </Badge>
                      </TableCell>
                      <TableCell>{slot.patientName || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!slot.isAvailable && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setViewingSlot(slot)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Appointment Details</DialogTitle>
                                  <DialogDescription>
                                    View appointment information
                                  </DialogDescription>
                                </DialogHeader>
                                {viewingSlot && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Date</Label>
                                        <p className="text-sm">{new Date(viewingSlot.date).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Time</Label>
                                        <p className="text-sm">{viewingSlot.time}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Duration</Label>
                                        <p className="text-sm">{formatDuration(viewingSlot.duration)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Patient Name</Label>
                                        <p className="text-sm">{viewingSlot.patientName}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Email</Label>
                                        <p className="text-sm">{viewingSlot.patientEmail}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Phone</Label>
                                        <p className="text-sm">{viewingSlot.patientPhone}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Medical Information Section */}
                                    <div className="space-y-4 border-t pt-4">
                                      <h3 className="text-lg font-semibold">Medical Information</h3>
                                      
                                      {viewingSlot.reasonForVisit && (
                                        <div>
                                          <Label className="text-sm font-medium">Reason for Visit</Label>
                                          <p className="text-sm text-gray-700 mt-1">{viewingSlot.reasonForVisit}</p>
                                        </div>
                                      )}
                                      
                                      {viewingSlot.medicalHistory && (
                                        <div>
                                          <Label className="text-sm font-medium">Medical History</Label>
                                          <p className="text-sm text-gray-700 mt-1">{viewingSlot.medicalHistory}</p>
                                        </div>
                                      )}
                                      
                                      {viewingSlot.currentMedications && (
                                        <div>
                                          <Label className="text-sm font-medium">Current Medications</Label>
                                          <p className="text-sm text-gray-700 mt-1">{viewingSlot.currentMedications}</p>
                                        </div>
                                      )}
                                      
                                      {viewingSlot.appointmentNotes && (
                                        <div>
                                          <Label className="text-sm font-medium">Appointment Notes</Label>
                                          <p className="text-sm text-gray-700 mt-1">{viewingSlot.appointmentNotes}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditSlot(slot)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Time Slot</DialogTitle>
                                <DialogDescription>
                                  Modify the time slot details
                                </DialogDescription>
                              </DialogHeader>
                              {editingSlot && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-date">Date</Label>
                                      <Input
                                        id="edit-date"
                                        type="date"
                                        value={editingSlot.date}
                                        onChange={(e) => setEditingSlot({ ...editingSlot, date: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-time">Time</Label>
                                      <Input
                                        id="edit-time"
                                        type="time"
                                        value={editingSlot.time}
                                        onChange={(e) => setEditingSlot({ ...editingSlot, time: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-duration">Duration</Label>
                                    <Select 
                                      value={editingSlot.duration.toString()} 
                                      onValueChange={(value) => setEditingSlot({ ...editingSlot, duration: parseInt(value) })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="90">1.5 hours</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <Button onClick={handleUpdateSlot} className="w-full">
                                    Update Time Slot
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentManagement;
