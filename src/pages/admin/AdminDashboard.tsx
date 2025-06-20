
import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, BookOpen, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useAdminStats, useRecentAppointments, useRecentBlogPosts } from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useNavigate } from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {PaginationControls} from "@/components/ui/PaginationControls.tsx";



const AdminDashboard = () => {
  const { user, userRole } = useAuth();
  const [page, setPage] = useState(1);
  const { data: stats, isLoading: statsLoading, isError } = useAdminStats();
  const { data: recentAppointments = undefined, isLoading: appointmentsLoading } = useRecentAppointments(page);
  const { data: recentPosts = undefined, isLoading: postsLoading } = useRecentBlogPosts();
  const navigate = useNavigate();


  useEffect(() => {
    if (!["admin", "super_admin"].includes(userRole)) {
      navigate("/"); // Redirect non-admins to home
    }
  }, [userRole]);

  console.log('Rere run: ', recentAppointments, stats);

  const total: number = recentAppointments?.total;
  const limit: number = recentAppointments?.limit;
  const totalPages: number = Math.ceil(total / limit);


  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const statsData = [
    {
      title: 'Total Patients',
      value: statsLoading ? '...' : stats?.data?.totalAppointments?.toString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments Today',
      value: statsLoading ? '...' : stats?.data?.todayAppointments?.toString() || '0',
      change: '+5%',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Blog Posts',
      value: statsLoading ? '...' : stats?.data?.blogPosts?.toString() || '0',
      change: '+8%',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Publications',
      value: statsLoading ? '...' : stats?.data?.publications?.toString() || '0',
      change: '+2%',
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      title: 'Waiting List',
      value: statsLoading ? '...' : stats?.data?.waitingList?.toString() || '0',
      change: '-3%',
      icon: Clock,
      color: 'text-red-600'
    }
  ];

  if (isError) return <p>Error fetching data</p>;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to your medical practice management dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsData.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    Loading appointments...
                  </div>
              ) : recentAppointments?.data?.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No appointments scheduled for today</p>
                  </div>
              ) : (
                  <div>
                    <div className="space-y-4">
                      {recentAppointments?.data?.map((appointment) => (
                          <div key={appointment.id} className="border rounded-lg p-4 flex justify-between">
                            <div>
                              <h3 className="font-semibold">{appointment.reason || "Appointment"}</h3>
                              <p className="text-sm text-gray-500">{appointment.preferred_time}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{appointment.status || "scheduled"}</Badge>
                          </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    <PaginationControls
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(newPage) => setPage(newPage)}
                        isLoading={appointmentsLoading}
                    />
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Blog Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Loading blog posts...
                </div>
              ) : recentPosts?.data?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No blog posts available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts?.data?.map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-semibold">{post.title}</p>
                        <p className="text-sm text-gray-600">{formatDate(post.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status || 'draft'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
