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
          console.warn('⚠️ RoleGuard: No authenticated user');
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Step 2: Fetch user role from profiles table with duplicate detection
        const { data: profiles, error: profileError, count } = await supabase
          .from('profiles')
          .select('role, id, updated_at', { count: 'exact' })
          .eq('id', user.id)
          .order('updated_at', { ascending: false })
          .limit(2);

        if (profileError) {
          console.error('🔴 RoleGuard: Error fetching profile:', {
            code: (profileError as any).code,
            message: profileError.message,
          });
          setAuthorized(false);
          setLoading(false);
          return;
        }

        if (!profiles || profiles.length === 0) {
          // No profile found (empty array, not an error)
          console.warn('⚠️ RoleGuard: No profile found for user:', user.id);
          setAuthorized(false);
          setLoading(false);
          return;
        }

        // Handle duplicate profiles
        if (count && count > 1) {
          console.error('🔴 RoleGuard: DUPLICATE PROFILES detected for user:', user.id, {
            totalCount: count,
            returnedRows: profiles.length,
            profiles: profiles.map(p => ({ id: p.id, role: p.role, updated_at: p.updated_at })),
          });
          console.warn('⚠️ RoleGuard: Using most recent profile for authorization');
        }

        // Step 3: Check if user's role is in the allowed roles (use most recent profile)
        const profile = profiles[0];
        const userRole = profile.role as UserRole;
        
        if (!userRole) {
          console.warn('⚠️ RoleGuard: User role is null/undefined for user:', user.id);
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const isAuthorized = allowedRoles.includes(userRole) || userRole === 'admin';
        
        if (!isAuthorized) {
          console.warn('⚠️ RoleGuard: Access denied - user role:', userRole, 'allowed roles:', allowedRoles);
        } else {
          console.log('✅ RoleGuard: Access granted - user role:', userRole);
        }
        
        setAuthorized(isAuthorized);
      } catch (error) {
        console.error('🔴 RoleGuard: Authorization check failed:', error);
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
    <RoleGuard allowedRoles={['agent']} fallbackPath="/unauthorized">
      {children}
    </RoleGuard>
  );
}

/**
 * Specialized RoleGuard for merchant routes
 */
export function MerchantGuard({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['merchant']} fallbackPath="/unauthorized">
      {children}
    </RoleGuard>
  );
}

export default RoleGuard;
