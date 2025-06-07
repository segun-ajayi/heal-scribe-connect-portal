
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

export const useAdminStats = () => {
  const { user, userRole } = useAuth();


  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/admin/stats", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch admin stats");

      return response.json();
    },
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

export const useRecentAppointments = () => {
  const { user, userRole } = useAuth();

  return useQuery({
    queryKey: ["recent-appointments"],
    queryFn: async () => {
      const response = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/admin/appointments", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch recent appointments");

      return response.json();
    },
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};

export const useRecentBlogPosts = () => {
  const { user, userRole } = useAuth();

  return useQuery({
    queryKey: ["recent-blog-posts"],
    queryFn: async () => {
      const response = await fetch("https://iyawo-website-worker.mortalerror.workers.dev/admin/blog-posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch blog posts");

      return response.json();
    },
    enabled: !!user && (userRole === "admin" || userRole === "super_admin"),
  });
};
