import { Link, useLocation } from "react-router-dom";
import {
  Calendar,
  FileText,
  BookOpen,
  Clock,
  Shield,
  LayoutDashboard,
  Users,
  Settings,
  UserCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Appointments",
    url: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Patients",
    url: "/admin/patients",
    icon: UserCheck,
  },
  {
    title: "Blog Management",
    url: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Publications",
    url: "/admin/publications",
    icon: BookOpen,
  },
  {
    title: "Waiting List",
    url: "/admin/waiting-list",
    icon: Clock,
  },
  {
    title: "Content Management",
    url: "/admin/content",
    icon: Settings,
  },
  {
    title: "Manage Admins",
    url: "/admin/admins",
    icon: Shield,
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { user, userRole } = useAuth();

  if (userRole !== 'admin' && userRole !== 'super_admin') {
    return null;
  }

  return (
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Admin Panel</h2>
              <p className="text-sm text-gray-600">Dr. Wuraola's Practice</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.url} className="flex items-center gap-3">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>General</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/" className="flex items-center gap-3">
                      <Users className="w-4 h-4" />
                      <span>Back to Website</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="text-sm text-gray-600">
            Logged in as: {userRole}
          </div>
        </SidebarFooter>
      </Sidebar>
  );
}