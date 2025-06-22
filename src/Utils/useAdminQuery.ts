// utils/useAdminQuery.ts
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";

export function useAdminQuery<T>(
    queryKey: QueryKey,
    endpoint: string,
    options: Partial<UseQueryOptions<T>> = {}
) {
    const { user, userRole, fetchWithAuth } = useAuth();

    const isAuthorized = !!user && (userRole === "admin" || userRole === "super_admin");

    return useQuery<T>({
        queryKey,
        queryFn: async () => {
            const response = await fetchWithAuth(`${import.meta.env.VITE_API_URL}${endpoint}`);
            if (!response) throw new Error("Unauthorized or failed to fetch");
            return response.json();
        },
        enabled: isAuthorized,
        ...options,
    });
}