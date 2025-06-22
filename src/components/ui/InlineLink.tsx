import React, { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/contexts/AuthContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { Check, Loader2, Link2 } from 'lucide-react';
import {Link} from "react-router-dom";

interface InlineLinkProps {
    id: string;
    defaultLabel: string;
    defaultHref: string;
    as?: React.ElementType;
    componentProps?: {
        startIcon?: React.ReactNode;
        endIcon?: React.ReactNode;
        [key: string]: any;
    };
    className?: string;
    target?: '_blank' | '_self';
}

export const InlineLink = ({
                               id,
                               defaultLabel,
                               defaultHref,
                               as,
                               componentProps = {},
                               className = '',
                               target = '_self',
                           }: InlineLinkProps) => {
    const { updateItem, editedIds, isSaving } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    const canEdit = isEditMode && isAdmin;

    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(defaultLabel);
    const [href, setHref] = useState(defaultHref);
    const [hasSaved, setHasSaved] = useState(false);

    const handleBlur = () => {
        setEditing(false);
        if (label !== defaultLabel) updateItem(id, 'value', label);
        if (href !== defaultHref) updateItem(id, 'href', href);
        if (label !== defaultLabel || href !== defaultHref) setHasSaved(true);
    };

    useEffect(() => {
        if (hasSaved) {
            const timeout = setTimeout(() => setHasSaved(false), 1500);
            return () => clearTimeout(timeout);
        }
    }, [hasSaved]);

    const ComponentTag = as || 'a';
    const { startIcon, endIcon, children, ...restProps } = componentProps;

    const combinedChildren = (
        <span className="inline-flex items-center">
      {startIcon}
            {label}
            {endIcon}
    </span>
    );

    if (!canEdit) {
        return (
            <Link to={defaultHref}>
                <ComponentTag
                    href={defaultHref}
                    target={target}
                    rel="noopener noreferrer"
                    {...restProps}
                >
                    {combinedChildren}
                </ComponentTag>
            </Link>
        );
    }

    return editing ? (
        <div className="space-y-2">
            <div className="relative">
                <input
                    className={`border px-2 py-1 rounded text-sm w-full bg-white text-gray-900 pr-6 ${className}`}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="Link label"
                    autoFocus
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2">
                    {isSaving && editedIds.has(id) ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : hasSaved ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Link2 className="w-4 h-4 text-gray-400" />
                    )}
                </div>
            </div>
            <input
                className={`border px-2 py-1 rounded text-sm w-full bg-white text-gray-800 ${className}`}
                value={href}
                onChange={(e) => setHref(e.target.value)}
                onBlur={handleBlur}
                placeholder="URL"
            />
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <ComponentTag
                href={href}
                target={target}
                rel="noopener noreferrer"
                {...restProps}
            >
                {combinedChildren}
            </ComponentTag>
            <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm text-blue-500 underline hover:text-blue-700"
            >
                Edit
            </button>
        </div>
    );
};