import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { useContent } from "@/hooks/useContent";
import {Link} from "react-router-dom";

interface InlineLinkProps {
    id: string;
    defaultLabel?: string;
    defaultHref?: string;
    as?: keyof JSX.IntrinsicElements | React.ElementType;
    componentProps?: Record<string, any>;
}

export const InlineLink = ({
                               id,
                               defaultLabel = "",
                               defaultHref = "",
                               as: Component = "a",
                               componentProps = {},
                           }: InlineLinkProps) => {
    const { updateItem, createItem } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();

    const isAdmin = userRole === "admin" || userRole === "super_admin";
    const canEdit = isAdmin && isEditMode;

    const [label, setLabel] = useState(defaultLabel);
    const [href, setHref] = useState(defaultHref);
    const [editing, setEditing] = useState(false);

    const isMissing = !defaultLabel && !defaultHref;

    const inferSectionFromId = (id: string) => id.split("-")[1] || "misc";
    const inferPageFromId = (id: string) => id.split("-")[0] || "global";

    const handleBlur = () => {
        setEditing(false);
        const cleanLabel = label.trim();
        const cleanHref = href.trim();

        if (!cleanLabel || !cleanHref) return;

        if (isMissing) {
            createItem({
                id,
                type: "link",
                value: cleanLabel,
                href: cleanHref,
                label: id,
                section: inferSectionFromId(id),
                page: inferPageFromId(id),
            });
        } else {
            updateItem(id, "value", cleanLabel);
            updateItem(id, "href", cleanHref);
        }
    };

    if (!canEdit) {
        return (
            <Link to={href}>
                <Component
                    href={href}
                    {...componentProps}
                    className={`cursor-pointer text-blue-600 hover:underline ${componentProps?.className || ""}`}
                >
                    {label || (
                        <em className="opacity-50">
                            [ Click to add link for <code>{id}</code> ]
                        </em>
                    )}
                </Component>
            </Link>
        );
    }

    return editing ? (
        <div className="space-y-2">
            <input
                type="text"
                className="border rounded text-black px-2 py-1 w-full"
                placeholder="Link label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
            />
            <input
                type="text"
                className="border rounded text-black px-2 py-1 w-full"
                placeholder="https://example.com"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                        setLabel(defaultLabel);
                        setHref(defaultHref);
                        setEditing(false);
                    }
                }}
            />
        </div>
    ) : (
        <Component
            href={href}
            onDoubleClick={() => setEditing(true)}
            title={isMissing ? `Click to create link for "${id}"` : ""}
            {...componentProps}
            className={`cursor-pointer text-blue-600 hover:underline ${componentProps?.className || ""}`}
        >
            {label || (
                <em className="opacity-50">
                    [ Click to add link for <code>{id}</code> ]
                </em>
            )}
        </Component>
    );
};