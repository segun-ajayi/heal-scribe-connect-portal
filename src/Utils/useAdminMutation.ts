import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminMutation = () => {
    const { fetchWithAuth } = useAuth();
    const queryClient = useQueryClient();

    const postMutation = useMutation({
        mutationFn: async ({ endpoint, data }: { endpoint: string; data: any }) => {
            return fetchWithAuth(`${import.meta.env.VITE_API_URL}${endpoint}`, "POST", data);
        },
        onSuccess: () => queryClient.invalidateQueries(), // Refresh affected data on success
    });

    const deleteMutation = useMutation({
        mutationFn: async (endpoint: string) => {
            return fetchWithAuth(`${import.meta.env.VITE_API_URL}${endpoint}`, "DELETE");
        },
        onSuccess: () => queryClient.invalidateQueries(), // Refresh affected data on success
    });

    // return { postMutation, deleteMutation };
    //
    // const { postMutation } = useAdminMutation();
    //
    // postMutation.mutate({
    //     endpoint: "/api/admin/blogs",
    //     data: { title: "New Health Insights", content: "This is an informative post!" },
    //     const { deleteMutation } = useAdminMutation();
    //
    //     deleteMutation.mutate("/api/admin/blogs/123"); // Deletes blog with ID 123

    // });

};