import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { UserRole } from '@/services/authService';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

/**
 * RoleGuard component for protecting routes based on user roles
 * Fetches the user's role from the profiles table (single source of truth)
 * and only allows access if the user has one of the allowed roles.
 */
export function RoleGuard({ 
  children, 
  allowedRoles,
  fallbackPath = '/unauthorized'
}: RoleGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Step 1: Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Step 2: Fetch user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Step 3: Check if user's role is in the allowed roles
        const userRole = profile.role as UserRole;
        const isAuthorized = allowedRoles.includes(userRole) || userRole === 'admin';
        
        setAuthorized(isAuthorized);
      } catch (error) {
        console.error('Authorization check failed:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [allowedRoles, location]);

  // Show loading state while checking authorization
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification des autorisations...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authorized
  if (!authorized) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Render children if authorized
  return <>{children}</>;
}

/**
 * Specialized RoleGuard for admin-only routes
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['admin']} fallbackPath="/auth/login">
      {children}
    </RoleGuard>
  );
}

/**
 * Specialized RoleGuard for agent routes
 */
export function AgentGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['agent']} fallbackPath="/dashboard">
      {children}
    </RoleGuard>
  );
}

/**
 * Specialized RoleGuard for merchant routes
 */
export function MerchantGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['merchant']} fallbackPath="/dashboard">
      {children}
    </RoleGuard>
  );
}

export default RoleGuard;
