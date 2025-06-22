import React, { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Loader2, ImageIcon } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';

interface InlineImageProps {
    id: string;
    defaultSrc: string;
    defaultAlt: string;
    className?: string;
    imgClassName?: string;
}

export const InlineImage = ({
                                id,
                                defaultSrc,
                                defaultAlt,
                                className = '',
                                imgClassName = 'w-full h-auto max-w-full rounded',
                            }: InlineImageProps) => {
    const { updateItem, editedIds, isSaving } = useContent();
    const { userRole } = useAuth();

    const { isEditMode } = useEditMode();
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const canEdit = isEditMode && isAdmin;

    const [src, setSrc] = useState(defaultSrc);
    const [alt, setAlt] = useState(defaultAlt);
    const [editing, setEditing] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const handleBlur = () => {
        setEditing(false);
        if (src !== defaultSrc) updateItem(id, 'value', src);
        if (alt !== defaultAlt) updateItem(id, 'alt', alt);
        if (src !== defaultSrc || alt !== defaultAlt) setHasSaved(true);
    };

    useEffect(() => {
        if (hasSaved) {
            const timeout = setTimeout(() => setHasSaved(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [hasSaved]);

    if (!canEdit) {
        return <img src={defaultSrc} alt={defaultAlt} className={imgClassName} />;
    }

    return editing ? (
        <div className={`space-y-2 ${className}`}>
            <img src={src} alt={alt} className={`${imgClassName} border`} />
            <input
                className="border w-full px-2 py-1 text-sm rounded bg-white text-gray-900"
                value={src}
                onChange={(e) => setSrc(e.target.value)}
                onBlur={handleBlur}
                placeholder="Image URL"
            />
            <input
                className="border w-full px-2 py-1 text-sm rounded bg-white text-gray-900"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                onBlur={handleBlur}
                placeholder="Alt text (description)"
            />
            {isSaving && editedIds.has(id) ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            ) : hasSaved ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : null}
        </div>
    ) : (
        <div className="relative group" onDoubleClick={() => setEditing(true)}>
            <img src={src} alt={alt} className={imgClassName} />
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ImageIcon className="w-4 h-4 text-white bg-black/50 p-1 rounded-full" />
            </div>
        </div>
    );
};