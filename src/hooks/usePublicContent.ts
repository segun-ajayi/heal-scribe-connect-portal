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

interface publications {
    data?: {
        id?: number;
        title?: string;
        abstract?: string;
        content?: string;
        authors?: string;
        journal?: string;
        impact?: string;
        url?: string;
        doi?: string;
        keywords?: string;
        category_id?: number;
        category?: string;
        published_at?: string;
        created_at?: string;
        updated_at?: string;
    }[];
    categories?: {
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
    }[];
    limit?: number;
    page?: number;
    total?: number;
    success?: boolean;
}

interface blogs {
    data?: {
        id?: number;
        title?: string;
        excerpt?: string;
        content?: string;
        author?: string;
        featured?: boolean;
        date?: string;
        readTime?: string;
        currentRating?: string;
        totalRatings?: string;
        comments?: string;
        category_id?: number;
        category?: string;
        status?: string;
        likes?: number;
        scheduledFor?: string;
        publishedAt?: string;
        created_at?: string;
    }[];
    categories?: {
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
    }[];
    limit?: number;
    page?: number;
    total?: number;
    success?: boolean;
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

// export const usePublications = (page = 1, category: string = 'all', refreshKey:number = 0) => {
//
//     return useQuery<publications>({
//         queryKey: ['my-publications', page, category, refreshKey],
//         queryFn: async () =>
//             await fetch(
//                 `${import.meta.env.VITE_API_URL}/api/publications?page=${page}&category=${category}`, {}),
//         staleTime: Infinity,
//         refetchOnWindowFocus: false,
//         retry: 1,    });
// };

export const usePublications = (
    page = 1,
    category: string = 'all',
    refreshKey: number = 0
) => {
    return useQuery<publications>({
        queryKey: ['my-publications', page, category, refreshKey],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/publications?page=${page}&category=${category}`
            );
            if (!res.ok) {
                throw new Error('Failed to fetch publications');
            }
            return res.json(); // ✅ Return parsed JSON here
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export const useBlogs = (
    page = 1,
    category: string = 'all',
    refreshKey: number = 0
) => {
    return useQuery<blogs>({
        queryKey: ['blogs', page, category, refreshKey],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/blogs?page=${page}&category=${category}`
            );
            if (!res.ok) {
                throw new Error('Failed to fetch blogs');
            }
            return res.json(); // ✅ Return parsed JSON here
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};
