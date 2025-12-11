import { Building2 } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Upload", path: "/upload" },
    { label: "Manual Check", path: "/manual" },
    { label: "Results", path: "/results" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login", { replace: true });
    // window.location.href = "/login";
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur shadow-sm">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo + title */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-xl bg-primary group-hover:scale-105 transition-transform">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-foreground">
              Early Risk Signal System
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Behaviour-based Delinquency Watch
            </p>
          </div>
        </Link>

        {/* Navigation + logout */}
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={
                      isActive
                        ? "font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  >
                    {item.label}
                  </Button>
                </NavLink>
              );
            })}
          </nav>

          <Button
            variant="outline"
            size="sm"
            className="text-xs md:text-sm"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};
