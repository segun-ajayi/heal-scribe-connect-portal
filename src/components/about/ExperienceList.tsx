import {useEditMode} from "@/contexts/EditModeContext";
import {usePublicContent} from "@/hooks/usePublicContent";
import {InlineText} from "@/components/ui/InlineText";
import {InlineTextarea} from "@/components/ui/InlineTextarea";
import {useContent} from "@/hooks/useContent";
import {useAuth} from "@/contexts/AuthContext";// Adjust imports to your actual file structure
import {Badge} from "@/components/ui/badge";
import {ArrowDown, ArrowUp, Trash} from "lucide-react";
import {useMemo} from "react";

interface ExperienceListProps {
    get?: (id: string) => any
}

export const ExperienceList = ({get}: ExperienceListProps) => {
    const {data = []} = usePublicContent();
    const {createItem, deleteItem} = useContent();
    const {userRole} = useAuth();
    const {isEditMode} = useEditMode();
    const canEdit = (userRole === "admin" || userRole === "super_admin") && isEditMode;

    const grouped = useMemo(() => {
        const result: Record<string, Record<string, string>> = {};
        for (const item of data) {
            if (item.page !== "about") continue;
            const match = item.id.match(/^about-exp(\d+)-(.+)$/);
            if (!match) continue;
            const [, idx, key] = match;
            result[idx] ||= {};
            result[idx][key] = item.value;
            result[idx]['id'] = item.id;
        }
        return result;
    }, [data]);

    const indices = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

    const handleAdd = () => {
        const next = indices.length ? Number(indices.at(-1)) + 1 : 1;
        const base = `about-exp${next}`;
        createItem({
            id: `${base}-position`,
            page: "about",
            section: "exp",
            type: "text",
            label: `${base}-position`,
            value: "New Position"
        });
        createItem({
            id: `${base}-institution`,
            page: "about",
            section: "exp",
            type: "text",
            label: `${base}-institution`,
            value: "Institution Name"
        });
        createItem({
            id: `${base}-period`,
            page: "about",
            section: "exp",
            type: "text",
            label: `${base}-period`,
            value: "Year - Year"
        });
        createItem({
            id: `${base}-description`,
            page: "about",
            section: "exp",
            type: "text",
            label: `${base}-description`,
            value: "Description here..."
        });
    };

    const handleDelete = (index: string) => {
        const base = `about-exp${index}`;
        ["position", "institution", "period", "description"].forEach(k =>
            deleteItem(`${base}-${k}`)
        );
    };

    const handleSwap = (a: string, b: string) => {
        const fields = ["position", "institution", "period", "description"];
        for (const f of fields) {
            const aID = `about-exp${a}-${f}`;
            const bID = `about-exp${b}-${f}`;
            const aVal = data.find(d => d.id === aID)?.value || "";
            const bVal = data.find(d => d.id === bID)?.value || "";
            if (aVal) createItem({id: bID, value: aVal, page: "about", section: "exp", label: bID, type: "text"});
            if (bVal) createItem({id: aID, value: bVal, page: "about", section: "exp", label: aID, type: "text"});
        }
    };

    return (
        <>
            <div className="space-y-6">
                {indices.map((index, i) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-6 relative group">
                        <InlineText
                            id={`about-exp${index}-position`}
                            defaultValue={get(`about-exp${index}-position`)}
                            className="text-4xl font-bold text-gray-900 mb-4"
                            as="h3"
                        />
                        <InlineText
                            id={`about-exp${index}-institution`}
                            defaultValue={get(`about-exp${index}-institution`)}
                            className="text-blue-600 font-medium mb-1"
                            as="p"
                        />
                        <InlineText
                            id={`about-exp${index}-description`}
                            defaultValue={get(`about-exp${index}-description`)}
                            className="text-gray-700"
                            as="p"
                        />
                        <Badge variant="outline" className="mb-2">
                            <InlineText
                                id={`about-exp${index}-period`}
                                defaultValue={get(`about-exp${index}-period`)}
                                className="text-gray-700"
                                as="p"
                            />
                        </Badge>

                        {canEdit && (
                            <div
                                className="absolute top-0 right-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                {i > 0 && (
                                    <button onClick={() => handleSwap(index, indices[i - 1])}>
                                        <ArrowUp className="w-4 h-4 text-gray-500"/>
                                    </button>
                                )}
                                {i < indices.length - 1 && (
                                    <button onClick={() => handleSwap(index, indices[i + 1])}>
                                        <ArrowDown className="w-4 h-4 text-gray-500"/>
                                    </button>
                                )}
                                <button onClick={() => handleDelete(index)}>
                                    <Trash className="w-4 h-4 text-red-500"/>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {canEdit && (
                <button onClick={handleAdd} className="mt-6 text-sm text-blue-600 hover:underline">
                    + Add Experience
                </button>
            )}
        </>
    );
};