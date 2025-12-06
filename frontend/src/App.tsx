import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import CustomerDetail from "./pages/CustomerDetail";
import NotFound from "./pages/NotFound";
import ManualEntry from "./pages/ManualEntry";


const queryClient = new QueryClient();

// Simple localStorage-based auth check
const isAuthenticated = () => localStorage.getItem("isAuthenticated") === "true";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/upload"
            element={
              <RequireAuth>
                <Upload />
              </RequireAuth>
            }
          />

          <Route
            path="/results"
            element={
              <RequireAuth>
                <Results />
              </RequireAuth>
            }
          />
          <Route
            path="/customer/:customerId"
            element={
              <RequireAuth>
                <CustomerDetail />
              </RequireAuth>
            }
          />
          <Route
            path="/manual" 
            element={
              <RequireAuth>
                <ManualEntry />
              </RequireAuth>
            }
          />
          {/* 404 – also behind auth so random URLs still require login */}
          <Route
            path="*"
            element={
              <RequireAuth>
                <NotFound />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
