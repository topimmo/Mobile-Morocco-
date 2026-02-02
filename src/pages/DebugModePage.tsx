/**
 * Debug Mode Screen
 * 
 * Hidden debug screen for troubleshooting auth and environment issues.
 * Access by navigating to /debug (admin only) or via special key combination.
 */

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { env, getSiteUrl, isEnvValid } from '@/config/env';
import { getBuildInfo, isCI } from '@/lib/buildInfo';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Copy, Eye, EyeOff } from 'lucide-react';

interface SessionInfo {
  hasSession: boolean;
  userId: string | null;
  email: string | null;
  expiresAt: string | null;
  tokenExpiry: string | null;
}

export function DebugModeScreen() {
  const { user } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTokens, setShowTokens] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadSessionInfo = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      setSessionInfo({
        hasSession: !!session,
        userId: session?.user.id || null,
        email: session?.user.email || null,
        expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
        tokenExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null,
      });
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessionInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const StatusIndicator = ({ status }: { status: boolean }) => (
    status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )
  );

  const envChecks = {
    supabaseUrl: !!env.SUPABASE_URL,
    supabaseKey: !!env.SUPABASE_ANON_KEY,
    siteUrl: !!env.SITE_URL,
    isProduction: env.IS_PRODUCTION,
    envValid: isEnvValid(),
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">🔧 Debug Mode</h1>
          <p className="text-muted-foreground">System diagnostics and troubleshooting</p>
        </div>
        <Button onClick={loadSessionInfo} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Environment Configuration
              <StatusIndicator status={envChecks.envValid} />
            </CardTitle>
            <CardDescription>Critical environment variables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supabase URL</span>
              <div className="flex items-center gap-2">
                <StatusIndicator status={envChecks.supabaseUrl} />
                {envChecks.supabaseUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(env.SUPABASE_URL || '')}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Supabase Anon Key</span>
              <div className="flex items-center gap-2">
                <StatusIndicator status={envChecks.supabaseKey} />
                {envChecks.supabaseKey && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTokens(!showTokens)}
                  >
                    {showTokens ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                )}
              </div>
            </div>

            {showTokens && env.SUPABASE_ANON_KEY && (
              <div className="mt-2 p-2 bg-muted rounded text-xs font-mono break-all">
                {env.SUPABASE_ANON_KEY}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Site URL</span>
              <div className="flex items-center gap-2">
                <StatusIndicator status={envChecks.siteUrl} />
                <code className="text-xs">{getSiteUrl()}</code>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge variant={envChecks.isProduction ? 'default' : 'secondary'}>
                {envChecks.isProduction ? 'Production' : 'Development'}
              </Badge>
            </div>

            {!envChecks.envValid && (
              <div className="flex items-center gap-2 text-sm text-red-600 mt-4">
                <AlertCircle className="w-4 h-4" />
                <span>Environment validation failed!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Session Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Session Status
              <StatusIndicator status={sessionInfo?.hasSession || false} />
            </CardTitle>
            <CardDescription>Current authentication session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading session info...</div>
            ) : sessionInfo?.hasSession ? (
              <>
                <div className="space-y-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">User ID</span>
                    <code className="text-xs bg-muted p-2 rounded break-all">
                      {sessionInfo.userId}
                    </code>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Email</span>
                    <code className="text-xs bg-muted p-2 rounded">
                      {sessionInfo.email}
                    </code>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Token Expiry</span>
                    <code className="text-xs bg-muted p-2 rounded">
                      {sessionInfo.tokenExpiry}
                    </code>
                  </div>

                  {sessionInfo.expiresAt && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={new Date(sessionInfo.expiresAt) > new Date() ? 'default' : 'destructive'}>
                        {new Date(sessionInfo.expiresAt) > new Date() ? 'Valid' : 'Expired'}
                      </Badge>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">No active session</div>
            )}
          </CardContent>
        </Card>

        {/* Build Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Build Information
              <StatusIndicator status={isCI()} />
            </CardTitle>
            <CardDescription>Deployment and version tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Commit SHA</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {getBuildInfo().shortCommitSha}
              </code>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Full SHA</span>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                  {getBuildInfo().commitSha}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(getBuildInfo().commitSha)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge variant={getBuildInfo().environment === 'production' ? 'default' : 'secondary'}>
                {getBuildInfo().environment}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CI/CD Build</span>
              <Badge variant={isCI() ? 'default' : 'secondary'}>
                {isCI() ? 'Yes' : 'No'}
              </Badge>
            </div>

            {isCI() && (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-4">
                <CheckCircle className="w-4 h-4" />
                <span>Deployed from {import.meta.env.VERCEL_GIT_COMMIT_SHA ? 'Vercel' : 'GitHub Actions'}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              User Profile
              <StatusIndicator status={!!user?.profile} />
            </CardTitle>
            <CardDescription>Profile data from database</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user?.profile ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Role</span>
                  <Badge>{user.profile.role}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Full Name</span>
                  <span className="text-sm">{user.profile.full_name || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Phone</span>
                  <span className="text-sm">{user.profile.phone || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">City</span>
                  <span className="text-sm">{user.profile.city || 'Not set'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active</span>
                  <StatusIndicator status={user.profile.is_active} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Verified</span>
                  <StatusIndicator status={user.profile.is_verified} />
                </div>
              </>
            ) : (
              <div className="text-sm text-muted-foreground">
                {user ? 'Profile not loaded' : 'Not authenticated'}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Network Status
              <StatusIndicator status={navigator.onLine} />
            </CardTitle>
            <CardDescription>Connection information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Online</span>
              <StatusIndicator status={navigator.onLine} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Connection Type</span>
              <span className="text-sm">
                {(navigator as any).connection?.effectiveType || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Downlink</span>
              <span className="text-sm">
                {(navigator as any).connection?.downlink 
                  ? `${(navigator as any).connection.downlink} Mbps`
                  : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
