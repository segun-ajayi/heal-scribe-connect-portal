
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import {BlogForm} from "@/components/admin/forms/BlogForm.tsx";

const BlogManagement = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Understanding Heart Health",
      excerpt: "A comprehensive guide to maintaining cardiovascular health...",
      status: "published",
      scheduledFor: null,
      publishedAt: "2024-01-15",
      created_at: "2024-01-15"
    },
    {
      id: 2,
      title: "Managing Diabetes",
      excerpt: "Tips and strategies for effective diabetes management...",
      status: "draft",
      scheduledFor: null,
      publishedAt: null
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    scheduledFor: ''
  });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };


  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      // Update existing post
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData, id: editingPost.id }
          : post
      ));
      toast({
        title: "Post Updated",
        description: "Blog post has been successfully updated."
      });
    } else {
      // Create new post
      const newPost = {
        id: Date.now(),
        ...formData,
        publishedAt: formData.status === 'published' ? new Date().toISOString().split('T')[0] : null
      };
      setPosts([...posts, newPost]);
      toast({
        title: "Post Created",
        description: "New blog post has been created successfully."
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      scheduledFor: ''
    });
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt,
      status: post.status,
      scheduledFor: post.scheduledFor || ''
    });
    setIsCreating(true);
  };

  const handleDelete = (postId: number) => {
    setPosts(posts.filter(post => post.id !== postId));
    toast({
      title: "Post Deleted",
      description: "Blog post has been deleted successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {isCreating && (
            <Card>
              <CardHeader>
                <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
              </CardHeader>
              <CardContent>
                <BlogForm
                    formData={formData}
                    onChange={setFormData}
                    onSubmit={handleSubmit}
                    onCancel={resetForm}
                    isEditing={!!editingPost}
                />
              </CardContent>
            </Card>
        )}

        <div className="grid gap-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' :
                        post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {post.status}
                      </span>
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Published: {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {post.scheduledFor && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Scheduled: {formatDate(post.scheduledFor)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogManagement;
