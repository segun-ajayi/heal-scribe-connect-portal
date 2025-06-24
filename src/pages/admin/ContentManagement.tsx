import React, { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Save, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/hooks/useContent";
import { ContentCard } from "@/components/admin/content/ContentCard";

const ContentManagement = () => {
    const { toast } = useToast();
    const {
        content = [],
        updateItem,
        deleteItem,
        addItem,
        editedIds,
        hasUnsavedChanges,
        resetEdits,
        isSaving,
        isDeleting,
    } = useContent();

    const [activeTab, setActiveTab] = useState("home");
    const [searchTerm, setSearchTerm] = useState("");
    const [lastAddedId, setLastAddedId] = useState<string | null>(null);
    const newItemRef = useRef<HTMLDivElement>(null);

    const pages = ["all", "home", "about", "blog", "publications", "navigation"];

    const filteredContent = Array.isArray(content)
        ? content.filter((item) => {
            const matchesTab = activeTab === "all" || item.page === activeTab;
            const matchesSearch =
                searchTerm === "" ||
                item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.section.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        })
        : [];

    const handleAddNewContent = (page: string) => {
        const newId = `${page}-${Date.now()}`;
        addItem({
            id: newId,
            type: "text",
            page,
            section: "New Section",
            label: "New Content",
            value: "Enter your content here...",
        });
        setLastAddedId(newId);
    };

    const handleSave = () => {
        resetEdits();
        toast({
            title: "Changes Saved",
            description: "All content changes have been saved.",
        });
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            if ((isMac ? e.metaKey : e.ctrlKey) && e.key === "s") {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [content]);

    useEffect(() => {
        if (newItemRef.current) {
            newItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            newItemRef.current = null;
        }
    }, [content]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Content Management</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview Changes
                        </Button>
                        <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? "Saving..." : "Save Changes"}
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
                        {pages.map((page) => (
                            <TabsTrigger key={page} value={page} className="capitalize">
                                {page === "all" ? "All Pages" : page}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {pages.map((page) => (
                        <TabsContent key={page} value={page} className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold capitalize">
                                    {page === "all" ? "All Content" : `${page} Page Content`}
                                </h2>
                                {page !== "all" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddNewContent(page)}
                                    >
                                        Add New Content
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-4">
                                {filteredContent.map((item) => {
                                    const isNew = item.id === lastAddedId;
                                    return (
                                        <div key={item.id} ref={isNew ? newItemRef : null}>
                                            <ContentCard
                                                item={item}
                                                isEdited={editedIds.has(item.id)}
                                                isSaving={isSaving}
                                                isDeleting={isDeleting === item.id}
                                                updateItem={updateItem}
                                                deleteItem={deleteItem}
                                            />
                                        </div>
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