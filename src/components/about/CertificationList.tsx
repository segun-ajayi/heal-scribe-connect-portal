import { usePublicContent } from "@/hooks/usePublicContent";
import { useContent } from "@/hooks/useContent";
import { useAuth } from "@/contexts/AuthContext";
import { useEditMode } from "@/contexts/EditModeContext";
import { useMemo } from "react";
import { ArrowDown, ArrowUp, Trash } from "lucide-react";
import {InlineText} from "@/components/ui/InlineText";



export const CertificationList = () => {
    const { data = [] } = usePublicContent();
    const { createItem, deleteItem } = useContent();
    const { userRole } = useAuth();
    const { isEditMode } = useEditMode();
    const canEdit = (userRole === "admin" || userRole === "super_admin") && isEditMode;

    const grouped = useMemo(() => {
        const result: Record<string, Record<string, string>> = {};
        for (const item of data) {
            if (item.page !== "about") continue;
            const match = item.id.match(/^about-cert(\d+)-(.+)$/);
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
        const base = `about-cert${next}`;
        createItem({ id: `${base}-title`, page: "about", section: "cert", type: "text", label: `${base}-title`, value: "Certification Title" });
        createItem({ id: `${base}-issuer`, page: "about", section: "cert", type: "text", label: `${base}-issuer`, value: "Issuer" });
        createItem({ id: `${base}-year`, page: "about", section: "cert", type: "text", label: `${base}-year`, value: "Year" });
    };

    const handleDelete = (index: string) => {
        const base = `about-cert${index}`;
        ["title", "issuer", "year"].forEach(k => deleteItem(`${base}-${k}`));
    };

    const handleSwap = (a: string, b: string) => {
        const keys = ["title", "issuer", "year"];
        for (const key of keys) {
            const idA = `about-cert${a}-${key}`;
            const idB = `about-cert${b}-${key}`;
            const valA = data.find((d) => d.id === idA)?.value || "";
            const valB = data.find((d) => d.id === idB)?.value || "";
            if (valA) createItem({ id: idB, value: valA, label: idB, page: "about", section: "cert", type: "text" });
            if (valB) createItem({ id: idA, value: valB, label: idA, page: "about", section: "cert", type: "text" });
        }
    };

    return (
        <>
            {indices.map((index, i) => (
                <div key={index} className="p-4 border rounded-lg relative group">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        <InlineText id={`about-cert${index}-title`} />
                    </h3>
                    <p className="text-blue-600 text-sm font-medium">
                        <InlineText id={`about-cert${index}-issuer`} />
                    </p>
                    <p className="text-gray-500 text-sm">
                        Issued: <InlineText id={`about-cert${index}-year`} />
                    </p>

                    {canEdit && (
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                            {i > 0 && (
                                <button onClick={() => handleSwap(index, indices[i - 1])}>
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            )}
                            {i < indices.length - 1 && (
                                <button onClick={() => handleSwap(index, indices[i + 1])}>
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                            )}
                            <button onClick={() => handleDelete(index)}>
                                <Trash className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    )}
                </div>
            ))}

            {canEdit && (
                <button
                    onClick={handleAdd}
                    className="mt-6 text-sm text-blue-600 hover:underline"
                >
                    + Add Certification
                </button>
            )}
        </>
    );
};