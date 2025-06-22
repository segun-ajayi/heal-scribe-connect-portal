import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ContentItem {
    id: string;
    type: 'text' | 'image' | 'link' | 'button';
    page: string;
    section: string;
    label: string;
    value: string;
    alt?: string;
    href?: string;
}

type EditableField = 'value' | 'label' | 'href' | 'alt';

const baseUrl = import.meta.env.VITE_API_URL || '';

export const useContent = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { authFetch } = useAuth();

    const [editedIds, setEditedIds] = useState<Set<string>>(new Set());

    const {
        data: content = [],
        isLoading,
        isError,
        refetch,
    } = useQuery<ContentItem[]>({
        queryKey: ['content'],
        queryFn: () => authFetch<ContentItem[]>(`${baseUrl}/api/admin/content`, {}),
    });

    const contentById = useMemo(() => {
        return Object.fromEntries(content.map(item => [item.id, item]));
    }, [content]);

    const updateMutation = useMutation({
        mutationFn: ({ id, field, value }: { id: string; field: EditableField; value: string }) =>
            authFetch(`${baseUrl}/api/admin/content/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ [field]: value }),
            }),
        onMutate: async ({ id, field, value }) => {
            const current = contentById[id];
            if (!current || current[field] === value) return;

            setEditedIds(prev => new Set(prev).add(id));
            await queryClient.cancelQueries({ queryKey: ['content'] });

            const previous = queryClient.getQueryData<ContentItem[]>(['content']);
            if (previous) {
                queryClient.setQueryData<ContentItem[]>(['content'], prev =>
                    (prev || []).map(item => (item.id === id ? { ...item, [field]: value } : item))
                );
            }

            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['content'], context.previous);
            }
            toast({
                title: 'Update Failed',
                description: 'Could not save changes.',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            toast({ title: 'Content Updated', description: 'Changes saved.' });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            authFetch(`${baseUrl}/api/admin/content/${id}`, { method: 'DELETE' }),
        onMutate: async id => {
            await queryClient.cancelQueries({ queryKey: ['content'] });
            const previous = queryClient.getQueryData<ContentItem[]>(['content']);
            if (previous) {
                queryClient.setQueryData<ContentItem[]>(['content'], prev =>
                    (prev || []).filter(item => item.id !== id)
                );
            }
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(['content'], context.previous);
            }
            toast({
                title: 'Delete Failed',
                description: 'Could not delete item.',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            toast({ title: 'Deleted', description: 'Item removed successfully.' });
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['content'] });
        },
    });

    const createMutation = useMutation({
        mutationFn: (item: ContentItem) =>
            authFetch(`${baseUrl}/api/admin/content`, {
                method: 'POST',
                body: JSON.stringify([item]),
            }),
        onSuccess: (_, item) => {
            queryClient.setQueryData<ContentItem[]>(['content'], prev => [...(prev ?? []), item]);
            toast({ title: 'Content Added', description: 'New content has been saved.' });
        },
        onError: () => {
            toast({
                title: 'Failed to Add',
                description: 'Could not save new content.',
                variant: 'destructive',
            });
        },
    });

    const getItemById = (id: string) => contentById[id];
    const groupBySection = useMemo(() => {
        return content.reduce<Record<string, ContentItem[]>>((acc, item) => {
            if (!acc[item.section]) acc[item.section] = [];
            acc[item.section].push(item);
            return acc;
        }, {});
    }, [content]);

    return {
        content,
        contentById,
        isLoading,
        isError,
        refetch,
        updateItem: (id: string, field: EditableField, value: string) =>
            updateMutation.mutate({ id, field, value }),
        deleteItem: (id: string) => deleteMutation.mutate(id),
        addItem: (item: ContentItem) => createMutation.mutate(item),
        isSaving: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        editedIds,
        hasUnsavedChanges: editedIds.size > 0,
        resetEdits: () => setEditedIds(new Set()),
        getItemById,
        groupBySection,
    };
};