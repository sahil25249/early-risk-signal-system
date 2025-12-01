import { Building2, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated"); // Clear login session
    navigate("/login"); // Redirect to login page
  };

  return (
    <header className="border-b bg-card shadow-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo + Title - Left Side */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-primary group-hover:scale-105 transition-transform">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Risk Assessment Portal</h1>
              <p className="text-xs text-muted-foreground">Customer Financial Risk Dashboard</p>
            </div>
          </Link>

          {/* Logout Button - Right Side */}
          {localStorage.getItem("isAuthenticated") === "true" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
