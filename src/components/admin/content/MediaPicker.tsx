import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface MediaPickerProps {
    onUpload: (url: string) => void;
    existingUrl?: string;
    alt?: string;
}

export const MediaPicker = ({ onUpload, existingUrl, alt }: MediaPickerProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState(existingUrl || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const form = new FormData();
            form.append("file", file);
            const token = localStorage.getItem("token");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: form,
            });

            const { url } = await res.json();
            setPreviewUrl(url);
            onUpload(url);
        }
    };

    return (
        <div className="space-y-2">
            {previewUrl && (
                <img
                    src={previewUrl}
                    alt={alt || "Selected image"}
                    className="max-w-xs rounded border"
                />
            )}
            <div className="flex items-center gap-2">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? "Change Image" : "Upload Image"}
                </Button>
            </div>
        </div>
    );
};