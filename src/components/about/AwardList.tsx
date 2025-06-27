import { usePublicContent } from "@/hooks/usePublicContent";
import { useContent } from "@/hooks/useContent";
import { useAuth } from "@/contexts/AuthContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import { useMemo } from "react";
import {InlineText} from "@/components/ui/InlineText";
import {InlineTextarea} from "@/components/ui/InlineTextarea";
interface AwardListProps {
    get?: (id: string) => any
}
export const AwardList = ({get}: AwardListProps) => {
    const { data = [] } = usePublicContent();
    const { createItem, deleteItem } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();
    const canEdit = (userRole === "admin" || userRole === "super_admin") && isEditMode;

    const grouped = useMemo(() => {
        const result: Record<string, Record<string, string>> = {};
        for (const item of data) {
            if (item.page !== "about") continue;
            const match = item.id.match(/^about-award(\d+)-(.+)$/);
            if (!match) continue;
            const [, idx, key] = match;
            result[idx] ||= {};
            result[idx][key] = item.value;
        }
        return result;
    }, [data]);

    const indices = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

    const handleAdd = () => {
        const next = indices.length ? Number(indices.at(-1)) + 1 : 1;
        const base = `about-award${next}`;
        createItem({ id: `${base}-title`, page: "about", section: "award", type: "text", label: `${base}-title`, value: "New Award Title" });
        createItem({ id: `${base}-org`, page: "about", section: "award", type: "text", label: `${base}-org`, value: "Organization Name" });
        createItem({ id: `${base}-year`, page: "about", section: "award", type: "text", label: `${base}-year`, value: "Year" });
        createItem({ id: `${base}-description`, page: "about", section: "award", type: "text", label: `${base}-description`, value: "Award Description" });
    };

    const handleDelete = (index: string) => {
        const base = `about-award${index}`;
        ["title", "org", "year", "description"].forEach((k) => deleteItem(`${base}-${k}`));
    };

    const handleSwap = (a: string, b: string) => {
        const fields = ["title", "org", "year", "description"];
        for (const f of fields) {
            const aID = `about-award${a}-${f}`;
            const bID = `about-award${b}-${f}`;
            const aVal = data.find((d) => d.id === aID)?.value || "";
            const bVal = data.find((d) => d.id === bID)?.value || "";
            if (aVal) createItem({ id: bID, value: aVal, page: "about", section: "award", label: bID, type: "text" });
            if (bVal) createItem({ id: aID, value: bVal, page: "about", section: "award", label: aID, type: "text" });
        }
    };

    return (
        <>
            {indices.map((index, i) => (
                <div key={index} className="p-4 border rounded-lg relative group">
                    <Badge className="bg-blue-100 text-blue-800 mb-2">
                        <InlineText
                            id={`about-award${index}-year`}
                            defaultValue={get(`about-award${index}-year`)}
                            className=""
                            as="p"
                        />
                    </Badge>
                    <InlineText
                        id={`about-award${index}-title`}
                        defaultValue={get(`about-award${index}-title`)}
                        className="font-semibold text-gray-900 mb-1"
                        as="h3"
                    />
                    <InlineText
                        id={`about-award${index}-org`}
                        defaultValue={get(`about-award${index}-org`)}
                        className="text-blue-600 text-sm font-medium mb-1"
                        as="p"
                    />
                    <InlineText
                        id={`about-award${index}-description`}
                        defaultValue={get(`about-award${index}-description`)}
                        className="text-gray-700 text-sm"
                        as="p"
                    />

                    {canEdit && (
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                            {i > 0 && <button onClick={() => handleSwap(index, indices[i - 1])}><ArrowUp className="w-4 h-4" /></button>}
                            {i < indices.length - 1 && <button onClick={() => handleSwap(index, indices[i + 1])}><ArrowDown className="w-4 h-4" /></button>}
                            <button onClick={() => handleDelete(index)}><Trash className="w-4 h-4 text-red-500" /></button>
                        </div>
                    )}
                </div>
            ))}
            {canEdit && (
                <button onClick={handleAdd} className="mt-6 text-sm text-blue-600 hover:underline">+ Add Award</button>
            )}
        </>
    );
};