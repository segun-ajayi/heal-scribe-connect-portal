import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import {PublicationForm} from "@/components/admin/forms/PublicationForm.tsx";
import {useMyPublications} from "@/hooks/useAdminData.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";

const PublicationManagement = () => {
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState('all');
  const { user, userRole, authFetch } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPublications = () => {
    setRefreshKey(prev => prev + 1);
  };

  const { data: publications, isLoading: isLoading } = useMyPublications(page, categories, refreshKey);


  const [isCreating, setIsCreating] = useState(false);
  const [editingPublication, setEditingPublication] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    authors: '',
    publicationDate: '',
    doi: '',
    url: '',
    category: '',
    keywords: '',
    abstract: ''
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPublication) {
      formData['id'] = editingPublication.id;
      try {
        try {
          await authFetch(
              `${import.meta.env.VITE_API_URL}/api/admin/publications`,
              {
                method: "PUT",
                body: JSON.stringify(formData),
              }
          );

          toast({
            title: "Publication updated successfully 👌",
            description: "Publication has been successfully updated. 😁",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500); // delays reload by 3 seconds

        } catch (error) {
          toast({
            title: "Failed to update uublication",
            description: error?.message || "Publication update failed!",
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
        title: "Publication Updated",
        description: "Publication has been successfully updated."
      });
    } else {
      try {
        try {
          await authFetch(
              `${import.meta.env.VITE_API_URL}/api/admin/publications`,
              {
                method: "POST",
                body: JSON.stringify(formData),
              }
          );

          toast({
            title: "Publication post created successfully",
            description: "Publication post has been successfully created.",
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500); // delays reload by 3 seconds

        } catch (error) {
          toast({
            title: "Failed to update publication",
            description: error?.message || "Publication update failed!",
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

      toast({
        title: "Publication Created",
        description: "New publication has been added successfully."
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      journal: '',
      authors: '',
      publicationDate: '',
      doi: '',
      url: '',
      category: '',
      keywords: '',
      abstract: ''
    });
    setIsCreating(false);
    setEditingPublication(null);
  };

  const handleEdit = (publication) => {
    setEditingPublication(publication);

    setFormData({
      title: publication.title,
      journal: publication.journal,
      authors: publication.authors,
      publicationDate: publication.published_at,
      doi: publication.doi,
      url: publication.url,
      category: publication.category.toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-') // replace spaces and non-word characters with hyphen
          .replace(/^-+|-+$/g, ''),
      keywords: publication.keywords,
      abstract: publication.abstract
    });
    setIsCreating(true);
  };

  const handleDelete = (publicationId: number) => {

    toast({
      title: "Publication Deleted",
      description: "Publication has been deleted successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Publication Management</h1>
          <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Publication
          </Button>
        </div>

        {isCreating && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</CardTitle>
            </CardHeader>
            <CardContent>
              <PublicationForm
                  formData={formData}
                  handleSubmit = {handleSubmit}
                  setFormData = {setFormData}
                  editingPublication = {editingPublication}
                  resetForm = {resetForm}
                  categories = {publications.categories}
                  onCategoryAdded={refreshPublications}
                  />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {publications?.data?.map((publication) => (
            <Card key={publication.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{publication.title}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p><strong>Journal:</strong> {publication.journal}</p>
                      <p><strong>Authors:</strong> {publication.authors}</p>
                      <p><strong>Published:</strong> {publication.published_at}</p>
                      {publication.doi && <p><strong>DOI:</strong> {publication.doi}</p>}
                    </div>
                    {publication.abstract && (
                      <p className="text-gray-700 mb-4">{publication.abstract}</p>
                    )}
                    {publication.url && (
                      <a 
                        href={publication.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Publication
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(publication)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(publication.id)}
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

export default PublicationManagement;
