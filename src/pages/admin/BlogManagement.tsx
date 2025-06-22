
import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import {BlogForm} from "@/components/admin/forms/BlogForm.tsx";
import { useAuth } from '@/contexts/AuthContext';
import {useRecentBlogPosts} from "@/hooks/useAdminData.ts";
import SafeHtml from "@/components/ui/safe-html.tsx";

const BlogManagement = () => {
  const [page, setPage] = useState(1);

  const {data: posts, isLoading: isLoading} = useRecentBlogPosts(page)
  const { user, userRole, authFetch } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    author: user.fullName,
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    scheduledFor: ''
  });

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };


  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      formData['id'] = editingPost.id;
      // Update existing post
      try {
        try {
          await authFetch(
              `${import.meta.env.VITE_API_URL}/api/admin/blogs`,
              {
                method: "PUT",
                body: JSON.stringify(formData),
              }
          );

          toast({
            title: "Blog post updated successfully 👌",
            description: "Blog post has been successfully updated. 😁",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500); // delays reload by 3 seconds

        } catch (error) {
          toast({
            title: "Failed to update blog",
            description: error?.message || "Blog update failed!",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while updating!.",
          variant: "destructive"
        });
      }
      toast({
        title: "Post Updated",
        description: "Blog post has been successfully updated."
      });
    } else {
      // Create new post
      try {
        try {
          await authFetch(
              `${import.meta.env.VITE_API_URL}/api/admin/blogs`,
              {
                method: "POST",
                body: JSON.stringify(formData),
              }
          );

          toast({
            title: "Blog post created successfully",
            description: "Blog post has been successfully created.",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500); // delays reload by 3 seconds

        } catch (error) {
          toast({
            title: "Failed to update blog",
            description: error?.message || "Blog update failed!",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "An error occurred while creating blog. 😢😢😢.",
          variant: "destructive"
        });
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      author: '',
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category: '',
      scheduledFor: ''
    });
    setIsCreating(false);
    setEditingPost(null);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      author: post.author,
      title: post.title,
      content: post.content || '',
      excerpt: post.excerpt,
      status: post.status,
      category: post.category,
      scheduledFor: post.scheduledFor || ''
    });
    setIsCreating(true);
  };

  const handleDelete = (postId: number) => {
    // setPosts(posts.filter(post => post.id !== postId));
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
          {posts?.data?.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <SafeHtml html={post.excerpt} className="text-gray-600 mb-4" />
                    <p className="text-gray-600 mb-4">{post.author}</p>
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
