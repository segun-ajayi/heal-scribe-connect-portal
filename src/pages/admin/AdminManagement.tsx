
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, User, Shield } from 'lucide-react';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      email: 'admin@example.com',
      fullName: 'Super Admin',
      role: 'super_admin',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      email: 'editor@example.com',
      fullName: 'Content Editor',
      role: 'admin',
      createdAt: '2024-01-15'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call the Supabase auth API
    const newAdmin = {
      id: Date.now(),
      ...formData,
      role: 'admin',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAdmins([...admins, newAdmin]);
    toast({
      title: "Admin Created",
      description: `Admin account for ${formData.email} has been created successfully.`
    });

    setFormData({ email: '', fullName: '', password: '' });
    setIsCreating(false);
  };

  const handleDelete = (adminId: number) => {
    setAdmins(admins.filter(admin => admin.id !== adminId));
    toast({
      title: "Admin Removed",
      description: "Admin account has been removed successfully."
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Admin
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Admin</Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {admins.map((admin) => (
          <Card key={admin.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    {admin.role === 'super_admin' ? 
                      <Shield className="w-5 h-5 text-blue-600" /> :
                      <User className="w-5 h-5 text-blue-600" />
                    }
                  </div>
                  <div>
                    <h3 className="font-semibold">{admin.fullName}</h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-xs text-gray-500">
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'} • Created: {admin.createdAt}
                    </p>
                  </div>
                </div>
                {admin.role !== 'super_admin' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminManagement;
