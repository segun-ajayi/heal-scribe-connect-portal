import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, Eye, Settings, FileText, Image, Link, Home } from 'lucide-react';

interface ContentItem {
    id: string;
    type: 'text' | 'image' | 'link' | 'button';
    page: string;
    section: string;
    label: string;
    value: string;
    alt?: string;
    href?: string;
}

const ContentManagement = () => {
    const [content, setContent] = useState<ContentItem[]>([]);
    const [activeTab, setActiveTab] = useState('home');
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    // Load content from localStorage on component mount
    useEffect(() => {
        const savedContent = JSON.parse(localStorage.getItem('websiteContent') || '[]');
        if (savedContent.length === 0) {
            // Initialize with default content structure
            const defaultContent: ContentItem[] = [
                // Home page content
                {
                    id: 'home-hero-title',
                    type: 'text',
                    page: 'home',
                    section: 'Hero',
                    label: 'Main Title',
                    value: 'Leading General Surgeon'
                },
                {
                    id: 'home-hero-subtitle',
                    type: 'text',
                    page: 'home',
                    section: 'Hero',
                    label: 'Subtitle',
                    value: 'Dr. Funmilola Wuraola is a distinguished General Surgeon at Obafemi Awolowo University Teaching Hospitals Complex, Ile-Ife, dedicated to providing exceptional surgical care through innovative techniques and compassionate patient treatment.'
                },
                {
                    id: 'home-hero-cta1',
                    type: 'button',
                    page: 'home',
                    section: 'Hero',
                    label: 'Primary CTA Button',
                    value: 'Schedule Consultation',
                    href: '/appointments'
                },
                {
                    id: 'home-hero-cta2',
                    type: 'button',
                    page: 'home',
                    section: 'Hero',
                    label: 'Secondary CTA Button',
                    value: 'Learn More',
                    href: '/about'
                },
                {
                    id: 'home-stats-experience',
                    type: 'text',
                    page: 'home',
                    section: 'Statistics',
                    label: 'Years of Experience',
                    value: '15+'
                },
                {
                    id: 'home-stats-surgeries',
                    type: 'text',
                    page: 'home',
                    section: 'Statistics',
                    label: 'Successful Surgeries',
                    value: '2,500+'
                },
                {
                    id: 'home-stats-publications',
                    type: 'text',
                    page: 'home',
                    section: 'Statistics',
                    label: 'Research Publications',
                    value: '50+'
                },
                {
                    id: 'home-stats-awards',
                    type: 'text',
                    page: 'home',
                    section: 'Statistics',
                    label: 'Awards Received',
                    value: '12'
                },
                // About page content
                {
                    id: 'about-main-title',
                    type: 'text',
                    page: 'about',
                    section: 'Header',
                    label: 'Doctor Name & Credentials',
                    value: 'Dr. Funmilola Wuraola, MBBS, FWACS, FMPCS'
                },
                {
                    id: 'about-position',
                    type: 'text',
                    page: 'about',
                    section: 'Header',
                    label: 'Position Title',
                    value: 'Senior Consultant General Surgeon'
                },
                // Blog page content
                {
                    id: 'blog-main-title',
                    type: 'text',
                    page: 'blog',
                    section: 'Header',
                    label: 'Page Title',
                    value: 'Medical Insights & Research'
                },
                {
                    id: 'blog-subtitle',
                    type: 'text',
                    page: 'blog',
                    section: 'Header',
                    label: 'Page Subtitle',
                    value: 'Stay informed with the latest developments in cardiovascular medicine, patient care insights, and evidence-based medical research from Dr. Mitchell and the broader medical community.'
                },
                // Publications page content
                {
                    id: 'publications-title',
                    type: 'text',
                    page: 'publications',
                    section: 'Header',
                    label: 'Page Title',
                    value: 'Research Publications'
                },
                // Navigation links
                {
                    id: 'nav-home',
                    type: 'link',
                    page: 'navigation',
                    section: 'Main Menu',
                    label: 'Home Link',
                    value: 'Home',
                    href: '/'
                },
                {
                    id: 'nav-about',
                    type: 'link',
                    page: 'navigation',
                    section: 'Main Menu',
                    label: 'About Link',
                    value: 'About',
                    href: '/about'
                },
                {
                    id: 'nav-publications',
                    type: 'link',
                    page: 'navigation',
                    section: 'Main Menu',
                    label: 'Publications Link',
                    value: 'Publications',
                    href: '/publications'
                },
                {
                    id: 'nav-blog',
                    type: 'link',
                    page: 'navigation',
                    section: 'Main Menu',
                    label: 'Blog Link',
                    value: 'Blog',
                    href: '/blog'
                },
                {
                    id: 'nav-appointments',
                    type: 'link',
                    page: 'navigation',
                    section: 'Main Menu',
                    label: 'Appointments Link',
                    value: 'Appointments',
                    href: '/appointments'
                }
            ];
            setContent(defaultContent);
            localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
        } else {
            setContent(savedContent);
        }
    }, []);

    const updateContent = (id: string, field: string, value: string) => {
        const updatedContent = content.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setContent(updatedContent);
    };

    const saveChanges = () => {
        localStorage.setItem('websiteContent', JSON.stringify(content));
        toast({
            title: "Changes Saved",
            description: "All content changes have been saved successfully."
        });
    };

    const addNewContent = (page: string) => {
        const newId = `${page}-${Date.now()}`;
        const newItem: ContentItem = {
            id: newId,
            type: 'text',
            page: page,
            section: 'New Section',
            label: 'New Content',
            value: 'Enter your content here...'
        };
        setContent([...content, newItem]);
    };

    const deleteContent = (id: string) => {
        setContent(content.filter(item => item.id !== id));
        toast({
            title: "Content Deleted",
            description: "The content item has been removed."
        });
    };

    const filteredContent = content.filter(item => {
        const matchesTab = activeTab === 'all' || item.page === activeTab;
        const matchesSearch = searchTerm === '' ||
            item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.section.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const pages = ['all', 'home', 'about', 'blog', 'publications', 'navigation'];

    const getIcon = (type: string) => {
        switch (type) {
            case 'text': return <FileText className="h-4 w-4" />;
            case 'image': return <Image className="h-4 w-4" />;
            case 'link': return <Link className="h-4 w-4" />;
            case 'button': return <Settings className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

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
                        <Button onClick={saveChanges}>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search content by label, value, or section..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Content Tabs */}
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addNewContent(page)}
                                    >
                                        Add New Content
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4">
                                {filteredContent.map(item => (
                                    <Card key={item.id}>
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
                                                        value={item.label}
                                                        onChange={(e) => updateContent(item.id, 'label', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`${item.id}-section`}>Section</Label>
                                                    <Input
                                                        id={`${item.id}-section`}
                                                        value={item.section}
                                                        onChange={(e) => updateContent(item.id, 'section', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label htmlFor={`${item.id}-value`}>Content</Label>
                                                {item.type === 'text' ? (
                                                    <Textarea
                                                        id={`${item.id}-value`}
                                                        value={item.value}
                                                        onChange={(e) => updateContent(item.id, 'value', e.target.value)}
                                                        rows={3}
                                                    />
                                                ) : (
                                                    <Input
                                                        id={`${item.id}-value`}
                                                        value={item.value}
                                                        onChange={(e) => updateContent(item.id, 'value', e.target.value)}
                                                    />
                                                )}
                                            </div>

                                            {(item.type === 'link' || item.type === 'button') && (
                                                <div>
                                                    <Label htmlFor={`${item.id}-href`}>URL</Label>
                                                    <Input
                                                        id={`${item.id}-href`}
                                                        value={item.href || ''}
                                                        onChange={(e) => updateContent(item.id, 'href', e.target.value)}
                                                        placeholder="https://example.com or /page"
                                                    />
                                                </div>
                                            )}

                                            {item.type === 'image' && (
                                                <div>
                                                    <Label htmlFor={`${item.id}-alt`}>Alt Text</Label>
                                                    <Input
                                                        id={`${item.id}-alt`}
                                                        value={item.alt || ''}
                                                        onChange={(e) => updateContent(item.id, 'alt', e.target.value)}
                                                        placeholder="Description for accessibility"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-2">
                                                <div className="flex gap-2">
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => updateContent(item.id, 'type', e.target.value)}
                                                        className="px-3 py-1 border rounded-md text-sm"
                                                    >
                                                        <option value="text">Text</option>
                                                        <option value="image">Image</option>
                                                        <option value="link">Link</option>
                                                        <option value="button">Button</option>
                                                    </select>
                                                </div>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => deleteContent(item.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

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