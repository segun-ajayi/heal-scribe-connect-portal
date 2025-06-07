import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, UserCheck, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "admin" | "patient";
}

export const AuthModal = ({ isOpen, onClose, defaultTab = "patient" }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: ""
  });

  const { toast } = useToast();

  const authenticateUser = async (endpoint: string, payload: object) => {
    try {
      const response = await fetch(`https://iyawo-website-worker.mortalerror.workers.dev/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Authentication failed");

      return data;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return null;
    }
  };

  const handlePatientSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = isLogin ? "auth/login" : "auth/signup";
    const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, fullName: formData.fullName };

    const result = await authenticateUser(endpoint, payload);

    if (result) {
      toast({ title: "Success!", description: isLogin ? "Logged in!" : "Account created!" });

      if (isLogin) {
        localStorage.setItem("token", result.token); // ✅ Store JWT token

        // ✅ Decode JWT and get role
        const user = JSON.parse(atob(result.token.split(".")[1]));
        const isAdmin = user.role === "admin";
        console.log(isAdmin, 'segun');

        // ✅ Redirect based on role
        window.location.href = isAdmin ? "/admin/dashboard" : "/patient/dashboard";
      }

      onClose();
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear stored JWT
    window.location.href = "/login"; // Redirect to login
  };

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated!");
      return;
    }

    const response = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/auth/protected", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("Protected Data:", data);
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Patient
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Patient Login / Sign-up</CardTitle>
                  <CardDescription>Manage your patient account</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handlePatientSubmit(e, true)} className="space-y-4">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Label>Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Admin Login</CardTitle>
                  <CardDescription>Sign in to manage the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => handlePatientSubmit(e, true)} className="space-y-4">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />

                    <Label>Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Login"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
  );
};