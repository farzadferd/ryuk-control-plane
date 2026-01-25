import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const routes = [
  { path: "/dashboard", label: "QUERY", code: "01" },
  { path: "/access", label: "SCOPE", code: "02" },
  { path: "/status", label: "SESSION", code: "03" },
  { path: "/logs", label: "TRACE", code: "04" },
  { path: "/docs", label: "KNOWLEDGE", code: "05" },
];

const adminRoutes = [
  { path: "/admin", label: "PROVISION", code: "A1" },
  { path: "/admin/policies", label: "POLICY", code: "A2" },
  { path: "/admin/users", label: "ACCESS", code: "A3" },
  { path: "/admin/audit", label: "AUDIT", code: "A4" },
];

export function SystemNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-48 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      {/* System Identity */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold tracking-tight text-foreground">RYUK</span>
          <span className="text-[10px] text-muted-foreground font-mono">v2.1</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(120_40%_45%)]" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            System Active
          </span>
        </div>
      </div>

      {/* Main Routes */}
      <div className="flex-1 py-4">
        <div className="px-4 mb-2">
          <span className="label-system">Navigation</span>
        </div>
        {routes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 transition-colors relative group",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground" />
              )}
              <span className="font-mono text-[10px] opacity-40 group-hover:opacity-70 transition-opacity">
                {route.code}
              </span>
              <span className="text-sm tracking-wide">{route.label}</span>
            </Link>
          );
        })}

        {/* Admin Section */}
        <div className="px-4 mt-8 mb-2">
          <span className="label-system">Administration</span>
        </div>
        {adminRoutes.map((route) => {
          const isActive = location.pathname === route.path;
          return (
            <Link
              key={route.path}
              to={route.path}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 transition-colors relative group",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground" />
              )}
              <span className="font-mono text-[10px] opacity-40 group-hover:opacity-70 transition-opacity">
                {route.code}
              </span>
              <span className="text-sm tracking-wide">{route.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Session Footer */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="label-system">Expires</span>
            <span className="font-mono text-xs text-foreground">62:14:33</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center justify-between">
            <span className="label-system">Sandbox</span>
            <span className="font-mono text-[10px] text-muted-foreground">DEV-7291</span>
          </div>
          <div className="h-px bg-border" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <LogOut className="w-3 h-3" />
            <span className="text-[10px] uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </div>
    </nav>
  );
}