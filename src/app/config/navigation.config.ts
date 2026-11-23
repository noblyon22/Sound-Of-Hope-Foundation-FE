import {
  LayoutDashboard,
  Users,
  Music,
  CalendarDays,
  Settings,
  BookOpen,
  ClipboardList,
  Heart,
  DollarSign,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Participants", href: "/dashboard/participants", icon: Users },
  { label: "Programmes", href: "/dashboard/programmes", icon: Music },
  { label: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
  { label: "Applications", href: "/dashboard/applications", icon: ClipboardList },
  { label: "Donations", href: "/dashboard/donations", icon: Heart },
  { label: "Finance", href: "/dashboard/finance", icon: DollarSign },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];
