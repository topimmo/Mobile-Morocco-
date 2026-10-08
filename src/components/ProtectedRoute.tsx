import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types/database';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

/**
 * ProtectedRoute component that guards routes requiring authentication
 * and optionally specific user roles.
 * 
 * Usage:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminDashboard />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallbackPath = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق... / Vérification...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check for required role if specified
  if (requiredRole) {
    const userRole = user.profile?.role;
    
    // Admin can access all routes
    if (userRole === 'admin') {
      return <>{children}</>;
    }
    
    // Check if user has the required role
    if (userRole !== requiredRole) {
      // Redirect to appropriate dashboard or home
      const redirectPath = getRedirectPath(userRole);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}

/**
 * Get redirect path based on user role
 * Exported for use in other components
 */
export function getRedirectPath(role?: UserRole | string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'agent':
      return '/agent';
    case 'merchant':
      return '/merchant';
    case 'user':
      return '/dashboard';
    default:
      return '/';
  }
}

/**
 * AdminRoute - Shortcut for admin-only routes
 */
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

/**
 * AgentRoute - Shortcut for agent routes
 */
export function AgentRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="agent" fallbackPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

/**
 * MerchantRoute - Shortcut for merchant routes
 */
export function MerchantRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="merchant" fallbackPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
}

export default ProtectedRoute;
