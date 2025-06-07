import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/AuthContext.tsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem("token", data.token);

      // ✅ Decode JWT and get role
      const user = JSON.parse(atob(data.token.split(".")[1]));
      const isAdmin = user.role === "admin";

      // ✅ Redirect based on role
      navigate(isAdmin ? "/admin/dashboard" : "/patient/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }

    setIsLoading(false);
  };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
            <CardDescription>
              Sign in to access the appointment management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
                  <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                  <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                  to="/reset-password"
                  className="text-sm text-blue-600 hover:text-blue-800"
              >
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Login;
