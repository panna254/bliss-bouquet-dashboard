import { useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminSettingsPage = () => {
  const { user, profile, role, initialized, loading, isAuthenticated, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    setSignOutError(null);

    try {
      await signOut();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setIsSigningOut(false);
    }
  }, [signOut]);

  const safeCatalogSource = import.meta.env.VITE_CATALOG_SOURCE?.trim() || "Not configured";

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Admin Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">View your admin session details and operational guidance.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin profile</CardTitle>
              <CardDescription>Review the currently signed-in admin account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Name</p>
                  <p className="mt-1 text-sm text-foreground">{profile?.fullName ?? user?.name ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Email</p>
                  <p className="mt-1 text-sm text-foreground">{user?.email ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Role</p>
                  <p className="mt-1 text-sm text-foreground capitalize">{role ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Profile ID</p>
                  <p className="mt-1 font-mono text-sm text-foreground">{profile?.id ?? user?.id ?? "Unknown"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session status</CardTitle>
              <CardDescription>Current admin session state and authentication details.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Initialized</p>
                  <p className="mt-1 text-sm text-foreground">{initialized ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Authenticated</p>
                  <p className="mt-1 text-sm text-foreground">{isAuthenticated ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Loading</p>
                  <p className="mt-1 text-sm text-foreground">{loading ? "Yes" : "No"}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Use this control to end the admin session safely.</p>
                </div>
                <Button variant="outline" onClick={handleSignOut} disabled={isSigningOut || !isAuthenticated}>
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </Button>
              </div>
              {signOutError && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Sign out failed</AlertTitle>
                  <AlertDescription>{signOutError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Environment</CardTitle>
              <CardDescription>Safe runtime configuration values exposed by the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Mode</p>
                  <p className="mt-1 text-sm text-foreground">{import.meta.env.MODE}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Catalog source</p>
                  <p className="mt-1 text-sm text-foreground">{safeCatalogSource}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operational guidance</CardTitle>
              <CardDescription>Safe admin workflows and order management notes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm leading-6 text-foreground">
                <li>
                  <span className="font-medium">Manage orders</span> from the Orders page. Use the order detail view to update status and track progress.
                </li>
                <li>
                  <span className="font-medium">Manage products</span> from the Products page. Avoid deleting products in active orders.
                </li>
                <li>
                  <span className="font-medium">Manage customers</span> from the Customers page. Customer profiles are read-only here.
                </li>
                <li>
                  <span className="font-medium">Admin settings</span> are informational only. No destructive controls are exposed on this page.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminSettingsPage;
