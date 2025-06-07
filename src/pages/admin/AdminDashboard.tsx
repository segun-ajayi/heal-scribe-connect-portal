import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, BookOpen, Clock, Loader2 } from 'lucide-react';
import { useAdminStats, useRecentAppointments, useRecentBlogPosts } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';

const AdminDashboard = () => {

  const { user, loading, fetchUser } = useAuth() ?? {};

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentAppointments = [], isLoading: appointmentsLoading } = useRecentAppointments();
  const { data: recentPosts = [], isLoading: postsLoading } = useRecentBlogPosts();

  const navigate = useNavigate();

  // ✅ Ensure authentication before loading dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser(); // Refresh session on load
    } else {
      console.log('No token found, redirecting to login...');
      navigate('/login');
    }
  }, [fetchUser, navigate]);
  if (loading) {
    return <p>Loading...</p>; // Prevent UI flash before authentication check
  }
  console.log(user);
  if (!user) {
    return (
        <div className="container mx-auto py-8 px-4 text-center">
          <p>Please log in to access the admin dashboard.</p>
          <button onClick={() => navigate('/login')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </button>
        </div>
    );
  }

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const statsData = [
    {
      title: 'Total Patients',
      value: statsLoading ? '...' : stats?.totalPatients?.toString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Appointments Today',
      value: statsLoading ? '...' : stats?.todayAppointments?.toString() || '0',
      change: '+5%',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Blog Posts',
      value: statsLoading ? '...' : stats?.blogPosts?.toString() || '0',
      change: '+8%',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Publications',
      value: statsLoading ? '...' : stats?.publications?.toString() || '0',
      change: '+2%',
      icon: BookOpen,
      color: 'text-orange-600',
    },
    {
      title: 'Waiting List',
      value: statsLoading ? '...' : stats?.waitingList?.toString() || '0',
      change: '-3%',
      icon: Clock,
      color: 'text-red-600',
    },
  ];

  return (
      <AdminLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back, {user.email}!</p>
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

          {/* Appointments & Blog Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading appointments...
                    </div>
                ) : recentAppointments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No appointments scheduled for today</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {recentAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-semibold">Patient ID: {appointment.patient_id}</p>
                              <p className="text-sm text-gray-600">{appointment.reason || 'Appointment'}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatTime(appointment.time)}</p>
                              <Badge variant="outline" className="mt-1">{appointment.status || 'scheduled'}</Badge>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </CardContent>
            </Card>

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
                ) : recentPosts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No blog posts available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                      {recentPosts.map((post) => (
                          <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-semibold">{post.title}</p>
                              <p className="text-sm text-gray-600">{formatDate(post.created_at)}</p>
                            </div>
                            <Badge className={post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {post.status || 'draft'}
                            </Badge>
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