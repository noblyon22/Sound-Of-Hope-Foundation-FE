import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Music,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG } from "@/app/config/app.config";
import { useLogout, useAuthStore } from "@/features/auth";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Participants", href: "/dashboard/participants", icon: Users },
  { label: "Programmes", href: "/dashboard/programmes", icon: Music },
  { label: "Events", href: "/dashboard/events", icon: CalendarDays },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
] as const;

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const logout = useLogout();
  const user = useAuthStore((s) => s.user);

  const handleLogout = () => {
    logout.mutate();
  };

  const NavItems = () => (
    <nav className="flex flex-col gap-1 mt-6">
      {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? location.pathname === "/dashboard"
            : location.pathname.startsWith(href);
        return (
          <Link
            key={href}
            to={href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-soh-green-700 text-white"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-card border-r shadow-sm transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between gap-3 px-4 py-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-soh-green-700 flex items-center justify-center font-bold text-white text-xs">
              SH
            </div>
            <span className="font-semibold text-sm truncate">
              {APP_CONFIG.shortName}
            </span>
          </div>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <NavItems />
        </div>

        {/* User footer */}
        <div className="border-t px-3 py-3">
          {user && (
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className="w-8 h-8 rounded-full bg-soh-green-100 flex items-center justify-center text-xs font-semibold text-soh-green-700 shrink-0">
                {getInitials(user.first_name, user.last_name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-background border-b">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-medium text-muted-foreground">
            {APP_CONFIG.name}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
