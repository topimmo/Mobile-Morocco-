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
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        console.log('RoleGuard: Checking authorization for path:', location.pathname);
        
        // Step 1: Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!isMounted) return;

        if (authError || !user) {
          console.log('RoleGuard: User not authenticated, redirecting to login');
          setAuthorized(false);
          setRedirectTo('/auth/login');
          setLoading(false);
          return;
        }

        console.log('RoleGuard: User authenticated:', user.id);

        // Step 2: Fetch user role from profiles table with retry and exponential backoff
        // Try up to 3 times total: 1 initial attempt + 2 retries
        // Retry delays: 500ms (first retry), 1000ms (second retry)
        let retryCount = 0;
        let profile = null;
        let profileError = null;

        while (retryCount < 3 && !profile) {
          if (retryCount > 0) {
            console.log(`RoleGuard: Retrying profile fetch (attempt ${retryCount + 1}/3)...`);
            // Exponential backoff formula: 2^(retryCount-1) * 500ms
            // First retry (retryCount=1): 2^0 * 500 = 500ms
            // Second retry (retryCount=2): 2^1 * 500 = 1000ms
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount - 1) * 500));
          }

          const result = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (!isMounted) return;

          profile = result.data;
          profileError = result.error;
          retryCount++;

          if (profile) break;
        }

        if (profileError || !profile) {
          console.error('RoleGuard: Error fetching profile:', profileError);
          setAuthorized(false);
          setRedirectTo('/auth/select-account-type');
          setLoading(false);
          return;
        }

        if (!profile.role) {
          console.error('RoleGuard: Profile exists but role is null');
          setAuthorized(false);
          setRedirectTo('/auth/select-account-type');
          setLoading(false);
          return;
        }

        // Step 3: Check if user's role is in the allowed roles
        const userRole = profile.role as UserRole;
        console.log('RoleGuard: User role:', userRole, 'Allowed roles:', allowedRoles);
        
        // Admin role bypasses all checks
        const isAuthorized = allowedRoles.includes(userRole) || userRole === 'admin';
        
        if (isAuthorized) {
          console.log('RoleGuard: Authorization granted');
          setAuthorized(true);
          setRedirectTo(null);
        } else {
          console.log('RoleGuard: Authorization denied, redirecting to:', fallbackPath);
          setAuthorized(false);
          setRedirectTo(fallbackPath);
        }
      } catch (error) {
        console.error('RoleGuard: Authorization check failed:', error);
        if (!isMounted) return;
        setAuthorized(false);
        setRedirectTo(fallbackPath);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles, fallbackPath, location.pathname]);

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
  if (!authorized && redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
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
