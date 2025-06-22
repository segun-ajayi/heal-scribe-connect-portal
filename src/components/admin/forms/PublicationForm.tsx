import React, {useState} from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


import "react-quill/dist/quill.snow.css";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {toast} from "@/hooks/use-toast.ts";


interface PublicationFormProps {
    formData: {
        title: string;
        journal: string;
        publicationDate: string;
        authors: string;
        doi: string;
        url: string;
        category: string;
        keywords: string;
        abstract: string;
    };
    handleSubmit: (e: React.FormEvent) => void;
    setFormData: (p: {
        title: string;
        journal: string;
        publicationDate: string;
        authors: string;
        doi: string;
        url: string;
        category: string;
        keywords: string;
        abstract: string
    }) => void;
    editingPublication: boolean;
    resetForm: () => void;
    onCategoryAdded: () => void;
    categories: {
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
    }[];
}

export const PublicationForm = ({
                                    formData,
                                    handleSubmit,
                                    setFormData,
                                    editingPublication,
                                    resetForm,
                                    categories,
                                    onCategoryAdded
                         }: PublicationFormProps) => {
    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [newCategory, setNewCategory] = useState(null);
    const { authFetch } = useAuth();

    const handleAddCategory = async () => {
        if (!newCategory) {
            toast({
                title: "Please fill out the field",
                description: "New category cannot be empty",
                variant: "destructive",
            });
            return;
        }


        try {
            await authFetch(
                `${import.meta.env.VITE_API_URL}/api/admin/category`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: newCategory,
                        type: 'publication'
                    }),
                }
            );

            toast({
                title: "Publication category created successfully",
                description: "Publication category has been successfully created.",
            });
            setShowCategoryInput(false);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 1500); // delays reload by 3 seconds
            // onCategoryAdded();

        } catch (error) {
            toast({
                title: "Failed to add category",
                description: error?.message || "Publication category creation failed!",
                variant: "destructive",
            });
        }
    }

    return (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.slug}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Inline create button */}
                    <div className="mt-2 text-sm">
                        <button
                            type="button"
                            onClick={() => setShowCategoryInput(true)}
                            className="text-blue-600 hover:underline"
                        >
                            + Create new category
                        </button>
                    </div>

                    {/* Inline input field */}
                    {showCategoryInput && (
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="New category name"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="border px-2 py-1 rounded w-full"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="px-3 py-1 bg-blue-500 text-white rounded"
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <Label htmlFor="url">Keywords (Comma separated)</Label>
                    <Input
                        id="keywords"
                        type="keywords"
                        value={formData.keywords}
                        onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                        placeholder="Keywords"
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
    );
};