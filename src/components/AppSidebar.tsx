import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard, Users, UserCheck, MessageCircle, Video,
  User, BookOpen, Clock, Bookmark,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

const mentorItems = [
  { title: "Dashboard", url: "/mentor/dashboard", icon: LayoutDashboard },
  { title: "Discover Students", url: "/mentor/discover", icon: Users },
  { title: "Selected Students", url: "/mentor/selected", icon: UserCheck },
  { title: "Chat", url: "/mentor/chat", icon: MessageCircle },
  { title: "Video Sessions", url: "/mentor/sessions", icon: Video },
];

const studentItems = [
  { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
  { title: "My Mentor", url: "/student/mentor", icon: User },
  { title: "Chat", url: "/student/chat", icon: MessageCircle },
  { title: "Video Sessions", url: "/student/sessions", icon: Video },
  { title: "Saved Sessions", url: "/student/saved", icon: Bookmark },
];

export function AppSidebar() {
  const { user } = useAuth();
  const items = user?.role === "mentor" ? mentorItems : studentItems;

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-4 mb-2 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full hero-gradient flex items-center justify-center text-sm font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
