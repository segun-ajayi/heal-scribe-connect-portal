import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, UserCheck, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const { toast } = useToast();
  const { signIn, signUp, isLoading } = useAuth();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let response;
    if (isLogin) {
      response = await signIn(formData.email, formData.password);
    } else {
      response = await signUp(formData.email, formData.password, formData.fullName, "patient");
    }

    if (response.error) {
      toast({ title: "Authentication Failed", description: response.error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: isLogin ? "Logged in!" : "Account created." });
      onClose();
    }
  };

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Authentication</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient" onClick={() => setIsLogin(true)}>
                <Users className="w-4 h-4" /> Patient
              </TabsTrigger>
              <TabsTrigger value="admin" onClick={() => setIsLogin(true)}>
                <UserCheck className="w-4 h-4" /> Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patient">
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                          id="fullName"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                      />
                    </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Processing..." : isLogin ? "Sign In" : "Register"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-blue-600 hover:text-blue-800">
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
  );
};