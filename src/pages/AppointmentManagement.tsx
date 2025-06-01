
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Edit, Trash2, LogOut } from "lucide-react";

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  isAvailable: boolean;
  patientName?: string;
  patientEmail?: string;
}

const AppointmentManagement = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      date: "2025-01-10",
      time: "09:00",
      isAvailable: false,
      patientName: "John Doe",
      patientEmail: "john@email.com"
    },
    {
      id: "2",
      date: "2025-01-10",
      time: "10:00",
      isAvailable: true
    },
    {
      id: "3",
      date: "2025-01-11",
      time: "14:00",
      isAvailable: true
    }
  ]);

  const [newSlot, setNewSlot] = useState({
    date: "",
    time: ""
  });

  const handleAddSlot = () => {
    if (newSlot.date && newSlot.time) {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        date: newSlot.date,
        time: newSlot.time,
        isAvailable: true
      };
      setTimeSlots([...timeSlots, slot]);
      setNewSlot({ date: "", time: "" });
    }
  };

  const handleDeleteSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
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
            <div className="grid md:grid-cols-3 gap-4">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeSlots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                    <TableCell className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{slot.time}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={slot.isAvailable ? "default" : "secondary"}
                        className={slot.isAvailable ? "bg-green-500" : "bg-red-500"}
                      >
                        {slot.isAvailable ? "Available" : "Booked"}
                      </Badge>
                    </TableCell>
                    <TableCell>{slot.patientName || "-"}</TableCell>
                    <TableCell>{slot.patientEmail || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentManagement;
