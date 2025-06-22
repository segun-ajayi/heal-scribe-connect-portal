import { useQuery } from '@tanstack/react-query';

export interface ContentItem {
    id: string;
    type: 'text' | 'image' | 'link' | 'button';
    page: string;
    section: string;
    label: string;
    value: string;
    alt?: string;
    href?: string;
}

export const usePublicContent = () => {
    return useQuery<ContentItem[]>({
        queryKey: ['public-content'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/content`);
            if (!res.ok) throw new Error('Failed to fetch public content');
            return res.json();
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};