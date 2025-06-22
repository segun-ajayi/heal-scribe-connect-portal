import {useContent} from "@/hooks/useContent.tsx";
import {useEditMode} from "@/contexts/EditModeContext.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import React from "react";
import {iconMap} from "@/Utils/iconMap.ts";

export const InlineIconPicker = ({ id, defaultValue }: { id: string; defaultValue: string }) => {
    const { updateItem } = useContent();
    const { isEditMode } = useEditMode();
    const { userRole } = useAuth();
    const canEdit = isEditMode && (userRole === 'admin' || userRole === 'super_admin');
    const [selected, setSelected] = React.useState(defaultValue);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value);
        updateItem(id, 'value', e.target.value);
    };

    if (!canEdit) return null;

    return (
        <select
            value={selected}
            onChange={handleChange}
            className="border px-2 py-1 rounded text-sm bg-white text-gray-800"
        >
            {Object.keys(iconMap).map((key) => (
                <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
            ))}
        </select>
    );
};