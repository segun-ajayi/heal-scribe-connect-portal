import React from "react";
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
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";


interface BlogFormProps {
    formData: {
        author: string;
        title: string;
        content: string;
        excerpt: string;
        status: string;
        category: string;
        scheduledFor: string;
    };
    onChange: (data: BlogFormProps["formData"]) => void;
    onCancel: () => void;
    onSubmit: (e: React.FormEvent) => void;
    isEditing?: boolean;
}

export const BlogForm = ({
                             formData,
                             onChange,
                             onCancel,
                             onSubmit,
                             isEditing = false
                         }: BlogFormProps) => {
    const plainContent = formData.content.replace(/<[^>]+>/g, "");
    const contentWordCount = plainContent.trim().split(/\s+/).filter(Boolean).length;
    const excerptWordCount = formData.excerpt.trim().split(/\s+/).filter(Boolean).length;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Author</Label>
                <Input
                    id="title"
                    value={formData.author}
                    onChange={(e) => onChange({ ...formData, author: e.target.value })}
                    required
                />
            </div>
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => onChange({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <ReactQuill
                    value={formData.excerpt}
                    onChange={(value) => onChange({ ...formData, excerpt: value })}
                    theme="snow"
                />
                <div className="text-xs text-muted-foreground mt-1">
                    {excerptWordCount} word{excerptWordCount !== 1 && "s"} (Max 300 characters)
                </div>
            </div>


            <div>
                <Label htmlFor="content">Content</Label>
                <ReactQuill
                    value={formData.content}
                    onChange={(value) => onChange({ ...formData, content: value })}
                    theme="snow"
                />
                <div className="text-xs text-muted-foreground mt-1">
                    {contentWordCount} word{contentWordCount !== 1 && "s"}
                    {contentWordCount < 100 && (
                        <span className="text-red-500 ml-2">Min. 100 recommended</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="status">Category</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => onChange({ ...formData, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value) => onChange({ ...formData, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {formData.status === "scheduled" && (
                    <div>
                        <Label htmlFor="scheduledFor">Schedule For</Label>
                        <Input
                            id="scheduledFor"
                            type="datetime-local"
                            value={formData.scheduledFor}
                            onChange={(e) =>
                                onChange({ ...formData, scheduledFor: e.target.value })
                            }
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                <Button type="submit">{isEditing ? "Update Post" : "Create Post"}</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};