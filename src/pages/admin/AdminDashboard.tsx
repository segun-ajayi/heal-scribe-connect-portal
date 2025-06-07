import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, BookOpen, Clock, Loader2 } from "lucide-react";
import { useAdminStats, useRecentAppointments, useRecentBlogPosts } from "@/hooks/useAdminData";
import { Badge } from "@/components/ui/badge";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const { user, fetchUser, isLoading } = useAuth(); // ✅ Ensure isLoading is included
  const navigate = useNavigate();

  useEffect(() => {
      const token = localStorage.getItem("token");
      console.log("Checking for token...");

      if (token) {
          console.log("Token found, calling fetchUser...");
          fetchUser()
              .then(() => console.log("User after fetchUser:", user))
              .catch((err) => console.error("fetchUser Error:", err));
      } else {
          console.log("No token found, redirecting to login...");
          navigate("/login");
      }

  }, [fetchUser, navigate]);

  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: recentAppointments = [], isLoading: appointmentsLoading } = useRecentAppointments();
  const { data: recentPosts = [], isLoading: postsLoading } = useRecentBlogPosts();

  if (isLoading || statsLoading || appointmentsLoading || postsLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <p>Loading...</p>
        </div>
    );
  }

  if (statsError) {
    console.error("Stats API Error:", statsError);
    return <p>Error loading stats. Please try again.</p>;
  }

  if (!user) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
          <p>Please log in to access the admin dashboard.</p>
          <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </div>
    );
  }

  return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, {user.email}!</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {stats &&
                [
                  { title: "Total Patients", value: stats?.totalPatients, icon: Users },
                  { title: "Appointments Today", value: stats?.todayAppointments, icon: Calendar },
                  { title: "Blog Posts", value: stats?.blogPosts, icon: FileText },
                  { title: "Publications", value: stats?.publications, icon: BookOpen },
                  { title: "Waiting List", value: stats?.waitingList, icon: Clock },
                ].map(({ title, value, icon: Icon }) => (
                    <Card key={title}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">{title}</p>
                            <p className="text-2xl font-bold">{value || "0"}</p>
                          </div>
                          <Icon className="w-8 h-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                ))}
          </div>
        </div>
      </AdminLayout>
  );
};

export default AdminDashboard;