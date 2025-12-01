import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardHeader } from "@/components/DashboardHeader";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Very simple demo credentials
    const DEMO_USER = "analyst";
    const DEMO_PASS = "risk123";

    if (userId === DEMO_USER && password === DEMO_PASS) {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/"); // go to upload page
    } else {
      setError("Invalid credentials. Try analyst / risk123");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-12 flex justify-center">
        <Card className="w-full max-w-md shadow-elevated">
          <CardHeader>
            <CardTitle>Sign in to Early Risk Signal System</CardTitle>
            <CardDescription>
              Restricted access dashboard for credit risk analysts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">User ID</label>
                <Input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="analyst"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full mt-2">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Login;
