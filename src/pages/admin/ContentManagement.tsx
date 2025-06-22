import React, { useState, useEffect, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/useContent';
import { Save, Eye, FileText, Image, Link, Settings, Home } from 'lucide-react';

const ContentManagement = () => {
    const { toast } = useToast();

    const {
        content,
        updateItem,
        deleteItem,
        addItem,
        editedIds,
        hasUnsavedChanges,
        resetEdits,
        isSaving,
        isDeleting
    } = useContent();


    const [activeTab, setActiveTab] = useState('home');
    const [searchTerm, setSearchTerm] = useState('');
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);
    const newItemRef = useRef<HTMLDivElement>(null);

    const pages = ['all', 'home', 'about', 'blog', 'publications', 'navigation'];

    const filteredContent = content.filter(item => {
        const matchesTab = activeTab === 'all' || item.page === activeTab;
        const matchesSearch =
            searchTerm === '' ||
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.section.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });


    const handleAddNewContent = (page: string) => {
        const newId = `${page}-${Date.now()}`;
        const newItem: ContentItem = {
            id: newId,
            type: 'text',
            page,
            section: 'New Section',
            label: 'New Content',
            value: 'Enter your content here...',
        };

        addItem(newItem);
        setLastAddedId(newId);
    };

    const handleSave = () => {
        resetEdits();
        toast({
            title: 'Changes Saved',
            description: 'All content changes have been saved.'
        });
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes('MAC');
            const meta = isMac ? e.metaKey : e.ctrlKey;
            if (meta && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [content]);

    useEffect(() => {
        if (newItemRef.current) {
            newItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newItemRef.current = null;
        }
    }, [content]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'text': return <FileText className="h-4 w-4" />;
            case 'image': return <Image className="h-4 w-4" />;
            case 'link': return <Link className="h-4 w-4" />;
            case 'button': return <Settings className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const hasEdits = editedIds.size > 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Content Management</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview Changes
                        </Button>

                        <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <Input
                            placeholder="Search content by label, value, or section..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-6">
                        {pages.map(page => (
                            <TabsTrigger key={page} value={page} className="capitalize">
                                {page === 'all' ? 'All Pages' : page}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {pages.map(page => (
                        <TabsContent key={page} value={page} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold capitalize">
                                    {page === 'all' ? 'All Content' : `${page} Page Content`}
                                </h2>
                                {page !== 'all' && (
                                    <Button variant="outline" size="sm" onClick={() => handleAddNewContent(page)}>
                                        Add New Content
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4">
                                {filteredContent.map(item => {
                                    const isNew = item.id === lastAddedId;
                                    return (
                                        <Card key={item.id} ref={isNew ? newItemRef : null}>
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg">
                                                    {getIcon(item.type)}
                                                    {item.label}
                                                    <span className="text-sm text-gray-500">({item.section})</span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor={`${item.id}-label`}>Label</Label>
                                                        <Input
                                                            id={`${item.id}-label`}
                                                            defaultValue={item.label}
                                                            autoFocus={isNew}
                                                            onBlur={(e) => updateItem(item.id, 'label', e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`${item.id}-section`}>Section</Label>
                                                        <Input
                                                            id={`${item.id}-section`}
                                                            defaultValue={item.section}
                                                            onBlur={(e) => updateItem(item.id, 'section', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <Label htmlFor={`${item.id}-value`}>Content</Label>
                                                    {item.type === 'text' ? (
                                                        <Textarea
                                                            id={`${item.id}-value`}
                                                            rows={3}
                                                            defaultValue={item.value}
                                                            onBlur={(e) => updateItem(item.id, 'value', e.target.value)}
                                                        />
                                                    ) : (
                                                        <Input
                                                            id={`${item.id}-value`}
                                                            defaultValue={item.value}
                                                            onBlur={(e) => updateItem(item.id, 'value', e.target.value)}
                                                        />
                                                    )}
                                                </div>

                                                {(item.type === 'link' || item.type === 'button') && (
                                                    <div>
                                                        <Label htmlFor={`${item.id}-href`}>URL</Label>
                                                        <Input
                                                            id={`${item.id}-href`}
                                                            defaultValue={item.href || ''}
                                                            onBlur={(e) => updateItem(item.id, 'href', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                {item.type === 'image' && (
                                                    <div>
                                                        <Label htmlFor={`${item.id}-alt`}>Alt Text</Label>
                                                        <Input
                                                            id={`${item.id}-alt`}
                                                            defaultValue={item.alt || ''}
                                                            onBlur={(e) => updateItem(item.id, 'alt', e.target.value)}
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-center pt-2">
                                                    <select
                                                        defaultValue={item.type}
                                                        onBlur={(e) => updateItem(item.id, 'type', e.target.value)}
                                                        className="px-3 py-1 border rounded-md text-sm"
                                                    >
                                                        <option value="text">Text</option>
                                                        <option value="image">Image</option>
                                                        <option value="link">Link</option>
                                                        <option value="button">Button</option>
                                                    </select>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteItem(item.id)}
                                                        disabled={isDeleting === item.id}
                                                    >
                                                        {isDeleting === item.id ? 'Deleting...' : 'Delete'}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                                {filteredContent.length === 0 && (
                                    <Card>
                                        <CardContent className="text-center py-8">
                                            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">No content found for this page.</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default ContentManagement;