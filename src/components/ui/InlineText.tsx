import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';

interface InlineTextProps {
    id: string;
    defaultValue?: string;
    className?: string;
    as?: keyof JSX.IntrinsicElements;
    isEditable?: boolean;
}

export const InlineText = ({
                               id,
                               defaultValue = '',
                               className = '',
                               as: Tag = 'span',
                               isEditable = true,
                           }: InlineTextProps) => {
    const { updateItem, createItem, editedIds, isSaving } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const canEdit = isEditMode && isAdmin && isEditable;

    const isMissing = !defaultValue;
    const [value, setValue] = useState(defaultValue || '');
    const [editing, setEditing] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const inferSectionFromId = (id: string) => id.split('-')[1] || 'misc';
    const inferPageFromId = (id: string) => id.split('-')[0] || 'global';

    const handleBlur = () => {
        setEditing(false);
        if (value.trim() === defaultValue?.trim()) return;
        if (isMissing) {
            createItem({
                id,
                type: 'text',
                value: value.trim(),
                label: id,
                section: inferSectionFromId(id),
                page: inferPageFromId(id),
            });
        } else {
            updateItem(id, 'value', value.trim());
        }
        setHasSaved(true);
    };

    useEffect(() => {
        if (hasSaved) {
            const timeout = setTimeout(() => setHasSaved(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [hasSaved]);

    if (!canEdit) {
        return <Tag className={className}>{defaultValue || ''}</Tag>;
    }

    return editing ? (
        <div className="relative inline-block w-full">
            <input
                type="text"
                className={`border px-2 py-1 rounded text-base w-full bg-white text-gray-900 pr-6 ${className}`}
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur();
                    if (e.key === 'Escape') {
                        setValue(defaultValue || '');
                        setEditing(false);
                    }
                }}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                {isSaving && editedIds.has(id) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : hasSaved ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : null}
            </div>
        </div>
    ) : (
        <Tag
            className={`cursor-pointer relative text-muted-foreground ${className}`}
            onDoubleClick={() => setEditing(true)}
            title={isMissing ? `Double-click to add content for "${id}"` : ''}
        >
            {value || <em className="opacity-50">[ Click to add text for <code>{id}</code> ]</em>}
        </Tag>
    );
};