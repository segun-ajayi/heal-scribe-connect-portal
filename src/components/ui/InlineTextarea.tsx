import React, { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Check, Loader2 } from 'lucide-react';
import { useEditMode } from '@/contexts/EditModeContext';

interface InlineTextareaProps {
    id: string;
    defaultValue: string;
    className?: string;
    previewClassName?: string;
    rows?: number;
}

export const InlineTextarea = ({
                                   id,
                                   defaultValue,
                                   className = '',
                                   previewClassName = '',
                                   rows = 4,
                               }: InlineTextareaProps) => {
    const { updateItem, editedIds, isSaving } = useContent();
    const { userRole } = useAuth();

    const { isEditMode } = useEditMode();
    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const canEdit = isEditMode && isAdmin;

    const [value, setValue] = useState(defaultValue);
    const [editing, setEditing] = useState(false);
    const [hasSaved, setHasSaved] = useState(false);

    const handleBlur = () => {
        setEditing(false);
        if (value !== defaultValue) {
            updateItem(id, 'value', value);
            setHasSaved(true);
        }
    };

    useEffect(() => {
        if (hasSaved) {
            const timeout = setTimeout(() => setHasSaved(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [hasSaved]);

    if (!canEdit) {
        return (
            <div className={previewClassName}>
                <ReactMarkdown>{defaultValue}</ReactMarkdown>
            </div>
        );
    }

    return editing ? (
        <div className="relative">
      <textarea
          className={`border rounded w-full px-3 py-2 text-sm font-mono bg-white text-gray-900 pr-6 ${className}`}
          value={value}
          rows={rows}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
              if (e.key === 'Escape') {
                  setValue(defaultValue);
                  setEditing(false);
              }
          }}
      />
            <div className="absolute right-2 top-2">
                {isSaving && editedIds.has(id) ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : hasSaved ? (
                    <Check className="w-4 h-4 text-green-500" />
                ) : null}
            </div>
        </div>
    ) : (
        <div
            className={`cursor-pointer relative ${previewClassName}`}
            onDoubleClick={() => setEditing(true)}
        >
            <ReactMarkdown>{value}</ReactMarkdown>
        </div>
    );
};