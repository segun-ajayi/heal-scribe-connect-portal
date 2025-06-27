// components/cms/DynamicSection.tsx
import { InlineText } from "@/components/ui/InlineText";
import { InlineTextarea } from "@/components/ui/InlineTextarea";
import { Badge } from "@/components/ui/badge";

export const DynamicSection = ({
                                   group,
                                   fields,
                                   render,
                               }: {
    group: Record<string, string[]>;
    fields: string[];
    render: (index: string, get: (id: string) => string) => React.ReactNode;
}) => {
    const get = (id: string) =>
        group[id] || "";

    return (
        <>
            {Object.entries(group).map(([index]) => render(index, get))}
        </>
    );
};