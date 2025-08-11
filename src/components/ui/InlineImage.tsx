import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { useContent } from "@/hooks/useContent";

interface InlineImageProps {
    id: string;
    defaultSrc?: string;
    defaultAlt?: string;
    imgClassName?: string;
    wrapperClassName?: string;
}

export const InlineImage = ({
                                id,
                                defaultSrc = "",
                                defaultAlt = "",
                                imgClassName = "",
                                wrapperClassName = "",
                            }: InlineImageProps) => {
    const { updateItem, createItem } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isAdmin = userRole === "admin" || userRole === "super_admin";
    const canEdit = isAdmin && isEditMode;

    const isMissing = !defaultSrc;
    const [previewUrl, setPreviewUrl] = useState<string>(defaultSrc || "");

    const inferSectionFromId = (id: string) => id.split("-")[1] || "misc";
    const inferPageFromId = (id: string) => id.split("-")[0] || "global";

    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

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

        if (isMissing) {
            createItem({
                id,
                type: "image",
                value: url,
                label: id,
                section: inferSectionFromId(id),
                page: inferPageFromId(id),
                alt: defaultAlt || "Uploaded image",
            });
        } else {
            updateItem(id, "value", url);
        }
    };

    if (!canEdit && !previewUrl) return null;

    return (
        <div
            className={`relative group ${wrapperClassName}`}
            onClick={() => canEdit && fileInputRef.current?.click()}
        >
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={defaultAlt || `InlineImage ${id}`}
                    className={imgClassName}
                />
            ) : canEdit ? (
                <div className="flex items-center justify-center border border-dashed border-gray-400 rounded p-4 text-center text-sm text-gray-600 cursor-pointer">
                    Click to upload image for <code>{id}</code>
                </div>
            ) : null}

            {canEdit && (
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            )}
        </div>
    );
};