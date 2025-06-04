
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, FileText, BookOpen, Clock, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Appointments Today',
      value: '24',
      change: '+5%',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Blog Posts',
      value: '45',
      change: '+8%',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      title: 'Publications',
      value: '12',
      change: '+2%',
      icon: BookOpen,
      color: 'text-orange-600'
    },
    {
      title: 'Waiting List',
      value: '18',
      change: '-3%',
      icon: Clock,
      color: 'text-red-600'
    }
  ];

  const recentAppointments = [
    { id: 1, patient: 'John Smith', time: '10:00 AM', type: 'Consultation' },
    { id: 2, patient: 'Sarah Johnson', time: '11:30 AM', type: 'Follow-up' },
    { id: 3, patient: 'Mike Davis', time: '2:00 PM', type: 'Check-up' },
    { id: 4, patient: 'Emily Brown', time: '3:30 PM', type: 'Consultation' }
  ];

  const recentPosts = [
    { id: 1, title: 'Understanding Heart Health', status: 'Published', date: '2024-01-15' },
    { id: 2, title: 'Managing Diabetes', status: 'Draft', date: '2024-01-14' },
    { id: 3, title: 'Healthy Eating Tips', status: 'Scheduled', date: '2024-01-16' }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to your medical practice management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat) => (
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
              <Calendar className="w-5 h-5" />
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{post.title}</p>
                    <p className="text-sm text-gray-600">{post.date}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'Published' ? 'bg-green-100 text-green-800' :
                      post.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
