import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, Phone, Mail, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Appointments = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    appointmentType: "",
    preferredDate: "",
    preferredTime: "",
    reason: "",
    medicalHistory: "",
    currentMedications: "",
    insuranceProvider: "",
    emergencyContact: "",
    emergencyPhone: ""
  });

  const appointmentTypes = [
    "Initial Consultation",
    "Follow-up Appointment",
    "Pre-operative Assessment",
    "Post-operative Check-up",
    "Second Opinion",
    "Emergency Consultation"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment Request Submitted",
      description: "We'll contact you within 24 hours to confirm your appointment.",
    });

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      appointmentType: "",
      preferredDate: "",
      preferredTime: "",
      reason: "",
      medicalHistory: "",
      currentMedications: "",
      insuranceProvider: "",
      emergencyContact: "",
      emergencyPhone: ""
    });
  };

  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule an Appointment</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take the first step towards better health. Schedule a consultation 
            with Dr. Funmilola Wuraola to discuss your concerns and treatment options.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Appointment Request Form</CardTitle>
                <p className="text-gray-600">
                  Please fill out the form below and we'll contact you to confirm your appointment.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                        <Input
                          id="insuranceProvider"
                          value={formData.insuranceProvider}
                          onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                          placeholder="e.g., NHIS, HMO"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appointmentType">Appointment Type</Label>
                        <Select value={formData.appointmentType} onValueChange={(value) => handleInputChange("appointmentType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                          <SelectContent>
                            {appointmentTypes.map(type => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date</Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange("preferredTime", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map(time => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Medical Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea
                          id="reason"
                          value={formData.reason}
                          onChange={(e) => handleInputChange("reason", e.target.value)}
                          placeholder="Please describe your symptoms or concerns..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="medicalHistory">Relevant Medical History</Label>
                        <Textarea
                          id="medicalHistory"
                          value={formData.medicalHistory}
                          onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                          placeholder="Previous surgeries, chronic conditions, family history..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentMedications">Current Medications</Label>
                        <Textarea
                          id="currentMedications"
                          value={formData.currentMedications}
                          onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                          placeholder="List all current medications and dosages..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="emergencyContact">Contact Name</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          value={formData.emergencyPhone}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Submit Appointment Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-1 text-blue-600" />
                  <div>
                    <p className="font-medium">Obafemi Awolowo University Teaching Hospitals Complex</p>
                    <p className="text-gray-600">Ile-Ife<br />Osun State<br />Nigeria</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">+234 (036) 230-0000</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  <div>
                    <p className="font-medium">appointments@oauthc.com</p>
                    <p className="text-sm text-gray-600">24-hour response time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Emergency consultations available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Initial Consultation</h4>
                    <p className="text-sm text-gray-600">60-90 minutes comprehensive evaluation</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Follow-up Visits</h4>
                    <p className="text-sm text-gray-600">30-45 minutes progress assessment</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Please Bring</h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      <li>• Valid ID card</li>
                      <li>• Insurance card (if applicable)</li>
                      <li>• Previous medical records</li>
                      <li>• Current medication list</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
