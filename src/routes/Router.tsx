import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContexts";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/MainLayout";
import Login from "@/pages/Login";
import ProductRegistration from "@/pages/products/ProductRegistration";
import Dashboard from "@/pages/Dashboard";

export function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/product-registration" replace /> : <Login />
        } 
      />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ProductRegistration />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="product-registration" element={<ProductRegistration />} />
        <Route path="analytics" element={<div className="p-8 text-center text-muted-foreground">Analytics page coming soon...</div>} />
        <Route path="users" element={<div className="p-8 text-center text-muted-foreground">Users page coming soon...</div>} />
        <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings page coming soon...</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 