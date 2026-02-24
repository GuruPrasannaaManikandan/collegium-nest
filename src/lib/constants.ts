import {
  LayoutDashboard,
  Megaphone,
  Calendar,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const sidebarNavItems: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Announcements", url: "/announcements", icon: Megaphone },
  { title: "Timetable", url: "/timetable", icon: Calendar },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Materials", url: "/materials", icon: FolderOpen },
  { title: "Discussions", url: "/discussions", icon: MessageCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];
