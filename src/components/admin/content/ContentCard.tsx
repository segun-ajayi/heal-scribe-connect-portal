import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Image as ImageIcon, Link as LinkIcon, Settings, Loader2, Check } from "lucide-react";
import { marked } from "marked";
import { MediaPicker } from "./MediaPicker"; // Adjust path if needed

interface ContentItem {
    id: string;
    type: "text" | "image" | "link" | "button";
    page: string;
    section: string;
    label: string;
    value: string;
    alt?: string;
    href?: string;
}

interface ContentCardProps {
    item: ContentItem;
    isEdited: boolean;
    isSaving: boolean;
    isDeleting: boolean;
    updateItem: (id: string, field: string, value: string) => void;
    deleteItem: (id: string) => void;
}

export const ContentCard = ({
                                item,
                                isEdited,
                                isSaving,
                                isDeleting,
                                updateItem,
                                deleteItem,
                            }: ContentCardProps) => {
    const getIcon = (type: string) => {
        switch (type) {
            case "text": return <FileText className="w-4 h-4" />;
            case "image": return <ImageIcon className="w-4 h-4" />;
            case "link": return <LinkIcon className="w-4 h-4" />;
            case "button": return <Settings className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-2 flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-lg">
                    {getIcon(item.type)}
                    {item.label}
                    <span className="text-sm text-muted-foreground">({item.section})</span>
                </CardTitle>
                <span className="text-sm">
          {isEdited ? (
              <span className="text-yellow-500 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Unsaved
            </span>
          ) : (
              <span className="text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </span>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label>Label</Label>
                        <Input
                            defaultValue={item.label}
                            onBlur={(e) => updateItem(item.id, "label", e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Section</Label>
                        <Input
                            defaultValue={item.section}
                            onBlur={(e) => updateItem(item.id, "section", e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <Label>Content</Label>
                    {item.type === "text" ? (
                        <Tabs defaultValue="edit" className="mt-2">
                            <TabsList>
                                <TabsTrigger value="edit">Edit</TabsTrigger>
                                <TabsTrigger value="preview">Preview</TabsTrigger>
                            </TabsList>
                            <TabsContent value="edit">
                                <Textarea
                                    rows={4}
                                    defaultValue={item.value}
                                    onBlur={(e) => updateItem(item.id, "value", e.target.value)}
                                />
                            </TabsContent>
                            <TabsContent value="preview">
                                <div
                                    className="prose max-w-none mt-2"
                                    dangerouslySetInnerHTML={{ __html: marked(item.value || "") }}
                                />
                            </TabsContent>
                        </Tabs>
                    ) : item.type === "image" ? (
                        <MediaPicker
                            existingUrl={item.value}
                            alt={item.alt}
                            onUpload={(url) => updateItem(item.id, "value", url)}
                        />
                    ) : (
                        <Input
                            defaultValue={item.value}
                            onBlur={(e) => updateItem(item.id, "value", e.target.value)}
                        />
                    )}
                </div>

                {(item.type === "link" || item.type === "button") && (
                    <div>
                        <Label>URL</Label>
                        <Input
                            defaultValue={item.href || ""}
                            onBlur={(e) => updateItem(item.id, "href", e.target.value)}
                        />
                    </div>
                )}

                {item.type === "image" && (
                    <div>
                        <Label>Alt Text</Label>
                        <Input
                            defaultValue={item.alt || ""}
                            onBlur={(e) => updateItem(item.id, "alt", e.target.value)}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center pt-2">
                    <select
                        defaultValue={item.type}
                        onBlur={(e) => updateItem(item.id, "type", e.target.value)}
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
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};