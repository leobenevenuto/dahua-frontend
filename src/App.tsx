import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "@/components/LoginForm";
import { MainLayout } from "@/components/MainLayout";
import ProductRegistration from "@/pages/ProductRegistration";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {!isAuthenticated ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="product-registration" element={<ProductRegistration />} />
                <Route path="analytics" element={<div className="p-8 text-center text-muted-foreground">Analytics page coming soon...</div>} />
                <Route path="users" element={<div className="p-8 text-center text-muted-foreground">Users page coming soon...</div>} />
                <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings page coming soon...</div>} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;