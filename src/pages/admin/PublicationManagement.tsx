
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

const PublicationManagement = () => {
  const [publications, setPublications] = useState([
    {
      id: 1,
      title: "Advances in Cardiovascular Medicine",
      journal: "Journal of Cardiology",
      authors: ["Dr. Sarah Johnson", "Dr. Michael Chen"],
      publicationDate: "2024-01-15",
      doi: "10.1016/j.jacc.2024.01.001",
      url: "https://example.com/publication1",
      abstract: "This study examines the latest advances in cardiovascular treatment..."
    },
    {
      id: 2,
      title: "Diabetes Management in Modern Healthcare",
      journal: "Diabetes Care",
      authors: ["Dr. Sarah Johnson", "Dr. Lisa Wang"],
      publicationDate: "2023-12-10",
      doi: "10.2337/dc23-1234",
      url: "https://example.com/publication2",
      abstract: "A comprehensive review of diabetes management strategies..."
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingPublication, setEditingPublication] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    authors: '',
    publicationDate: '',
    doi: '',
    url: '',
    abstract: ''
  });

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const publicationData = {
      ...formData,
      authors: formData.authors.split(',').map(author => author.trim())
    };

    if (editingPublication) {
      setPublications(publications.map(pub => 
        pub.id === editingPublication.id 
          ? { ...pub, ...publicationData, id: editingPublication.id }
          : pub
      ));
      toast({
        title: "Publication Updated",
        description: "Publication has been successfully updated."
      });
    } else {
      const newPublication = {
        id: Date.now(),
        ...publicationData
      };
      setPublications([...publications, newPublication]);
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
      abstract: ''
    });
    setIsCreating(false);
    setEditingPublication(null);
  };

  const handleEdit = (publication: any) => {
    setEditingPublication(publication);
    setFormData({
      title: publication.title,
      journal: publication.journal,
      authors: publication.authors.join(', '),
      publicationDate: publication.publicationDate,
      doi: publication.doi,
      url: publication.url,
      abstract: publication.abstract
    });
    setIsCreating(true);
  };

  const handleDelete = (publicationId: number) => {
    setPublications(publications.filter(pub => pub.id !== publicationId));
    toast({
      title: "Publication Deleted",
      description: "Publication has been deleted successfully."
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Publication Management</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Publication
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingPublication ? 'Edit Publication' : 'Add New Publication'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="journal">Journal</Label>
                  <Input
                    id="journal"
                    value={formData.journal}
                    onChange={(e) => setFormData({...formData, journal: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input
                    id="publicationDate"
                    type="date"
                    value={formData.publicationDate}
                    onChange={(e) => setFormData({...formData, publicationDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="authors">Authors (comma separated)</Label>
                <Input
                  id="authors"
                  value={formData.authors}
                  onChange={(e) => setFormData({...formData, authors: e.target.value})}
                  placeholder="Dr. Jane Doe, Dr. John Smith"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={formData.doi}
                    onChange={(e) => setFormData({...formData, doi: e.target.value})}
                    placeholder="10.1016/j.example.2024.01.001"
                  />
                </div>

                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="https://example.com/publication"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  value={formData.abstract}
                  onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPublication ? 'Update Publication' : 'Add Publication'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {publications.map((publication) => (
          <Card key={publication.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{publication.title}</h3>
                  <div className="text-sm text-gray-600 mb-3">
                    <p><strong>Journal:</strong> {publication.journal}</p>
                    <p><strong>Authors:</strong> {publication.authors.join(', ')}</p>
                    <p><strong>Published:</strong> {publication.publicationDate}</p>
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
  );
};

export default PublicationManagement;
