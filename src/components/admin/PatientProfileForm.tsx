import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const PatientProfileForm = ({ selectedPatient, phone, userRole, onSave, formatDate }) => {
    const [profileForm, setProfileForm] = useState(null);

    useEffect(() => {
        if (selectedPatient) {
            setProfileForm({ ...selectedPatient });
        }
    }, [selectedPatient]);

    if (!profileForm) return null;

    return (
        <div className="space-y-6">
            {/* Static Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <Label>Full Name</Label>
                        <p className="font-semibold">{profileForm.full_name}</p>
                    </div>
                    <div>
                        <Label>Patient ID</Label>
                        <p>{profileForm.patient_id || profileForm.id}</p>
                    </div>
                    <div>
                        <Label>Member Since</Label>
                        <p>{formatDate(profileForm.created_at)}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label>Email</Label>
                        <p>{profileForm.email}</p>
                    </div>
                    <div>
                        <Label>Phone</Label>
                        {userRole === "super_admin" ? (
                            <Input
                                value={profileForm.phone || profileForm.userPhone}
                                onChange={(e) =>
                                    setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
                                }
                            />
                        ) : (
                            <p>{profileForm.phone || "Not provided"}</p>
                        )}
                    </div>
                    <div>
                        <Label>Last Visit</Label>
                        <p>{profileForm.last_visit ? formatDate(profileForm.last_visit) : "No visits yet"}</p>
                    </div>
                </div>
            </div>

            {/* Editable Fields */}
            {userRole === "super_admin" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                    <Label htmlFor="address">Address</Label>
                    <Input
                        id="address"
                        value={profileForm.address || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, address: e.target.value }))
                        }
                    />

                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                        id="dob"
                        type="date"
                        value={profileForm.dob || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, dob: e.target.value }))
                        }
                    />

                    <Label htmlFor="nok">Next of Kin</Label>
                    <Input
                        id="nok"
                        value={profileForm.nok || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, nok: e.target.value }))
                        }
                    />

                    <Label htmlFor="nok_phone">Next of Kin Phone</Label>
                    <Input
                        id="nok_phone"
                        value={profileForm.nok_phone || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({
                                ...prev,
                                nok_phone: e.target.value,
                            }))
                        }
                    />

                    <Label htmlFor="gender">Gender</Label>
                    <Select
                        value={profileForm.gender || ""}
                        onValueChange={(value) =>
                            setProfileForm((prev) => ({ ...prev, gender: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="blood_type">Blood Type</Label>
                    <Select
                        value={profileForm.blood_type || ""}
                        onValueChange={(value) =>
                            setProfileForm((prev) => ({ ...prev, blood_type: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                        </SelectContent>
                    </Select>

                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                        id="allergies"
                        value={profileForm.allergies || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({ ...prev, allergies: e.target.value }))
                        }
                    />

                    <Label htmlFor="medical_conditions">Medical Conditions</Label>
                    <Textarea
                        id="medical_conditions"
                        value={profileForm.medical_conditions || ""}
                        onChange={(e) =>
                            setProfileForm((prev) => ({
                                ...prev,
                                medical_conditions: e.target.value,
                            }))
                        }
                    />

                    <div className="col-span-full text-right">
                        <Button onClick={() => onSave(profileForm)}>Save Changes</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientProfileForm;